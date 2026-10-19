import {getDb} from '@/db';
import {blogPosts} from '@/db/schema';
import {and,desc,eq} from 'drizzle-orm';
export async function getPublishedPosts(){return getDb().select().from(blogPosts).where(eq(blogPosts.status,'published')).orderBy(desc(blogPosts.publishedAt));}
export async function getPublishedPost(slug:string){return (await getDb().select().from(blogPosts).where(and(eq(blogPosts.slug,slug),eq(blogPosts.status,'published'))).limit(1))[0];}
export async function getAllPosts(){return getDb().select().from(blogPosts).orderBy(desc(blogPosts.updatedAt));}
