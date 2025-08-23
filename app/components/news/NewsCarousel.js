import { t } from '../../utils/i18n.js';

export default function NewsCarousel(list) {
  const wrap = document.createElement('div');
  wrap.className = 'news-carousel';

  const title = document.createElement('h3');
  title.textContent = t('dashboard.news.title');
  wrap.appendChild(title);

  if (!list || list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'news-carousel__empty';
    empty.textContent = t('dashboard.news.empty');
    wrap.appendChild(empty);
    return wrap;
  }

  const track = document.createElement('div');
  track.className = 'news-carousel__track';
  list.forEach(n => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `<h4>${n.title}</h4><p>${n.text}</p><span class="news-card__meta">${t('dashboard.news.cityTag',{city:n.city})} · ${n.date}</span>`;
    track.appendChild(card);
  });
  wrap.appendChild(track);

  const dots = document.createElement('div');
  dots.className = 'news-carousel__dots';
  list.forEach((_,i)=>{
    const d=document.createElement('span');
    d.className='dot'+(i===0?' active':'');
    dots.appendChild(d);
  });
  wrap.appendChild(dots);

  function updateDots(){
    const idx=Math.round(track.scrollLeft/track.clientWidth);
    dots.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
  }
  track.addEventListener('scroll',updateDots);

  return wrap;
}
