export function wrapConsole(m){const e=console.error,w=console.warn;m.errors=0;m.warnings=0;console.error=(...a)=>{m.errors++;e.apply(console,a);};console.warn=(...a)=>{m.warnings++;w.apply(console,a);};}
export function guardedFetch(m){const f=window.fetch;m.http={404:0,500:0};window.fetch=async(...a)=>{const r=await f(...a).catch(err=>{throw err});if(r.status===404)m.http[404]++;if(r.status>=500)m.http[500]++;return r;};}
export function captureWindowErrors(m){window.addEventListener('error',()=>m.errors++);window.addEventListener('unhandledrejection',()=>m.errors++);}
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export const withTimeout=(p,ms)=>Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
export function navigate(hash){location.hash=hash;}
export function waitForSel(sel,ms=2000){return new Promise((res,rej)=>{const t=setTimeout(()=>rej('timeout'),ms);const i=setInterval(()=>{const el=document.querySelector(sel);if(el){clearTimeout(t);clearInterval(i);res(el);}},50);});}
export function clickTestId(id){const el=document.querySelector(`[data-testid="${id}"]`);if(el)el.click();else throw new Error('no element '+id);}
export function setLang(lang){const e=new CustomEvent('set-lang',{detail:lang});window.dispatchEvent(e);}
