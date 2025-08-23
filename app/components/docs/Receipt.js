import { t, onLangChange } from '../../utils/i18n.js';
import Storage from '../../utils/storage.js';

if (!document.querySelector('link[href="components/docs/Receipt.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'components/docs/Receipt.css';
  document.head.appendChild(link);
}

const storage = new Storage('eco');

const overlay = document.createElement('div');
overlay.className = 'receipt-viewer';
overlay.tabIndex = -1;

const box = document.createElement('div');
box.className = 'receipt-viewer__box';
const content = document.createElement('div');
content.className = 'receipt-viewer__content';
const btns = document.createElement('div');
btns.className = 'receipt-viewer__controls';
const printBtn = document.createElement('button');
printBtn.type = 'button';
const saveBtn = document.createElement('button');
saveBtn.type = 'button';
const closeBtn = document.createElement('button');
closeBtn.type = 'button';
btns.append(printBtn, saveBtn, closeBtn);
box.append(content, btns);
overlay.appendChild(box);
document.body.appendChild(overlay);
overlay.style.display = 'none';

function updateTexts(){
  printBtn.textContent = t('documents.receipt.print');
  saveBtn.textContent = t('documents.receipt.saveHtml');
  closeBtn.textContent = t('documents.buttons.close');
}
onLangChange(updateTexts); updateTexts();

printBtn.addEventListener('click', ()=>window.print());
saveBtn.addEventListener('click', ()=>{
  const blob=new Blob([content.innerHTML],{type:'text/html'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='receipt.html';
  a.click();
  URL.revokeObjectURL(a.href);
});
closeBtn.addEventListener('click', close);
overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
overlay.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); trapFocus(e); });

function trapFocus(e){
  if(e.key!=='Tab') return;
  const f=[printBtn, saveBtn, closeBtn];
  const first=f[0]; const last=f[f.length-1];
  if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
}

function buildFromLastOperation(){
  const op = storage.get('lastOperation');
  if(!op){ content.innerHTML = `<p>${t('documents.receipt.empty')}</p>`; return; }
  const date = new Date(op.tsISO).toLocaleString();
  content.innerHTML = `
    <h2>${t('documents.receipt.operation')} ${op.id}</h2>
    <p>${t('documents.receipt.station')}: ${op.stationName}</p>
    <p>${t('documents.receipt.slot')}: ${op.slot}</p>
    <p>${t('documents.receipt.city')}: ${op.cityId}</p>
    <p>${t('documents.receipt.plan')}: ${op.plan}</p>
    <p>${t('documents.receipt.dateTime')}: ${date}</p>
    <div class="receipt-viewer__photos">
      <div>
        <p>${t('documents.receipt.photosBeforeAfter')} — ${t('documents.receipt.operation')} ${op.id}</p>
        <img src="${op.photos?.before || ''}" alt="before"/>
        <img src="${op.photos?.after || ''}" alt="after"/>
      </div>
    </div>
    <div class="receipt-viewer__stamp">EcoBike</div>
  `;
}

function open(){
  overlay.style.display='flex';
  buildFromLastOperation();
  overlay.focus();
}

function close(){ overlay.style.display='none'; }

export default { open };
