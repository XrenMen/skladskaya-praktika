const shortTitles: Record<string, string> = {
  'order-picking-check': 'Проверка комплектации перед упаковкой',
  'warehouse-location-labels': 'Как разметить ячейки склада',
  'cycle-counting': 'Как пересчитывать остатки по зонам',
  'warehouse-site-audit': 'Что проверить на складе перед договором',
  'compare-fulfillment': 'Как сравнить тарифы FBO и FBS',
  'first-delivery': 'Первая поставка на склад',
  'warehouse-move': 'Переезд склада без остановки отгрузок',
  'storage-cost': 'Как посчитать стоимость хранения',
  'first-warehouse-invoice': 'Проверка первого счёта за склад',
  returns: 'Как организовать возвраты на складе',
  'peak-pallet-capacity': 'Сколько паллетомест нужно в пик',
  'dispatch-slots': 'Как распределить отгрузку по окнам',
  'choose-operator': 'Что спросить у складского оператора',
  'own-vs-outsourced': 'Свой склад или аутсорсинг',
  'receiving-discrepancies': 'Недостача и пересорт на приёмке',
};
export function articleTeaserTitle(article: { slug: string; title: string }): string {
  return shortTitles[article.slug] ?? article.title;
}
