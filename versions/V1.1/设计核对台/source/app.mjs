import { baseline,pages,flows,statuses,kinds,imageSlots,legacy,libraryURL,sources } from './data.mjs';
import { derive,difference,snapshot,unique } from './engine.mjs';

const $=id=>document.getElementById(id);
const content=$('content'), dialog=$('dialog');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const options=(values,first)=> (first===undefined?'':'<option value="">'+esc(first)+'</option>')+values.map(v=>{const [key,label]=Array.isArray(v)?v:[v,v];return '<option value="'+esc(key)+'">'+esc(label)+'</option>';}).join('');
const tags=(items)=>items.map(page=>'<button class="tag-link" data-page="'+esc(page)+'">'+esc(page)+' '+esc(pages[page])+'</button>').join('');
const badge=status=>'<span class="badge" data-status="'+esc(status)+'">'+esc(status)+'</span>';
const pageLabel=page=>page+' · '+(pages[page]||'');
const pageOptions=Object.entries(pages).map(([id,name])=>[id,id+' '+name]);
const date=value=>new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',dateStyle:'medium',timeStyle:'short',hour12:false}).format(new Date(value));
const visibleURL=url=>url?.startsWith('/api/image/')||url?.startsWith('https://')?url:'';
const nav={
  overview:['核对总览','M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z'],
  trace:['页面追溯','M4 3h16v18H4z M8 8h8 M8 12h8 M8 16h6'],
  issues:['问题与影响','M12 3 2.5 20h19z M12 9v5 M12 17h.01'],
  images:['原图档案','M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 6 M16 8h.01'],
  history:['核对历史','M3 12a9 9 0 1 1 2.5 6 M3 7v5h5 M12 7v5l3 2'],
  sources:['依据与旧版','M5 4h13v16H5z M8 4v16 M11 9h4 M11 13h4']
};
let state={events:[],reviews:[]}, model=derive(state), loadError='', tab='overview';
let filter={q:'',page:'',status:'',flow:'',kind:''};
let noticeTimer;
const issueTypes=()=>unique(model.issues.map(row=>row.type));
const currentIssues=()=>model.issues.filter(row=>row.state!=='已有基线裁定');
const recent=()=>state.reviews.at(-1);
const lookup=id=>[...model.records,...model.candidates,...model.images,...legacy].find(row=>row.id===id);
function msg(text){$('notice').textContent=text;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').textContent='',3700);}
async function api(path,body){
  const init=body===undefined?{}:{method:'POST',body:body instanceof FormData?body:JSON.stringify(body),headers:body instanceof FormData?{}:{'Content-Type':'application/json'}};
  const response=await fetch('/api/'+path,init);
  const data=await response.json();
  if(!response.ok)throw Error(data.error||'请求失败');
  return data;
}
async function refresh(){
  try{state=await api('state');model=derive(state);loadError='';}
  catch(error){loadError=error.message;}
  render();
}
function show(next,page='',status='',flow='',kind=''){
  tab=next;
  filter={q:'',page,status,flow,kind};
  render();
  window.scrollTo(0,0);
  content.focus({preventScroll:true});
}
const heading=(title,note,button='')=>'<div class="page-title"><div><h1>'+title+'</h1><p class="muted">'+note+'</p></div>'+button+'</div>';
const itemButton=(id,title)=>'<button class="text-button" data-item="'+esc(id)+'">'+esc(title)+'</button>';
const issueButton=(id,title)=>'<button class="text-button" data-issue="'+esc(id)+'">'+esc(title)+'</button>';
const table=(headers,rows)=>rows.length?'<div class="table-wrap"><table><thead><tr>'+headers.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(cells=>'<tr>'+cells.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>':'<p class="empty">当前筛选条件下没有条目。</p>';
const blurb=(title,note,action)=>'<div class="panel-header"><div><h2>'+title+'</h2>'+(note?'<p class="muted">'+note+'</p>':'')+'</div>'+(action||'')+'</div>';
function diffView(delta){
  const map={added:'新增',changed:'更新',removed:'已移出或解决'};
  if(!Object.values(delta).some(x=>x.length))return '<p class="muted">本次与上次相比无变化。</p>';
  return Object.entries(map).filter(([key])=>delta[key].length).map(([key,label])=>'<details '+(key==='added'||key==='changed'?'open':'')+'><summary>'+label+' · '+delta[key].length+'</summary><ul class="bullets">'+delta[key].map(([,page,title])=>'<li><strong>'+esc(page)+'</strong> '+esc(title)+'</li>').join('')+'</ul></details>').join('');
}
function overview(){
  const last=recent(), next=state.events.filter(event=>!last||event.date>last.date);
  const stat=(label,value,note,view,status='')=>'<button class="stat" data-tab="'+view+'" data-status="'+status+'"><small>'+label+'</small><strong>'+value+'</strong><small>'+note+'</small></button>';
  const focus=['P01','P02','P05','P07-B','P08','MY','PR','REC','P06'];
  const recentChanges=next.length?'<div class="stack">'+next.slice(-6).reverse().map(row=>'<div class="list-item"><div>'+itemButton(row.target||row.id,row.title)+'<small>'+esc(pageLabel(row.page))+' · '+date(row.date)+'</small></div>'+badge(row.status)+'</div>').join('')+'</div>':'<p class="muted">'+(last?'上次核对之后暂无新登记。':'已导入归档基线。首次核对将保存对比起点。')+'</p>';
  return '<section class="hero"><div class="label">基线归档 · 2026-11-21</div><h1>小牵 V1.1 设计核对</h1><p>按页面追溯功能、弹窗和跳转。登记原图与明确变更，逐轮核对设计进展。</p><div class="inline"><button class="light" data-tab="trace">查看页面清单</button><button data-action="image">登记原图</button></div></section>'
    +'<div class="stats">'+stat('当前基线条目',model.records.length,'含取消、原生复用等','trace')+stat('待处理问题',currentIssues().length,'覆盖、旧节点、决策待核实','issues')+stat('已登记原图',model.images.length,'已确认 '+model.images.filter(x=>x.status==='已确认').length+' 张','images')+stat('已完成核对',state.reviews.length,'逐轮保留结果','history')+'</div>'
    +'<div class="grid"><section class="panel">'+blurb('最新变化',last?'上次核对 '+date(last.date):'首次核对待保存','<button data-tab="history">核对历史</button>')+recentChanges+(last&&!last.initial?'<details><summary>上次核对的差异</summary>'+diffView(last.delta)+'</details>':'')+'</section>'
    +'<section class="panel">'+blurb('重点页面','查看页面规则和去向')+'<div class="links">'+tags(focus)+'</div>'
    +'<div class="list-item"><div><b>原图逐张复核</b><small>当前归档已定位地点编辑与交通方式两张弹窗图</small></div><button class="text-button" data-tab="images">原图档案</button></div></section></div>'
    +'<section class="panel">'+blurb('四类草稿','从存放位置和恢复规则检查是否串用')+draftTable()+'</section>';
}
function draftTable(){
  return '<div class="draft-table">'+table(['草稿','存放位置','恢复或提交规则'],[
    [itemButton('draft-plan','私人行程规划草稿'),'我的行程／草稿','新建半成品，可缺必填信息'],
    [itemButton('draft-edit','已有行程编辑草稿'),'依附原正式私人行程','一份附属 B；入口恢复原 B'],
    [itemButton('draft-record','旅行记录草稿'),'所属私人行程／旅行记录','保留记录自己的文字、照片与链接'],
    [itemButton('draft-work','抖音作品草稿'),'抖音原生作品草稿箱','失败保留；不自动同步私人行程新增内容']
  ])+'</div>';
}
function filterBar(statusList,kindList,label){
  return '<div class="filters"><input aria-label="搜索条目" id="q" placeholder="搜索标题、编号或规则" value="'+esc(filter.q)+'"><select id="page" aria-label="页面">'+options(pageOptions,'全部页面')+'</select><select id="status" aria-label="状态">'+options(statusList,'全部状态')+'</select><select id="flow" aria-label="流程">'+options(flows,'全部流程')+'</select><select id="kind" aria-label="'+label+'">'+options(kindList,'全部'+label)+'</select></div><div id="results"></div>';
}
function filtered(rows,isIssue=false){
  return rows.filter(row=>{
    const page=row.page;
    const flowsForPage=model.records.filter(item=>item.page===page).map(item=>item.flow);
    return (!filter.page||page===filter.page)&&(!filter.status||(row.status||row.state)===filter.status)
    &&(!filter.flow||(row.flow?[row.flow]:flowsForPage).includes(filter.flow))
    &&(!filter.kind||(isIssue?row.type:row.kind)===filter.kind)
    &&(!filter.q||[row.id,row.title,row.rule,row.detail,row.source,pages[page]].join(' ').toLowerCase().includes(filter.q.trim().toLowerCase()));
  });
}
function results(){
  if(!$('results'))return;
  const issues=tab==='issues';
  const rows=filtered(issues?model.issues:[...model.records,...model.candidates],issues);
  $('results').innerHTML='<small>共 '+rows.length+' 条</small>'+(issues
    ? table(['所属页面','问题与证据','问题类型','状态','影响范围'],rows.map(row=>[esc(pageLabel(row.page)),issueButton(row.id,row.title)+'<br><small>'+esc(row.detail)+'</small>',esc(row.type),badge(row.state),'<div class="links">'+tags(row.impact)+'</div>']))
    : table(['页面','功能、状态或交互','流程 / 类型','状态','去向 / 关联'],rows.map(row=>[esc(pageLabel(row.page)),itemButton(row.id,row.title)+'<br><small>'+esc(row.source)+'</small>',esc(row.flow)+'<br><small>'+esc(row.kind)+'</small>',badge(row.status),row.targets.length?'<div class="links">'+tags(row.targets)+'</div>':'<small>未登记</small>'])));
}
function imagesView(){
  const rows=model.images.filter(row=>!filter.page||row.page===filter.page);
  return heading('原图档案','登记一个画面、状态或弹窗对应的原图及证据。','<button class="primary" data-action="image">登记原图</button>')
    +'<div class="panel"><label>筛选页面<select aria-label="原图页面" id="image-filter">'+options(pageOptions,'全部页面')+'</select></label></div>'
    +'<section class="panel">'+blurb('已登记原图',rows.length+' 张')+'<div class="asset-grid">'+rows.map(row=>'<article class="asset-card">'+(row.url?.startsWith('/api/image/')?'<img loading="lazy" src="'+esc(row.url)+'" alt="'+esc(row.title)+'">':'<div class="asset-placeholder">'+(row.url?'已登记来源链接':'已登记文件名')+'</div>')+'<div class="asset-body">'+badge(row.status)+'<h3>'+itemButton(row.id,row.title)+'</h3><p class="small muted">'+esc(pageLabel(row.page))+' · '+esc(row.slot)+'</p>'+(visibleURL(row.url)?'<a target="_blank" rel="noopener noreferrer" href="'+esc(visibleURL(row.url))+'">查看原图来源</a>':'')+'</div></article>').join('')+'</div>'+(rows.length?'':'<p class="empty">此页面尚未登记原图。</p>')+'</section>'
    +'<section class="panel">'+blurb('待核对的画面','覆盖按页面和具体画面统计')+table(['页面','画面或状态','依据'],model.issues.filter(row=>row.type==='原图覆盖'&&(!filter.page||filter.page===row.page)).map(row=>[esc(pageLabel(row.page)),issueButton(row.id,row.title),esc(row.detail)]))+'</section>';
}
function historyView(){
  return heading('核对历史','核对会保存当前清单和问题快照，对比上一轮新增、变更和已解决事项。','<button class="primary" data-action="review">发起核对</button>')
    +(!state.reviews.length?'<div class="panel"><p>暂无已保存核对。首次核对会建立比较基线。</p></div>':'')
    +state.reviews.toReversed().map(row=>'<section class="panel">'+blurb(esc(row.title),date(row.date)+' · '+row.counts.records+' 条基线 · '+row.counts.images+' 张登记 · '+row.counts.issues+' 项待处理')+(row.note?'<p>'+esc(row.note)+'</p>':'')+(row.initial?'<p class="muted">首次核对，已保存比较基线。</p>':diffView(row.delta))+'<details><summary>当轮待处理问题</summary>'+table(['页面','问题','状态','影响范围'],row.open.map(issue=>[esc(pageLabel(issue.page)),esc(issue.title),badge(issue.state),esc(issue.impact.join('、'))]))+'</details></section>').join('')
    +'<section class="panel">'+blurb('变更登记','保留每次登记的规则、依据和确认状态')+table(['时间','页面','条目','状态','决策依据'],state.events.filter(row=>row.type==='decision').toReversed().map(row=>[date(row.date),esc(pageLabel(row.page)),esc(row.title)+'<br><small>'+esc(row.rule)+'</small>',badge(row.status),esc(row.source)]))+'</section>';
}
function sourcesView(){
  return heading('依据与旧版','以归档确认的规则为依据。历史编号用于定位旧设计。')+'<section class="panel">'+blurb('项目资料','')+Object.entries(sources).map(([key,[title,id]])=>'<div class="list-item"><b>'+key+' · '+esc(title)+'</b><a rel="noopener noreferrer" target="_blank" href="'+libraryURL(id)+'">查看来源</a></div>').join('')+'</section>'
  +'<section class="panel">'+blurb('旧版交互与外部模拟节点','旧版用来找差异与待核实映射；映射链接指向相应现行条目。')+table(['编号','旧节点','旧入口 / 去向','当前对照'],legacy.map(row=>[row.id,esc(row.title)+'<br><small>'+esc(row.rule)+'</small>',esc(row.entry+' / '+row.target),row.link?itemButton(row.link,lookup(row.link)?.title):badge('待核实')]))+'</section>';
}
function render(){
  $('nav').innerHTML=Object.entries(nav).map(([view,[label,path]])=>'<button data-tab="'+view+'"'+(view===tab?' aria-current="page"':'')+'><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="'+path+'"/></svg>'+label+'</button>').join('');
  $('crumb').textContent=nav[tab][0];
  const views={overview,images:imagesView,history:historyView,sources:sourcesView,
    trace:()=>heading('页面追溯','查阅页面、功能、交互、状态、弹窗与跳转。点击条目查看证据和影响。')+'<section class="panel">'+filterBar(statuses,kinds,'类型')+'</section>',
    issues:()=>heading('问题与影响','按结构化规则识别差异、重复、原图缺口及无效跳转。判断依据不足时保留待核实。')+'<section class="panel">'+filterBar(['待核实','待完善','已有基线裁定'],issueTypes(),'问题类型')+'</section>'};
  content.innerHTML=(loadError?'<p class="load-error" role="alert">持久化记录未读取：'+esc(loadError)+' <button data-action="reload">重试</button></p>':'')+views[tab]();
  for(const name of ['page','status','flow','kind']){
    if(!$(name))continue;
    $(name).value=filter[name];
    $(name).onchange=event=>{filter[name]=event.target.value;results();};
  }
  if($('q'))$('q').oninput=event=>{filter.q=event.target.value;results();};
  if($('image-filter')){
    $('image-filter').value=filter.page;
    $('image-filter').onchange=event=>{filter.page=event.target.value;render();$('image-filter').focus();};
  }
  results();
}
function popup(title,body){
  dialog.innerHTML='<div class="dialog-header"><h2 id="dialog-title">'+esc(title)+'</h2><button class="close" aria-label="关闭" data-action="close">×</button></div>'+body;
  if(!dialog.open)dialog.showModal();
}
function details(row){
  if(row.type==='image'){
    const url=visibleURL(row.url);
    popup(row.title,'<div class="stack"><p>'+esc(pageLabel(row.page))+' · '+esc(row.slot)+' '+badge(row.status)+'</p><p>'+esc(row.source)+'</p>'+(url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">查看原图来源</a>':'')+'</div>');
    return;
  }
  const original=baseline.find(x=>x.id===row.id);
  const upstream=unique(model.records.filter(x=>x.page!==row.page&&x.targets.includes(row.page)).map(x=>x.page));
  const proofs=Object.entries(sources).filter(([key])=>new RegExp('(^|[·, ])'+key+'(?=[ §·,]|$)').test(row.source||''));
  popup(row.title,'<div class="stack"><p>'+esc(pageLabel(row.page))+' · '+esc(row.flow)+' · '+esc(row.kind)+' '+badge(row.status)+'</p><p>'+esc(row.rule)+'</p><div><h3>决策依据</h3><p>'+esc(row.source)+'</p>'+proofs.map(([, [title,id]])=>'<p><a rel="noopener noreferrer" target="_blank" href="'+libraryURL(id)+'">'+esc(title)+'</a></p>').join('')+'</div>'
    +'<div><h3>跳转与下游关联</h3><div class="links">'+(tags(row.targets||[])||'<small>无登记</small>')+'</div></div><div><h3>上游引用页面</h3><div class="links">'+(tags(upstream)||'<small>无登记</small>')+'</div></div>'
    +(original?.rule!==row.rule&&original?'<div><h3>锁定归档原始规则</h3><p>'+esc(original.rule)+'</p></div>':'')
    +(model.records.includes(row)?'<button data-action="decision" data-target="'+esc(row.id)+'">登记此条目的变更</button>':'')+'</div>');
}
function problem(row){
  popup(row.title,'<div class="stack"><p>'+esc(row.type)+' '+badge(row.state)+'</p><p>'+esc(row.detail)+'</p><div><h3>影响页面</h3><div class="links">'+tags(row.impact)+'</div></div>'
    +'<div><h3>关联记录</h3>'+row.refs.map(id=>{const item=lookup(id);return item?.entry?'<p>'+esc(id+' '+item.title+' · '+item.entry+' / '+item.target)+'</p>':item?'<p>'+itemButton(id,item.title)+'</p>':'';}).join('')+'</div></div>');
}
const field=(name,label,value='',attrs='')=>'<label>'+label+'<input name="'+name+'" value="'+esc(value)+'" '+attrs+'></label>';
const textArea=(name,label,value='',attrs='')=>'<label class="wide">'+label+'<textarea name="'+name+'" '+attrs+'>'+esc(value)+'</textarea></label>';
const select=(name,label,choices,first)=>'<label>'+label+'<select name="'+name+'" required>'+options(choices,first)+'</select></label>';
function formEnd(label){return '<p class="form-error wide" role="alert"></p><div class="inline wide"><button class="primary" type="submit">'+label+'</button><button type="button" data-action="close">取消</button></div></form>';}
const check=(name,label)=>'<label class="check wide"><input type="checkbox" name="'+name+'" value="yes">'+label+'</label>';
function showForm(type,id){
  if(type==='decision'){
    const original=lookup(id);
    const available=model.records.filter(row=>row.page===(original?.page||filter.page||'P01'));
    popup('登记设计变更','<form id="editor" class="form-grid"><p class="wide muted">未确认内容记为待核实或待完善。变更只影响登记台的生效记录，归档原文会保留。</p>'
      +select('page','所属页面',pageOptions)+select('target','关联现行条目',available.map(row=>[row.id,row.title]),'新条目')
      +select('flow','所属流程',flows)+select('kind','条目类型',kinds)+select('status','决策状态',statuses)
      +field('title','条目名称',original?.title,'required maxlength="160"')
      +textArea('rule','规则与触发条件',original?.rule,'required maxlength="4000"')
      +textArea('source','用户原话、文件链接或证据位置','','required maxlength="2000"')
      +'<label class="wide">跳转去向或影响页面<select name="targets" multiple size="5">'+options(pageOptions)+'</select><small>按 Ctrl 或 Command 多选</small></label>'
      +check('confirmed','用户已明确确认此项决策')+check('supersede','明确替换所关联的现行规则')+formEnd('保存登记'));
    const f=$('editor'), e=f.elements;
    e.page.value=original?.page||filter.page||'P01';
    e.target.required=false;
    e.target.value=original?.id||'';
    e.flow.value=original?.flow||filter.flow||flows[0];
    e.kind.value=original?.kind||kinds[0];
    e.status.value='待核实';
    for(const option of e.targets.options)option.selected=original?.targets.includes(option.value)||false;
    e.page.onchange=()=>{e.target.innerHTML=options(model.records.filter(row=>row.page===e.page.value).map(row=>[row.id,row.title]),'新条目');};
    e.target.onchange=()=>{
      const row=lookup(e.target.value);
      if(!row)return;
      e.flow.value=row.flow;e.kind.value=row.kind;e.title.value=row.title;e.rule.value=row.rule;
      for(const option of e.targets.options)option.selected=row.targets.includes(option.value);
    };
  }else if(type==='image'){
    popup('登记页面原图','<form id="editor" class="form-grid">'+select('page','所属页面',pageOptions)+field('slot','对应画面或状态','','list="slots" required maxlength="100"')+'<datalist id="slots"></datalist>'
      +field('title','文件名或原图名称','','required maxlength="160"')+select('status','原图状态',['待核实','已确认','历史原图'])
      +'<label class="wide">上传图片<input type="file" name="file" accept="image/png,image/jpeg,image/webp,image/gif"><small>PNG、JPG、WebP、GIF · 单张不超过 10 MB</small></label>'
      +field('url','或登记 HTTPS 来源链接','','type="url"')+textArea('source','原图版本、证据或确认依据','','required maxlength="2000"')
      +check('confirmed','用户已明确确认此画面的最终原图')+formEnd('保存原图'));
    const e=$('editor').elements;
    e.page.value=filter.page||'P01';
    const setSlots=()=>{const slots=imageSlots.filter(([page])=>page===e.page.value).map(([,slot])=>slot);$('slots').innerHTML=options(slots);e.slot.value=slots.length===1?slots[0]:'';};
    e.page.onchange=setSlots;setSlots();
    e.file.onchange=()=>{if(!e.title.value&&e.file.files[0])e.title.value=e.file.files[0].name;};
  }else{
    popup('发起一次核对','<form id="editor" class="form-grid"><p class="wide muted">'+(recent()?'和 '+date(recent().date)+' 的核对结果比较。':'首次核对将保存当前基线作为比较起点。')+'</p>'
      +'<p class="wide">'+model.records.length+' 条基线 · '+model.images.length+' 张登记原图 · '+currentIssues().length+' 项待处理</p>'
      +field('title','核对标题','','placeholder="例如 P07-B 草稿流程验收" maxlength="120"')+textArea('note','本轮证据或备注','','maxlength="2000"')+formEnd('保存核对结果'));
  }
  $('editor').onsubmit=async event=>{
    event.preventDefault();
    const form=event.currentTarget, fd=new FormData(form);
    const submit=form.querySelector('[type=submit]');
    const errorText=form.querySelector('.form-error');
    errorText.textContent='';submit.disabled=true;
    const body=type==='image'?fd:{...Object.fromEntries(fd),confirmed:fd.get('confirmed')==='yes',supersede:fd.get('supersede')==='yes',targets:fd.getAll('targets')};
    try{
      await api(type,body);dialog.close();
      if(type==='review')show('history');
      await refresh();
      msg(type==='review'?'已保存本轮核对':type==='image'?'已登记原图':'已登记变更');
    }catch(error){errorText.textContent=error.message;}
    finally{submit.disabled=false;}
  };
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  const d=button.dataset;
  if(d.tab){show(d.tab,'',d.status);return;}
  if(d.page){if(dialog.open)dialog.close();show('trace',d.page);return;}
  if(d.item){const row=lookup(d.item);if(row)details(row);return;}
  if(d.issue){const row=model.issues.find(row=>row.id===d.issue);if(row)problem(row);return;}
  if(d.action==='close'){dialog.close();return;}
  if(d.action==='reload'){refresh();return;}
  if(d.action)showForm(d.action,d.target);
});
render();
refresh();
