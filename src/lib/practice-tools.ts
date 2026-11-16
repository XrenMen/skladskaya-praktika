export const practiceTools = [
  {
    path: 'tools/warehouse-quotes/',
    title: 'Сравнение складских тарифов',
    description: 'Сравните три сметы на одинаковом объёме хранения, приёмки и отгрузки. Учтите ежемесячные доплаты.',
    action: 'Сравнить тарифы',
    article: 'choose-operator',
    articleTitle: 'Что запросить у складского оператора',
  },
  {
    path: 'tools/warehouse-checklist/',
    title: 'Чек-лист осмотра склада',
    description: 'Пройдите площадку от въезда до выдачи. Отметьте проверенное и распечатайте лист осмотра.',
    action: 'Открыть чек-лист',
    article: 'warehouse-site-audit',
    articleTitle: 'Как проверить склад перед договором',
  },
  {
    path: 'tools/peak-capacity/',
    title: 'Запас паллетомест на пик',
    description: 'Введите приёмки и отгрузки по порядку. Калькулятор покажет максимальный остаток и сколько мест понадобится.',
    action: 'Рассчитать запас мест',
    article: 'peak-pallet-capacity',
    articleTitle: 'Как учесть задержку отгрузки',
  },
  {
    path: 'calculator/',
    title: 'Паллето-дни и стоимость',
    description: 'Рассчитайте объём хранения по остатку и сроку. Добавьте тариф, чтобы получить сумму.',
    action: 'Рассчитать паллето-дни',
    article: 'storage-cost',
    articleTitle: 'Что входит в стоимость хранения',
  },
] as const;
