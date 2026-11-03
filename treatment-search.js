'use strict';
window.TreatmentSearch={match(item,department,query){const q=String(query||'').normalize('NFKC').trim().toLowerCase();const text=[item.code,item.name,item.zh,...(item.aliases||[])].join(' ').normalize('NFKC').toLowerCase();return q?text.includes(q):department==='全部'||item.department===department||item.department==='General'||(item.specialties||[]).includes(department)}};
