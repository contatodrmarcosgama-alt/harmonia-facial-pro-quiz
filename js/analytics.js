/**
 * ANALYTICS — medição do funil (Google Analytics 4) + pontos de integração
 * para pixels futuros (Meta/TikTok).
 *
 * REGRAS DE PRIVACIDADE (obrigatórias):
 * - Nunca enviar nome, telefone, WhatsApp, e-mail, endereço ou qualquer
 *   conteúdo digitado pelo visitante para o Analytics.
 * - Nunca usar nome ou telefone como user_id, parâmetro, rótulo ou valor
 *   de evento.
 * - O quiz precisa continuar funcionando normalmente mesmo se o Analytics
 *   estiver bloqueado, indisponível ou demorar para carregar — por isso
 *   todo envio é best-effort, protegido por try/catch, e nunca atrasa a
 *   navegação real do visitante.
 */
const HfpAnalytics = (() => {
  let initialized = false;

  // Controla eventos que devem disparar no máximo uma vez por sessão de
  // página (ex.: quiz_view). Não é resetado pelo restart do quiz — reflete
  // a sessão do navegador, não o progresso dentro do funil.
  const firedOnce = new Set();

  // Evita duplicar quiz_step_view quando a mesma tela é remontada sem uma
  // mudança real de etapa.
  let lastStepViewed = null;

  function _initMetaPixel(pixelId) { /* snippet oficial do Meta Pixel entra aqui */ }
  function _initTikTokPixel(pixelId) { /* snippet oficial do TikTok Pixel entra aqui */ }
  function _initGoogleAnalytics(gaId) {
    // A tag oficial do GA4 (gtag.js) é carregada de forma estática dentro
    // do <head> do index.html — fora deste módulo — para seguir à risca a
    // instalação oficial do Google. Este método é mantido apenas por
    // simetria com os outros pixels e para deixar explícito que nenhuma
    // segunda instância deve ser criada a partir daqui.
  }

  function init() {
    if (initialized) return;
    initialized = true;
    const cfg = HFP_CONFIG.ANALYTICS;
    if (cfg.metaPixelId) _initMetaPixel(cfg.metaPixelId);
    if (cfg.tiktokPixelId) _initTikTokPixel(cfg.tiktokPixelId);
    if (cfg.googleAnalyticsId) _initGoogleAnalytics(cfg.googleAnalyticsId);
  }

  // Parâmetros de campanha preservados (somente quando presentes na URL) e
  // encaminhados ao checkout. Nenhum valor é inventado aqui.
  // fbclid foi acrescentado para o Pixel do Meta (clique vindo de anúncio),
  // sem alterar o comportamento já existente para o GA4 — é só mais uma
  // chave que passa a ser preservada quando presente.
  const UTM_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'src', 'sck', 's1', 's2', 's3', 'fbclid'
  ];

  function captureUtms() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    let found = false;
    UTM_KEYS.forEach((key) => {
      const val = params.get(key);
      if (val) { utms[key] = val; found = true; }
    });
    return found ? utms : null;
  }

  // Acrescenta ao link de checkout somente os parâmetros de campanha que
  // realmente chegaram na URL do quiz — nunca altera o endereço-base e
  // nunca cria valores fictícios.
  function buildCheckoutUrl(baseUrl) {
    const utms = captureUtms();
    if (!utms) return baseUrl;
    try {
      const url = new URL(baseUrl);
      Object.keys(utms).forEach((key) => url.searchParams.set(key, utms[key]));
      return url.toString();
    } catch (err) {
      return baseUrl;
    }
  }

  // Camada extra de segurança: mesmo que um ponto de disparo passe algo
  // indevido por engano, estas chaves nunca chegam ao Analytics.
  const BLOCKED_KEYS = [
    'name', 'nome', 'phone', 'telefone', 'whatsapp', 'lead', 'email',
    'e-mail', 'address', 'endereco', 'endereço', 'user_id'
  ];

  function _sanitize(payload) {
    const clean = {};
    if (!payload) return clean;
    Object.keys(payload).forEach((key) => {
      if (BLOCKED_KEYS.indexOf(key.toLowerCase()) !== -1) return;
      clean[key] = payload[key];
    });
    return clean;
  }

  // Envio centralizado e seguro de eventos para o GA4 via gtag. Nunca
  // lança exceção e nunca bloqueia o quiz: se o gtag ainda não carregou,
  // estiver bloqueado (ad-blocker) ou indisponível, o evento é apenas
  // descartado silenciosamente.
  function sendGaEvent(name, payload) {
    const data = _sanitize(payload);
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, data));
    } catch (err) { /* nunca deixa o quiz quebrar por causa do analytics */ }
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, data);
      }
    } catch (err) { /* idem */ }
  }

  // Dispara um evento no máximo uma vez por sessão de página.
  function sendOnce(key, name, payload) {
    if (firedOnce.has(key)) return;
    firedOnce.add(key);
    sendGaEvent(name, payload);
  }

  // quiz_step_view com proteção contra duplicação quando a mesma tela
  // renderiza novamente sem mudança real de etapa.
  function sendStepView(payload) {
    const stepKey = payload && payload.step_id;
    if (stepKey && stepKey === lastStepViewed) return;
    lastStepViewed = stepKey;
    sendGaEvent('quiz_step_view', payload);
  }

  // Controla os eventos do Pixel do Meta que devem disparar no máximo uma
  // vez por sessão de página (ex.: ViewContent). Independente do firedOnce
  // do GA4 acima — cada canal tem seu próprio controle de duplicidade.
  const firedOnceMeta = new Set();

  // Envio centralizado e seguro de eventos para o Pixel do Meta via fbq.
  // Nunca lança exceção e nunca bloqueia o quiz: se o fbq ainda não
  // carregou, estiver bloqueado ou indisponível, o evento é apenas
  // descartado silenciosamente — o mesmo princípio do sendGaEvent acima.
  // "mode" é 'track' para eventos padrão do Meta (ViewContent, Lead,
  // InitiateCheckout, ...) e 'trackCustom' para eventos que não fazem
  // parte do catálogo padrão do Meta (ex.: QuizStart, OfferView).
  function sendMetaEvent(name, payload, mode) {
    const data = _sanitize(payload);
    try {
      if (typeof window.fbq === 'function') {
        window.fbq(mode || 'trackCustom', name, data);
      }
    } catch (err) { /* nunca deixa o quiz quebrar por causa do pixel */ }
  }

  // Dispara um evento do Meta no máximo uma vez por sessão de página.
  function sendMetaOnce(key, name, payload, mode) {
    if (firedOnceMeta.has(key)) return;
    firedOnceMeta.add(key);
    sendMetaEvent(name, payload, mode);
  }

  // Mantido por compatibilidade com integrações futuras (Meta/TikTok).
  // Não envia mais eventos ao GA4 diretamente (uso sendGaEvent para isso).
  function trackEvent(name, payload) {
    const data = Object.assign({ event: name, timestamp: Date.now() }, _sanitize(payload));
    console.log('[HFP analytics]', name, data);
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(data);
    } catch (err) { /* nunca deixa o quiz quebrar por causa do analytics */ }
    if (window.fbq) window.fbq('trackCustom', name, data);
    if (window.ttq) window.ttq.track(name, data);
  }

  return {
    init, captureUtms, buildCheckoutUrl,
    trackEvent, sendGaEvent, sendOnce, sendStepView,
    sendMetaEvent, sendMetaOnce
  };
})();
