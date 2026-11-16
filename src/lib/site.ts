export const siteName = 'Складская практика';
export const releaseDate = '2026-11-16';
export const base = import.meta.env.BASE_URL.replace(/\/$/,'') + '/';
export const path = (slug = '') => base + slug.replace(/^\//,'');
export const categories = [
  { id: 'storage', mark: '01', name: 'Хранение', title: 'Хранение и выбор склада', description: 'Рассчитайте объём хранения, сравните варианты и подготовьте вводные для запроса предложения.' },
  { id: 'fulfillment', mark: '02', name: 'Фулфилмент', title: 'Фулфилмент и возвраты', description: 'Сравните условия обработки заказов и разберитесь, как считать стоимость возвратов.' },
  { id: 'operations', mark: '03', name: 'Операции', title: 'Складские операции', description: 'Подготовьте поставку, назначьте окна отгрузки и спланируйте перенос запасов.' }
] as const;
export interface Article {
  slug: string;
  category: string;
  title: string;
  description: string;
  minutes: number;
  body: string;
}
export const articlePath = (slug: string) => path('materials/' + slug + '/');
export const categoryPath = (id: string) => path('topics/' + id + '/');