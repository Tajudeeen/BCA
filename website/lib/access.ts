import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getDb } from '@/db';
import { grants, audit } from '@/db/schema';
import { and,eq,gt } from 'drizzle-orm';
export async function isAdmin(){const u=await getChatGPTUser();const allowed=(env.STUDIO_ADMIN_EMAILS||'').split(',').map((s:string)=>s.trim().toLowerCase()).filter(Boolean);return !!u&&allowed.includes(u.email.toLowerCase());}
export async function canRead(project:string){if(await isAdmin())return true;const u=await getChatGPTUser();if(!u)return false;const found=await getDb().select().from(grants).where(and(eq(grants.email,u.email.toLowerCase()),eq(grants.project,project),eq(grants.revoked,0),gt(grants.expiresAt,Date.now()))).limit(1);return found.length>0;}
export async function log(action:string,subject:string){const u=await getChatGPTUser();await getDb().insert(audit).values({id:crypto.randomUUID(),actor:u?.userId||'unknown',action,subject,createdAt:Date.now()});}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !!origin&&origin===new URL(req.url).origin;}
