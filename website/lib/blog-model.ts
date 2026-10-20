export const blogCategories=['Studio notes','Vehicle design','Mobility research','Project updates'] as const;
export const blogCovers=['','/backgrounds/home.webp','/backgrounds/profile.webp','/backgrounds/overhead.webp','/backgrounds/rear.webp','/vehicles/orange-0.webp','/vehicles/irin-0.webp','/vehicles/ami-0.webp','/vehicles/ara-0.webp','/vehicles/mace-0.webp'];
export type BlogPost={slug:string;title:string;excerpt:string;body:string;category:string;cover:string;coverAlt:string;status:string;publishedAt:number|null;updatedAt:number;createdAt:number};
export type BlogInput=Pick<BlogPost,'slug'|'title'|'excerpt'|'body'|'category'|'cover'|'coverAlt'|'status'>;
export function validateBlogInput(value:unknown):BlogInput{
 if(!value||typeof value!=='object')throw new Error('Enter the post details.');
 const d=value as Record<string,unknown>;const out={} as BlogInput;
 for(const key of ['slug','title','excerpt','body','category','cover','coverAlt','status'] as const){if(typeof d[key]!=='string')throw new Error('Invalid post details.');out[key]=(d[key] as string).trim();}
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(out.slug)||out.slug.length>100||['feed','new'].includes(out.slug))throw new Error('Use a short URL with lowercase letters, numbers and hyphens.');
 if(!out.title||out.title.length>160||out.excerpt.length>320||out.body.length>50000||out.coverAlt.length>200)throw new Error('Check the title and text lengths.');
 if(!blogCategories.includes(out.category as typeof blogCategories[number])||!blogCovers.includes(out.cover)||!['draft','published'].includes(out.status))throw new Error('Choose a valid category, image and publication status.');
 if(out.cover&&!out.coverAlt)throw new Error('Describe the cover image for screen readers.');
 if(out.status==='published'&&(out.excerpt.length<20||out.body.length<100))throw new Error('Published posts need a short summary and at least 100 characters of article text.');
 return out;
}
export type ArticleBlock={type:'heading'|'list'|'quote'|'paragraph';text?:string;items?:string[]};
export function articleBlocks(body:string):ArticleBlock[]{return body.replace(/\r\n?/g,'\n').split(/\n\s*\n/).map(chunk=>chunk.trim()).filter(Boolean).map(text=>{
 if(/^#{1,3} /.test(text))return {type:'heading',text:text.replace(/^#{1,3} /,'')};
 if(text.split('\n').every(line=>/^- /.test(line)))return {type:'list',items:text.split('\n').map(line=>line.slice(2))};
 if(/^> /.test(text))return {type:'quote',text:text.replace(/^> /gm,'')};
 return {type:'paragraph',text};
 });}
export const readingMinutes=(body:string)=>Math.max(1,Math.ceil(body.trim().split(/\s+/).filter(Boolean).length/200));
export const postDate=(date:number)=>new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Africa/Lagos'});
