const ANALYTICS_STORAGE_KEY = 'dreams_closet_analytics';
const WHATSAPP_CODE_PATTERN = /DCW-\d{8}-\d{4}-[A-Z0-9]{2}/;
const DEVICE_CONTEXT = {
  user_agent: navigator.userAgent || '',
  user_agent_brands: '',
  device_model: '',
  device_platform_version: '',
  device_architecture: '',
  device_bitness: '',
  device_wow64: '',
};

function detectarNavegador(userAgent) {
  const ua = userAgent || '';
  const reglas = [
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Microsoft Edge', /Edg\/([\d.]+)/],
    ['Opera', /OPR\/([\d.]+)/],
    ['Firefox', /Firefox\/([\d.]+)/],
    ['Chrome', /Chrome\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari/],
  ];

  const match = reglas
    .map(([name, regex]) => {
      const result = ua.match(regex);
      return result ? { browser: name, browser_version: result[1] } : null;
    })
    .find(Boolean);

  return match || { browser: 'Desconocido', browser_version: '' };
}

function detectarSistema(userAgent) {
  const ua = userAgent || '';
  const reglas = [
    ['iOS', /(?:iPhone|iPad|iPod).*OS ([\d_]+)/],
    ['Android', /Android ([\d.]+)/],
    ['Windows', /Windows NT ([\d.]+)/],
    ['macOS', /Mac OS X ([\d_]+)/],
    ['ChromeOS', /CrOS [\w\s]+ ([\d.]+)/],
    ['Linux', /Linux/],
  ];

  for (const [os, regex] of reglas) {
    const result = ua.match(regex);
    if (result) {
      return { os, os_version: (result[1] || '').replace(/_/g, '.') };
    }
  }

  return { os: 'Desconocido', os_version: '' };
}

function detectarTipoDispositivo(userAgent) {
  const ua = userAgent || '';
  const esTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const esCelular = /Mobi|iPhone|Android.*Mobile|Windows Phone/i.test(ua);

  if (esTablet) return 'tablet';
  if (esCelular) return 'mobile';
  return 'desktop';
}

function contextoDispositivo() {
  const userAgent = DEVICE_CONTEXT.user_agent;
  const navegador = detectarNavegador(userAgent);
  const sistema = detectarSistema(userAgent);
  const deviceType = detectarTipoDispositivo(userAgent);

  return {
    ...navegador,
    ...sistema,
    device_type: deviceType,
    is_mobile: deviceType === 'mobile',
    is_tablet: deviceType === 'tablet',
    screen_width: window.screen?.width || null,
    screen_height: window.screen?.height || null,
    viewport_width: window.innerWidth || null,
    viewport_height: window.innerHeight || null,
    device_pixel_ratio: window.devicePixelRatio || 1,
    user_agent: userAgent,
    user_agent_brands: DEVICE_CONTEXT.user_agent_brands,
    device_model: DEVICE_CONTEXT.device_model,
    device_platform_version: DEVICE_CONTEXT.device_platform_version,
    device_architecture: DEVICE_CONTEXT.device_architecture,
    device_bitness: DEVICE_CONTEXT.device_bitness,
    device_wow64: DEVICE_CONTEXT.device_wow64,
  };
}

async function cargarClientHints() {
  if (!navigator.userAgentData?.getHighEntropyValues) return;

  try {
    const hints = await navigator.userAgentData.getHighEntropyValues([
      'architecture',
      'bitness',
      'model',
      'platformVersion',
      'uaFullVersion',
      'wow64',
    ]);

    DEVICE_CONTEXT.user_agent_brands = (navigator.userAgentData.brands || [])
      .map((brand) => `${brand.brand} ${brand.version}`)
      .join(', ');
    DEVICE_CONTEXT.device_model = hints.model || '';
    DEVICE_CONTEXT.device_platform_version = hints.platformVersion || '';
    DEVICE_CONTEXT.device_architecture = hints.architecture || '';
    DEVICE_CONTEXT.device_bitness = hints.bitness || '';
    DEVICE_CONTEXT.device_wow64 = String(Boolean(hints.wow64));
  } catch (error) {
    // Algunos navegadores bloquean estos datos; seguimos con user agent normal.
  }
}

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
    ...contextoDispositivo(),
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

function productoActualDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  return slug && typeof buscarProductoPorSlug === 'function' ? buscarProductoPorSlug(slug) : null;
}

document.addEventListener('DOMContentLoaded', () => {
  cargarClientHints();
  capturarEvento('page_view');

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
