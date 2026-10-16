import {env} from 'cloudflare:workers';
import {getFilm} from '@/lib/films';
export async function PUT(req:Request){
 const secret=env.STUDIO_FILM_IMPORT_TOKEN;
 // Temporary scoped ingestion only. Disable by removing the runtime secret after import.
 if(!secret||req.headers.get('X-Studio-Import-Key')!==secret)return new Response('Forbidden',{status:403});
 const film=getFilm(new URL(req.url).searchParams.get('slug')||'');
 if(!film||!env.BUCKET||!req.body)return new Response('Invalid import',{status:400});
 if(Number(req.headers.get('content-length'))!==film.bytes||req.headers.get('content-type')!=='video/mp4')return new Response('Unexpected media size or type',{status:400});
 try{
  await env.BUCKET.put(film.key,req.body,{sha256:film.sha256,httpMetadata:{contentType:'video/mp4',cacheControl:'public, max-age=3600'}});
  return Response.json({ok:true,key:film.key,bytes:film.bytes},{headers:{'Cache-Control':'no-store'}});
 }catch{return new Response('Media import failed checksum or storage validation',{status:500});}
}
