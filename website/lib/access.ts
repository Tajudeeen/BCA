import { getChatGPTUser } from '@/app/chatgpt-auth';
import {getOwnerUser,ownerOrigin} from '@/lib/owner-auth';
import { getDb } from '@/db';
import { grants, audit } from '@/db/schema';
import { and,eq,gt } from 'drizzle-orm';
export async function isAdmin(){return !!await getOwnerUser();}
export async function canRead(project:string){if(await isAdmin())return true;const u=await getChatGPTUser();if(!u)return false;const found=await getDb().select().from(grants).where(and(eq(grants.email,u.email.toLowerCase()),eq(grants.project,project),eq(grants.revoked,0),gt(grants.expiresAt,Date.now()))).limit(1);return found.length>0;}
export async function log(action:string,subject:string){const u=await getOwnerUser()||await getChatGPTUser();await getDb().insert(audit).values({id:crypto.randomUUID(),actor:u?.userId||'unknown',action,subject,createdAt:Date.now()});}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !!origin&&(origin===new URL(req.url).origin||origin===ownerOrigin);}
