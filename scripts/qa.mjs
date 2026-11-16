import registry from '../src/lib/content.mjs';
import { readdir,readFile,stat } from 'node:fs/promises';
import { resolve,join,relative } from 'node:path';
const dist=resolve('dist'),prefix='/skladskaya-praktika/',origin='https://xrenmen.github.io';
const problems=[],titles=new Set(),descriptions=new Set();
const walk=async root=>(await Promise.all((await readdir(root,{withFileTypes:true})).map(x=>x.isDirectory()?walk(join(root,x.name)):[join(root,x.name)]))).flat();
const files=await walk(dist);const html=files.filter(f=>f.endsWith('.html'));let articles=0;const refs=[];
for(const f of html){
  const local=relative(dist,f).replaceAll('\\','/'),page=local==='index.html'?prefix:prefix+local.replace(/index\.html$/,'');
  const src=await readFile(f,'utf8'),head=src.match(/<head>(.*?)<\/head>/s)?.[1]||'';
  if(!/<meta name="robots" content="noindex"\s*\/?\s*>/.test(head))problems.push(local+' noindex missing');
  if((src.match(/<h1[ >]/g)||[]).length!==1)problems.push(local+' H1 count');
  const title=head.match(/<title>(.*?)<\/title>/s)?.[1];
  if(!title||titles.has(title))problems.push(local+' duplicate/missing title');titles.add(title);
  const desc=head.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if(!desc||descriptions.has(desc))problems.push(local+' duplicate/missing description');descriptions.add(desc);
  if(local!=='404.html'&&!head.includes('rel="canonical" href="'+origin+page+'"'))problems.push(local+' unexpected canonical');
  for(const match of src.matchAll(/(?:href|src)="([^"]+)"/g)){
    const val=match[1].replaceAll('&amp;','&'); if(val.startsWith('mailto:'))continue;
    const url=new URL(val,origin+page);
    if(url.origin!==origin){ if(/^https:\/\/rfl\.ru\//.test(val))refs.push({page,href:val});continue; }
    if(!url.pathname.startsWith(prefix)){problems.push(local+' invalid prefix '+val);continue;}
    const key=decodeURIComponent(url.pathname.slice(prefix.length));
    const target=join(dist,key+(url.pathname.endsWith('/')?'index.html':''));
    if(!(await stat(target).catch(()=>null))?.isFile())problems.push(local+' missing internal '+val);
    else if(url.hash&&target.endsWith('.html')&&!(await readFile(target,'utf8')).includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'))problems.push(local+' missing anchor '+val);
  }
  if(local.startsWith('materials/')&&local!=='materials/index.html'){
    articles++;

    const slug=local.split('/')[1];
    const photoPath=prefix+'photos/articles/'+slug;
    const credit=src.match(/<figcaption\b[^>]*>(.*?)<\/figcaption>/s)?.[1]||'';
    if(!credit.includes('https://www.pexels.com/photo/')||!credit.includes('https://www.pexels.com/license/'))problems.push(local+' photo credit missing');
    for(const width of [640,1280]){
      const asset='photos/articles/'+slug+'-'+width+'.webp';
      if(!src.includes(prefix+asset)||!(await stat(join(dist,asset)).catch(()=>null))?.isFile())problems.push(local+' missing article photo '+width);
    }
    const schema=src.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1];
    try{
      const data=JSON.parse(schema);
      if(data['@type']!=='Article'||data.image!==origin+photoPath+'-1280.webp')throw Error();
    }catch{problems.push(local+' invalid Article data or photo');}
    if(!src.includes('data-pagefind-body'))problems.push(local+' not opted into search');
  }
}
if(html.length!==registry.length+11 || articles!==registry.length)problems.push('Unexpected page counts: '+html.length+' / '+articles);
for(const asset of ['.nojekyll','404.html','rss.xml','pagefind/pagefind.js','pagefind/pagefind-entry.json'])if(!(await stat(join(dist,asset)).catch(()=>null))?.isFile())problems.push('Missing '+asset);
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}
else console.log(JSON.stringify({html:html.length,articles,noindex:html.length,refs,assets:files.length},null,2));
