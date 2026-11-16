import { clearDraft, readDraft, saveDraft } from './calculator-draft.js';

const draftKey = 'peak-v1';
const maxPallets = 1000000;
const maxMovements = 50;
const example = [
  { direction: 'in', amount: 35 },
  { direction: 'out', amount: 28 },
  { direction: 'in', amount: 16 }
];
const wholeCount = (value, min) => Number.isSafeInteger(value) && value >= min && value <= maxPallets;

const numericField = value => typeof value === 'string' && (
  value === '' || (/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value) && Number.isFinite(Number(value)))
);

function validDraft(draft) {
  return numericField(draft?.initial) && numericField(draft.capacity)
    && Array.isArray(draft.movements) && draft.movements.length <= maxMovements
    && draft.movements.every(move => ['in', 'out'].includes(move?.direction) && numericField(move.amount));
}

export function calculatePeak(initial, capacity, movements) {
  if (!wholeCount(initial, 0) || !wholeCount(capacity, 0)) return { error: 'base' };
  let balance = initial;
  let peak = initial;
  let peakIndex = -1;
  const balances = [];

  for (const [index, { direction, amount }] of movements.entries()) {
    if (!wholeCount(amount, 1) || !['in', 'out'].includes(direction)) {
      return { error: 'movement', index, balances };
    }
    if (direction === 'out' && amount > balance) {
      return { error: 'underflow', index, balances, available: balance };
    }
    balance += direction === 'in' ? amount : -amount;
    balances.push(balance);
    // Retain the first movement that reached the maximum.
    if (balance > peak) {
      peak = balance;
      peakIndex = index;
    }
  }

  return { peak, peakIndex, balance, availableAtPeak: capacity - peak, balances };
}

function setup(form) {
  const get = key => form.querySelector('[data-peak-' + key + ']');
  const initial = get('initial');
  const capacity = get('capacity');
  const rows = get('rows');
  const draftNote = get('draft');
  const rowTemplate = rows.firstElementChild.cloneNode(true);
  const add = form.querySelector('[data-peak-action="add"]');
  const format = new Intl.NumberFormat('ru-RU');
  const number = value => format.format(value);
  const ending = new Intl.PluralRules('ru-RU');
  const quantity = (value, units) => number(value) + ' ' + (units[ending.select(value)] ?? units.many);
  const palletUnits = { one: 'паллета', few: 'паллеты', many: 'паллет' };
  const pallets = value => quantity(value, palletUnits);
  const places = value => quantity(value, { one: 'место', few: 'места', many: 'мест' });
  let nextId = rows.children.length;

  function showError(input, message, text) {
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    message.textContent = text;
    message.hidden = !text;
  }

  function addRow({ direction = 'in', amount = '' } = {}) {
    const row = rowTemplate.cloneNode(true);
    const input = row.querySelector('[data-peak-amount]');
    const error = row.querySelector('[data-peak-error]');
    error.id = 'peak-movement-error-' + nextId++;
    input.setAttribute('aria-describedby', error.id);
    input.value = amount;
    row.querySelector('[data-peak-direction]').value = direction;
    row.querySelector('[data-peak-controls]').hidden = false;
    rows.append(row);
    return input;
  }

  function readMovement(row, index, total) {
    const direction = row.querySelector('[data-peak-direction]');
    const input = row.querySelector('[data-peak-amount]');
    row.querySelector('[data-peak-index]').textContent = index + 1;
    row.querySelector('[data-peak-amount-index]').textContent = 'в операции №' + (index + 1);
    const names = { up: 'Переместить выше', down: 'Переместить ниже', remove: 'Удалить' };
    for (const action of Object.keys(names)) {
      const button = row.querySelector('[data-peak-action="' + action + '"]');
      button.setAttribute('aria-label', names[action] + ' операцию №' + (index + 1));
      button.disabled = (action === 'up' && index === 0) || (action === 'down' && index === total - 1);
    }
    return {
      direction: direction.value,
      amount: input.valueAsNumber,
      input,
      error: row.querySelector('[data-peak-error]'),
      result: row.querySelector('[data-peak-row-balance]'),
      indicator: row.querySelector('[data-peak-indicator]')
    };
  }

  function render() {
    const moves = Array.from(rows.children, (row, index) => readMovement(row, index, rows.children.length));
    get('empty').hidden = moves.length > 0;
    add.disabled = moves.length >= maxMovements;
    get('limit').hidden = !add.disabled;
    const result = calculatePeak(initial.valueAsNumber, capacity.valueAsNumber, moves);
    const baseMessage = 'Введите целое число от 0 до 1 000 000.';
    showError(initial, get('initial-error'), wholeCount(initial.valueAsNumber, 0) ? '' : baseMessage);
    showError(capacity, get('capacity-error'), wholeCount(capacity.valueAsNumber, 0) ? '' : baseMessage);
    for (const [index, move] of moves.entries()) {
      let message = wholeCount(move.amount, 1) ? '' : 'Введите целое число от 1 до 1 000 000.';
      if (result.error === 'underflow' && result.index === index) {
        message = 'Доступный остаток · ' + pallets(result.available);
      }
      showError(move.input, move.error, message);
      move.result.textContent = result.balances?.[index] == null ? '—' : number(result.balances[index]);
      move.indicator.hidden = result.peakIndex !== index;
    }
    const status = get('status-error');
    status.hidden = !result.error;
    status.textContent = result.error === 'underflow'
      ? 'Отгрузка в операции №' + (result.index + 1) + ' превышает остаток.'
      : 'Проверьте выделенные поля.';
    if (result.error) {
      get('total').textContent = '—';
      get('unit').textContent = '';
      get('when').textContent = '';
      get('balance-title').textContent = 'Места в пик';
      get('balance-result').textContent = '—';
      get('end').textContent = '';
      return;
    }
    const peakMove = moves[result.peakIndex];
    get('total').textContent = number(result.peak);
    get('unit').textContent = palletUnits[ending.select(result.peak)] ?? palletUnits.many;
    get('when').textContent = peakMove
      ? 'После операции №' + (result.peakIndex + 1) + ' · приёмка, ' + pallets(peakMove.amount)
      : 'Пик совпадает с начальным остатком';
    get('balance-title').textContent = result.availableAtPeak < 0 ? 'Дефицит мест в пик' : 'Запас мест в пик';
    get('balance-result').textContent = places(Math.abs(result.availableAtPeak));
    get('end').textContent = 'Остаток после всех операций · ' + pallets(result.balance);
  }

  function saveCurrentDraft() {
    const movements = Array.from(rows.children, row => ({
      direction: row.querySelector('[data-peak-direction]').value,
      amount: row.querySelector('[data-peak-amount]').value
    }));
    draftNote.hidden = !saveDraft(draftKey, { initial: initial.value, capacity: capacity.value, movements });
  }

  form.addEventListener('input', () => {
    render();
    saveCurrentDraft();
  });
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('click', event => {
    const button = event.target.closest('[data-peak-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.peakAction;
    const row = button.closest('[data-peak-row]');
    let nextFocus = button;

    if (action === 'add') {
      nextFocus = addRow();
    } else if (action === 'example') {
      initial.value = 86;
      capacity.value = 130;
      rows.replaceChildren();
      example.forEach(addRow);
      nextFocus = initial;
    } else if (action === 'remove') {
      nextFocus = (row.nextElementSibling ?? row.previousElementSibling)?.querySelector('[data-peak-amount]') ?? add;
      row.remove();
    } else if (action === 'up' && row.previousElementSibling) {
      rows.insertBefore(row, row.previousElementSibling);
    } else if (action === 'down' && row.nextElementSibling) {
      rows.insertBefore(row.nextElementSibling, row);
    }

    render();
    if (action === 'example') {
      clearDraft(draftKey);
      draftNote.hidden = true;
    } else {
      saveCurrentDraft();
    }
    if (nextFocus.disabled) nextFocus = row.querySelector('[data-peak-direction]');
    nextFocus.focus();
  });

  const draft = readDraft(draftKey);
  if (validDraft(draft)) {
    initial.value = draft.initial;
    capacity.value = draft.capacity;
    rows.replaceChildren();
    draft.movements.forEach(addRow);
    draftNote.hidden = false;
  }

  form.querySelectorAll('[data-peak-controls]').forEach(element => { element.hidden = false; });
  get('inputs').disabled = false;
  render();
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('peak-capacity');
  if (form) setup(form);
}
