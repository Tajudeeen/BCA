import {absoluteUrl} from '@/lib/seo';
export function GET(){return new Response(['User-agent: *','Allow: /','Disallow: /admin','Disallow: /sign-in','Disallow: /sign-up','Disallow: /private/','Disallow: /api/','Allow: /api/films/','Sitemap: '+absoluteUrl('/sitemap.xml'),''].join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
