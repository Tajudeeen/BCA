import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {getDb} from '@/db';
import {user,account} from '@/db/auth-schema';
import {createOwnerAuth} from './owner-auth-config';
export const ownerOrigin='https://bca-chi-three.vercel.app';
export const ownerId='bca-company-owner';
export function ownerAuth(){return createOwnerAuth(getDb(),env.BCA_AUTH_SECRET||'',ownerOrigin);}
export async function provisionOwner(){
 const email=env.BCA_OWNER_EMAIL?.trim().toLowerCase(),password=env.BCA_OWNER_PASSWORD_HASH;
 if(!email||!password)throw new Error('Company owner account is not configured.');
 const db=getDb(),now=new Date();
 // Seed once. Redeploys never reset a password changed by the owner.
 await db.insert(user).values({id:ownerId,name:'Bonire Concepts Art',email,emailVerified:false,createdAt:now,updatedAt:now}).onConflictDoNothing();
 await db.insert(account).values({id:'bca-owner-credential',accountId:ownerId,providerId:'credential',userId:ownerId,password,createdAt:now,updatedAt:now}).onConflictDoNothing();
}
export async function getOwnerUser(){
 if(!env.BCA_AUTH_SECRET)return null;
 const current=await ownerAuth().api.getSession({headers:await headers(),query:{disableCookieCache:true}});
 return current?.user.id===ownerId&&current.user.email.toLowerCase()===env.BCA_OWNER_EMAIL?.toLowerCase()?{userId:current.user.id,email:current.user.email,displayName:current.user.name}:null;
}
export async function requireOwner(){const user=await getOwnerUser();if(!user)redirect('/sign-in');return user;}
