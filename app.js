const cfgKey="r2keval_cfg_v1";
const rulesKey="r2keval_rules_v1";
function getCfg(){const raw=localStorage.getItem(cfgKey);if(!raw)return{keywords:[]};try{const j=JSON.parse(raw);return{keywords:Array.isArray(j.keywords)?j.keywords:[]};}catch(e){return{keywords:[]};}}
function setCfg(c){localStorage.setItem(cfgKey,JSON.stringify(c));}
function getRules(){const raw=localStorage.getItem(rulesKey);if(!raw)return[];try{const arr=JSON.parse(raw);return Array.isArray(arr)?arr:[];}catch(e){return[];}}
function setRules(arr){localStorage.setItem(rulesKey,JSON.stringify(arr));}
function uiLoadCfg(){const c=getCfg();document.getElementById("keywords").value=c.keywords.join(", ");}
function uiSaveWords(){const kw=document.getElementById("keywords").value.split(",").map(s=>s.trim()).filter(Boolean);const c=getCfg();c.keywords=kw;setCfg(c);}
async function loadMaster(){try{const res=await fetch("master_config.json");if(!res.ok)throw new Error("not ok");const obj=await res.json();applyMaster(obj);document.getElementById("masterStatus").textContent="Master config loaded";}catch(e){document.getElementById("masterStatus").textContent="Master config not found; import instead";}}
function importMasterFile(file){const r=new FileReader();r.onload=()=>{try{const obj=JSON.parse(r.result);applyMaster(obj);document.getElementById("masterStatus").textContent="Master config imported";}catch(e){document.getElementById("masterStatus").textContent="Invalid master config";}};r.readAsText(file);}
function applyMaster(obj){const rules=Array.isArray(obj.rules)?obj.rules:[];const merged=getRules();for(const rr of rules){if(!rr||!rr.name)continue;const idx=merged.findIndex(x=>x.name.toLowerCase()===String(rr.name).toLowerCase());const pats=(rr.patterns||[]).map(s=>String(s)).filter(Boolean);if(idx>=0){merged[idx].patterns=unique([...(merged[idx].patterns||[]),...pats]);}else{merged.push({name:String(rr.name),patterns:pats});}}setRules(merged);}
function matchAll(re,text){const out=[];let m;while((m=re.exec(text))){out.push({value:m[0],start:m.index,end:m.index+m[0].length});if(!re.global)break;}return out;}
function detCustom(text,cfg){const out=[];for(const k of cfg.keywords||[]){if(!k)continue;const re=new RegExp("\\b"+escapeRegExp(k)+"\\b","gi");for(const m of matchAll(re,text)){out.push({...m,type:"Word"});}}
const rules=getRules();for(const r of rules){for(const p of (r.patterns||[])){let re=null;try{re=new RegExp(p,"gi");}catch(e){continue;}for(const m of matchAll(re,text)){out.push({...m,type:`Pattern: ${r.name}`});}}}
return out;}
function escapeRegExp(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
function unique(arr){const s=new Set();const out=[];for(const x of arr){const k=String(x);if(!s.has(k)){s.add(k);out.push(x);}}return out;}
function scan(text){const a=[];a.push(...detCustom(text,getCfg()));return dedupe(a);}
function dedupe(items){const seen=new Set();const out=[];for(const it of items){const k=it.type+"|"+it.start+"|"+it.end+"|"+it.value.toLowerCase();if(!seen.has(k)){seen.add(k);out.push(it);}}return out.sort((x,y)=>x.start-y.start);}
function renderFindings(fs){const tbody=document.querySelector("#findingsTable tbody");tbody.innerHTML="";if(fs.length===0){const tr=document.createElement("tr");const td=document.createElement("td");td.colSpan=3;td.textContent="No matches";tr.appendChild(td);tbody.appendChild(tr);return;}for(const f of fs){const tr=document.createElement("tr");const td1=document.createElement("td");td1.textContent=f.type;const td2=document.createElement("td");td2.textContent=f.value;const td3=document.createElement("td");td3.textContent=`${f.start}-${f.end}`;tr.append(td1,td2,td3);tbody.appendChild(tr);}}
function renderHighlight(text,fs){if(fs.length===0){document.getElementById("highlightPreview").textContent=text;return;}let out="";let i=0;for(const f of fs){if(f.start>i)out+=escapeHtml(text.slice(i,f.start));out+=`<span class="hl">${escapeHtml(text.slice(f.start,f.end))}</span>`;i=f.end;}out+=escapeHtml(text.slice(i));document.getElementById("highlightPreview").innerHTML=out;}
function escapeHtml(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));}
document.getElementById("scanBtn").addEventListener("click",()=>{const t=document.getElementById("prompt").value||"";const fs=scan(t);renderFindings(fs);renderHighlight(t,fs);});
document.getElementById("copyPromptBtn").addEventListener("click",()=>{navigator.clipboard.writeText(document.getElementById("prompt").value||"").catch(()=>{});});
document.getElementById("keywords").addEventListener("change",uiSaveWords);
document.getElementById("clearPreviewBtn").addEventListener("click",()=>{document.getElementById("highlightPreview").innerHTML="";});
document.getElementById("loadMasterBtn").addEventListener("click",loadMaster);
document.getElementById("importMasterBtn").addEventListener("click",()=>{document.getElementById("importMasterFile").click();});
document.getElementById("importMasterFile").addEventListener("change",(e)=>{const f=e.target.files&&e.target.files[0];if(f)importMasterFile(f);});
uiLoadCfg();
