import {env} from 'cloudflare:workers';
import {getProjects} from '@/lib/content';
import {getPublishedPosts} from '@/lib/blog';
import {POST as submitEnquiry} from '@/app/api/enquiries/route';
import {timingSafeEqual} from 'node:crypto';
function authorized(req:Request){const expected=env.BCA_FRONTEND_KEY;if(!expected)return false;const a=Buffer.from(req.headers.get('authorization')||''),b=Buffer.from('Bearer '+expected);return a.length===b.length&&timingSafeEqual(a,b);}
const denied=()=>Response.json({error:'Access denied.'},{status:403,headers:{'Cache-Control':'private, no-store'}});
export async function GET(req:Request){if(!authorized(req))return denied();const [projects,posts]=await Promise.all([getProjects(),getPublishedPosts()]);return Response.json({projects,posts},{headers:{'Cache-Control':'private, no-store'}});}
export async function POST(req:Request){if(!authorized(req))return denied();if(Number(req.headers.get('content-length')||0)>16000)return Response.json({error:'Request too large.'},{status:413});const body=await req.text();if(body.length>16000)return Response.json({error:'Request too large.'},{status:413});const origin=new URL(req.url).origin;return submitEnquiry(new Request(new URL('/api/enquiries',origin),{method:'POST',headers:{'Content-Type':'application/json',origin,'cf-connecting-ip':req.headers.get('x-bca-visitor')||'unknown'},body}));}
