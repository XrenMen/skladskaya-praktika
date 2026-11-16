const form = document.getElementById('article-search');
const input = document.getElementById('query');
const status = document.getElementById('search-status');
const results = document.getElementById('search-results');
const fallback = document.getElementById('search-fallback');
const root = new URL('../', import.meta.url);
let version = 0;
let index;

function excerptNodes(html) {
  const clean = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(clean.body.childNodes, node => {
    if (node.nodeName === 'MARK') {
      const mark = document.createElement('mark');
      mark.textContent = node.textContent;
      return mark;
    }
    return document.createTextNode(node.textContent);
  });
}

function resultCount(count) {
  const category = new Intl.PluralRules('ru').select(count);
  const noun = {one:'статья', few:'статьи', many:'статей', other:'статьи'}[category];
  return count + ' ' + noun + ' по запросу';
}

async function run() {
  const token = ++version;
  const query = input.value.trim();
  results.replaceChildren();
  fallback.hidden = true;
  if (query.length < 2) {
    status.textContent = query ? 'Введите хотя бы два символа.' : '';
    return;
  }

  status.textContent = 'Ищем по статьям…';
  try {
    index ??= import(new URL('pagefind/pagefind.js', root).href)
      .then(async api => {
        await api.options({baseUrl: root.pathname});
        await api.init();
        return api;
      })
      .catch(error => { index = undefined; throw error; });

    const api = await index;
    const found = await api.search(query);
    const pages = await Promise.all(found.results.slice(0, 24).map(match => match.data()));
    if (token !== version) return;
    for (const page of pages) {
      const target = new URL(page.url, root);
      if (target.origin !== root.origin || !target.pathname.startsWith(root.pathname + 'materials/')) continue;

      const item = document.createElement('li');
      const link = document.createElement('a');
      const heading = document.createElement('h2');
      const arrow = document.createElement('span');
      const description = document.createElement('p');

      heading.textContent = page.meta.title || 'Читать статью';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.className = 'search-result-arrow';
      arrow.textContent = '↗';
      if (page.excerpt) {
        description.append(...excerptNodes(page.excerpt));
      } else {
        description.textContent = (page.content || '').slice(0, 160);
      }

      link.href = target.href;
      link.append(heading, arrow, description);
      item.append(link);
      results.append(item);
    }

    const count = results.children.length;
    status.textContent = count ? resultCount(count) + ' «' + query + '»' : 'По запросу «' + query + '» ничего не найдено. Попробуйте другое слово.';
    fallback.hidden = count > 0;
  } catch {
    if (token !== version) return;
    status.textContent = 'Поиск временно недоступен.';
    fallback.hidden = false;
  }
}

function syncFromUrl() {
  input.value = new URLSearchParams(location.search).get('q')?.slice(0, 120) || '';
  run();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const q = input.value.trim();
  const current = new URL(location.href);
  if (q) current.searchParams.set('q', q);
  else current.searchParams.delete('q');
  if (current.href !== location.href) history.pushState(null, '', current);
  run();
});
window.addEventListener('popstate', syncFromUrl);
syncFromUrl();