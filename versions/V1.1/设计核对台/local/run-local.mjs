import { createServer, STATUS_CODES } from 'node:http';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { DatabaseSync } from 'node:sqlite';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import worker from './dist/server/index.js';

const storage=new URL('./review-data/',import.meta.url);
const images=new URL('images/',storage);
await mkdir(images,{recursive:true});
const db=new DatabaseSync(fileURLToPath(new URL('review.sqlite',storage)));
const migration=await readFile(new URL('./drizzle/0000_register.sql',import.meta.url),'utf8');
db.exec(migration.replace('CREATE TABLE ','CREATE TABLE IF NOT EXISTS '));
function imagePath(id,extension=''){
  if(!/^local\/[a-f0-9-]+$/.test(id))throw Error('Invalid image key');
  return fileURLToPath(new URL(id.slice(6)+extension,images));
}
const env={
  DB:{
    prepare(sql){
      const stmt=db.prepare(sql);
      return {bind(...params){return {first:()=>stmt.get(...params),run:()=>({meta:stmt.run(...params)})};}};
    }
  },
  BUCKET:{
    async put(id,stream,{httpMetadata}){
      await pipeline(Readable.fromWeb(stream),createWriteStream(imagePath(id)));
      await writeFile(imagePath(id,'.json'),JSON.stringify(httpMetadata));
    },
    async get(id){
      try{
        const httpMetadata=JSON.parse(await readFile(imagePath(id,'.json'),'utf8'));
        return {httpMetadata,body:Readable.toWeb(createReadStream(imagePath(id)))};
      }catch(error){
        if(error.code!=='ENOENT')throw error;
        return null;
      }
    },
    async delete(id){
      await Promise.all([imagePath(id),imagePath(id,'.json')].map(path=>unlink(path).catch(error=>{if(error.code!=='ENOENT')throw error;})));
    }
  }
};
const origin='http://127.0.0.1:5731';
const server=createServer(async(req,res)=>{
  if(req.headers.host!=='127.0.0.1:5731'){
    res.writeHead(421).end(STATUS_CODES[421]);
    return;
  }
  try{
    const headers=new Headers(req.headers);
    headers.set('oai-authenticated-user-id','local');
    const method=req.method||'GET';
    const destination=new URL(req.url,origin);
    if(destination.origin!==origin){
      res.writeHead(400).end(STATUS_CODES[400]);
      return;
    }
    const body=method==='GET'||method==='HEAD'?undefined:Readable.toWeb(req);
    const response=await worker.fetch(new Request(destination,{method,headers,body,duplex:'half'}),env);
    res.writeHead(response.status,Object.fromEntries(response.headers));
    if(response.body)await pipeline(Readable.fromWeb(response.body),res);
    else res.end();
  }catch(error){
    console.error(error);
    if(!res.headersSent)res.writeHead(500);
    res.end();
  }
});
server.listen(5731,'127.0.0.1',()=>{
  console.log('Open '+origin);
  if(process.platform==='win32'&&process.argv.includes('--open')){
    execFile('rundll32.exe',['url.dll,FileProtocolHandler',origin],{windowsHide:true});
  }
});
