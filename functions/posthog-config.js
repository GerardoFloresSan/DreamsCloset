export function onRequestGet({ env }) {
  return new Response(`window.POSTHOG_CONFIG = ${JSON.stringify({
    projectToken: env.POSTHOG_PROJECT_TOKEN,
    host: env.POSTHOG_HOST,
  })};`, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
