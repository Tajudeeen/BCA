import {ownerAuth,provisionOwner} from '@/lib/owner-auth';
import {isStudioBridge} from '@/lib/studio-bridge';
const allowed=new Set(['sign-in/email','sign-out','get-session','change-password','list-sessions','revoke-session','revoke-sessions','revoke-other-sessions','ok']);
async function handle(req:Request,{params}:{params:Promise<{path:string[]}>}){
 const path=(await params).path.join('/');
 if(!isStudioBridge(req)||!allowed.has(path))return Response.json({error:'Access denied.'},{status:403,headers:{'Cache-Control':'private, no-store'}});
 if(Number(req.headers.get('content-length')||0)>12000)return new Response('Request too large',{status:413});
 await provisionOwner();
 const response=await ownerAuth().handler(req);
 const headers=new Headers(response.headers);headers.set('Cache-Control','private, no-store');
 return new Response(response.body,{status:response.status,headers});
}
export const GET=handle;
export const POST=handle;
