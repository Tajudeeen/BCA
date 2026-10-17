import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
// Exercise the real route handler against an in-memory R2 binding, without a preview server.
const bytes=new TextEncoder().encode('0123456789abcdefghij');
globalThis.__filmEnv={BUCKET:{head:async()=>({size:bytes.length,httpEtag:'"film-etag"'}),get:async(_key,{range})=>({body:bytes.slice(range.offset,range.offset+range.length)})}};
let src=fs.readFileSync(new URL('../app/api/films/[slug]/route.ts',import.meta.url),'utf8');
src=src.replace("import {env} from 'cloudflare:workers';",'const env=globalThis.__filmEnv;').replace("import {getFilm} from '@/lib/films';","const getFilm=(slug)=>slug==='ami'?{key:'test-film'}:null;");
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {GET,HEAD}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const context={params:Promise.resolve({slug:'ami'})};
const request=(headers={},method='GET')=>new Request('https://example.test/api/films/ami',{headers,method});
let r=await GET(request(),context);assert.equal(r.status,200);assert.equal(await r.text(),'0123456789abcdefghij');assert.equal(r.headers.get('accept-ranges'),'bytes');
r=await GET(request({Range:'bytes=2-5'}),context);assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),'bytes 2-5/20');assert.equal(await r.text(),'2345');
r=await GET(request({Range:'bytes=-4'}),context);assert.equal(await r.text(),'ghij');
r=await GET(request({Range:'bytes=18-'}),context);assert.equal(await r.text(),'ij');
for(const range of ['bytes=20-','bytes=3-1','bytes=-0','bytes=1-2,4-5','bytes=-','garbage']){r=await GET(request({Range:range}),context);assert.equal(r.status,416,range);}
r=await GET(request({Range:'bytes=0-1','If-Range':'"stale"'}),context);assert.equal(r.status,200);assert.equal((await r.text()).length,20);
r=await GET(request({'If-None-Match':'"film-etag"'}),context);assert.equal(r.status,304);
r=await HEAD(request({},'HEAD'),context);assert.equal(r.status,200);assert.equal(r.headers.get('content-length'),'20');assert.equal(await r.text(),'');
r=await GET(request(),{params:Promise.resolve({slug:'private/secret'})});assert.equal(r.status,404);
console.log('PASS: full stream, seek ranges, suffix/open ranges, invalid/multipart rejection, If-Range, ETag, HEAD and unknown-film isolation');
