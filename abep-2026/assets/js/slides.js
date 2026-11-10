(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.querySelector('#counter');
  const bar = document.querySelector('#bar');
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const full = document.querySelector('#full');
  if (!slides.length || !counter || !bar || !prev || !next) return;

  const topics = {
    'fundamentos': '01',
    'machine-learning': '02',
    'deep-learning': '03',
    'ia-generativa': '04',
    'estudos-de-caso': '05'
  };
  const topicSlug = Object.keys(topics).find(slug =>
    location.pathname.includes('/topicos/' + slug + '/')
  );
  const topicCode = topics[topicSlug];

  let current = -1;
  let audio = null;
  let audioStatus = null;
  let audioRequest = 0;

  // O mesmo reprodutor acompanha todos os slides, mudando o MP3 pela numeração.
  if (topicCode) {
    const footer = document.querySelector('.control-body');
    if (footer) {
      const region = document.createElement('div');
      region.className = 'slide-audio';
      region.setAttribute('role', 'group');
      region.setAttribute('aria-label', 'Controles da narração do slide');
      region.innerHTML = `
        <span class="slide-audio-label">Narração</span>
        <audio class="slide-audio-media" controls preload="metadata"
               aria-label="Áudio do slide atual"></audio>
        <button class="slide-audio-restart" type="button"
                title="Reiniciar a narração" aria-label="Reiniciar narração">↺</button>
        <span class="slide-audio-status" role="status" aria-live="polite"></span>
      `;
      footer.insertBefore(region, footer.querySelector('.buttons'));
      audio = region.querySelector('audio');
      audioStatus = region.querySelector('.slide-audio-status');

      region.querySelector('.slide-audio-restart').addEventListener('click', () => {
        if (!audio.src) return;
        audio.currentTime = 0;
        attemptPlay();
      });

      audio.addEventListener('play', () => { audioStatus.textContent = 'Reproduzindo'; });
      audio.addEventListener('pause', () => {
        if (!audio.ended) audioStatus.textContent = 'Pausado';
      });
      audio.addEventListener('ended', () => { audioStatus.textContent = 'Narração concluída'; });
      audio.addEventListener('error', () => {
        audioStatus.textContent = 'Áudio indisponível neste slide';
      });
    }
  }

  function attemptPlay() {
    if (!audio) return;
    const request = ++audioRequest;
    const action = audio.play();
    if (action && typeof action.catch === 'function') {
      action.catch(() => {
        if (request !== audioRequest || audio.error) return;
        audioStatus.textContent = 'Clique em ▶ para ouvir';
      });
    }
  }

  function updateNarration() {
    if (!audio) return;
    ++audioRequest;
    audio.pause();
    const number = String(current + 1).padStart(2, '0');
    audio.src = new URL(
      '../../audios_topicos/audios_topico_' + topicCode + '/slide_' + number + '.mp3',
      document.baseURI
    ).href;
    audio.setAttribute('aria-label', 'Narração do slide ' + (current + 1));
    audioStatus.textContent = 'Preparando áudio';
    audio.load();
    attemptPlay();
  }

  function show(n) {
    const selected = Math.min(slides.length - 1, Math.max(0, n));
    if (selected === current) return;
    current = selected;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });

    counter.textContent = (current + 1) + ' / ' + slides.length;
    bar.style.width = ((current + 1) / slides.length * 100) + '%';
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    history.replaceState(null, '', '#slide-' + (current + 1));
    updateNarration();
  }

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  full?.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  });

  document.addEventListener('keydown', e => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const target = e.target;
    if (target?.closest?.('button, input, select, textarea, audio, [contenteditable="true"]')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      show(current + 1);
    } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      show(current - 1);
    } else if (e.key.toLowerCase() === 'f') {
      full?.click();
    } else if (e.key === 'Home') {
      show(0);
    } else if (e.key === 'End') {
      show(slides.length - 1);
    }
  });

  // Também atende a navegação por links diretos com #slide-XX.
  window.addEventListener('hashchange', () => {
    const number = Number(location.hash.match(/^#slide-(\d+)$/)?.[1]);
    if (Number.isFinite(number) && number >= 1) show(number - 1);
  });

  const initial = Number(location.hash.match(/^#slide-(\d+)$/)?.[1]);
  show(Number.isFinite(initial) && initial > 0 ? initial - 1 : 0);
})();
