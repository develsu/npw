import CardBase from './CardBase.js';
import { t } from '../../utils/i18n.js';

function drawSpark(canvas, data) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0,0,w,h);
  const max = Math.max(...data, 1);
  const step = w/(data.length-1);
  ctx.beginPath();
  ctx.moveTo(0, h - (data[0]/max)*h);
  for(let i=1;i<data.length;i++){
    ctx.lineTo(i*step, h - (data[i]/max)*h);
  }
  ctx.strokeStyle = 'var(--primary)';
  ctx.stroke();
  ctx.lineTo(w,h);
  ctx.lineTo(0,h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(46,125,50,.2)';
  ctx.fill();
}

export default function SubscriptionCard(sub) {
  const el = CardBase('subscription-card');

  const title = document.createElement('h3');
  title.textContent = t('dashboard.subscription.plan', { plan: sub.plan });
  el.appendChild(title);

  const limit = document.createElement('p');
  limit.className = 'subscription-card__limit';
  limit.textContent = t('dashboard.subscription.usedOf', { used: sub.usedToday, limit: sub.limitPerDay });
  el.appendChild(limit);

  const barWrap = document.createElement('div');
  barWrap.className = 'subscription-card__bar';
  const bar = document.createElement('div');
  bar.style.width = `${(sub.usedToday / sub.limitPerDay) * 100}%`;
  barWrap.appendChild(bar);
  el.appendChild(barWrap);

  const days = document.createElement('p');
  days.className = 'subscription-card__days';
  days.textContent = t('dashboard.subscription.daysLeft', { days: sub.daysLeft });
  el.appendChild(days);

  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 40;
  drawSpark(canvas, sub.usage7d);
  el.appendChild(canvas);

  return el;
}
