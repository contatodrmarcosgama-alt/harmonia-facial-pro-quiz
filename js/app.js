/**
 * APP — motor do quiz (state machine + eventos).
 */
(function () {
  'use strict';

  const APP_ROOT = document.getElementById('app');
  const PROGRESS_FILL = document.getElementById('progressFill');
  const RESTART_BTN = document.getElementById('restartBtn');

  let state = {
    phase: 'quiz',
    stepIndex: 0,
    answers: {},
    lead: { name: '', phone: '' }
  };

  // Mapa de medição (GA4) — número real da tela (1 a 20), id técnico,
  // nome curto e tipo, na mesma ordem já usada por todo o funil. Não afeta
  // dados, textos, ordem ou lógica do quiz: é usado apenas para descrever
  // cada tela nos eventos de analytics.
  const STEP_META = {
    'intro':          { step_number: 1,  step_name: 'Abertura',          step_type: 'intro' },
    'q1':             { step_number: 2,  step_name: 'Pergunta 1',        step_type: 'question' },
    'q2':             { step_number: 3,  step_name: 'Pergunta 2',        step_type: 'question' },
    'break1':         { step_number: 4,  step_name: 'Transição 1',       step_type: 'transition' },
    'q3':             { step_number: 5,  step_name: 'Pergunta 3',        step_type: 'question' },
    'break2':         { step_number: 6,  step_name: 'Transição 2',       step_type: 'transition' },
    'q4':             { step_number: 7,  step_name: 'Pergunta 4',        step_type: 'question' },
    'break3':         { step_number: 8,  step_name: 'Transição 3',       step_type: 'transition' },
    'q5':             { step_number: 9,  step_name: 'Pergunta 5',        step_type: 'question' },
    'q6':             { step_number: 10, step_name: 'Pergunta 6',        step_type: 'question' },
    'break4':         { step_number: 11, step_name: 'Transição 4',       step_type: 'transition' },
    'product-intro':  { step_number: 12, step_name: 'Funcionalidades',   step_type: 'transition' },
    'authority':      { step_number: 13, step_name: 'Autoridade',        step_type: 'transition' },
    'audio':          { step_number: 14, step_name: 'Áudio',             step_type: 'audio' },
    'proof':          { step_number: 15, step_name: 'Prova social',      step_type: 'transition' },
    'q7':             { step_number: 16, step_name: 'Pergunta 7',        step_type: 'question' },
    'results':        { step_number: 17, step_name: 'Resultados',        step_type: 'result' },
    'loading':        { step_number: 18, step_name: 'Carregando',        step_type: 'loading' },
    'unlock':         { step_number: 19, step_name: 'Formulário',        step_type: 'form' },
    'offer':          { step_number: 20, step_name: 'Oferta',            step_type: 'offer' }
  };

  function trackStepView(stepId) {
    const meta = STEP_META[stepId];
    if (!meta) return;
    HfpAnalytics.sendStepView({
      step_number: meta.step_number,
      step_id: stepId,
      step_name: meta.step_name,
      step_type: meta.step_type
    });
  }

  function persist() { HfpStorage.save(state); }

  function restore() {
    const saved = HfpStorage.load();
    if (saved && saved.phase) { state = Object.assign(state, saved); return true; }
    return false;
  }

  function restart() {
    HfpStorage.clear();
    state = { phase: 'quiz', stepIndex: 0, answers: {}, lead: { name: '', phone: '' } };
    render();
  }

  // Fundo por tela — assets/images/backgrounds/<id>.jpg quando existir.
  // Sempre em "contain" (ver style.css): a composição completa da imagem
  // (rosto, malha dourada, proporções) nunca é cortada, ampliada ou
  // deformada — o preto institucional completa o que sobrar.
  function applyScreenBackground(screenId, sectionEl) {
    if (!screenId) return;
    const src = `assets/images/backgrounds/${screenId}.jpg`;
    const probe = new Image();
    probe.onload = () => {
      // url() dentro de uma variável CSS resolve relativo ao style.css, não
      // ao index.html — por isso usamos a URL absoluta aqui.
      const absoluteUrl = new URL(src, document.baseURI).href;
      sectionEl.style.setProperty('--hfp-bg-image', `url("${absoluteUrl}")`);
      sectionEl.classList.add('hfp-screen--has-bg');
      // Marca a tela com o id do passo (ex.: "q7") apenas para permitir um
      // ajuste de CSS específico daquela tela (enquadramento do fundo).
      // Não afeta texto, lógica, sequência ou dados do quiz.
      sectionEl.dataset.screenId = screenId;
      // "Reiniciar quiz" e o rodapé (copyright) ficam fora de .hfp-screen no
      // DOM (são irmãos de <main id="app">), então o fundo por-tela acima não
      // os alcança. Replicamos a mesma imagem como pano de fundo fixo da
      // página (body::before) para que eles também fiquem sobre a foto
      // contínua, nunca sobre um bloco preto isolado.
      document.body.style.setProperty('--hfp-page-bg-image', `url("${absoluteUrl}")`);
    };
    probe.onerror = () => { /* sem imagem ainda: mantém fundo sólido padrão */ };
    probe.src = src;
  }

  function setProgress(pct) { PROGRESS_FILL.style.width = `${pct}%`; }

  function render() {
    persist();
    RESTART_BTN.hidden = state.phase === 'quiz' && state.stepIndex === 0;

    if (state.phase === 'quiz') renderQuizStep();
    else if (state.phase === 'results') renderResults();
    else if (state.phase === 'loading') renderLoading();
    else if (state.phase === 'unlock' || state.phase === 'lead-form') renderUnlockAndLeadForm();
    else if (state.phase === 'offer') renderOffer();

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function mount(html, screenId) {
    APP_ROOT.innerHTML = html;
    const section = APP_ROOT.querySelector('.hfp-screen');
    if (section) applyScreenBackground(screenId, section);
  }

  function renderQuizStep() {
    const step = HFP_STEPS[state.stepIndex];
    if (!step) {
      state.phase = 'results';
      state.stepIndex = 0;
      return render();
    }

    setProgress(step.progress);

    let html;
    switch (step.type) {
      case 'intro': html = HfpComponents.intro(step); break;
      case 'question': html = HfpComponents.question(step); break;
      case 'break': html = HfpComponents.pause(step); break;
      case 'feature-list': html = HfpComponents.featureList(step); break;
      case 'authority': html = HfpComponents.authority(step); break;
      case 'audio': html = HfpComponents.audio(step); break;
      case 'proof': html = HfpComponents.proof(step); break;
      default: html = '';
    }
    mount(html, step.id);

    if (step.id === 'intro') {
      HfpAnalytics.sendOnce('quiz_view', 'quiz_view', {});
      HfpAnalytics.sendMetaOnce('quiz_view_meta', 'ViewContent', {}, 'track');
    }
    trackStepView(step.id);

    if (step.type === 'audio') wireAudio(step);
  }

  function advanceQuiz() { state.stepIndex += 1; render(); }

  function answerQuestion(step, index) {
    state.answers[step.id] = index;
    advanceQuiz();
  }

  function wireAudio(step) {
    const btn = APP_ROOT.querySelector('[data-action="toggle-audio"]');
    const audioEl = APP_ROOT.querySelector('[data-role="audio-el"]');
    const fill = APP_ROOT.querySelector('[data-role="audio-fill"]');
    const current = APP_ROOT.querySelector('[data-role="audio-current"]');
    if (!btn || !audioEl) return;

    let audioStartTracked = false;

    function formatTime(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    btn.addEventListener('click', () => {
      if (audioEl.paused) {
        audioEl.play();
        btn.querySelector('.hfp-audio-play__icon').textContent = '❚❚';
      } else {
        audioEl.pause();
        btn.querySelector('.hfp-audio-play__icon').textContent = '▶';
      }
    });

    audioEl.addEventListener('timeupdate', () => {
      if (!audioEl.duration) return;
      const pct = (audioEl.currentTime / audioEl.duration) * 100;
      if (fill) fill.style.width = `${pct}%`;
      if (current) current.textContent = formatTime(audioEl.currentTime);
    });

    audioEl.addEventListener('playing', () => {
      if (audioStartTracked) return;
      audioStartTracked = true;
      HfpAnalytics.sendGaEvent('audio_start', {});
    });

    audioEl.addEventListener('ended', () => {
      btn.querySelector('.hfp-audio-play__icon').textContent = '▶';
      HfpAnalytics.sendGaEvent('audio_complete', {});
    });
  }

  function renderResults() {
    setProgress(HFP_RESULTS.progress);
    mount(HfpComponents.resultsPage(HFP_RESULTS), 'results');
    trackStepView('results');
    HfpCharts.renderRadar(document.getElementById('hfpRadarChart'), HFP_RESULTS.radar.axes);
    HfpCharts.renderDonut(document.getElementById('hfpDonutChart'), HFP_RESULTS.donut.segments);
    HfpCharts.renderBars(document.getElementById('hfpBarsChart'), HFP_RESULTS.bars.items);
  }

  function advanceFromResults() { state.phase = 'loading'; render(); }

  function renderLoading() {
    setProgress(HFP_LOADING.progress);
    mount(HfpComponents.loading(HFP_LOADING), 'loading');
    trackStepView('loading');

    const fill = APP_ROOT.querySelector('[data-role="loading-fill"]');
    const percentEl = APP_ROOT.querySelector('[data-role="loading-percent"]');
    requestAnimationFrame(() => {
      if (fill) fill.style.transition = `width ${HFP_LOADING.durationMs}ms ease-out`;
      requestAnimationFrame(() => { if (fill) fill.style.width = '100%'; });
    });

    const startTime = performance.now();
    function tickPercent(now) {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / HFP_LOADING.durationMs) * 100));
      if (percentEl) percentEl.textContent = `${pct}%`;
      if (pct < 100 && state.phase === 'loading') window.requestAnimationFrame(tickPercent);
    }
    window.requestAnimationFrame(tickPercent);

    window.setTimeout(() => { state.phase = 'unlock'; render(); }, HFP_LOADING.durationMs + 200);
  }

  function renderUnlockAndLeadForm() {
    state.phase = 'unlock';
    setProgress(HFP_UNLOCK.progress);
    mount(HfpComponents.unlockAndLeadForm(HFP_UNLOCK, HFP_LEAD_FORM), 'unlock');
    trackStepView('unlock');
    HfpAnalytics.sendGaEvent('lead_form_view', {});
    spawnConfetti(APP_ROOT.querySelector('.hfp-confetti'));
    wireLeadForm();
  }

  function spawnConfetti(container) {
    if (!container) return;
    const colors = ['#C6A969', '#F5F6F7', '#2A323C', '#E8C97A'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('span');
      piece.className = 'hfp-confetti__piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
    }
  }

  function maskPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
  }

  function wireLeadForm() {
    const form = APP_ROOT.querySelector('[data-role="lead-form"]');
    if (!form) return;
    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneError = form.querySelector('[data-role="phone-error"]');

    phoneInput.addEventListener('input', (e) => {
      e.target.value = maskPhone(e.target.value);
      phoneError.hidden = true;
      phoneInput.classList.remove('hfp-field--invalid');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = phoneInput.value;

      if (!isValidPhone(phone)) {
        phoneError.hidden = false;
        phoneInput.classList.add('hfp-field--invalid');
        return;
      }

      state.lead = { name, phone };
      HfpAnalytics.sendGaEvent('lead_form_submit', { form_id: 'lead_form', validation_status: 'success' });
      HfpAnalytics.sendMetaEvent('Lead', { content_name: 'lead_form', validation_status: 'success' }, 'track');
      submitLead(state.lead);
      state.phase = 'offer';
      render();
    });
  }

  // Ponto único e centralizado para o envio futuro do lead. Hoje não há
  // integração real (HFP_CONFIG.LEAD_ENDPOINT ainda não foi configurado),
  // então isso apenas registra o evento local/analytics — nenhuma chamada de
  // rede é feita até que um endpoint real seja definido em config.js.
  function submitLead(lead) {
    if (!HFP_CONFIG.LEAD_ENDPOINT) return;
    // Quando um endpoint real existir, o envio (fetch/POST) deve acontecer
    // aqui — e somente aqui — para manter a integração centralizada.
  }

  function renderOffer() {
    setProgress(HFP_OFFER.progress);
    mount(HfpComponents.offerPage(HFP_OFFER), 'offer');
    trackStepView('offer');
    HfpAnalytics.sendGaEvent('offer_view', {});
    HfpAnalytics.sendMetaEvent('OfferView', {}, 'trackCustom');
    wireOfferVideo();
    wireCountdown();
    wireCheckoutButtons();
  }

  function wireOfferVideo() {
    const btn = APP_ROOT.querySelector('[data-action="toggle-video"]');
    const videoEl = APP_ROOT.querySelector('[data-role="offer-video"]');
    if (!btn || !videoEl) return;

    let videoStartTracked = false;

    btn.addEventListener('click', () => {
      videoEl.setAttribute('controls', 'controls');
      videoEl.play();
      btn.style.display = 'none';
    });
    videoEl.addEventListener('pause', () => { btn.style.display = 'flex'; });
    videoEl.addEventListener('play', () => { btn.style.display = 'none'; });
    videoEl.addEventListener('playing', () => {
      if (videoStartTracked) return;
      videoStartTracked = true;
      HfpAnalytics.sendGaEvent('video_start', {});
    });
    videoEl.addEventListener('ended', () => {
      videoEl.removeAttribute('controls');
      HfpAnalytics.sendGaEvent('video_complete', {});
    });
  }

  function wireCountdown() {
    const minEl = APP_ROOT.querySelector('[data-role="countdown-min"]');
    const secEl = APP_ROOT.querySelector('[data-role="countdown-sec"]');
    if (!minEl || !secEl) return;

    let remaining = HFP_CONFIG.OFFER_COUNTDOWN_SECONDS;
    const tick = () => {
      remaining = Math.max(0, remaining - 1);
      minEl.textContent = Math.floor(remaining / 60).toString().padStart(2, '0');
      secEl.textContent = Math.floor(remaining % 60).toString().padStart(2, '0');
      if (remaining <= 0) window.clearInterval(interval);
    };
    const interval = window.setInterval(tick, 1000);
  }

  function wireCheckoutButtons() {
    APP_ROOT.querySelectorAll('[data-action="checkout"]').forEach((btn) => {
      // Apenas mede o clique — nunca impede nem atrasa a navegação real do
      // link (o <a href> segue para a Kiwify normalmente).
      btn.addEventListener('click', () => {
        const buttonId = btn.getAttribute('data-button-id') || 'checkout';
        const buttonName = btn.getAttribute('data-button-name') || '';
        HfpAnalytics.sendGaEvent('checkout_click', {
          button_id: buttonId,
          button_name: buttonName,
          checkout_provider: 'kiwify',
          destination: 'https://pay.kiwify.com.br/dOngR7l'
        });
        // Meta Pixel — InitiateCheckout, sem Purchase: a compra só é
        // confirmada depois pela Kiwify após pagamento aprovado.
        HfpAnalytics.sendMetaEvent('InitiateCheckout', {
          content_name: 'Harmonia Facial PRO',
          content_ids: ['harmonia-facial-pro'],
          content_type: 'product',
          value: 49.00,
          currency: 'BRL',
          button_id: buttonId,
          button_name: buttonName,
          checkout_provider: 'kiwify',
          destination: 'https://pay.kiwify.com.br/dOngR7l'
        }, 'track');
      });
    });
  }

  APP_ROOT.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');

    if (action === 'advance') {
      if (state.phase === 'quiz') {
        const step = HFP_STEPS[state.stepIndex];
        if (step && step.id === 'intro') {
          HfpAnalytics.sendGaEvent('quiz_start', {});
          HfpAnalytics.sendMetaEvent('QuizStart', {}, 'trackCustom');
        } else if (step) {
          const meta = STEP_META[step.id];
          HfpAnalytics.sendGaEvent('quiz_continue', {
            step_number: meta ? meta.step_number : undefined,
            step_id: step.id,
            button_id: `${step.id}_advance`
          });
        }
        advanceQuiz();
      } else if (state.phase === 'results') {
        HfpAnalytics.sendGaEvent('quiz_continue', {
          step_number: STEP_META.results.step_number,
          step_id: 'results',
          button_id: 'results_advance'
        });
        advanceFromResults();
      }
    } else if (action === 'answer') {
      const step = HFP_STEPS[state.stepIndex];
      const index = Number(actionEl.getAttribute('data-index'));
      const meta = STEP_META[step.id];
      HfpAnalytics.sendGaEvent('quiz_answer', {
        step_number: meta ? meta.step_number : undefined,
        question_id: step.id,
        answer_id: String(index),
        answer_position: index + 1
      });
      actionEl.classList.add('hfp-option--selected');
      window.setTimeout(() => answerQuestion(step, index), 150);
    }
  });

  RESTART_BTN.addEventListener('click', restart);

  HfpAnalytics.init();
  restore();
  render();
})();
