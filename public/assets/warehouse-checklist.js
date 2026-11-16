const checklist = document.getElementById('warehouse-checklist');

if (checklist) {
  const storageKey = 'skladskaya-praktika:warehouse-checklist:v1';
  const items = Array.from(checklist.querySelectorAll('[data-checklist-item]'));
  const controls = checklist.querySelector('[data-checklist-controls]');
  const count = checklist.querySelector('[data-checklist-count]');
  const progress = checklist.querySelector('[data-checklist-progress]');
  const reset = checklist.querySelector('[data-checklist-reset]');
  const print = checklist.querySelector('[data-checklist-print]');
  const storageNote = checklist.querySelector('[data-checklist-storage]');

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

  function save() {
    const selected = items.filter(item => item.checked).map(item => item.value);
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
  }

  try {
    restore(localStorage.getItem(storageKey));
    announceStorage(true);
  } catch {
    announceStorage(false);
  }

  checklist.addEventListener('change', (event) => {
    if (!items.includes(event.target)) return;
    updateProgress();
    save();
  });

  reset.addEventListener('click', () => {
    items.forEach(item => { item.checked = false; });
    updateProgress();
    save();
    items[0]?.focus();
  });

  print.addEventListener('click', () => window.print());

  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    restore(event.newValue);
    updateProgress();
  });

  updateProgress();
  controls.hidden = false;
}
