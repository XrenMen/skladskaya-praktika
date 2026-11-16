const checklist = document.getElementById('warehouse-checklist');

if (checklist) {
  const storageKey = 'skladskaya-praktika:warehouse-checklist:v1';
  const items = Array.from(checklist.querySelectorAll('[data-checklist-item]'));
  const controls = checklist.querySelector('[data-checklist-controls]');
  const count = checklist.querySelector('[data-checklist-count]');
  const progress = checklist.querySelector('[data-checklist-progress]');
  const reset = checklist.querySelector('[data-checklist-reset]');
  const undo = checklist.querySelector('[data-checklist-undo]');
  const print = checklist.querySelector('[data-checklist-print]');
  const storageNote = checklist.querySelector('[data-checklist-storage]');
  let resetSnapshot = null;

  function restore(serialized) {
    let saved = [];
    try {
      const value = JSON.parse(serialized ?? '[]');
      if (Array.isArray(value)) saved = value;
    } catch {
      // Ignore unreadable state.
    }
    const selected = new Set(saved);
    items.forEach(item => { item.checked = selected.has(item.value); });
  }

  function announceStorage(available) {
    storageNote.hidden = false;
    storageNote.textContent = available
      ? 'Отметки сохраняются в этом браузере.'
      : 'Отметки доступны до закрытия страницы.';
  }

  function selectedItems() {
    return items.filter(item => item.checked).map(item => item.value);
  }

  function save() {
    const selected = selectedItems();
    try {
      localStorage.setItem(storageKey, JSON.stringify(selected));
      announceStorage(true);
    } catch {
      announceStorage(false);
    }
  }

  function updateProgress() {
    const completed = items.filter(item => item.checked).length;
    count.textContent = 'Отмечено ' + completed + ' из ' + items.length;
    progress.value = completed;
    reset.disabled = completed === 0;
    if (undo) undo.hidden = resetSnapshot === null;
  }

  try {
    restore(localStorage.getItem(storageKey));
    announceStorage(true);
  } catch {
    announceStorage(false);
  }

  checklist.addEventListener('change', (event) => {
    if (!items.includes(event.target)) return;
    resetSnapshot = null;
    updateProgress();
    save();
  });

  reset.addEventListener('click', () => {
    if (undo) resetSnapshot = new Set(selectedItems());
    items.forEach(item => { item.checked = false; });
    updateProgress();
    save();
    (undo ?? items[0])?.focus();
  });

  undo?.addEventListener('click', () => {
    if (resetSnapshot === null) return;
    items.forEach(item => { item.checked = resetSnapshot.has(item.value); });
    resetSnapshot = null;
    updateProgress();
    save();
    reset.focus();
  });

  print.addEventListener('click', () => window.print());

  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    const undoHadFocus = document.activeElement === undo;
    resetSnapshot = null;
    restore(event.newValue);
    updateProgress();
    if (undoHadFocus) items[0]?.focus();
  });

  updateProgress();
  controls.hidden = false;
}
