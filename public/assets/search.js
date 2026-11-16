const form=document.getElementById('article-search');
const input=document.getElementById('query');
const status=document.getElementById('search-status');
const results=document.getElementById('search-results');
const root=new URL('../',import.meta.url);
let version=0;
let index;
async function run() {
  const token=++version;
  const q=input.value.trim();
  const current=new URL(location.href);
  q ? current.searchParams.set('q',q) : current.searchParams.delete('q');
  history.replaceState(null,'',current);
  results.replaceChildren();
  if(q.length<2){status.textContent=q?'Введите хотя бы два символа.':'';return;}
  status.textContent='Ищем по статьям…';
  try{
    index??=import(new URL('pagefind/pagefind.js',root).href).then(async api=>{await api.options({baseUrl:root.pathname});await api.init();return api;}).catch(e=>{index=undefined;throw e;});
    const api=await index;
    const found=await api.search(q);
    const pages=await Promise.all(found.results.slice(0,24).map(x=>x.data()));
    if(token!==version)return;
    for(const page of pages){
      const target=new URL(page.url,root);
      if(target.origin!==root.origin || !target.pathname.startsWith(root.pathname+'materials/'))continue;
      const item=document.createElement('li');
      const link=document.createElement('a');
      link.href=target.href;
      link.textContent=page.meta.title || 'Читать материал';
      const description=document.createElement('p');
      const clean=new DOMParser().parseFromString(page.excerpt||page.content.slice(0,160),'text/html');
      description.textContent=clean.body.textContent;
      item.append(link,description);
      results.append(item);
    }
    status.textContent=results.children.length?'Найдено материалов: '+results.children.length:'Ничего не найдено. Попробуйте другое слово.';
  }catch{
    if(token!==version)return;
    status.textContent='Поиск временно недоступен. Откройте раздел «Материалы».';
  }
}
form.addEventListener('submit',e=>{e.preventDefault();run();});
input.value=new URLSearchParams(location.search).get('q')||'';
if(input.value)run();