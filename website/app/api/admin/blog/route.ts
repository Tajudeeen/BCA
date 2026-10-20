import {getDb} from '@/db';
import {blogPosts} from '@/db/schema';
import {isAdmin,log,sameOrigin} from '@/lib/access';
import {validateBlogInput} from '@/lib/blog-model';
import {and,eq} from 'drizzle-orm';
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return Response.json({error:'Studio administrator access required.'},{status:403});
 try{
 if(Number(req.headers.get('content-length')||0)>220000)return Response.json({error:'Post is too large.'},{status:413});
 const raw=await req.text();if(raw.length>65000)return Response.json({error:'Post is too large.'},{status:413});
 let data;try{data=JSON.parse(raw);}catch{return Response.json({error:'Invalid post data.'},{status:400});}
 let post;try{post=validateBlogInput(data.post);}catch(error){return Response.json({error:error instanceof Error?error.message:'Invalid post.'},{status:400});}
 const expected=data.expectedUpdatedAt;if(expected!==null&&(!Number.isSafeInteger(expected)||expected<0))return Response.json({error:'Reload the editor before saving.'},{status:400});
 const db=getDb();const existing=(await db.select().from(blogPosts).where(eq(blogPosts.slug,post.slug)).limit(1))[0];
 if(existing&&expected===null)return Response.json({error:'This post URL is already in use. Choose another.'},{status:409});
 if((!existing&&expected!==null)||(existing&&existing.updatedAt!==expected))return Response.json({error:'This post changed in another session. Reload before saving.'},{status:409});
 const now=Math.max(Date.now(),(existing?.updatedAt||0)+1);const values={...post,updatedAt:now,publishedAt:post.status==='published'?(existing?.publishedAt||now):(existing?.publishedAt||null)};
 if(existing){const updated=await db.update(blogPosts).set(values).where(and(eq(blogPosts.slug,post.slug),eq(blogPosts.updatedAt,expected))).returning();if(!updated.length)return Response.json({error:'This post changed. Reload before saving.'},{status:409});}
 else{const inserted=await db.insert(blogPosts).values({...values,createdAt:now}).onConflictDoNothing().returning();if(!inserted.length)return Response.json({error:'This post URL is already in use.'},{status:409});}
 await log(post.status==='published'?'publish-blog':'save-blog-draft',post.slug);
 return Response.json({ok:true,updatedAt:now,publishedAt:values.publishedAt},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'The post could not be saved. Try again.'},{status:500});}
}
