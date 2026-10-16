import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { materials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { canRead,log } from '@/lib/access';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const [m]=await getDb().select().from(materials).where(eq(materials.id,id)).limit(1);if(!m||!await canRead(m.project))return new Response('Access denied',{status:403,headers:{'Cache-Control':'private, no-store'}});const file=await env.BUCKET?.get(m.objectKey);if(!file)return new Response('Material unavailable',{status:404});await log('read-material',id);return new Response(file.body,{headers:{'Content-Type':m.mime,'Content-Disposition':`attachment; filename="${id}.${m.mime==='application/pdf'?'pdf':m.mime.split('/')[1]}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
