/**
 * CONFIG — ponto único de configuração do funil.
 */
const HFP_CONFIG = {
  CHECKOUT_URL: 'https://pay.kiwify.com.br/dOngR7l',
  // Endpoint único e centralizado para o envio futuro do lead (nome + WhatsApp).
  // Ainda não configurado — nenhuma URL real foi fornecida. Quando houver um
  // endpoint real, defina-o aqui; todo o resto do código deve ler esta
  // constante em vez de espalhar chamadas de envio pelo app.
  LEAD_ENDPOINT: null,
  STORAGE_NAMESPACE: 'hfp_quiz_v1',
  OFFER_COUNTDOWN_SECONDS: 14 * 60 + 10,
  ANALYTICS: {
    metaPixelId: null,
    tiktokPixelId: null,
    // A tag do GA4 é carregada de forma estática no <head> do index.html
    // (gtag.js), então este valor serve apenas como referência/documentação
    // — nenhum código depende dele para inicializar o Analytics.
    googleAnalyticsId: 'G-N3JG1H6KNG'
  }
};
