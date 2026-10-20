import {requireOwner} from '@/lib/owner-auth';
import {getAllPosts} from '@/lib/blog';
import {BlogEditor} from '@/components/blog-editor';
export const dynamic='force-dynamic';
export const metadata={title:'Blog editor',robots:{index:false,follow:false}};
export default async function BlogAdmin(){await requireOwner();return <section className="desk-blog-page"><a href="/admin" className="breadcrumb">← Studio desk</a><p className="eyebrow">Publishing desk</p><h1>Blog posts</h1><p>Write a draft, preview the article and publish when it is ready.</p><BlogEditor posts={await getAllPosts()}/></section>;}
