import { clearDraft, readDraft, saveDraft } from './calculator-draft.js';

const DRAFT_KEY = 'quotes-v1';
const MAX_VALUE = 1_000_000;
const volumeFormat = new Intl.NumberFormat('ru-RU');
const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function volumeIsValid(volume) {
  return Number.isInteger(volume) && volume >= 0 && volume <= MAX_VALUE;
}

function rateIsValid(rate) {
  if (!Number.isFinite(rate) || rate < 0 || rate > MAX_VALUE) return false;
  return Math.round(rate * 100) / 100 === rate;
}

export function compareQuotes(volumes, ratesByQuote) {
  if (volumes.length !== 3 || !volumes.every(volumeIsValid)) return null;

  return ratesByQuote.map((rates) => {
    if (rates.length !== 4 || !rates.every(rateIsValid)) return null;
    // Sum whole kopecks so equal quotes remain equal after arithmetic.
    const [storage, receiving, dispatch, monthly] = rates.map((rate) => Math.round(rate * 100));
    return storage * volumes[0] + receiving * volumes[1] + dispatch * volumes[2] + monthly;
  });
}

function valuesFrom(inputs, validate, guidance) {
  return inputs.map((input) => {
    const value = input.valueAsNumber;
    const valid = validate(value);
    const error = input.nextElementSibling;
    if (valid) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
    if (error?.classList.contains('quotes-error')) {
      error.hidden = valid;
      error.textContent = valid ? '' : guidance;
    }
    return valid ? value : null;
  });
}

function format(kopecks) {
  return rubles.format(kopecks / 100);
}

export function mountQuotes(form) {
  const volumeFields = form.querySelector('[data-quotes-volume]');
  const volumes = [...volumeFields.querySelectorAll('[data-quote-volume]')];
  const summary = form.querySelector('[data-quote-summary]');
  const actions = form.querySelector('[data-quotes-actions]');
  const copy = form.querySelector('[data-quotes-copy]');
  const copyGuidance = form.querySelector('[data-quotes-copy-guidance]');
  const copyStatus = form.querySelector('[data-quotes-copy-status]');
  const copyFallback = form.querySelector('[data-quotes-copy-fallback]');
  const copyField = form.querySelector('[data-quotes-copy-text]');
  let comparison = '';
  const draftNote = form.querySelector('[data-quote-draft-note]');
  const quotes = [...form.querySelectorAll('[data-quote-card]')].map((card) => {
    const fields = card.querySelector('[data-quote-fields]');
    const rates = [...fields.querySelectorAll('[data-quote-rate]')];
    const amount = card.querySelector('[data-quote-amount]');
    const label = card.querySelector('[data-quote-total-label]');
    fields.disabled = false;
    return { card, name: card.dataset.quoteName, rates, amount, label };
  });

  function update() {
    const monthlyVolumes = valuesFrom(volumes, volumeIsValid, 'Введите целое число от 0 до 1 000 000.');
    const ratesByQuote = quotes.map((quote) => valuesFrom(quote.rates, rateIsValid, 'Введите сумму от 0 до 1 000 000 ₽ с точностью до копеек.'));
    const totals = compareQuotes(monthlyVolumes, ratesByQuote);
    const complete = totals?.filter((total) => total !== null) ?? [];
    const best = complete.length >= 2 ? Math.min(...complete) : null;
    const winners = [];

    quotes.forEach((quote, index) => {
      const total = totals?.[index] ?? null;
      const isBest = best !== null && total === best;
      if (isBest) winners.push(quote.name);
      quote.card.dataset.quoteBest = String(isBest);
      quote.amount.textContent = total === null ? '—' : format(total);
      quote.label.textContent = totals && total === null ? 'Проверьте тарифы' : isBest ? 'Минимум за месяц' : 'За месяц';
    });

    if (!totals) {
      summary.textContent = 'Проверьте объёмы. В каждом поле должно быть целое число от 0 до 1 000 000.';
    } else if (best === null) {
      summary.textContent = 'Заполните хотя бы два предложения. Укажите тарифы от 0 до 1 000 000 ₽ с точностью до копеек.';
    } else {
      const scope = complete.length === quotes.length ? '' : ' среди заполненных предложений';
      const names = winners.join(', ');
      summary.textContent = winners.length === 1
        ? 'Минимальная сумма' + scope + ' — ' + names + ', ' + format(best) + ' в месяц.'
        : 'Одинаковая минимальная сумма' + scope + ' — ' + names + ', ' + format(best) + ' в месяц.';
    }

    const canCopy = complete.length === quotes.length;
    copy.disabled = !canCopy;
    copyGuidance.hidden = canCopy;
    copyStatus.textContent = '';
    copyFallback.hidden = true;
    comparison = '';
    if (canCopy) {
      const [storage, receiving, dispatch] = monthlyVolumes.map(value => volumeFormat.format(value));
      comparison = [
        'Сравнение складских тарифов',
        '',
        'Объёмы за месяц',
        'Хранение, паллето-дни — ' + storage,
        'Приёмка, паллеты — ' + receiving,
        'Отгрузка, паллеты — ' + dispatch,
        '',
        'Суммы за месяц',
        ...quotes.map((quote, index) => quote.name + ' — ' + format(totals[index])),
        '',
        summary.textContent
      ].join('\n');
    }
  }

  const inputs = [...volumes, ...quotes.flatMap(quote => quote.rates)];
  const draft = readDraft(DRAFT_KEY);
  const restored = Array.isArray(draft) && draft.length === inputs.length && draft.every(value => typeof value === 'string' && value.length <= 256);
  if (restored) inputs.forEach((input, index) => { input.value = draft[index]; });
  if (draftNote) draftNote.hidden = !restored;

  volumeFields.disabled = false;
  actions.hidden = false;
  copy.addEventListener('click', async () => {
    const text = comparison;
    if (!text) return;
    copyStatus.textContent = '';
    copyFallback.hidden = true;
    let copied = false;
    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      // The browser can decline clipboard access even on a secure page.
    }
    if (text !== comparison) return;

    copyStatus.textContent = copied
      ? 'Сравнение скопировано.'
      : 'Копирование недоступно. Скопируйте выделенный текст вручную.';
    if (!copied) {
      copyField.value = text;
      copyFallback.hidden = false;
      copyField.focus();
      copyField.select();
    }
  });
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', () => {
    const saved = saveDraft(DRAFT_KEY, inputs.map(input => input.value));
    if (draftNote) draftNote.hidden = !saved;
    update();
  });
  form.addEventListener('reset', () => {
    clearDraft(DRAFT_KEY);
    if (draftNote) draftNote.hidden = true;
    setTimeout(update, 0);
  });
  update();
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('warehouse-quotes');
  if (form) mountQuotes(form);
}
