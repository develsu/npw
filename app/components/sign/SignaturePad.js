import { t, onLangChange } from '../../utils/i18n.js';

if (!document.querySelector('link[href="components/sign/SignaturePad.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'components/sign/SignaturePad.css';
  document.head.appendChild(link);
}

const overlay = document.createElement('div');
overlay.className = 'signature-pad';
overlay.tabIndex = -1;

const box = document.createElement('div');
box.className = 'signature-pad__box';
const canvas = document.createElement('canvas');
canvas.width = 400; canvas.height = 200;
const ctx = canvas.getContext('2d');
ctx.lineWidth = 2; ctx.lineCap = 'round';

const btns = document.createElement('div');
btns.className = 'signature-pad__controls';
const clearBtn = document.createElement('button');
clearBtn.type = 'button';
const doneBtn = document.createElement('button');
doneBtn.type = 'button';

btns.append(clearBtn, doneBtn);
box.append(canvas, btns);
overlay.appendChild(box);
document.body.appendChild(overlay);
overlay.style.display = 'none';

let drawing = false;
let onDone;

function updateTexts() {
  clearBtn.textContent = t('documents.buttons.clear');
  doneBtn.textContent = t('documents.buttons.done');
}
onLangChange(updateTexts); updateTexts();

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}

function start(e){ drawing = true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); }
function move(e){ if(!drawing) return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); }
function end(){ drawing=false; }

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mouseup', end);
canvas.addEventListener('mouseleave', end);
canvas.addEventListener('touchstart', e=>{e.preventDefault(); start(e);});
canvas.addEventListener('touchmove', e=>{e.preventDefault(); move(e);});
canvas.addEventListener('touchend', e=>{e.preventDefault(); end(e);});

clearBtn.addEventListener('click', ()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); });
doneBtn.addEventListener('click', ()=>{ if(onDone) onDone(canvas.toDataURL('image/png')); close(); });

function trapFocus(e){
  if(e.key==='Tab'){
    const f=[clearBtn, doneBtn];
    if(e.shiftKey && document.activeElement===clearBtn){ e.preventDefault(); doneBtn.focus(); }
    else if(!e.shiftKey && document.activeElement===doneBtn){ e.preventDefault(); clearBtn.focus(); }
  } else if(e.key==='Escape'){ close(); }
}

overlay.addEventListener('keydown', trapFocus);
overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });

function open(callback){
  onDone = callback;
  overlay.style.display='flex';
  ctx.clearRect(0,0,canvas.width,canvas.height);
  overlay.focus();
}

function close(){
  overlay.style.display='none';
}

export function getImageDataURL(){ return canvas.toDataURL('image/png'); }

export default { open, close, getImageDataURL };
