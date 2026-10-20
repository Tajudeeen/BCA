import {backendHeaders,backendOrigin} from '@/lib/backend';
const routeAllowed=(path:string)=>/^\/api\/auth\/(sign-in\/email|sign-out|get-session|change-password|list-sessions|revoke-session|revoke-sessions|revoke-other-sessions|ok)$/.test(path)||/^\/api\/admin(?:\/(?:blog|export))?$/.test(path)||/^\/api\/materials\/[a-zA-Z0-9-]{1,100}$/.test(path);
async function forwardOwnerRequest(req:Request){
 const url=new URL(req.url);
 if(!routeAllowed(url.pathname))return Response.json({error:'Access denied.'},{status:403});
 if(req.method!=='GET'&&req.headers.get('origin')!==url.origin)return Response.json({error:'Invalid request origin.'},{status:403});
 const headers=new Headers(backendHeaders());
 for(const name of ['cookie','content-type','user-agent','origin']){const value=req.headers.get(name);if(value)headers.set(name,value);}
 headers.set('x-bca-visitor',req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown');
 const limit=url.pathname.startsWith('/api/auth/')?12000:11*1024*1024;
 if(Number(req.headers.get('content-length')||0)>limit)return Response.json({error:'Request too large.'},{status:413});
 const body=req.method==='GET'?undefined:await req.arrayBuffer();
 if(body&&body.byteLength>limit)return Response.json({error:'Request too large.'},{status:413});
 try{
  const response=await fetch(backendOrigin+url.pathname+url.search,{method:req.method,headers,body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(30000)});
  const out=new Headers({'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'});
  for(const name of ['content-type','content-disposition','retry-after']){const value=response.headers.get(name);if(value)out.set(name,value);}
  for(const cookie of response.headers.getSetCookie())out.append('set-cookie',cookie);
  return new Response(response.body,{status:response.status,headers:out});
 }catch{return Response.json({error:'The studio workspace is unavailable. Please try again.'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
}
export const GET=forwardOwnerRequest;
export const POST=forwardOwnerRequest;
