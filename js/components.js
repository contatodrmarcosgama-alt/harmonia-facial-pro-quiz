/**
 * COMPONENTS — camada visual. Recebe dados (data.js) e devolve HTML.
 */
const HfpComponents = (() => {

  function intro(step) {
    return `
      <section class="hfp-screen hfp-screen--intro">
        <h1 class="hfp-title">${step.title}</h1>
        <p class="hfp-body">${step.body}</p>
        <ul class="hfp-checklist">
          ${step.bullets.map((b) => `<li><span class="hfp-check">✓</span>${b}</li>`).join('')}
        </ul>
        <button class="hfp-btn hfp-btn--primary" data-action="advance">
          <span class="hfp-btn__icon">✦</span> ${step.cta}
        </button>
        <p class="hfp-trustrow">${step.trustRow.join(' · ')}</p>
      </section>
    `;
  }

  function question(step) {
    return `
      <section class="hfp-screen hfp-screen--question">
        ${step.watermark ? `<p class="hfp-watermark">${step.watermark}</p>` : ''}
        <h2 class="hfp-question-text">${step.text}</h2>
        <div class="hfp-options" role="listbox">
          ${step.options.map((opt, i) => `
            <button class="hfp-option" type="button" role="option" data-action="answer" data-index="${i}">
              <span class="hfp-option__check">✓</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;
  }

  function pause(step) {
    return `
      <section class="hfp-screen hfp-screen--break">
        <h2 class="hfp-title hfp-title--sm">${step.title}</h2>
        ${step.subtitle ? `<p class="hfp-subtitle">${step.subtitle}</p>` : ''}
        <p class="hfp-body">${step.body}</p>
        ${step.body2 ? `<p class="hfp-body">${step.body2}</p>` : ''}
        <button class="hfp-btn hfp-btn--primary" data-action="advance">
          <span class="hfp-btn__icon">✦</span> ${step.cta}
        </button>
      </section>
    `;
  }

  function featureList(step) {
    return `
      <section class="hfp-screen hfp-screen--features">
        <h2 class="hfp-title hfp-title--sm">${step.title}</h2>
        <p class="hfp-body">${step.subtitle}</p>
        <ul class="hfp-feature-list">
          ${step.items.map((item) => `
            <li>
              <span class="hfp-feature-check">✓</span>
              <div><strong>${item.title}</strong><p>${item.body}</p></div>
            </li>
          `).join('')}
        </ul>
        ${step.notice ? `<div class="hfp-method-notice"><strong>Atenção:</strong><span>${step.notice.replace(/^Atenção:\s*/, '')}</span></div>` : ''}
        <p class="hfp-footnote">${step.footnote}</p>
        <button class="hfp-btn hfp-btn--primary" data-action="advance">→ ${step.cta}</button>
      </section>
    `;
  }

  function authority(step) {
    return `
      <section class="hfp-screen hfp-screen--authority">
        <h2 class="hfp-title hfp-title--sm">${step.title}</h2>
        <p class="hfp-subtitle">${step.subtitle}</p>
        <img class="hfp-authority-photo" src="${step.photo}" alt="Dr. Marcos Gama" loading="lazy">
        <p class="hfp-body">${step.body}</p>
        ${step.signature ? `<p class="hfp-authority-signature">${step.signature}</p>` : ''}
        <button class="hfp-btn hfp-btn--primary" data-action="advance">
          ${step.cta}${step.ctaUnconfirmed ? ' <span class="hfp-flag" title="Texto do CTA não confirmado na gravação original">*</span>' : ''}
        </button>
      </section>
    `;
  }

  function audio(step) {
    return `
      <section class="hfp-screen hfp-screen--audio">
        <h2 class="hfp-title hfp-title--sm">${step.title}</h2>
        <p class="hfp-body">${step.subtitle}</p>
        <div class="hfp-audio-bubble">
          <button class="hfp-audio-play" type="button" data-action="toggle-audio" aria-label="Reproduzir áudio">
            <span class="hfp-audio-play__icon">▶</span>
          </button>
          <div class="hfp-audio-track">
            <div class="hfp-audio-progress"><div class="hfp-audio-progress__fill" data-role="audio-fill"></div></div>
            <div class="hfp-audio-times">
              <span data-role="audio-current">00:00</span>
              <span data-role="audio-duration">${step.durationLabel}</span>
            </div>
          </div>
          <audio data-role="audio-el" preload="none">
            <source src="${step.audioSrc}" type="audio/mpeg">
            ${step.audioSrcFallback ? `<source src="${step.audioSrcFallback}" type="audio/mp4">` : ''}
          </audio>
        </div>
        <img class="hfp-audio-inset" src="assets/images/audio-inset.jpg" alt="Rosto observado no espelho com linhas de proporção" loading="lazy">
        <button class="hfp-btn hfp-btn--primary" data-action="advance">→ ${step.cta}</button>
      </section>
    `;
  }

  function proof(step) {
    return `
      <section class="hfp-screen hfp-screen--proof">
        <h2 class="hfp-title hfp-title--sm">${step.title}</h2>
        <p class="hfp-body">${step.subtitle} <span aria-hidden="true">⬇</span></p>
        <div class="hfp-chat">
          ${step.messages.map((m) => `
            <div class="hfp-chat__bubble">
              <span class="hfp-chat__sender">${step.sender}</span>
              <p>${m.text}</p>
              <span class="hfp-chat__time">${m.time}</span>
            </div>
          `).join('')}
        </div>
        <button class="hfp-btn hfp-btn--primary" data-action="advance">→ ${step.cta}</button>
      </section>
    `;
  }

  function resultsPage(data) {
    return `
      <section class="hfp-screen hfp-screen--results">
        <h2 class="hfp-title hfp-title--sm">${data.headline} <span class="hfp-highlight">${data.headlineHighlight}</span></h2>

        <h3 class="hfp-section-title">${data.radar.title}</h3>
        <div class="hfp-chart-wrap" id="hfpRadarChart"></div>
        <div class="hfp-info-card"><span class="hfp-info-card__icon">⚠</span><p>${data.cards[0]}</p></div>

        <h3 class="hfp-section-title">${data.donut.title}</h3>
        <div class="hfp-chart-wrap" id="hfpDonutChart"></div>
        <div class="hfp-info-card"><span class="hfp-info-card__icon">⚠</span><p>${data.cards[1]}</p></div>

        <h3 class="hfp-section-title">${data.bars.title}</h3>
        <div id="hfpBarsChart"></div>
        <div class="hfp-info-card"><span class="hfp-info-card__icon">⚠</span><p>${data.cards[2]}</p></div>

        <h3 class="hfp-section-title">${data.closingTitle}</h3>
        <p class="hfp-body">${data.closingBody}</p>
        <button class="hfp-btn hfp-btn--primary" data-action="advance">→ ${data.cta}</button>
      </section>
    `;
  }

  function loading(data) {
    return `
      <section class="hfp-screen hfp-screen--loading">
        <h2 class="hfp-title hfp-title--sm">${data.title}</h2>
        <div class="hfp-loading-bar"><div class="hfp-loading-bar__fill" data-role="loading-fill"></div></div>
        <p class="hfp-loading-percent" data-role="loading-percent">0%</p>
        <p class="hfp-body">${data.subtitle}</p>
      </section>
    `;
  }

  function unlockAndLeadForm(unlockData, leadData) {
    return `
      <section class="hfp-screen hfp-screen--unlock">
        <div class="hfp-confetti" aria-hidden="true"></div>
        <h2 class="hfp-title hfp-title--sm">${unlockData.title}</h2>
        <p class="hfp-body">${unlockData.body}</p>
        <div class="hfp-locked-card">
          <img class="hfp-locked-card__preview" src="assets/images/app-preview.jpg" alt="Prévia bloqueada do Harmonia Facial Pro">
          <p class="hfp-locked-card__headline">Desvende o Potencial Único do Seu Rosto</p>
          <div class="hfp-locked-card__overlay">
            <svg class="hfp-locked-card__icon" viewBox="0 0 32 38" aria-hidden="true">
              <path d="M8 16V11a8 8 0 0 1 16 0v5M5 16h22v19H5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <strong>${unlockData.lockedLabel}</strong>
          </div>
        </div>

        <p class="hfp-body">${leadData.prompt} <span aria-hidden="true">⬇</span></p>
        <form class="hfp-form" data-role="lead-form" novalidate>
          <label class="hfp-field">
            <span>${leadData.nameLabel}</span>
            <input type="text" name="name" placeholder="${leadData.namePlaceholder}" autocomplete="name" required>
          </label>
          <label class="hfp-field">
            <span>${leadData.phoneLabel}</span>
            <input type="tel" name="phone" placeholder="${leadData.phonePlaceholder}" inputmode="numeric" autocomplete="tel" required>
            <small class="hfp-field__error" data-role="phone-error" hidden>${leadData.phoneError}</small>
          </label>
          <button class="hfp-btn hfp-btn--primary" type="submit">${leadData.cta} →</button>
        </form>
      </section>
    `;
  }

  function offerPage(data) {
    // data-button-id / data-button-name identificam de forma estável cada
    // um dos dois botões de checkout apenas para fins de medição (GA4) —
    // não alteram texto, estilo ou o endereço-base do checkout. O href
    // continua apontando para HFP_CONFIG.CHECKOUT_URL; parâmetros de
    // campanha (quando presentes na URL do quiz) são apenas anexados por
    // HfpAnalytics.buildCheckoutUrl, sem nunca mudar o domínio/caminho base.
    const priceBlock = (ctaLabel, ctaAction, buttonId) => `
      <div class="hfp-price-card">
        <p class="hfp-price-card__badge">DESCONTO SOMENTE HOJE</p>
        <p class="hfp-price-card__product">HARMONIA FACIAL PRO</p>
        <p class="hfp-price-card__from">de <s>R$${data.price.anchor}</s> por apenas</p>
        <p class="hfp-price-card__amount">${data.price.installments} <strong>R$${data.price.amount}</strong></p>
        <a class="hfp-btn hfp-btn--primary" href="${HfpAnalytics.buildCheckoutUrl(HFP_CONFIG.CHECKOUT_URL)}" data-action="${ctaAction}" data-button-id="${buttonId}" data-button-name="${ctaLabel}">
          <span class="hfp-btn__icon">✦</span> ${ctaLabel}
        </a>
      </div>
    `;

    return `
      <section class="hfp-screen hfp-screen--offer">
        <h2 class="hfp-title hfp-title--sm">${data.videoIntro}</h2>
        <div class="hfp-video-wrap">
          <video data-role="offer-video" preload="none" playsinline poster="${data.videoPoster}">
            <source src="${data.videoSrc}" type="video/mp4">
          </video>
          <button class="hfp-video-play" type="button" data-action="toggle-video" aria-label="Reproduzir vídeo">▶</button>
        </div>

        <h2 class="hfp-title hfp-title--sm hfp-title--center">${data.headline}</h2>
        <p class="hfp-body hfp-body--center">${data.subtitle}</p>
        <ul class="hfp-checklist">
          ${data.bullets.map((b) => `<li><span class="hfp-check">✓</span>${b}</li>`).join('')}
        </ul>

        <h3 class="hfp-section-title hfp-section-title--center">${data.receiveTitle}</h3>
        ${data.receiveCards.map((c) => `
          <div class="hfp-feature-card">
            <div class="hfp-feature-card__art" aria-hidden="true">${c.image ? `<img src="${c.image}" alt="" loading="lazy">` : _faceGlyph()}</div>
            <div class="hfp-feature-card__body"><h4>${c.title}</h4><p>${c.body}</p></div>
          </div>
        `).join('')}

        <div class="hfp-countdown">
          <span>Esta oferta expira em:</span>
          <div class="hfp-countdown__clock">
            <div><strong data-role="countdown-min">14</strong><small>MIN</small></div>
            <span>:</span>
            <div><strong data-role="countdown-sec">10</strong><small>SEG</small></div>
          </div>
        </div>

        ${priceBlock(data.priceBlock1Cta, 'checkout', 'checkout_price_1')}

        <h3 class="hfp-section-title hfp-section-title--center">${data.recapTitle}</h3>
        <ul class="hfp-recap-list">
          ${data.recapItems.map((item) => `<li><span class="hfp-recap-check">✓</span>${item.label}<s>R$${item.value}</s></li>`).join('')}
        </ul>
        <p class="hfp-recap-total">Valor Total: <s>R$${data.recapTotal}</s></p>

        ${priceBlock(data.priceBlock2Cta, 'checkout', 'checkout_price_2')}

        <h3 class="hfp-section-title">${data.faqTitle}</h3>
        <div class="hfp-faq">
          ${data.faq.map((item) => `
            <details class="hfp-faq__item" ${item.openByDefault ? 'open' : ''}>
              <summary>${item.q}</summary>
              <p>${item.a}</p>
            </details>
          `).join('')}
        </div>

        <div class="hfp-guarantee">
          <span class="hfp-guarantee__icon">🛡</span>
          <p class="hfp-guarantee__badge">${data.guaranteeTitle}</p>
          <strong>${data.guaranteeSubtitle}</strong>
          <p>${data.guaranteeBody}</p>
        </div>
      </section>
    `;
  }

  function _faceGlyph() {
    return `
      <svg viewBox="0 0 80 100" width="56" height="70">
        <path d="M40 6 L40 94 M18 30 L62 30 M14 55 L66 55 M26 78 L54 78"
          stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.8"/>
        <ellipse cx="40" cy="50" rx="26" ry="42" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.5"/>
      </svg>
    `;
  }

  return {
    intro, question, pause, featureList, authority, audio, proof,
    resultsPage, loading, unlockAndLeadForm, offerPage
  };
})();
