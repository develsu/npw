import { t, onLangChange, getLang } from '../utils/i18n.js';
import { getCatalog, markSigned, isSigned } from '../utils/docs.js';
import HtmlViewer from '../components/docs/HtmlViewer.js';
import SignaturePad from '../components/sign/SignaturePad.js';
import Receipt from '../components/docs/Receipt.js';

if (!document.querySelector('link[href="routes/documents.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'routes/documents.css';
  document.head.appendChild(link);
}

export default function Documents(){
  const lang = getLang();
  const catalog = getCatalog(lang);
  const el=document.createElement('div');
  el.className='documents';
  const h=document.createElement('h2');h.textContent=t('documents.title');
  el.appendChild(h);

  const tabsWrap=document.createElement('div');
  tabsWrap.className='doc-tabs';
  tabsWrap.setAttribute('role','tablist');
  const tabNames=['active','warranty','technical','financial'];
  let active='active';
  const tabBtns={};
  tabNames.forEach(name=>{
    const btn=document.createElement('button');
    btn.className='doc-tab';
    btn.setAttribute('role','tab');
    btn.textContent=t(`documents.tabs.${name}`);
    btn.addEventListener('click',()=>{switchTab(name);});
    tabsWrap.appendChild(btn); tabBtns[name]=btn;
  });
  el.appendChild(tabsWrap);

  const listWrap=document.createElement('div');
  listWrap.className='doc-list';
  el.appendChild(listWrap);

  function renderList(){
    listWrap.innerHTML='';
    const arr=catalog[active]||[];
    if(active==='financial'){
      const lastCard=document.createElement('div');
      lastCard.className='doc-card';
      const title=document.createElement('h3');title.textContent=t('documents.receipt.lastReceipt');
      const openBtn=document.createElement('button');openBtn.textContent=t('documents.buttons.open');openBtn.addEventListener('click',()=>Receipt.open());
      const printBtn=document.createElement('button');printBtn.textContent=t('documents.buttons.print');printBtn.addEventListener('click',()=>{Receipt.open(); setTimeout(()=>window.print(),500);});
      lastCard.append(title, openBtn, printBtn);
      listWrap.appendChild(lastCard);
    }
    arr.forEach(doc=>{
      const card=document.createElement('div');card.className='doc-card';
      const title=document.createElement('h3');title.textContent=doc.title;card.appendChild(title);
      const desc=document.createElement('p');desc.textContent=doc.shortDesc;card.appendChild(desc);
      const meta=document.createElement('div');meta.className='doc-meta';meta.textContent=doc.updatedAt;card.appendChild(meta);
      const status=document.createElement('div');status.className='doc-status';
      const sig=isSigned(doc.id);
      if(doc.requiresSign && !sig.signed) status.textContent=t('documents.status.needsSignature');
      else if(sig.signed) status.textContent=t('documents.status.signedOn',{date:new Date(sig.tsISO).toLocaleDateString()});
      card.appendChild(status);
      const controls=document.createElement('div');controls.className='doc-controls';
      const openBtn=document.createElement('button');openBtn.textContent=t('documents.buttons.open');openBtn.addEventListener('click',()=>{
        HtmlViewer.open({ title: doc.title, src: `docs/html/${lang}/${doc.file}`, signature: isSigned(doc.id) });
      });
      controls.appendChild(openBtn);
      if(doc.requiresSign && !sig.signed){
        const signBtn=document.createElement('button');signBtn.textContent=t('documents.buttons.sign');signBtn.addEventListener('click',()=>{
          SignaturePad.open(dataURL=>{ const tsISO=new Date().toISOString(); markSigned(doc.id,dataURL,tsISO,lang); renderList(); });
        });
        controls.appendChild(signBtn);
      }
      const printBtn=document.createElement('button');printBtn.textContent=t('documents.buttons.print');printBtn.addEventListener('click',()=>{
        HtmlViewer.open({ title: doc.title, src: `docs/html/${lang}/${doc.file}`, signature: isSigned(doc.id), onClosed: null });
        setTimeout(()=>window.print(),500);
      });
      controls.appendChild(printBtn);
      card.appendChild(controls);
      listWrap.appendChild(card);
    });
    Object.keys(tabBtns).forEach(k=>{
      tabBtns[k].setAttribute('aria-selected', k===active);
    });
  }

  function switchTab(name){ active=name; renderList(); }

  tabsWrap.addEventListener('keydown', e=>{
    const idx=tabNames.indexOf(active);
    if(e.key==='ArrowRight'){ const n=tabNames[(idx+1)%tabNames.length]; switchTab(n); tabBtns[n].focus(); }
    if(e.key==='ArrowLeft'){ const n=tabNames[(idx-1+tabNames.length)%tabNames.length]; switchTab(n); tabBtns[n].focus(); }
  });

  onLangChange(()=>{
    tabNames.forEach(name=>{ tabBtns[name].textContent=t(`documents.tabs.${name}`); });
    h.textContent=t('documents.title');
    renderList();
  });

  renderList();
  return el;
}
