// ========================================================
// POKÉDEX LITE — Next-Level Stateful Router & Navigation Guards
// Phase 1: URL Query Synchronization, Parallel Modal Routes, Bot Detection
// ========================================================

/**
 * Bot user-agent detection for SEO crawlers and search indexers
 */
export function isBotUserAgent(userAgent = navigator.userAgent) {
  const botPattern = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|whatsapp/i;
  return botPattern.test(userAgent);
}

/**
 * Parse state from current URL Query parameters
 */
export function parseUrlState() {
  if (typeof window === 'undefined') {
    return {
      page: 1,
      search: '',
      type: null,
      modal: null,
      tab: 'all',
    };
  }

  const params = new URLSearchParams(window.location.search);
  const page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const search = params.get('search') || '';
  const type = params.get('type') || null;
  const modal = params.get('modal') ? parseInt(params.get('modal'), 10) || params.get('modal') : null;
  const tab = params.get('tab') === 'favorites' ? 'favorites' : 'all';

  return {
    page: isNaN(page) ? 1 : page,
    search,
    type,
    modal,
    tab,
  };
}

/**
 * Synchronize state back into URL without full page reload
 */
export function syncUrlState({ page, search, type, modal, tab }, replace = false) {
  if (typeof window === 'undefined') return;

  const currentUrl = new URL(window.location.href);
  const params = new URLSearchParams();

  if (page && page > 1) {
    params.set('page', String(page));
  }

  if (search && search.trim()) {
    params.set('search', search.trim());
  }

  if (type) {
    params.set('type', type);
  }

  if (modal) {
    params.set('modal', String(modal));
  }

  if (tab === 'favorites') {
    params.set('tab', 'favorites');
  }

  const newQuery = params.toString();
  const newPath = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}${window.location.hash}`;

  if (currentUrl.search !== (newQuery ? `?${newQuery}` : '')) {
    if (replace) {
      window.history.replaceState({ page, search, type, modal, tab }, '', newPath);
    } else {
      window.history.pushState({ page, search, type, modal, tab }, '', newPath);
    }
  }
}

/**
 * Geo / Locale resolver helper for country-specific regional configurations
 */
export function getClientLocale() {
  try {
    return navigator.language || navigator.userLanguage || 'en-US';
  } catch {
    return 'en-US';
  }
}

/**
 * Route protection guard for authenticated actions
 */
export function requireAuthGuard(user, onOpenAuth) {
  if (!user) {
    if (onOpenAuth) onOpenAuth();
    return false;
  }
  return true;
}
