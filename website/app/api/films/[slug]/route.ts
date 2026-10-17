import {env} from 'cloudflare:workers';
import {getFilm} from '@/lib/films';
const errorHeaders={'Cache-Control':'no-store'};
async function serve(req:Request,slug:string,headOnly=false){
 const film=getFilm(slug);if(!film)return new Response('Unknown film',{status:404,headers:errorHeaders});
 if(!env.BUCKET)return new Response('Film storage unavailable',{status:503,headers:errorHeaders});
 const meta=await env.BUCKET.head(film.key);if(!meta)return new Response('Film unavailable',{status:503,headers:errorHeaders});
 const base:Record<string,string>={'Content-Type':'video/mp4','Accept-Ranges':'bytes','ETag':meta.httpEtag,'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'};
 if(req.headers.get('if-none-match')===meta.httpEtag)return new Response(null,{status:304,headers:base});
 let offset=0,length=meta.size,status=200;
 const range=req.headers.get('range');const ifRange=req.headers.get('if-range');
 if(range&&(!ifRange||ifRange===meta.httpEtag)){
  const m=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{...base,'Content-Range':`bytes */${meta.size}`}});
  if(m[1]){offset=Number(m[1]);const end=m[2]?Math.min(Number(m[2]),meta.size-1):meta.size-1;length=end-offset+1;}
  else{length=Math.min(Number(m[2]),meta.size);offset=meta.size-length;}
  if(!Number.isSafeInteger(offset)||!Number.isSafeInteger(length)||offset<0||offset>=meta.size||length<=0)return new Response(null,{status:416,headers:{...base,'Content-Range':`bytes */${meta.size}`}});
  status=206;base['Content-Range']=`bytes ${offset}-${offset+length-1}/${meta.size}`;
 }
 base['Content-Length']=String(length);
 if(headOnly)return new Response(null,{status,headers:base});
 const object=await env.BUCKET.get(film.key,{range:{offset,length}});if(!object)return new Response('Film unavailable',{status:503,headers:errorHeaders});
 return new Response(object.body,{status,headers:base});
}
export async function GET(req:Request,{params}:{params:Promise<{slug:string}>}){return serve(req,(await params).slug);}
export async function HEAD(req:Request,{params}:{params:Promise<{slug:string}>}){return serve(req,(await params).slug,true);}
