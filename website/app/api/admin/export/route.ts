import {isAdmin,log} from '@/lib/access';
import {getDb} from '@/db';
import {enquiries,grants,materials,projectContent,audit,blogPosts} from '@/db/schema';
export async function GET(){if(!await isAdmin())return new Response('Forbidden',{status:403});const db=getDb();const [requests,access,files,content,events,posts]=await Promise.all([db.select().from(enquiries),db.select().from(grants),db.select().from(materials),db.select().from(projectContent),db.select().from(audit),db.select().from(blogPosts)]);await log('export-backup','studio');return Response.json({exportedAt:new Date().toISOString(),requests,access,files,content,events,posts},{headers:{'Cache-Control':'private, no-store','Content-Disposition':'attachment; filename="bonire-studio-backup.json"'}});}
