import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/access';
import {getAllPosts} from '@/lib/blog';
import {BlogEditor} from '@/components/blog-editor';
export const dynamic='force-dynamic';
export const metadata={title:'Blog editor',robots:{index:false,follow:false}};
export default async function BlogAdmin(){await requireChatGPTUser('/admin/blog');if(!await isAdmin())return <section className="section page-intro"><p className="eyebrow">Studio desk / Restricted</p><h1>Studio access required.</h1><p>The site owner must configure STUDIO_ADMIN_EMAILS with the approved sign-in emails before the blog editor can be used.</p></section>;return <section className="section page-intro"><a href="/admin" className="breadcrumb">← Studio desk</a><p className="eyebrow">Publishing desk</p><h1>The studio journal.</h1><p>Write a draft, preview the article and publish when it is ready.</p><BlogEditor posts={await getAllPosts()}/></section>;}
