import {absoluteUrl} from '@/lib/seo';
import {getProjects} from '@/lib/content';
export const dynamic='force-dynamic';
const escapeXml=(value:string)=>value.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export async function GET(){const projects=await getProjects();const pages=['/','/projects','/about','/partnerships','/support','/contact',...projects.map(p=>'/projects/'+p.slug)];return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+pages.map(path=>{const p=projects.find(p=>path==='/projects/'+p.slug);return '<url><loc>'+escapeXml(absoluteUrl(path))+'</loc>'+(p?p.images.map(image=>'<image:image><image:loc>'+escapeXml(absoluteUrl(image))+'</image:loc></image:image>').join(''):'')+'</url>';}).join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});}
