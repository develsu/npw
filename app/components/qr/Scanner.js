import { t, onLangChange } from '../../utils/i18n.js';
import Toast from '../ui/toast.js';

function loadStyles() {
  if (!document.querySelector('link[href="components/qr/Scanner.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'components/qr/Scanner.css';
    document.head.appendChild(link);
  }
}

function loadQuagga() {
  if (window.Quagga) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function Scanner({ onResult }) {
  loadStyles();
  const el = document.createElement('div');
  el.className = 'scanner';
  const video = document.createElement('div');
  video.className = 'scanner-video';
  el.appendChild(video);
  const overlay = document.createElement('div');
  overlay.className = 'scanner-overlay';
  const label = document.createElement('div');
  label.className = 'scanner-label';
  overlay.appendChild(label);
  el.appendChild(overlay);
  const torchBtn = document.createElement('button');
  torchBtn.type = 'button';
  torchBtn.className = 'torch hidden';
  el.appendChild(torchBtn);
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.capture = 'environment';
  fileInput.className = 'upload hidden';
  el.appendChild(fileInput);
  const toast = Toast();
  let track = null;
  let torch = false;
  let started = false;

  function updateTexts() {
    label.textContent = t('qr.scanning');
    torchBtn.textContent = t(torch ? 'qr.torchOff' : 'qr.torchOn');
    torchBtn.setAttribute('aria-label', torch ? t('qr.torchOff') : t('qr.torchOn'));
    fileInput.setAttribute('aria-label', t('qr.uploadImage'));
  }
  onLangChange(updateTexts);
  updateTexts();

  function startLive() {
    if (started) return;
    started = true;
    loadQuagga().then(() => {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: video,
          constraints: { facingMode: 'environment' }
        },
        decoder: { readers: ['qr_reader'] }
      }, err => {
        if (err) {
          fileInput.classList.remove('hidden');
          toast.show(t('qr.cameraError'));
          return;
        }
        Quagga.start();
        const stream = Quagga.CameraAccess.getActiveStream();
        const tracks = stream.getVideoTracks();
        if (tracks[0] && tracks[0].getCapabilities().torch) {
          track = tracks[0];
          torchBtn.classList.remove('hidden');
        }
      });
      Quagga.onDetected(data => {
        const code = data.codeResult.code;
        Quagga.stop();
        started = false;
        onResult(code);
      });
    });
  }

  torchBtn.addEventListener('click', () => {
    if (!track) return;
    torch = !torch;
    track.applyConstraints({ advanced: [{ torch }] });
    updateTexts();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    loadQuagga().then(() => {
      Quagga.decodeSingle({
        src: URL.createObjectURL(file),
        numOfWorkers: 0,
        decoder: { readers: ['qr_reader'] }
      }, res => {
        if (res && res.codeResult) {
          onResult(res.codeResult.code);
        } else {
          toast.show(t('qr.invalidQr'));
        }
      });
    });
  });

  startLive();

  window.addEventListener('qa:qr', e => {
    const text = e.detail && e.detail.text;
    if (text) onResult(text);
  });

  function destroy() {
    if (window.Quagga) {
      try { Quagga.stop(); } catch (e) {}
    }
    if (track) { track.stop(); track = null; }
    started = false;
  }

  return { el, destroy };
}
