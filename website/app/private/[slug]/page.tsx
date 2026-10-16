import {notFound} from 'next/navigation';
import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {canRead} from '@/lib/access';
import {projects} from '@/lib/projects';
import {getDb} from '@/db';
import {materials} from '@/db/schema';
import {eq} from 'drizzle-orm';
export const dynamic='force-dynamic';
export const metadata={title:'Private Project Room',robots:{index:false,follow:false}};
export default async function Room({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);if(!p)notFound();await requireChatGPTUser('/private/'+slug);if(!await canRead(slug))return <section className="section page-intro"><p className="eyebrow">Private project room</p><h1>Access is<br/><span>by approval.</span></h1><p className="large-copy">Your signed-in account doesn't have an active grant for {p.name}. Apply for access, or sign in with the email the studio approved.</p><a href={`/contact?kind=access&project=${slug}`} className="button">Request access ↗</a></section>;const files=await getDb().select().from(materials).where(eq(materials.project,slug));return <section className="section page-intro"><p className="eyebrow">Approved private access</p><h1>{p.name}<br/><span>Project room.</span></h1><p>Selected studio materials for your approved review. Access is individual and revocable. Please respect any agreed confidentiality terms.</p><div className="numbered-list">{files.map((f,i)=><a key={f.id} href={'/api/materials/'+f.id}><span>0{i+1}</span><h2>{f.title}</h2><span>Download ↓</span></a>)}</div>{!files.length&&<p className="editorial-note">No materials have been shared in this room yet.</p>}</section>;}
