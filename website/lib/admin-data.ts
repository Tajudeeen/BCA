import {getDb} from '@/db';
import {enquiries,grants,materials,audit,blogPosts,projectContent} from '@/db/schema';
import {projects,type Project} from '@/lib/projects';
import {and,count,desc,eq,gt,lte,like,or} from 'drizzle-orm';
import {deskQuery,pageSize} from './admin-model';
export async function getDeskData(query:ReturnType<typeof deskQuery>){
 const db=getDb();const now=Date.now();const {view,q,status,kind,project}=query;
 const active=and(eq(grants.revoked,0),gt(grants.expiresAt,now));
 const [requestCounts,grantCounts,postCounts,fileCounts,overrides,recent,latestRequests]=await Promise.all([
 db.select({status:enquiries.status,total:count()}).from(enquiries).groupBy(enquiries.status),
 db.select({total:count()}).from(grants).where(active),
 db.select({status:blogPosts.status,total:count()}).from(blogPosts).groupBy(blogPosts.status),
 db.select({total:count()}).from(materials),db.select().from(projectContent),
 db.select().from(audit).orderBy(desc(audit.createdAt)).limit(8),
 db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(5)
 ]);
 const content:Project[]=projects.map(project=>{const row=overrides.find(r=>r.slug===project.slug);return row?{...project,...JSON.parse(row.content),slug:project.slug}:project;});
 const counts={enquiries:requestCounts.reduce((n,r)=>n+r.total,0),new:requestCounts.find(r=>r.status==='new')?.total||0,reviewing:requestCounts.find(r=>r.status==='reviewing')?.total||0,active:grantCounts[0]?.total||0,published:postCounts.find(r=>r.status==='published')?.total||0,drafts:postCounts.find(r=>r.status==='draft')?.total||0,files:fileCounts[0]?.total||0,projects:content.length};
 const revisions=Object.fromEntries(overrides.map(v=>[v.slug,v.updatedAt]));
 const conditions=[];
 let total=0,rows:Record<string,unknown>[]=[];
 // Bind search values through Drizzle. SQLite LIKE wildcards are intentional for dashboard search.
 const pattern=q?'%'+q+'%':null;
 if(view==='inbox'){
 if(status)conditions.push(eq(enquiries.status,status));if(kind)conditions.push(eq(enquiries.kind,kind));if(project)conditions.push(eq(enquiries.project,project));if(pattern)conditions.push(or(like(enquiries.name,pattern),like(enquiries.email,pattern),like(enquiries.details,pattern)));
 const where=and(...conditions);total=(await db.select({total:count()}).from(enquiries).where(where))[0].total;
 const page=Math.min(query.page,Math.max(1,Math.ceil(total/pageSize)));rows=await db.select().from(enquiries).where(where).orderBy(desc(enquiries.createdAt),desc(enquiries.id)).limit(pageSize).offset((page-1)*pageSize);return {counts,content,recent,latestRequests,revisions,rows,total,page,now};
 }
 if(view==='access'){
 if(status==='active')conditions.push(active);if(status==='expired')conditions.push(and(eq(grants.revoked,0),lte(grants.expiresAt,now)));if(status==='revoked')conditions.push(eq(grants.revoked,1));if(project)conditions.push(eq(grants.project,project));if(pattern)conditions.push(like(grants.email,pattern));
 const where=and(...conditions);total=(await db.select({total:count()}).from(grants).where(where))[0].total;const page=Math.min(query.page,Math.max(1,Math.ceil(total/pageSize)));rows=await db.select().from(grants).where(where).orderBy(desc(grants.createdAt),desc(grants.id)).limit(pageSize).offset((page-1)*pageSize);return {counts,content,recent,latestRequests,revisions,rows,total,page,now};
 }
 if(view==='materials'){
 if(project)conditions.push(eq(materials.project,project));if(pattern)conditions.push(like(materials.title,pattern));const where=and(...conditions);total=(await db.select({total:count()}).from(materials).where(where))[0].total;const page=Math.min(query.page,Math.max(1,Math.ceil(total/pageSize)));rows=await db.select({id:materials.id,title:materials.title,project:materials.project,mime:materials.mime,createdAt:materials.createdAt}).from(materials).where(where).orderBy(desc(materials.createdAt),desc(materials.id)).limit(pageSize).offset((page-1)*pageSize);return {counts,content,recent,latestRequests,revisions,rows,total,page,now};
 }
 if(view==='activity'){
 if(pattern)conditions.push(or(like(audit.action,pattern),like(audit.subject,pattern),like(audit.actor,pattern)));const where=and(...conditions);total=(await db.select({total:count()}).from(audit).where(where))[0].total;const page=Math.min(query.page,Math.max(1,Math.ceil(total/pageSize)));rows=await db.select().from(audit).where(where).orderBy(desc(audit.createdAt),desc(audit.id)).limit(pageSize).offset((page-1)*pageSize);return {counts,content,recent,latestRequests,revisions,rows,total,page,now};
 }
 return {counts,content,recent,latestRequests,revisions,rows,total,page:1,now};
}
export type DeskData=Awaited<ReturnType<typeof getDeskData>>;
