/**
 * STORAGE — persistência local do funil, com namespace próprio.
 */
const HfpStorage = (() => {
  const KEY = HFP_CONFIG.STORAGE_NAMESPACE;

  function _safeParse(raw) {
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      return _safeParse(raw) || null;
    } catch (e) { return null; }
  }

  function save(state) {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* falha silenciosa: persistência não é requisito funcional */ }
  }

  function clear() {
    try { window.localStorage.removeItem(KEY); }
    catch (e) { /* noop */ }
  }

  return { load, save, clear };
})();
