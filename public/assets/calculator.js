const form = document.getElementById('storage-calculator');
const volume = document.getElementById('storage-volume');
const cost = document.getElementById('storage-cost');
const decimal = new Intl.NumberFormat('ru-RU', {maximumFractionDigits:1});
const currency = new Intl.NumberFormat('ru-RU', {style:'currency',currency:'RUB'});
function render() {
  if (!form.checkValidity()) {
    volume.textContent = '—';
    cost.textContent = 'Проверьте значения в полях';
    return;
  }
  const days = form.elements.namedItem('days').valueAsNumber;
  const pallets = form.elements.namedItem('pallets').valueAsNumber;
  const rate = form.elements.namedItem('rate').valueAsNumber;
  const total = Math.round(pallets * days * 10) / 10;
  volume.textContent = decimal.format(total) + ' паллето-дней';
  cost.textContent = Number.isFinite(rate) ? 'Хранение: ' + currency.format(total * rate) : 'Введите тариф для оценки суммы';
}
form.addEventListener('input',render);
form.addEventListener('submit',event=>{event.preventDefault();render();});
render();