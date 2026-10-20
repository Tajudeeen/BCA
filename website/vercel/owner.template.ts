import 'server-only';
import {cache} from 'react';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {backendHeaders,backendOrigin} from '@/lib/backend';
export const ownerFetch=cache(async(path:string)=>{
 const incoming=await headers();const response=await fetch(backendOrigin+path,{headers:{...backendHeaders(),cookie:incoming.get('cookie')||''},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(25000)});
 if(response.status===401||response.status===403)redirect('/sign-in');
 if(!response.ok)throw new Error('The studio workspace is unavailable.');
 return response.json();
});
export async function getOwnerUser():Promise<{userId:string;email:string;displayName:string}|null>{return (await ownerFetch('/api/studio/session')).user;}
export async function requireOwner(){const user=await getOwnerUser();if(!user)redirect('/sign-in');return user;}
