(()=>{
'use strict';
const DBNAME='hospital11g-local-v1';
const accounts=[
 ['r01','住院醫師 林醫師','doctor','resident'],['a01','主治醫師 王醫師','doctor','attending'],
 ['np01','專科護理師 李護理師','np','np'],['n01','護理師 許Ｏ媃','nis','nurse'],['h01','住院行政 黃專員','his','his'],['s01','病房書記 吳書記','clerk','clerk'],['l01','醫檢師 張醫檢師','lis','lab'],['p01','藥師 趙藥師','pharmacy','pharmacist'],['x01','檢查人員 周技師','ris','technician'],['b01','血庫人員 蔡醫檢師','blood','blood'],['t01','營養師 林營養師','team','nutrition'],['t02','物理治療師 鄭治療師','team','rehab'],['t03','社工師 黃社工師','team','social'],['admin','系統管理員','admin','admin']
].map(([id,name,module,role])=>({id,name,module,role,pass:id,active:true}));
const MODULES={his:['HIS','住院資訊','病人主檔・入出轉床'],doctor:['CPOE','醫師系統','病歷・醫囑・簽署覆核'],np:['NP','專科護理師','個案追蹤・協作照護'],nis:['NIS','護理資訊','評估・執行・交班'],clerk:['WARD','病房書記','床位・動態・行政'],lis:['LIS','醫學檢驗','檢體・結果・報告'],pharmacy:['PHARM','藥局系統','審方・調劑・發藥'],ris:['RIS','檢查與放射','排程・檢查・報告'],blood:['BLOOD','血庫系統','配血・血品・發血'],team:['CARE','跨團隊照護','營養・復健・社工'],admin:['ADMIN','系統管理','人員・備份・操作軌跡']};
const uid=()=>crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
const stamp=()=>new Date().toISOString();
function initialState(){
 const raw=window.makeOriginalPatients();
 const patients=Object.entries(raw).map(([bed,p])=>({...p,id:'P'+bed,bed,mrn:p.isEmpty?'':(p.info.match(/病例號：([^ ]+)/)||[])[1],diagnosis:p.editInfo?.disease||'',allergy:p.editInfo?.allergy||'',doctor:'王醫師',resident:'林醫師',nurse:'許Ｏ媃',admittedAt:stamp(),dischargedAt:null,notes:[],observations:[],carePlans:[],fees:[]}));
 const state={schema:1,revision:0,createdAt:stamp(),patients,accounts:structuredClone(accounts),orders:[],documents:[],tasks:[],audit:[],archive:[],catalog:[{id:'cat1',type:'檢驗',name:'CBC',detail:'EDTA 全血'},{id:'cat2',type:'檢驗',name:'生化檢驗',detail:'依院內檢體規範'},{id:'cat3',type:'檢查',name:'胸部 X 光',detail:''},{id:'cat4',type:'處置',name:'生命徵象監測',detail:'依醫囑指定頻率'},{id:'cat5',type:'會診',name:'營養',detail:''},{id:'cat6',type:'會診',name:'復健',detail:''},{id:'cat7',type:'會診',name:'社工',detail:''}]};
 for(const bed of ['01-1','01-3'])state.orders.push({id:uid(),patientId:'P'+bed,type:'輸血',name:'原始待輸血醫囑',detail:'待醫師補齊血品及數量後，由血庫處理；未完成前不得發血。',status:'待補資料',createdAt:stamp(),author:'原始初始化',history:[],signed:true});
 return state;
}
let dbPromise;
function database(){return dbPromise||=(new Promise((resolve,reject)=>{const req=indexedDB.open(DBNAME,1);req.onupgradeneeded=()=>req.result.createObjectStore('state');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)}))}
async function readState(){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('state');const req=tx.objectStore('state').get('main');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
let channel;try{channel=new BroadcastChannel(DBNAME)}catch{}
async function changeState(fn){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite');const store=tx.objectStore('state');let result,error;const req=store.get('main');req.onsuccess=()=>{try{const s=req.result||initialState();result=fn(s);s.revision++;store.put(s,'main')}catch(e){error=e;tx.abort()}};tx.oncomplete=()=>{channel?.postMessage('changed');resolve(result)};tx.onabort=()=>reject(error||tx.error||new Error('儲存中斷'));tx.onerror=()=>reject(tx.error)})}
async function ensureState(){if(!await readState())await changeState(()=>{})}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>t?new Date(t).toLocaleString('zh-TW',{hour12:false}):'—';
function log(s,u,action,target){s.audit.unshift({id:uid(),time:stamp(),user:u?.id||'system',name:u?.name||'系統',action,target});}
function patient(s,id){const p=s.patients.find(p=>p.id===id);if(!p||p.isEmpty||p.dischargedAt)throw Error('病人已出院或床位為空，請重新選擇');return p}
function activeUser(s,user,module){const u=s.accounts.find(a=>a.id===user?.id&&a.active&&a.module===module);if(!u)throw Error('帳號無效或已停用');return u}
function requireRole(u,roles){if(!roles.includes(u.role))throw Error('目前帳號沒有此操作權限')}
const startStatus=type=>({'藥物':'待審方','檢驗':'待採檢','檢查':'待排程','處置':'待執行','會診':'待接案','輸血':'待配血'})[type];
const terminal=s=>['已停止','已完成','已給藥','已執行','已回覆','已審核','已退血','已退藥','已領用'].includes(s);
window.H11={MODULES,accounts,uid,stamp,esc,fmt,initialState,readState,changeState,ensureState,log,patient,activeUser,requireRole,startStatus,terminal,channel};

})();
