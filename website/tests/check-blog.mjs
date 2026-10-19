import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const compile=source=>ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const load=source=>import('data:text/javascript;base64,'+Buffer.from(compile(source)).toString('base64'));
const model=await load(fs.readFileSync('lib/blog-model.ts','utf8'));
const rows=new Map();let admin=true;let writes=0;
const col=new Proxy({},{get:(_,key)=>key});
const eq=(field,value)=>row=>row[field]===value;
const and=(...conditions)=>row=>conditions.every(fn=>fn(row));
const db={
 select:()=>({from:()=>({where:predicate=>({limit:async n=>[...rows.values()].filter(predicate).slice(0,n),orderBy:async()=>[...rows.values()].filter(predicate)})})}),
 insert:()=>({values:value=>({onConflictDoNothing:()=>({returning:async()=>{if(rows.has(value.slug))return [];rows.set(value.slug,value);writes++;return [value];}})})}),
 update:()=>({set:values=>({where:predicate=>({returning:async()=>{const out=[];for(const [slug,row] of rows)if(predicate(row)){const value={...row,...values};rows.set(slug,value);out.push(value);writes++;}return out;}})})})
};
globalThis.__blogTest={...model,getDb:()=>db,blogPosts:col,isAdmin:async()=>admin,log:async()=>{},sameOrigin:req=>req.headers.get('origin')===new URL(req.url).origin,eq,and,desc:()=>null};
let source=fs.readFileSync('app/api/admin/blog/route.ts','utf8').replace(/^import .*;\n/gm,'');
source='const {getDb,blogPosts,isAdmin,log,sameOrigin,validateBlogInput,and,eq}=globalThis.__blogTest;\n'+source;
const {POST}=await load(source);
const valid={slug:'test-design',title:'Inside the design process',excerpt:'An original note about automotive concept development.',body:'Design research starts with a real problem. '.repeat(8),category:'Studio notes',cover:'',coverAlt:'',status:'draft'};
const request=(post,expectedUpdatedAt=null,origin='https://example.test')=>new Request('https://example.test/api/admin/blog',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({post,expectedUpdatedAt})});
admin=false;assert.equal((await POST(request(valid))).status,403);admin=true;
assert.equal((await POST(request(valid,null,'https://other.test'))).status,403);assert.equal(writes,0);
for(const bad of [{...valid,slug:'../../admin'},{...valid,cover:'https://other.test/track.jpg'},{...valid,cover:'/vehicles/ami-0.webp',coverAlt:''},{...valid,status:'published',body:'short'}])assert.equal((await POST(request(bad))).status,400);
assert.equal((await POST(request(valid))).status,200);assert.equal(rows.get(valid.slug).publishedAt,null);
assert.equal((await POST(request(valid))).status,409,'Slug collisions do not overwrite');
let publicSource=fs.readFileSync('lib/blog.ts','utf8').replace(/^import .*;\n/gm,'');
const publicApi=await load('const {getDb,blogPosts,and,eq,desc}=globalThis.__blogTest;\n'+publicSource);
assert.equal((await publicApi.getPublishedPosts()).length,0);assert.equal(await publicApi.getPublishedPost(valid.slug),undefined,'Draft URL is inaccessible');
let current=rows.get(valid.slug);
assert.equal((await POST(request({...valid,status:'published'},current.updatedAt))).status,200);
assert.equal((await publicApi.getPublishedPosts()).length,1);assert.equal((await publicApi.getPublishedPost(valid.slug)).title,valid.title);
const firstPublication=rows.get(valid.slug).publishedAt;
assert.equal((await POST(request({...valid,title:'Stale update'},current.updatedAt))).status,409);
current=rows.get(valid.slug);assert.equal((await POST(request(valid,current.updatedAt))).status,200);
assert.equal((await publicApi.getPublishedPosts()).length,0,'Unpublished posts disappear');
current=rows.get(valid.slug);assert.equal((await POST(request({...valid,status:'published'},current.updatedAt))).status,200);assert.equal(rows.get(valid.slug).publishedAt,firstPublication);
assert.equal(await publicApi.getPublishedPost('unknown'),undefined);
const malicious='<script>alert(1)</script>\n\n## Design details\n\n- One\n- Two\n\n> Quoted text';
globalThis.__blogTest.React=React;
let bodySource=fs.readFileSync('components/article-body.tsx','utf8').replace(/^import .*;\n/gm,'');
const {ArticleBody}=await load('const {articleBlocks,React}=globalThis.__blogTest;\n'+bodySource);
const markup=renderToStaticMarkup(React.createElement(ArticleBody,{body:malicious}));
assert.ok(!markup.includes('<script>'));assert.ok(markup.includes('&lt;script&gt;'));assert.ok(markup.includes('<h2>Design details</h2>'));assert.ok(markup.includes('<ul>'));assert.ok(markup.includes('<blockquote>'));
console.log('PASS blog access/origin protection, validation, draft/publish/unpublish reads, slug collisions, stale edits, stable publication time and safe article rendering');
