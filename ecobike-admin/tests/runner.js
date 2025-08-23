import {wrapConsole,guardedFetch,captureWindowErrors} from './helpers.js';
// Only run available spec modules
const specs=['login_guard'];
async function run(){const metrics={};wrapConsole(metrics);guardedFetch(metrics);captureWindowErrors(metrics);const rows=[];for(const n of specs){const start=performance.now();let status=true,notes=[];try{const m=await import(`./${n}.spec.js`);if(m.default)await m.default(notes);}catch(e){status=false;notes.push(e.message);}rows.push({name:n,status,duration:Math.round(performance.now()-start),notes});}const summary={scope:'admin',errors:metrics.errors,warnings:metrics.warnings,http:metrics.http,specs:rows};window.parent&&window.parent.postMessage(summary,'*');render(rows);}
function render(rows){const tbody=document.querySelector('#report tbody');rows.forEach(r=>{const tr=document.createElement('tr');tr.className=r.status?'pass':'fail';tr.innerHTML=`<td>${r.name}</td><td>${r.status?'PASS':'FAIL'}</td><td>${r.duration}</td><td>${(r.notes||[]).join('; ')}</td>`;tbody.appendChild(tr);});}
document.getElementById('run').addEventListener('click',run);if(new URLSearchParams(location.search).get('auto'))run();
