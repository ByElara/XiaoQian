import {baseline, historical, imageSlots, initialImages, legacy, pages} from './data.mjs';

export const seedDate='2026-11-21';
export const emptyState=()=>({events:[],reviews:[]});
export const normalize=value=>value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
export const unique=values=>[...new Set(values)];
export const frozen=status=>['取消','不独立制作','复用抖音原生'].includes(status);

export function derive(state) {
  const records=Object.fromEntries(baseline.map(row=>[row.id,{...row}]));
  const originals={...records};
  const images=[...initialImages];
  const candidates=[];
  for(const event of state.events){
    if(event.type==='image'){
      images.push(event);
    }else if(event.status==='待核实'||event.status==='待完善'){
      candidates.push(event);
    }else{
      records[event.target||event.id]={...event,id:event.target||event.id};
    }
  }
  const active=Object.values(records);
  const issues=[];
  const impact=(page,targets)=>{
    const direct=unique([page,...targets]).filter(p=>pages[p]);
    const related=active.filter(row=>!frozen(row.status)&&row.page!==page&&row.targets.includes(page)).map(row=>row.page);
    return unique([...direct,...related]);
  };
  const issue=(id,type,page,title,detail,refs,targets=[],state='待核实')=>issues.push({id,type,page,title,detail,refs,impact:impact(page,targets),state});
  for(const [id,ref,detail] of historical){
    const row=originals[id];
    issue('old-'+id,'新旧冲突',row.page,row.title,detail+' 当前依据：'+row.source,[id],row.targets,'已有基线裁定');
  }
  for(const [page,slot] of imageSlots){
    const matches=images.filter(row=>row.page===page&&row.slot===slot&&row.status!=='历史原图');
    const confirmed=matches.filter(row=>row.status==='已确认');
    if(confirmed.length===0) issue('img-'+page+'-'+slot,'原图覆盖',page,slot,matches.length?'已登记来源，最终原图与视觉验收待核实。':'尚未登记可唯一对应的最终原图。',matches.map(row=>row.id));
    if(confirmed.length>1) issue('img-dup-'+page+'-'+slot,'重复设计',page,slot,'同一状态登记了多份已确认原图，请核实最终版本。',confirmed.map(row=>row.id));
  }
  const same=(a,b)=>a.status===b.status&&normalize(a.rule)===normalize(b.rule)&&a.targets.toSorted().join()===b.targets.toSorted().join();
  for(const candidate of candidates){
    const target=records[candidate.target];
    if(target){
      const comparable={...candidate,status:target.status};
      const identical=same(comparable,target);
      issue('candidate-'+candidate.id,identical?'重复设计':'新旧冲突',target.page,candidate.title,identical?'候选项与当前条目的规则和去向一致。':'候选项与当前条目的规则或去向不同，请核对证据。当前基线：'+target.rule,[target.id,candidate.id],unique([...candidate.targets,...target.targets]));
    }
  }
  const candidatesAndActive=[...active,...candidates.filter(row=>!row.target)];
  const duplicateKeys=new Map();
  for(const row of candidatesAndActive){
    const key=[row.page,row.kind,normalize(row.title)].join('|');
    const matches=duplicateKeys.get(key)||[];
    matches.push(row);
    duplicateKeys.set(key,matches);
    if(row.kind==='跳转'&&!row.targets.length) issue('jump-'+row.id,'缺失覆盖',row.page,row.title,'尚未关联跳转去向。',[row.id]);
    for(const dest of row.targets){
      if(dest===row.page||!['跳转','交互'].includes(row.kind)||frozen(row.status)) continue;
      const cancelled=active.some(item=>item.page===dest&&item.kind==='页面'&&item.status==='取消');
      const covered=active.some(item=>item.page===dest);
      if(cancelled||!covered) issue('dest-'+row.id+'-'+dest,'缺失覆盖',row.page,row.title,cancelled?'跳转指向已取消页面 '+dest+'。':'目标 '+dest+' 缺少可追溯基线条目。',[row.id],[dest]);
    }
    if(['待核实','待完善'].includes(row.status)) issue('review-'+row.id,'待核实/完善',row.page,row.title,row.rule,[row.id],row.targets,row.status);
  }
  for(const [key,list] of duplicateKeys){
    if(list.length>1) issue('dup-'+key,'重复设计',list[0].page,list[0].title,'同页、同类型且规范化后的条目标题一致。',list.map(row=>row.id),list.flatMap(row=>row.targets));
  }
  for(const row of legacy.filter(row=>!row.link)){
    const page=row.entry.split('/')[0];
    issue('legacy-'+row.id,'旧节点映射',pages[page]?page:'LEGACY',row.id+' '+row.title,'旧清单：'+row.rule+'。当前版本的对应归属或范围缺少明确依据。',[row.id]);
  }
  return {records:active,candidates,images,issues};
}

export function snapshot(model) {
  const entries=[...model.records,...model.candidates,...model.images].map(row=>['item:'+row.id,row.page,row.title,JSON.stringify(row)]);
  const issues=model.issues.map(row=>['issue:'+row.id,row.page,row.title,JSON.stringify(row)]);
  return [...entries,...issues];
}

export function difference(previous,current) {
  const before=new Map(previous.map(row=>[row[0],row]));
  const after=new Map(current.map(row=>[row[0],row]));
  return {
    added:current.filter(row=>!before.has(row[0])).map(row=>row.slice(0,3)),
    changed:current.filter(row=>before.has(row[0])&&before.get(row[0])[3]!==row[3]).map(row=>row.slice(0,3)),
    removed:previous.filter(row=>!after.has(row[0])).map(row=>row.slice(0,3))
  };
}
