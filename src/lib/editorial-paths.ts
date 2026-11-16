import type { categories } from './site';

interface Guide {
  slug: string;
  reason: string;
}

interface Tool {
  route: string;
  label: string;
  reason: string;
}

interface EditorialPath {
  guides: readonly Guide[];
  tool?: Tool;
}

const compareQuotes: Tool = {
  route: 'tools/warehouse-quotes/',
  label: 'Сравнить сметы складов',
  reason: 'Посчитайте месячные затраты по нескольким предложениям на одинаковом объёме.',
};

const peakCapacity: Tool = {
  route: 'tools/peak-capacity/',
  label: 'Рассчитать запас паллетомест',
  reason: 'Проверьте, хватит ли места с учётом последовательности поставок и отгрузок.',
};

export const articleRoutes: Record<string, EditorialPath | undefined> = {
  'order-picking-check': {
    guides: [
      { slug: 'compare-fulfillment', reason: 'Уточните, входит ли проверка комплектации в ставку за заказ.' },
      { slug: 'cycle-counting', reason: 'Если при сборке товар систематически не находится по адресу, сверьте остатки в этой зоне.' },
    ],
  },
  'warehouse-location-labels': {
    guides: [
      { slug: 'warehouse-site-audit', reason: 'При осмотре проверьте, как устроены адреса и насколько легко найти место на площадке.' },
      { slug: 'warehouse-move', reason: 'Заранее нанесите адреса на новой площадке и проверьте их в учёте до первого рейса.' },
    ],
  },
  'warehouse-site-audit': {
    guides: [
      { slug: 'peak-pallet-capacity', reason: 'Проверьте, хватит ли доступных мест в самый загруженный день.' },
      { slug: 'first-delivery', reason: 'Запланируйте пилотную приёмку и сверку остатков.' },
      { slug: 'warehouse-location-labels', reason: 'Проверьте схему адресов стеллажей и читаемость этикеток до завоза товара.' },
    ],
  },
  'peak-pallet-capacity': {
    guides: [
      { slug: 'dispatch-slots', reason: 'Разнесите отгрузки по времени, чтобы освободить место до прихода товара.' },
      { slug: 'warehouse-move', reason: 'Спланируйте переезд, если запаса места на одной площадке недостаточно.' },
    ],
  },
  'storage-cost': {
    guides: [
      { slug: 'first-warehouse-invoice', reason: 'После запуска сверяйте начисления с тарифами и фактическими операциями.' },
      { slug: 'own-vs-outsourced', reason: 'Сопоставьте смету хранения с расходами на собственный склад.' },
      { slug: 'choose-operator', reason: 'Подготовьте одинаковый набор вопросов для всех площадок.' },
    ],
    tool: compareQuotes,
  },
  'first-warehouse-invoice': {
    guides: [
      { slug: 'choose-operator', reason: 'Проверьте, какие доплаты нужно уточнить у оператора ещё при запросе тарифа.' },
      { slug: 'first-delivery', reason: 'Сверьте документы и остатки по первой партии перед проверкой начислений.' },
    ],
  },
  'first-delivery': {
    guides: [
      { slug: 'cycle-counting', reason: 'Организуйте повторную проверку запасов после запуска.' },
    ],
  },
  'compare-fulfillment': {
    guides: [
      { slug: 'returns', reason: 'Уточните, какие операции с возвратами войдут в договор.' },
      { slug: 'order-picking-check', reason: 'Согласуйте, как склад проверяет состав заказа до передачи.' },
      { slug: 'choose-operator', reason: 'Проведите одинаковый пилот и сравните фактический результат.' },
    ],
  },
  returns: {
    guides: [
      { slug: 'cycle-counting', reason: 'Проверьте остатки после возврата товара в годный запас.' },
      { slug: 'compare-fulfillment', reason: 'Включите обработку возвратов в сравнение тарифов FBO и FBS.' },
    ],
  },
  'choose-operator': {
    guides: [
      { slug: 'warehouse-site-audit', reason: 'Проверьте ответы из опросника во время осмотра площадки.' },
      { slug: 'own-vs-outsourced', reason: 'Сравните предложение оператора со своими складскими затратами.' },
    ],
  },
  'warehouse-move': {
    guides: [
      { slug: 'first-delivery', reason: 'Подготовьте первую волну приёмки на новой площадке.' },
      { slug: 'cycle-counting', reason: 'Сверьте рискованные позиции между волнами переезда.' },
    ],
    tool: peakCapacity,
  },
  'dispatch-slots': {
    guides: [
      { slug: 'first-delivery', reason: 'Согласуйте приёмку так, чтобы разгрузка и отгрузка могли идти по расписанию.' },
      { slug: 'warehouse-move', reason: 'Зарезервируйте окна на период переезда склада.' },
    ],
    tool: peakCapacity,
  },
  'own-vs-outsourced': {
    guides: [
      { slug: 'storage-cost', reason: 'Посчитайте плату за хранение по фактическим остаткам.' },
      { slug: 'choose-operator', reason: 'Соберите сопоставимые предложения для модели аутсорсинга.' },
    ],
    tool: compareQuotes,
  },
  'receiving-discrepancies': {
    guides: [
      { slug: 'cycle-counting', reason: 'Проверьте, остались ли расхождения после корректировки приёмки.' },
      { slug: 'warehouse-move', reason: 'Организуйте сверку груза между отправлением и приёмкой при переезде.' },
    ],
  },
  'cycle-counting': {
    guides: [
      { slug: 'receiving-discrepancies', reason: 'Проверьте документы приёмки, если фактический остаток не сходится с учётом.' },
      { slug: 'first-delivery', reason: 'Согласуйте порядок сверки сразу на первой поставке.' },
    ],
  },
};

type CategoryId = (typeof categories)[number]['id'];

export const topicRoutes: Record<CategoryId, { start: Guide; next: Guide | Tool }> = {
  storage: {
    start: { slug: 'choose-operator', reason: 'Отправьте кандидатам одинаковый опросник и соберите сметы на свой объём.' },
    next: compareQuotes,
  },
  fulfillment: {
    start: { slug: 'compare-fulfillment', reason: 'Сравните предложения на своих заказах, партиях и возвратах.' },
    next: { slug: 'returns', reason: 'Разберите, что происходит с товаром после возврата на склад.' },
  },
  operations: {
    start: { slug: 'first-delivery', reason: 'Подготовьте поставку, назначьте приёмку и сверьте первые остатки.' },
    next: { slug: 'receiving-discrepancies', reason: 'Действуйте по инструкции, если приехало меньше товара или нарушена упаковка.' },
  },
};