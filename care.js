'use strict';
window.CarePolicy=(()=>{
 const originalDoctors=['陳大鈞','林哲宇','張志豪','黃建勳','許智勝','鄭博文','王立峰'];
 function canWrite(s,u,pid,at=Date.now()){const p=s.patients.find(p=>p.id===pid&&!p.isEmpty&&!p.dischargedAt);if(!p||!u?.active||u.role==='chief')return false;if(u.role==='attending'&&p.doctor===u.clinicianName)return true;return(s.careGrants||[]).some(g=>g.patientId===pid&&g.accountId===u.id&&!g.revokedAt&&(!g.expiresAt||Date.parse(g.expiresAt)>at))}
 function migrate(s){if(s.careAssignmentVersion===1)return;for(const[i,name]of originalDoctors.entries()){const id='a'+String(i+1).padStart(2,'0'),a=s.accounts.find(a=>a.id===id);if(a){a.clinicianName=name;a.name=name}else s.accounts.push({id,name,clinicianName:name,module:'doctor',role:'attending',pass:id,active:true})}for(const id of ['r01','c01']){const a=s.accounts.find(a=>a.id===id);if(a){a.name=id==='r01'?'住院醫師（姓名未設定）':'總醫師（姓名未設定）';a.clinicianName=null}}const raw=window.makeOriginalPatients();for(const p of s.patients){if(p.isEmpty)continue;if(p.originalSeed||p.id==='P'+p.bed){const value=raw[p.bed]?.doctor||raw[p.bed]?.editInfo?.doctor||'陳大鈞';if(!p.doctor||p.doctor==='王醫師')p.doctor=value;if(p.resident==='林醫師')p.resident='未指派'}}s.careGrants||=[];s.careAssignmentVersion=1}
 function assertWrite(s,u,pid){if(!canWrite(s,u,pid))throw Error('非本照護團隊，且無有效代理授權，目前僅可查閱。')}
 return{originalDoctors,canWrite,assertWrite,migrate};
})();
