import { t, onLangChange } from '../../utils/i18n.js';

export default function Uploader({ capture = 'environment' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'uploader';

  const label = document.createElement('label');
  const span = document.createElement('span');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = capture;
  label.append(span, input);

  const preview = document.createElement('img');
  preview.className = 'uploader__preview';
  preview.hidden = true;

  const msg = document.createElement('div');
  msg.className = 'uploader__msg';

  wrap.append(label, preview, msg);

  let data = null;
  let labelKey = '';

  function setLabel(textKey) {
    labelKey = textKey;
    span.textContent = t(textKey);
  }

  function updateLang() {
    if (labelKey) span.textContent = t(labelKey);
    if (msg.dataset.key) msg.textContent = t(msg.dataset.key);
  }
  onLangChange(updateLang);

  function checkSharpness(ctx, w, h) {
    const img = ctx.getImageData(0, 0, w, h).data;
    let sum = 0, sumSq = 0;
    for (let i = 0; i < img.length; i += 4) {
      const y = 0.299 * img[i] + 0.587 * img[i + 1] + 0.114 * img[i + 2];
      sum += y;
      sumSq += y * y;
    }
    const pixels = w * h;
    const mean = sum / pixels;
    const variance = sumSq / pixels - mean * mean;
    return Math.sqrt(variance);
  }

  function reset() {
    data = null;
    preview.src = '';
    preview.hidden = true;
    msg.textContent = '';
    delete msg.dataset.key;
    wrap.dispatchEvent(new Event('change'));
  }

  function process(file) {
    if (!file) { reset(); return; }
    if (file.size < 200 * 1024) {
      msg.dataset.key = 'register.errors.photo';
      msg.textContent = t('register.errors.photo');
      preview.hidden = true;
      data = null;
      wrap.dispatchEvent(new Event('change'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.width < 720) {
        msg.dataset.key = 'register.errors.photo';
        msg.textContent = t('register.errors.photo');
        preview.hidden = true;
        data = null;
        wrap.dispatchEvent(new Event('change'));
        return;
      }
      let w = img.width, h = img.height;
      const maxDim = 1600;
      if (w > h && w > maxDim) {
        h = Math.round(h * maxDim / w);
        w = maxDim;
      } else if (h > maxDim) {
        w = Math.round(w * maxDim / h);
        h = maxDim;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const sharp = checkSharpness(ctx, w, h);
      if (sharp < 20) {
        msg.dataset.key = 'register.warnings.blurry';
        msg.textContent = t('register.warnings.blurry');
      } else {
        msg.textContent = '';
        delete msg.dataset.key;
      }
      const dataURL = canvas.toDataURL('image/jpeg', 0.85);
      preview.src = dataURL;
      preview.hidden = false;
      data = { mime: 'image/jpeg', size: file.size, width: w, height: h, dataURL };
      wrap.dispatchEvent(new Event('change'));
    };
    img.src = URL.createObjectURL(file);
  }

  input.addEventListener('change', () => process(input.files[0]));

  wrap.getData = () => data;
  wrap.setLabel = setLabel;
  wrap.reset = reset;

  return wrap;
}
