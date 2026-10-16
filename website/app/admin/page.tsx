import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/access';
import {getDb} from '@/db';
import {enquiries,grants,materials} from '@/db/schema';
import {desc} from 'drizzle-orm';
import {getProjects} from '@/lib/content';
import {AdminDesk} from '@/components/admin-desk';
export const dynamic='force-dynamic';
export const metadata={title:'Studio Desk',robots:{index:false,follow:false}};
export default async function Admin(){await requireChatGPTUser('/admin');if(!await isAdmin())return <section className="section page-intro"><p className="eyebrow">Studio desk / Restricted</p><h1>Studio access<br/><span>required.</span></h1><p className="large-copy">This account isn't listed as a studio administrator. The site owner must configure STUDIO_ADMIN_EMAILS with the approved sign-in emails before this desk can be used.</p></section>;const db=getDb();const [requests,access,content,files]=await Promise.all([db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(500),db.select().from(grants).orderBy(desc(grants.createdAt)).limit(500),getProjects(),db.select().from(materials)]);return <section className="section page-intro"><p className="eyebrow">Private administration</p><h1>Studio desk.</h1><p>Review enquiries, manage project access and keep the public portfolio current.</p><AdminDesk requests={requests} access={access} content={content} files={files}/></section>;}
