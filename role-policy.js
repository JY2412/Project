'use strict';
window.DoctorPolicy=(()=>{
 const editable=new Set(['使用中','待確認','待藥師安全確認','待審方','待發藥','待給藥','已接案','結果待確認','待採檢','待排程','待執行','待配血','待補資料','退回','待覆核','待回覆']);
 const valid=u=>!!u?.active&&u.module==='doctor'&&['resident','attending','chief'].includes(u.role);
 function migrate(s){for(const old of s.accounts.filter(a=>a.role==='chief'&&a.id!=='c01'))old.active=false;let a=s.accounts.find(a=>a.id==='c01');if(!a){a={id:'c01',name:'總醫師',module:'doctor',role:'chief',pass:'c01',active:true};s.accounts.push(a)}if(s.doctorRoleVersion!==2){a.name='總醫師';a.module='doctor';a.role='chief';a.active=true;}s.doctorRoleVersion=2;}
 function assertEntity(s,u,entity,pid){if(!valid(u))throw Error('醫師帳號無效或已停用');if(!entity||entity.patientId!==pid)throw Error('目標紀錄不屬於目前病人，請重新開啟');H11.patient(s,entity.patientId);CarePolicy.assertWrite(s,u,entity.patientId);return entity}
 function assertRevision(s,u,o,pid){assertEntity(s,u,o,pid);if(!editable.has(o.status))throw Error('此醫囑已結束或狀態不可修訂，請依需要另開醫囑');if(u.role!=='attending'&&o.authorId!==u.id)throw Error('住院醫師只能修訂自己的醫囑');return o}
 return{valid,migrate,assertEntity,assertRevision,editable};
})();
