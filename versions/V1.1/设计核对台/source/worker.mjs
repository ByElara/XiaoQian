import { baseline, flows, imageSlots, kinds, pages, statuses } from './data.mjs';
import { derive, difference, emptyState, snapshot, unique } from './engine.mjs';
import { html, css, client, data, engine } from './embedded.mjs';

const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const file=(body,type)=>new Response(body,{headers:{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; img-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'" }});
const clean=(value,max=2000)=>typeof value==='string'?value.trim().slice(0,max):'';
class InputError extends Error {}
function requireValue(condition,message){if(!condition)throw new InputError(message);}

async function load(env,owner){
  const row=await env.DB.prepare('SELECT revision, payload FROM review_state WHERE owner = ?').bind(owner).first();
  return row ? {revision:row.revision,...JSON.parse(row.payload)} : {revision:0,...emptyState()};
}
async function persist(env,owner,state){
  const payload=JSON.stringify({events:state.events,reviews:state.reviews,lastSnapshot:state.lastSnapshot});
  const query=state.revision
    ? env.DB.prepare('UPDATE review_state SET revision = revision + 1, payload = ? WHERE owner = ? AND revision = ?').bind(payload,owner,state.revision)
    : env.DB.prepare('INSERT OR IGNORE INTO review_state (owner,revision,payload) VALUES (?,1,?)').bind(owner,payload);
  const result=await query.run();
  return result.meta.changes===1;
}
async function imageType(upload){
  const bytes=new Uint8Array(await upload.slice(0,12).arrayBuffer());
  if([137,80,78,71,13,10,26,10].every((byte,index)=>bytes[index]===byte))return 'image/png';
  if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
  if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
  if(['GIF87a','GIF89a'].includes(String.fromCharCode(...bytes.slice(0,6))))return 'image/gif';
  return '';
}
async function takeImage(request,env,owner){
  const form=await request.formData();
  const page=clean(form.get('page'),30), slot=clean(form.get('slot'),100);
  const status=clean(form.get('status'),30), source=clean(form.get('source'),2000);
  const title=clean(form.get('title'),160);
  const link=clean(form.get('url'));
  const upload=form.get('file');
  requireValue(pages[page]&&slot&&title&&source,'请填写页面、状态或画面、名称和依据。');
  requireValue(['待核实','已确认','历史原图'].includes(status),'原图状态无效。');
  requireValue(status!=='已确认'||form.get('confirmed')==='yes','请勾选用户已明确确认。');
  requireValue(!(upload?.size&&link),'请在图片上传和来源链接中选择一种。');
  if(link){
    let url;
    try{url=new URL(link);}catch{throw new InputError('请输入有效的 HTTPS 来源链接。');}
    requireValue(url.protocol==='https:'&&!url.username&&!url.password,'请输入有效的 HTTPS 来源链接。');
  }
  const id=crypto.randomUUID();
  const item={id,type:'image',date:new Date().toISOString(),status,source,page,slot,title,url:link};
  if(upload?.size){
    requireValue(upload.size<=10*1024*1024,'单张上传上限为 10 MB。');
    const contentType=await imageType(upload);
    requireValue(contentType,'支持 PNG、JPG、WebP、GIF。');
    item.url='/api/image/'+id;
    await env.BUCKET.put(owner+'/'+id,upload.stream(),{httpMetadata:{contentType}});
  }
  return item;
}

function takeDecision(body,model){
  const target=clean(body.target,100), page=clean(body.page,30);
  const status=clean(body.status,30), kind=clean(body.kind,30), flow=clean(body.flow,80);
  const title=clean(body.title,160), rule=clean(body.rule,4000), source=clean(body.source);
  const targets=unique(Array.isArray(body.targets)?body.targets:[]);
  requireValue(pages[page]&&kind&&kinds.includes(kind)&&flows.includes(flow)&&statuses.includes(status)&&title&&rule&&source,'请填写页面、流程、类型、状态、规则和决策依据。');
  requireValue(targets.every(p=>typeof p==='string'&&Object.hasOwn(pages,p)),'关联页面无效。');
  const original=model.records.find(row=>row.id===target);
  requireValue(!target||(original&&original.page===page),'所选基线须属于当前页面。');
  const pending=['待完善','待核实'].includes(status);
  requireValue(pending||body.confirmed===true,'只有明确确认的决策才能记入生效基线。');
  requireValue(pending||!target||body.supersede===true,'替换当前决策需要明确勾选替换。');
  return {id:crypto.randomUUID(),type:'decision',date:new Date().toISOString(),target,page,kind,flow,status,title,rule,source,targets};
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    const assets={'/':[html,'text/html; charset=utf-8'],'/style.css':[css,'text/css; charset=utf-8'],'/app.mjs':[client,'text/javascript; charset=utf-8'],'/data.mjs':[data,'text/javascript; charset=utf-8'],'/engine.mjs':[engine,'text/javascript; charset=utf-8']};
    const asset=Object.hasOwn(assets,url.pathname)&&assets[url.pathname];
    if(asset&&request.method==='GET')return file(...asset);
    if(!url.pathname.startsWith('/api/'))return json({error:'页面不存在。'},404);
    const owner=request.headers.get('oai-authenticated-user-id');
    if(!owner)return json({error:'请通过 Sites 登录后访问工作台。'},401);
    if(request.method==='POST'&&request.headers.get('origin')!==url.origin)return json({error:'请求来源不匹配。'},403);
    try{
      if(request.method==='GET'&&/^\/api\/image\/[\w-]+$/.test(url.pathname)){
        const object=await env.BUCKET.get(owner+'/'+url.pathname.split('/').at(-1));
        return object?file(object.body,object.httpMetadata.contentType):json({error:'图片不存在。'},404);
      }
      if(!['/api/state','/api/decision','/api/image','/api/review'].includes(url.pathname))return json({error:'页面不存在。'},404);
      const state=await load(env,owner);
      if(request.method==='GET'&&url.pathname==='/api/state'){
        const {lastSnapshot,...visible}=state;
        return json(visible);
      }
      if(request.method!=='POST'||url.pathname==='/api/state')return json({error:'不支持此操作。'},405);
      const model=derive(state);
      let uploaded=null, saved;
      if(url.pathname==='/api/image'){
        requireValue(Number(request.headers.get('content-length')||0)<=11*1024*1024,'单张上传上限为 10 MB。');
        uploaded=await takeImage(request,env,owner);
        state.events.push(uploaded);
        saved=uploaded;
      }else{
        const body=await request.json();
        if(url.pathname==='/api/decision'){
          saved=takeDecision(body,model);
          state.events.push(saved);
        }else{
          const current=snapshot(model);
          const delta=state.lastSnapshot?difference(state.lastSnapshot,current):{added:[],changed:[],removed:[]};
          saved={id:crypto.randomUUID(),date:new Date().toISOString(),title:clean(body.title,120)||'设计核对',note:clean(body.note),initial:!state.lastSnapshot,delta,counts:{records:model.records.length,images:model.images.length,issues:model.issues.filter(row=>row.state!=='已有基线裁定').length},open:model.issues.filter(row=>row.state!=='已有基线裁定').map(({id,type,page,title,state,impact})=>({id,type,page,title,state,impact}))};
          state.reviews.push(saved);
          state.lastSnapshot=current;
        }
      }
      let committed;
      try{committed=await persist(env,owner,state);}catch(error){
        if(uploaded?.url.startsWith('/api/'))await env.BUCKET.delete(owner+'/'+uploaded.id);
        throw error;
      }
      if(!committed){
        if(uploaded?.url.startsWith('/api/'))await env.BUCKET.delete(owner+'/'+uploaded.id);
        return json({error:'另一项操作已更新工作台。请刷新后重试。'},409);
      }
      return json({saved},201);
    }catch(error){
      if(error instanceof InputError)return json({error:error.message},400);
      if(error instanceof SyntaxError)return json({error:'提交数据格式无效。'},400);
      console.error(error);
      return json({error:'操作暂未保存，请稍后重试。'},500);
    }
  }
};
