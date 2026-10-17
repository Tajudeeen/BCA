import { getDb } from '@/db';
import { projectContent } from '@/db/schema';
import { projects, type Project } from './projects';
export async function getProjects():Promise<Project[]>{
 const rows=await getDb().select().from(projectContent);
 return projects.map(p=>{const row=rows.find(r=>r.slug===p.slug);return row?{...p,...JSON.parse(row.content),slug:p.slug}:p;});
}
