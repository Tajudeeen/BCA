import {env} from 'cloudflare:workers';
import {isAdmin} from '@/lib/access';
import {isStudioBridge} from '@/lib/studio-bridge';
import {getDeskData} from '@/lib/admin-data';
import {deskQuery} from '@/lib/admin-model';
import {getAllPosts} from '@/lib/blog';
export async function GET(req:Request){
 if(!isStudioBridge(req)||!await isAdmin())return Response.json({error:'Studio administrator access required.'},{status:403,headers:{'Cache-Control':'private, no-store'}});
 const params=Object.fromEntries(new URL(req.url).searchParams);
 return Response.json(params.resource==='blog'?{posts:await getAllPosts()}:{data:await getDeskData(deskQuery(params)),services:{database:!!env.DB,files:!!env.BUCKET}},{headers:{'Cache-Control':'private, no-store'}});
}
