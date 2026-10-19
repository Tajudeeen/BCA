import {absoluteUrl} from '@/lib/seo';
export function GET(){return new Response(['User-agent: *','Allow: /','Disallow: /admin','Disallow: /private/','Disallow: /api/','Allow: /api/films/','Sitemap: '+absoluteUrl('/sitemap.xml'),''].join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
