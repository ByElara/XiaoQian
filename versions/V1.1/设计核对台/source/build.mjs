import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import * as values from './data.mjs';

const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const dataSource=Object.entries(values).map(([name,value])=>{
  if(name==='libraryURL')return 'export const libraryURL='+value.toString()+';';
  return 'export const '+name+'='+JSON.stringify(value)+';';
}).join('\n');
const files={html:await read('index.html'),css:await read('style.css'),client:await read('app.mjs'),data:dataSource,engine:await read('engine.mjs')};
await mkdir('dist/server',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
const core=await read('worker.mjs');
const imports=core.replace(/^import .* from '\.\/embedded\.mjs';$/m,'')
  .replace(/^import .* from '\.\/data\.mjs';$/m,'')
  .replace(/^import .* from '\.\/engine\.mjs';$/m,'');
const engine=files.engine.replace(/^import .* from '\.\/data\.mjs';$/m,'');
const embedded=Object.entries(files).map(([name,value])=>'const '+name+'='+JSON.stringify(value)+';').join('\n');
await writeFile('dist/server/index.js',dataSource+'\n'+engine+'\n'+embedded+'\n'+imports);
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
