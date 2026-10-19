import 'server-only';
import {cache} from 'react';
import type {Project} from '@/lib/projects';
import type {BlogPost} from '@/lib/blog-model';
export const backendOrigin='https://bonire-concepts-art.deeen-code.chatgpt.site';
export function backendHeaders(){const token=process.env.BCA_BACKEND_SERVICE_TOKEN,key=process.env.BCA_FRONTEND_KEY;if(!token||!key)throw new Error('Studio backend is not configured.');return {'OAI-Sites-Authorization':'Bearer '+token,Authorization:'Bearer '+key};}
export const publicContent=cache(async():Promise<{projects:Project[];posts:BlogPost[]}>=>{const response=await fetch(backendOrigin+'/api/studio/public',{headers:backendHeaders(),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('Studio content is unavailable.');return response.json();});
