(() => {
  const config = window.POSTHOG_CONFIG;

  if (!config?.projectToken || !config?.host) {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      const missingVariable = !config?.projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
    }

    return;
  }

  const posthog = window.posthog || [];
  window.posthog = posthog;

  if (!posthog.__SV) {
    posthog._i = [];
    posthog.init = function init(token, options, name) {
      function stub(target, method) {
        const parts = method.split('.');
        if (parts.length === 2) {
          target = target[parts[0]];
          method = parts[1];
        }
        target[method] = function queuedCall() {
          target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }

      let instance = posthog;
      if (name !== undefined) {
        instance = posthog[name] = [];
      } else {
        name = 'posthog';
      }

      instance.people = instance.people || [];
      [
        'capture',
        'identify',
        'alias',
        'people.set',
        'people.set_once',
        'set_config',
        'register',
        'register_once',
        'unregister',
        'reset',
      ].forEach((method) => stub(instance, method));

      posthog._i.push([token, options, name]);
    };
    posthog.__SV = 1;
  }

  window.posthog.init(config.projectToken, {
    api_host: config.host,
    capture_pageview: false,
    person_profiles: 'identified_only',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `${config.host}/static/array.js`;
  document.head.appendChild(script);
})();
