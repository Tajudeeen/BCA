import {projects,statuses} from './projects';
export const deskViews=['overview','inbox','projects','access','materials','activity','settings'] as const;
export type DeskView=typeof deskViews[number];
export const reviewStatuses=['new','reviewing','approved','declined','closed'];
export const enquiryKinds=['contact','commission','access','ip','partnership','support'];
export const deskLabels:Record<DeskView,string>={overview:'Overview',inbox:'Enquiries',projects:'Portfolio',access:'Access grants',materials:'Private files',activity:'Activity log',settings:'Settings'};
export const pageSize=20;
export function deskQuery(q:Record<string,string|string[]|undefined>){
 const string=(key:string)=>typeof q[key]==='string'?q[key] as string:'';
 const view=deskViews.includes(string('view') as DeskView)?string('view') as DeskView:'overview';
 const page=Math.max(1,Math.min(100000,Number.parseInt(string('page'),10)||1));
 const status=view==='access'?(['active','expired','revoked'].includes(string('status'))?string('status'):''):(reviewStatuses.includes(string('status'))?string('status'):'');
 return {view,page,q:string('q').trim().slice(0,150),status,kind:enquiryKinds.includes(string('kind'))?string('kind'):'',project:projects.some(p=>p.slug===string('project'))?string('project'):''};
}
export function validateProjectContent(value:unknown,slug:string){
 const base=projects.find(p=>p.slug===slug);if(!base||!value||typeof value!=='object')throw new Error('Choose an existing project.');
 const c=value as Record<string,unknown>;
 const text=(key:string,max:number)=>typeof c[key]==='string'&&!!(c[key] as string).trim()&&(c[key] as string).length<=max;
 if(!text('name',100)||!text('category',150)||!text('summary',2000)||!statuses.includes(String(c.status)))throw new Error('Complete the project name, category, summary and phase.');
 if(!Array.isArray(c.description)||!c.description.length||c.description.length>12||!c.description.every(p=>typeof p==='string'&&p.trim().length>0&&p.length<=4000))throw new Error('Add one to twelve description paragraphs, up to 4,000 characters each.');
 if(!Array.isArray(c.images)||!c.images.length||c.images.length>base.images.length||new Set(c.images).size!==c.images.length||!c.images.every(image=>base.images.includes(image)))throw new Error('Choose approved images belonging to this project.');
 return {name:(c.name as string).trim(),category:(c.category as string).trim(),summary:(c.summary as string).trim(),status:String(c.status),description:(c.description as string[]).map(p=>p.trim()),images:c.images as string[]};
}
export function grantState(grant:{revoked:number;expiresAt:number},now:number){return grant.revoked?'revoked':grant.expiresAt<=now?'expired':'active';}
export function parseDetails(value:string):Record<string,unknown>{try{const d=JSON.parse(value);return d&&typeof d==='object'&&!Array.isArray(d)?d:{};}catch{return {};}}
