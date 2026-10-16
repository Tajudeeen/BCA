import {isAdmin,log} from '@/lib/access';
import {getDb} from '@/db';
import {enquiries,grants,materials,projectContent,audit} from '@/db/schema';
export async function GET(){if(!await isAdmin())return new Response('Forbidden',{status:403});const db=getDb();const [requests,access,files,content,events]=await Promise.all([db.select().from(enquiries),db.select().from(grants),db.select().from(materials),db.select().from(projectContent),db.select().from(audit)]);await log('export-backup','studio');return Response.json({exportedAt:new Date().toISOString(),requests,access,files,content,events},{headers:{'Cache-Control':'private, no-store','Content-Disposition':'attachment; filename="bonire-studio-backup.json"'}});}
