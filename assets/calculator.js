import { readDraft, saveDraft, clearDraft } from './calculator-draft.js';

const form = document.getElementById('storage-calculator');
const volume = document.getElementById('storage-volume');
const equation = document.getElementById('storage-equation');
const cost = document.getElementById('storage-cost');
const pallets = form.elements.namedItem('pallets');
const days = form.elements.namedItem('days');
const rate = form.elements.namedItem('rate');
const fields = [pallets, days, rate];
const draftKey = 'storage-v1';
const draftControls = document.getElementById('storage-draft');
const draftNote = document.getElementById('storage-draft-note');
const decimal = new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 1});
const currency = new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB'});

function validate(input) {
  const valid = input.validity.valid;
  const error = document.getElementById(input.id + '-error');
  input.setAttribute('aria-invalid', String(!valid));
  error.hidden = valid;
  return valid;
}

function render() {
  const validPallets = validate(pallets);
  const validDays = validate(days);
  const validRate = validate(rate);
  if (!validPallets || !validDays) {
    volume.textContent = '—';
    equation.textContent = 'Проверьте остаток и срок';
    cost.textContent = '—';
    return;
  }

  const total = Math.round(pallets.valueAsNumber * days.valueAsNumber * 10) / 10;
  volume.textContent = decimal.format(total);
  equation.textContent = decimal.format(pallets.valueAsNumber) + ' × ' + decimal.format(days.valueAsNumber);
  if (!validRate) {
    cost.textContent = 'Проверьте тариф';
  } else {
    cost.textContent = Number.isFinite(rate.valueAsNumber)
      ? currency.format(total * rate.valueAsNumber)
      : 'Введите тариф для расчёта';
  }
}

const draft = readDraft(draftKey);
if (Array.isArray(draft) && draft.length === fields.length && draft.every(value => typeof value === 'string')) {
  fields.forEach((input, index) => { input.value = draft[index]; });
  draftNote.hidden = false;
}

form.addEventListener('input', () => {
  render();
  draftNote.hidden = !saveDraft(draftKey, fields.map(input => input.value));
});
form.addEventListener('reset', () => {
  clearDraft(draftKey);
  draftNote.hidden = true;
  setTimeout(render, 0);
});
form.addEventListener('submit', event => { event.preventDefault(); render(); });
draftControls.hidden = false;
render();