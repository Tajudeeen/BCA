import {env} from 'cloudflare:workers';
import {getDb} from '@/db';
import {enquiries,grants,materials,projectContent} from '@/db/schema';
import {isAdmin,log,sameOrigin} from '@/lib/access';
import {validProject} from '@/lib/projects';
import {reviewStatuses,validateProjectContent} from '@/lib/admin-model';
import {and,eq,gt} from 'drizzle-orm';
const reply=(error:string,status=400)=>Response.json({error},{status,headers:{'Cache-Control':'private, no-store'}});
const realProject=(value:unknown)=>typeof value==='string'&&value!=='studio'&&validProject(value);
const validId=(value:unknown)=>typeof value==='string'&&value.length>0&&value.length<=100;
const validDays=(value:unknown)=>Number.isInteger(value)&&Number(value)>=1&&Number(value)<=90;
function fileSignature(bytes:Uint8Array,mime:string){const starts=(signature:number[])=>signature.every((n,i)=>bytes[i]===n);if(mime==='application/pdf')return starts([37,80,68,70,45]);if(mime==='image/png')return starts([137,80,78,71,13,10,26,10]);if(mime==='image/jpeg')return starts([255,216,255]);if(mime==='image/webp')return starts([82,73,70,70])&&[87,69,66,80].every((n,i)=>bytes[i+8]===n);return false;}
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return reply('Studio administrator access required.',403);
 try{
 const db=getDb();
 if((req.headers.get('content-type')||'').includes('multipart/form-data')){
 if(Number(req.headers.get('content-length')||0)>11*1024*1024)return reply('Maximum file size is 10 MB.',413);
 const form=await req.formData();const file=form.get('file');const project=String(form.get('project')||'');const title=String(form.get('title')||'').trim();
 if(!(file instanceof File)||file.size>10*1024*1024||!file.size||!realProject(project)||!title||title.length>200)return reply('Choose a project, title and a PDF or image up to 10 MB.');
 const bytes=await file.arrayBuffer();if(!fileSignature(new Uint8Array(bytes),file.type))return reply('The file contents must match a supported PDF, PNG, JPEG or WebP format.');
 if(!env.BUCKET)return reply('Private storage is unavailable.',503);
 const id=crypto.randomUUID();const objectKey=`private/${project}/${id}`;await env.BUCKET.put(objectKey,bytes,{httpMetadata:{contentType:file.type}});
 try{await db.insert(materials).values({id,project,title,objectKey,mime:file.type,createdAt:Date.now()});}catch(error){await env.BUCKET.delete(objectKey);throw error;}
 await log('upload-material',id);return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});
 }
 const raw=await req.text();if(raw.length>65000)return reply('Request too large.',413);let d;try{d=JSON.parse(raw);}catch{return reply('Invalid request data.');}if(!d||typeof d!=='object')return reply('Invalid request data.');
 if(d.action==='review'){
 if(!validId(d.id)||!reviewStatuses.includes(d.status)||typeof d.notes!=='string'||d.notes.length>6000||!Number.isSafeInteger(d.expectedUpdatedAt)||d.expectedUpdatedAt<0)return reply('Choose a valid review status and notes.');
 const found=(await db.select().from(enquiries).where(eq(enquiries.id,d.id)).limit(1))[0];if(!found)return reply('Enquiry not found.',404);
 if(found.updatedAt!==d.expectedUpdatedAt)return reply('This enquiry changed. Refresh before saving.',409);
 const updated=await db.update(enquiries).set({status:d.status,notes:d.notes.trim(),updatedAt:Math.max(Date.now(),found.updatedAt+1)}).where(and(eq(enquiries.id,d.id),eq(enquiries.updatedAt,d.expectedUpdatedAt))).returning();if(!updated.length)return reply('This enquiry changed. Refresh before saving.',409);
 await log('review-enquiry-'+d.status,d.id);
 }else if(d.action==='grant'){
 if(!realProject(d.project)||typeof d.email!=='string'||d.email.length>254||!/^\S+@\S+\.\S+$/.test(d.email.trim())||!validDays(d.days))return reply('Enter an approved email, project and 1 to 90 days.');
 const email=d.email.trim().toLowerCase();const found=await db.select().from(grants).where(and(eq(grants.email,email),eq(grants.project,d.project),eq(grants.revoked,0),gt(grants.expiresAt,Date.now()))).limit(1);if(found.length)return reply('An active grant already exists. Extend it or revoke it first.',409);
 const id=crypto.randomUUID();await db.insert(grants).values({id,email,project:d.project,expiresAt:Date.now()+d.days*86400000,createdAt:Date.now()});await log('grant-access',id);
 }else if(d.action==='revoke'||d.action==='renew'){
 if(!validId(d.id)||(d.action==='renew'&&!validDays(d.days)))return reply('Choose a grant and a valid duration.');
 const found=(await db.select().from(grants).where(eq(grants.id,d.id)).limit(1))[0];if(!found)return reply('Grant not found.',404);
 if(d.action==='renew'&&found.revoked)return reply('Revoked grants cannot be renewed. Create a new approved grant.');
 if(d.action==='revoke'){await db.update(grants).set({revoked:1}).where(eq(grants.id,d.id));await log('revoke-access',d.id);}
 else{const changed=await db.update(grants).set({expiresAt:Date.now()+d.days*86400000}).where(and(eq(grants.id,d.id),eq(grants.revoked,0))).returning();if(!changed.length)return reply('This grant was revoked. Refresh the dashboard.',409);await log('renew-access',d.id);}
 }else if(d.action==='content'){
 let content;try{content=validateProjectContent(d.content,d.slug);}catch(error){return reply(error instanceof Error?error.message:'Invalid project content.');}
 if(!Number.isSafeInteger(d.expectedUpdatedAt)||d.expectedUpdatedAt<0)return reply('Refresh the project editor before saving.');
 const existing=(await db.select().from(projectContent).where(eq(projectContent.slug,d.slug)).limit(1))[0];if((existing?.updatedAt||0)!==d.expectedUpdatedAt)return reply('This project changed. Refresh before saving.',409);
 const serialized=JSON.stringify(content);const now=Math.max(Date.now(),d.expectedUpdatedAt+1);
 if(existing){const updated=await db.update(projectContent).set({content:serialized,updatedAt:now}).where(and(eq(projectContent.slug,d.slug),eq(projectContent.updatedAt,d.expectedUpdatedAt))).returning();if(!updated.length)return reply('This project changed. Refresh before saving.',409);}
 else{const inserted=await db.insert(projectContent).values({slug:d.slug,content:serialized,updatedAt:now}).onConflictDoNothing().returning();if(!inserted.length)return reply('This project changed. Refresh before saving.',409);}
 await log('edit-project',d.slug);
 }else if(d.action==='rename-material'||d.action==='remove-material'){
 if(!validId(d.id))return reply('Choose a private file.');const found=(await db.select().from(materials).where(eq(materials.id,d.id)).limit(1))[0];if(!found)return reply('File not found.',404);
 if(d.action==='rename-material'){if(typeof d.title!=='string'||!d.title.trim()||d.title.length>200)return reply('Enter a file title up to 200 characters.');await db.update(materials).set({title:d.title.trim()}).where(eq(materials.id,d.id));await log('rename-material',d.id);}
 else{if(d.confirm!==true)return reply('Confirm file removal.');await db.delete(materials).where(eq(materials.id,d.id));await log('remove-material',d.id);try{await env.BUCKET?.delete(found.objectKey);}catch{return Response.json({ok:true,warning:'File access was removed. The stored object could not be cleaned up.'});}}
 }else return reply('Invalid action.');
 return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return reply('The action could not be completed. Please try again.',500);}
}
