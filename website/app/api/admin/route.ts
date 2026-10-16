import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { enquiries, grants, materials, projectContent } from '@/db/schema';
import { isAdmin, log, sameOrigin } from '@/lib/access';
import { projects, statuses, validProject } from '@/lib/projects';
import { eq } from 'drizzle-orm';
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return Response.json({error:'Studio administrator access required.'},{status:403});
 try{
 const db=getDb();const type=req.headers.get('content-type')||'';
 if(type.includes('multipart/form-data')){
 if(Number(req.headers.get('content-length')||0)>11*1024*1024)return Response.json({error:'Maximum file size is 10 MB.'},{status:413});
 const f=await req.formData();const file=f.get('file');const project=String(f.get('project'));const title=String(f.get('title')||'').trim();
 if(!(file instanceof File)||file.size>10*1024*1024||!file.size||!validProject(project)||project==='studio'||!title||title.length>200||!['application/pdf','image/png','image/jpeg','image/webp'].includes(file.type))return Response.json({error:'Choose a project, title and a PDF or image up to 10 MB.'},{status:400});
 if(!env.BUCKET)return Response.json({error:'Private storage is unavailable.'},{status:503});
 const id=crypto.randomUUID();const objectKey=`private/${project}/${id}`;await env.BUCKET.put(objectKey,await file.arrayBuffer());await db.insert(materials).values({id,project,title,objectKey,mime:file.type,createdAt:Date.now()});await log('upload-material',id);return Response.json({ok:true});
 }
 const raw=await req.text();if(raw.length>20000)return Response.json({error:'Request too large.'},{status:413});const d=JSON.parse(raw);
 if(d.action==='status'&&['new','reviewing','approved','declined','closed'].includes(d.status)){await db.update(enquiries).set({status:d.status}).where(eq(enquiries.id,d.id));await log('enquiry-'+d.status,d.id);}
 else if(d.action==='grant'&&validProject(d.project)&&d.project!=='studio'&&/^\S+@\S+\.\S+$/.test(d.email)&&Number.isInteger(d.days)&&d.days>=1&&d.days<=90){const id=crypto.randomUUID();await db.insert(grants).values({id,email:d.email.trim().toLowerCase(),project:d.project,expiresAt:Date.now()+d.days*86400000,createdAt:Date.now()});await log('grant-access',id);}
 else if(d.action==='revoke'){await db.update(grants).set({revoked:1}).where(eq(grants.id,d.id));await log('revoke-access',d.id);}
 else if(d.action==='content'&&projects.some(p=>p.slug===d.slug)){
 const c=d.content;if(!c||typeof c.name!=='string'||!c.name.trim()||c.name.length>100||typeof c.category!=='string'||c.category.length>150||typeof c.summary!=='string'||c.summary.length>2000||!statuses.includes(c.status)||!Array.isArray(c.images)||c.images.length<1||c.images.length>5||!c.images.every((x:unknown)=>typeof x==='string'&&/^\/vehicles\/(orange|irin|ami|mace|ara)-[0-3]\.webp$/.test(x)))return Response.json({error:'Invalid project content. Use one to five curated vehicle assets.'},{status:400});
 const content=JSON.stringify({name:c.name.trim(),category:c.category,summary:c.summary,status:c.status,images:c.images});await db.insert(projectContent).values({slug:d.slug,content,updatedAt:Date.now()}).onConflictDoUpdate({target:projectContent.slug,set:{content,updatedAt:Date.now()}});await log('edit-project',d.slug);
 }else return Response.json({error:'Invalid action.'},{status:400});
 return Response.json({ok:true});
 }catch{return Response.json({error:'The action could not be completed.'},{status:500});}
}
