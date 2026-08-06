const ANALYTICS_STORAGE_KEY = 'dreams_closet_analytics';
const WHATSAPP_CODE_PATTERN = /DCW-\d{8}-\d{4}-[A-Z0-9]{2}/;

function leerAnalyticsStorage() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function guardarAnalyticsStorage(datos) {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(datos));
  } catch (error) {
    // La analitica no debe bloquear la compra si el navegador limita storage.
  }
}

function fechaCodigoConsulta(fecha = new Date()) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function siguienteCodigoConsulta() {
  const storage = leerAnalyticsStorage();
  const hoy = fechaCodigoConsulta();
  const contador = storage.codigoFecha === hoy ? (storage.codigoContador || 0) + 1 : 1;
  const sufijo = Math.random().toString(36).slice(2, 4).toUpperCase().padEnd(2, '0');

  storage.codigoFecha = hoy;
  storage.codigoContador = contador;
  guardarAnalyticsStorage(storage);

  return `DCW-${hoy}-${String(contador).padStart(4, '0')}-${sufijo}`;
}

function codigoDesdeWhatsappHref(href) {
  try {
    const texto = new URL(href).searchParams.get('text') || '';
    return texto.match(WHATSAPP_CODE_PATTERN)?.[0] || '';
  } catch (error) {
    return '';
  }
}

function agregarCodigoConsulta(mensaje, codigo) {
  if (WHATSAPP_CODE_PATTERN.test(mensaje)) return mensaje;
  return `${mensaje}\n\n*Consulta:* ${codigo || siguienteCodigoConsulta()}`;
}

function agregarCodigoAWhatsappHref(href) {
  try {
    const url = new URL(href);
    const mensaje = url.searchParams.get('text') || '';
    const codigoExistente = mensaje.match(WHATSAPP_CODE_PATTERN)?.[0];
    if (codigoExistente) {
      return { href, codigo: codigoExistente };
    }

    const codigo = siguienteCodigoConsulta();
    url.searchParams.set('text', agregarCodigoConsulta(mensaje, codigo));
    return { href: url.toString(), codigo };
  } catch (error) {
    return { href, codigo: '' };
  }
}

function contextoProductoDesdeElemento(elemento) {
  const card = elemento.closest('.card-producto');
  const detalle = elemento.closest('.detalle__info');
  const producto = card?.querySelector('h3')?.textContent || detalle?.querySelector('h1')?.textContent || '';
  const codigo = card?.querySelector('.card-producto__codigo')?.textContent || detalle?.querySelector('.detalle__codigo')?.textContent || '';
  const categoria = card?.querySelector('.card-producto__linea')?.textContent || detalle?.querySelector('.eyebrow')?.textContent || '';

  return {
    product_name: producto.trim(),
    product_code: codigo.replace(/^Codigo:\s*/i, '').replace(/^Código:\s*/i, '').trim(),
    category: categoria.trim(),
  };
}

function eventoBase() {
  return {
    path: window.location.pathname,
    url: window.location.href,
    title: document.title,
  };
}

function capturarEvento(nombre, propiedades = {}) {
  const payload = { ...eventoBase(), ...propiedades };

  if (window.posthog?.capture) {
    window.posthog.capture(nombre, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: nombre, ...payload });
}

function cargarPostHog() {
  if (!SITE_CONFIG.posthogProjectKey) return;

  (function initPostHogSnippet(documentRef, posthogRef) {
    if (posthogRef.__SV) return;
    window.posthog = posthogRef;
    posthogRef._i = [];
    posthogRef.init = function init(token, config, name) {
      function createStub(target, method) {
        const parts = method.split('.');
        if (parts.length === 2) {
          target = target[parts[0]];
          method = parts[1];
        }
        target[method] = function stub() {
          target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }

      let instance = posthogRef;
      if (typeof name !== 'undefined') {
        instance = posthogRef[name] = [];
      } else {
        name = 'posthog';
      }

      instance.people = instance.people || [];
      const methods = 'capture identify alias people.set people.set_once set_config register register_once unregister reset'.split(' ');
      methods.forEach((method) => createStub(instance, method));
      posthogRef._i.push([token, config, name]);

      const script = documentRef.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `${config.api_host}/static/array.js`;
      const firstScript = documentRef.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };
    posthogRef.__SV = 1;
  }(document, window.posthog || []));

  window.posthog.init(SITE_CONFIG.posthogProjectKey, {
    api_host: SITE_CONFIG.posthogApiHost || 'https://us.i.posthog.com',
    capture_pageview: false,
    person_profiles: 'identified_only',
  });

  capturarEvento('page_view');
}

function productoActualDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  return slug && typeof buscarProductoPorSlug === 'function' ? buscarProductoPorSlug(slug) : null;
}

document.addEventListener('DOMContentLoaded', () => {
  cargarPostHog();

  if (!SITE_CONFIG.posthogProjectKey) {
    capturarEvento('page_view');
  }

  const producto = productoActualDesdeUrl();
  if (producto) {
    capturarEvento('product_view', {
      product_name: producto.name,
      product_code: producto.code,
      category: producto.category,
      slug: producto.slug,
    });
  }
});

document.addEventListener('click', (event) => {
  const enlace = event.target.closest('a');
  if (!enlace) return;

  if (enlace.href.includes('wa.me/')) {
    const consulta = agregarCodigoAWhatsappHref(enlace.href);
    enlace.href = consulta.href;

    capturarEvento('whatsapp_click', {
      whatsapp_code: consulta.codigo || codigoDesdeWhatsappHref(enlace.href),
      button_text: enlace.textContent.trim().replace(/\s+/g, ' '),
      ...contextoProductoDesdeElemento(enlace),
    });
    return;
  }

  if (enlace.href.includes('instagram.com')) {
    capturarEvento('social_click', { network: 'instagram' });
    return;
  }

  if (enlace.href.includes('facebook.com')) {
    capturarEvento('social_click', { network: 'facebook' });
  }
});

document.addEventListener('input', (event) => {
  if (event.target?.id !== 'buscadorProductos') return;
  const query = event.target.value.trim();
  if (query.length < 3) return;

  clearTimeout(window.__dreamsSearchTimer);
  window.__dreamsSearchTimer = setTimeout(() => {
    capturarEvento('catalog_search', { query });
  }, 600);
});
