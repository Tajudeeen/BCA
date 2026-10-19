import {getPublishedPosts} from '@/lib/blog';
import {absoluteUrl} from '@/lib/seo';
export const dynamic='force-dynamic';
const xml=(s:string)=>s.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export async function GET(){const posts=await getPublishedPosts();return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Bonire Concepts Art Journal</title><link>'+absoluteUrl('/blog')+'</link><description>Automotive design, mobility research and studio notes from BCA.</description><language>en</language>'+posts.map(p=>'<item><title>'+xml(p.title)+'</title><link>'+absoluteUrl('/blog/'+p.slug)+'</link><guid isPermaLink="true">'+absoluteUrl('/blog/'+p.slug)+'</guid><description>'+xml(p.excerpt)+'</description><pubDate>'+new Date(p.publishedAt!).toUTCString()+'</pubDate></item>').join('')+'</channel></rss>',{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});}
