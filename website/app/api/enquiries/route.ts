import { getDb } from '@/db';
import { enquiries, rateLimits } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { sameOrigin } from '@/lib/access';
import { validProject } from '@/lib/projects';
export async function POST(req:Request){
 if(!sameOrigin(req))return Response.json({error:'Invalid request origin.'},{status:403});
 if(Number(req.headers.get('content-length')||0)>16000)return Response.json({error:'Request too large.'},{status:413});
 try{
 const raw=await req.text();if(raw.length>16000)return Response.json({error:'Request too large.'},{status:413});
 const d=JSON.parse(raw);if(d.website)return Response.json({error:'Unable to accept this request.'},{status:400});
 const kinds=['access','ip','partnership','support','contact'];
 const str=(v:unknown,max=200)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
 if(!kinds.includes(d.kind)||!validProject(d.project)||!str(d.name)||!str(d.email,254)||!/^\S+@\S+\.\S+$/.test(d.email)||!str(d.message,4000)||d.consent!==true)return Response.json({error:'Please complete all required fields and accept the privacy notice.'},{status:400});
 if(['access','ip','partnership'].includes(d.kind)&&(!str(d.organization)||!str(d.country)||!str(d.intent,1000)))return Response.json({error:'Organization, country and intended use or contribution are required.'},{status:400});
 if(d.kind==='support'&&(!['Financial','Technical & professional','Strategic & institutional'].includes(d.supportType)||!str(d.offer,1000)||!str(d.country)))return Response.json({error:'Please include your support type, country and offer.'},{status:400});
 const ip=req.headers.get('cf-connecting-ip')||'unknown';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+':'+Math.floor(Date.now()/3600000)));const key=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
 const db=getDb();const counts=await db.insert(rateLimits).values({key,count:1}).onConflictDoUpdate({target:rateLimits.key,set:{count:sql`${rateLimits.count}+1`}}).returning();
 if(counts[0].count>10)return Response.json({error:'Too many enquiries. Please try again in an hour.'},{status:429});
 const id=crypto.randomUUID();const details={organization:String(d.organization||'').slice(0,200),country:String(d.country||'').slice(0,200),intent:String(d.intent||'').slice(0,1000),message:d.message,supportType:d.supportType||null,offer:String(d.offer||'').slice(0,1000),listingConsent:d.listingConsent===true,privacyConsent:true};
 await db.insert(enquiries).values({id,kind:d.kind,project:d.project,name:d.name.trim(),email:d.email.trim().toLowerCase(),details:JSON.stringify(details),createdAt:Date.now()});
 return Response.json({id,message:'Your enquiry has been recorded for studio review. Access is granted separately after approval.'},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Your enquiry could not be saved. Please try again.'},{status:503});}
}
