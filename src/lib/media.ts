import { path } from './site';
const media = {
  cover: { alt: 'Высокие складские стеллажи и проезд между ними', position: '50% 52%' },
  storage: { alt: 'Паллеты с коробами на складских стеллажах', position: '50% 50%' },
  fulfillment: { alt: 'Упаковка заказа на рабочем столе с ручным сканером', position: '50% 55%' },
  operations: { alt: 'Паллеты у погрузочного дока склада', position: '50% 58%' },
  planning: { alt: 'Рабочий стол логиста с документами и ноутбуком', position: '50% 52%' },
} as const;
export type PhotoKey = keyof typeof media;
export function photo(key: PhotoKey) {
 const item = media[key];
 const small = path('photos/'+key+'-640.webp'), large = path('photos/'+key+'-1280.webp');
 return {...item, small, large, srcset: small+' 640w, '+large+' 1280w'};
}
const articlePhotos:Record<string,PhotoKey> = {
 'storage-cost':'storage', 'first-delivery':'operations', 'compare-fulfillment':'fulfillment',
 'returns':'fulfillment', 'choose-operator':'planning', 'warehouse-move':'cover',
 'dispatch-slots':'operations', 'own-vs-outsourced':'planning',
};
export const photoForArticle=(slug:string, fallback:PhotoKey='cover')=>photo(articlePhotos[slug]??fallback);
export function photoForCategory(category:string){return photo(category==='storage'?'storage':category==='fulfillment'?'fulfillment':'operations');}
