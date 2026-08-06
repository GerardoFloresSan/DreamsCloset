(() => {
  const config = window.POSTHOG_CONFIG;

  if (!config?.projectToken || !config?.host) {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      const missingVariable = !config?.projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
    }

    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `${config.host}/static/array.js`;
  script.onload = () => {
    window.posthog.init(config.projectToken, {
      api_host: config.host,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    });
  };
  document.head.appendChild(script);
})();
