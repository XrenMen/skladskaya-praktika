import { path } from './site';
import { articlePhotoSources } from './article-photo-sources';

export const photoLicenseUrl = 'https://www.pexels.com/license/';

export function photoForArticle(slug: string) {
  const source = articlePhotoSources[slug];
  if (!source) throw new Error('Missing photo source for article: ' + slug);

  const base = 'photos/articles/' + slug;
  const small = path(base + '-640.webp');
  const large = path(base + '-1280.webp');
  return { ...source, small, large, srcset: small + ' 640w, ' + large + ' 1280w' };
}

const categoryPhoto: Record<string, string> = {
  storage: 'storage-cost',
  fulfillment: 'compare-fulfillment',
  operations: 'dispatch-slots',
};

export function photoForCategory(category: string) {
  return photoForArticle(categoryPhoto[category]);
}
