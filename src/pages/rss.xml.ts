import type { APIRoute } from 'astro';
import articles from '../lib/content.mjs';
import {articlePath,path,releaseDate,siteName} from '../lib/site';
const escape = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const GET:APIRoute = ({site})=>{
 const items=articles.map(a=>{
  const url=new URL(articlePath(a.slug),site).href;
  return '<item><title>'+escape(a.title)+'</title><link>'+url+'</link><guid>'+url+'</guid><description>'+escape(a.description)+'</description><pubDate>'+new Date(releaseDate+'T00:00:00Z').toUTCString()+'</pubDate></item>';
 }).join('');
 return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>'+siteName+'</title><link>'+new URL(path(),site).href+'</link><description>Практика складской логистики</description><language>ru</language>'+items+'</channel></rss>',{headers:{'Content-Type':'application/rss+xml; charset=UTF-8'}});
};