import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const compile=source=>ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const load=source=>import('data:text/javascript;base64,'+Buffer.from(compile(source)).toString('base64'));
const strip=source=>source.replace(/^import .*;\n/gm,'');
const projects=await load(fs.readFileSync('lib/projects.ts','utf8'));
globalThis.__deskTest={...projects,React,...React};
const model=await load('const {projects,statuses}=globalThis.__deskTest;\n'+strip(fs.readFileSync('lib/admin-model.ts','utf8')));
Object.assign(globalThis.__deskTest,model);
assert.deepEqual(model.deskQuery({view:'invalid',page:'-3',status:'junk',kind:'junk',project:'unknown'}),{view:'overview',page:1,q:'',status:'',kind:'',project:''});
assert.equal(model.grantState({revoked:0,expiresAt:100},100),'expired');assert.equal(model.grantState({revoked:1,expiresAt:1000},100),'revoked');
assert.deepEqual(model.parseDetails('invalid'),{});
const tables={};const records={};
for(const table of ['enquiries','grants','materials','projectContent']){records[table]=new Map();tables[table]=new Proxy({name:table},{get:(target,key)=>key==='name'?target.name:{table,field:key}});}
const eq=(column,value)=>row=>row[column.field]===value;
const gt=(column,value)=>row=>row[column.field]>value;
const and=(...predicates)=>row=>predicates.every(p=>!p||p(row));
let admin=true;const logs=[];const storage=new Map();
const db={
 select:()=>({from:table=>({where:predicate=>({limit:async n=>[...records[table.name].values()].filter(predicate).slice(0,n)})})}),
 insert:table=>({values:value=>{const save=()=>{const key=value.id||value.slug;if(records[table.name].has(key))return [];const saved={...(table.name==='grants'?{revoked:0}:{}),...value};records[table.name].set(key,saved);return [saved];};return {then:(resolve)=>resolve(save()),onConflictDoNothing:()=>({returning:async()=>save()})};}}),
 update:table=>({set:values=>({where:predicate=>{const update=()=>{const out=[];for(const [key,row] of records[table.name])if(predicate(row)){const updated={...row,...values};records[table.name].set(key,updated);out.push(updated);}return out;};return {then:resolve=>resolve(update()),returning:async()=>update()};}})}),
 delete:table=>({where:async predicate=>{for(const [key,row] of records[table.name])if(predicate(row))records[table.name].delete(key);}})
};
const env={BUCKET:{put:async(key,value)=>storage.set(key,value),delete:async key=>storage.delete(key)}};
Object.assign(globalThis.__deskTest,{...tables,eq,gt,and,getDb:()=>db,env,isAdmin:async()=>admin,log:async(...event)=>logs.push(event),sameOrigin:req=>req.headers.get('origin')===new URL(req.url).origin});
const {POST}=await load('const {env,getDb,enquiries,grants,materials,projectContent,isAdmin,log,sameOrigin,validProject,reviewStatuses,validateProjectContent,and,eq,gt}=globalThis.__deskTest;\n'+strip(fs.readFileSync('app/api/admin/route.ts','utf8')));
const request=(value,origin='https://example.test')=>new Request('https://example.test/api/admin',{method:'POST',headers:{origin,...(value instanceof FormData?{}:{'content-type':'application/json'})},body:value instanceof FormData?value:JSON.stringify(value)});
const review={action:'review',id:'request-1',status:'reviewing',notes:'Call about the project scope.',expectedUpdatedAt:0};
records.enquiries.set('request-1',{id:'request-1',status:'new',notes:'',updatedAt:0});
admin=false;assert.equal((await POST(request(review))).status,403);admin=true;assert.equal((await POST(request(review,'https://other.test'))).status,403);assert.equal(records.enquiries.get('request-1').status,'new');
assert.equal((await POST(request(review))).status,200);assert.equal(records.enquiries.get('request-1').notes,review.notes);assert.equal((await POST(request(review))).status,409);assert.equal((await POST(request({...review,id:'missing'}))).status,404);
const grant={action:'grant',email:'REVIEW@example.test',project:'irin',days:14};
assert.equal((await POST(request(grant))).status,200);assert.equal([...records.grants.values()][0].email,'review@example.test');assert.equal((await POST(request(grant))).status,409);
let g=[...records.grants.values()][0];assert.equal((await POST(request({action:'renew',id:g.id,days:90}))).status,200);assert.equal((await POST(request({action:'renew',id:g.id,days:91}))).status,400);assert.equal((await POST(request({action:'revoke',id:g.id}))).status,200);assert.equal(records.grants.get(g.id).revoked,1);assert.equal((await POST(request({action:'renew',id:g.id,days:5}))).status,400);
const p=projects.projects[0];const edit={action:'content',slug:p.slug,expectedUpdatedAt:0,content:{...p,description:['Updated approved description.']}};
assert.equal((await POST(request({...edit,content:{...edit.content,images:['/vehicles/irin-0.webp']}}))).status,400);
assert.equal((await POST(request(edit))).status,200);assert.deepEqual(JSON.parse(records.projectContent.get(p.slug).content).description,edit.content.description);assert.equal((await POST(request(edit))).status,409);
function fileRequest(bytes,type){const form=new FormData();form.set('project','irin');form.set('title','Design study');form.set('file',new File([bytes],'study.pdf',{type}));return request(form);}
assert.equal((await POST(fileRequest('fake pdf','application/pdf'))).status,400);assert.equal(storage.size,0);
assert.equal((await POST(fileRequest('%PDF-1.7\nexample','application/pdf'))).status,200);assert.equal(storage.size,1);let file=[...records.materials.values()][0];assert.equal((await POST(request({action:'rename-material',id:file.id,title:'Approved study'}))).status,200);assert.equal(records.materials.get(file.id).title,'Approved study');
assert.equal((await POST(request({action:'remove-material',id:file.id}))).status,400);assert.equal(storage.size,1);assert.equal((await POST(request({action:'remove-material',id:file.id,confirm:true}))).status,200);assert.equal(storage.size,0);assert.equal(records.materials.size,0);
assert.ok(logs.some(e=>e[0]==='remove-material'));
// Server-render every dashboard view with controlled fixtures; no browser or production records are used.
const icon=()=>React.createElement('svg',{'aria-hidden':true});
for(const name of ['Inbox','ArrowUpRight','Clock3','ShieldCheck','FileText','FolderLock','RefreshCw','Plus','Search','Download','Mail','ChevronLeft','ChevronRight','Trash2'])globalThis.__deskTest[name]=icon;
Object.assign(globalThis.__deskTest,{useRouter:()=>({refresh(){}})});
const component=await load('const {React,useEffect,useState,useTransition,useRouter,Inbox,ArrowUpRight,Clock3,ShieldCheck,FileText,FolderLock,RefreshCw,Plus,Search,Download,Mail,ChevronLeft,ChevronRight,Trash2,projects,statuses,deskLabels,enquiryKinds,reviewStatuses,grantState,parseDetails,pageSize}=globalThis.__deskTest;\n'+strip(fs.readFileSync('components/admin-desk.tsx','utf8')));
const data={counts:{enquiries:0,new:0,reviewing:0,active:0,published:0,drafts:0,files:0,projects:5},content:projects.projects,recent:[],latestRequests:[],revisions:{},rows:[],total:0,page:1,now:Date.now()};
for(const view of model.deskViews){const html=renderToStaticMarkup(React.createElement(component.AdminDesk,{query:model.deskQuery({view}),data,account:'review@example.test',services:{database:true,files:true}}));assert.ok(html.includes(model.deskLabels[view]),view);assert.ok(!html.includes('NaN'),view);}
console.log('PASS admin authorization/origin, review notes/conflicts, grant lifecycle, project validation/conflicts, file signature/rename/removal, audit events and all dashboard view renders');
