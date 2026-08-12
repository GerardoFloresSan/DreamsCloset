const POSTHOG_HOSTS_PERMITIDOS = new Set([
  'app.posthog.com',
  'us.i.posthog.com',
  'eu.i.posthog.com',
]);

function hostPosthogSeguro(host) {
  try {
    const url = new URL(host);
    return url.protocol === 'https:' && POSTHOG_HOSTS_PERMITIDOS.has(url.hostname)
      ? url.origin
      : '';
  } catch {
    return '';
  }
}

function tokenPosthogSeguro(token) {
  const texto = String(token || '');
  return /^phc_[A-Za-z0-9_-]{10,}$/.test(texto) ? texto : '';
}

export function onRequestGet({ env }) {
  return new Response(`window.POSTHOG_CONFIG = ${JSON.stringify({
    projectToken: tokenPosthogSeguro(env.POSTHOG_PROJECT_TOKEN),
    host: hostPosthogSeguro(env.POSTHOG_HOST),
  })};`, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
