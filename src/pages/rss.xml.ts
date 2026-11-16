import type { APIRoute } from 'astro';
import articles from '../lib/content.mjs';
import { articlePath, path, siteName, type Article } from '../lib/site';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rssDate = (date: string) => new Date(date + 'T00:00:00Z').toUTCString();
const feed: readonly Article[] = articles;

export const GET: APIRoute = ({ site }) => {
  const sorted = [...feed].sort((a, b) => b.published.localeCompare(a.published));
  const buildDate = sorted.reduce((latest, article) => {
    const date = article.updated ?? article.published;
    return date > latest ? date : latest;
  }, '');
  const items = sorted.map(article => {
    const url = escape(new URL(articlePath(article.slug), site).href);
    return '<item>' +
      '<title>' + escape(article.title) + '</title><link>' + url + '</link><guid>' + url + '</guid>' +
      '<description>' + escape(article.description) + '</description><pubDate>' + rssDate(article.published) + '</pubDate>' +
      '</item>';
  }).join('');
  const channel = '<channel><title>' + escape(siteName) + '</title><link>' + escape(new URL(path(), site).href) + '</link>' +
    '<description>Практика складской логистики</description><language>ru</language>' +
    (buildDate ? '<lastBuildDate>' + rssDate(buildDate) + '</lastBuildDate>' : '') + items + '</channel>';
  return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0">' + channel + '</rss>',
    { headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' } });
};
