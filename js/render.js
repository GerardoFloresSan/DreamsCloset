/**
 * Renderizado compartido de tarjetas de producto.
 * Usado por index.html (catálogo) y producto.html (relacionados).
 */
const ETIQUETA_TAG = {
  mundiales: 'Personalizable',
  ciudades: 'Elige tu ciudad',
  'equipos-futbol': 'Tu equipo',
  reencuentros: 'A tu medida',
  'trabajos-terminados': 'Trabajo realizado',
  varios: 'Personalizable',
};

function escapeHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function escapeAttribute(valor) {
  return escapeHTML(valor).replace(/`/g, '&#96;');
}

function safeRelativeAssetPath(ruta) {
  const texto = String(ruta ?? '');
  return /^(?:assets|css|js)\/[A-Za-z0-9._~/%() -]+$/.test(texto) && !texto.includes('..')
    ? texto
    : '';
}

function safeSlug(slug) {
  const texto = String(slug ?? '');
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(texto) ? texto : '';
}

function safeHexColor(hex) {
  const texto = String(hex ?? '');
  return /^#[0-9A-Fa-f]{6}$/.test(texto) ? texto : '#CCCCCC';
}

function safeClassToken(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

document.addEventListener('click', (event) => {
  const detailLink = event.target.closest('.js-product-detail');
  if (detailLink) {
    window.posthog?.capture('product_detail_opened', {
      product_slug: detailLink.dataset.productSlug,
      product_category: detailLink.dataset.productCategory,
      source: detailLink.dataset.source,
    });
    return;
  }

  const whatsappLink = event.target.closest('.js-product-inquiry');
  if (whatsappLink) {
    window.posthog?.capture('whatsapp_inquiry_started', {
      source: whatsappLink.dataset.source,
      product_slug: whatsappLink.dataset.productSlug,
      product_category: whatsappLink.dataset.productCategory,
    });
    return;
  }

  const quoteLink = event.target.closest('.js-custom-design-quote');
  if (quoteLink) {
    window.posthog?.capture('custom_design_quote_started', { source: quoteLink.dataset.source });
  }
});

function iconoWhatsapp() {
  return '<svg class="icono-wsp" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.876 9.876 0 0012.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.26-4.38c.01-4.55 3.7-8.23 8.26-8.23m-4.52 4.7c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.53.12.16 1.7 2.6 4.14 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.09.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.25-.63.79-.77.95-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.02"/></svg>';
}

/** @param {object} producto - objeto de PRODUCTOS */
function tarjetaHTML(producto) {
  const categoriaLabel = CATEGORIAS.find((c) => c.slug === producto.category)?.label || '';
  const url = urlProducto(producto);
  const mensaje = mensajeConsultaProducto(producto, url);
  const imagen = safeRelativeAssetPath(producto.images[0]);
  const imagenMiniatura = safeRelativeAssetPath(imagenCard(producto.images[0]));
  const slug = safeSlug(producto.slug);
  const categoria = safeSlug(producto.category);
  const ancho = Number(producto.imageWidth) || 0;
  const alto = Number(producto.imageHeight) || 0;

  return `
    <article class="card-producto reveal is-visible" data-categoria="${escapeAttribute(categoria)}">
      <div class="card-producto__img">
        <span class="tag-personalizable">${escapeHTML(ETIQUETA_TAG[producto.category] || 'Personalizable')}</span>
        <img
          src="${escapeAttribute(imagenMiniatura)}"
          srcset="${escapeAttribute(imagenMiniatura)} 700w, ${escapeAttribute(imagen)} ${ancho}w"
          sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 33vw"
          alt="${escapeAttribute(producto.name)}" loading="lazy"
          width="${ancho}" height="${alto}">
      </div>
      <div class="card-producto__body">
        <div class="card-producto__meta">
          <span class="card-producto__linea">${escapeHTML(categoriaLabel)}</span>
          <span class="card-producto__codigo">${escapeHTML(producto.code)}</span>
        </div>
        <h3>${escapeHTML(producto.name)}</h3>
        <p>${escapeHTML(producto.shortDescription)}</p>
        <p class="card-producto__detalle">Estampado DTF · <strong>${escapeHTML(etiquetaPrecio(producto))}</strong></p>
        <div class="card-producto__acciones">
          <a href="producto.html?slug=${escapeAttribute(slug)}" class="btn btn--outline btn--sm js-product-detail" data-product-slug="${escapeAttribute(slug)}" data-product-category="${escapeAttribute(categoria)}" data-source="catalog_card">Ver detalles</a>
          <a href="${escapeAttribute(buildWhatsAppLink(mensaje))}" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sm js-product-inquiry" data-product-slug="${escapeAttribute(slug)}" data-product-category="${escapeAttribute(categoria)}" data-source="catalog_card">${iconoWhatsapp()}Consultar este diseño</a>
        </div>
      </div>
    </article>
  `;
}

/** Card fija que cierra el grid del catálogo, invita a cotizar un diseño propio. */
function ctaCardHTML() {
  return `
    <article class="card-producto card-cta">
      <div class="card-cta__cuerpo">
        <span class="card-cta__icono">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="12"/><circle cx="11" cy="15" r=".5" fill="currentColor"/></svg>
        </span>
        <h3>¿No encontraste tu diseño?</h3>
        <p>Contanos tu idea — color, prenda y estampado — y te la cotizamos por WhatsApp.</p>
        <a href="${buildWhatsAppLink(MENSAJE_COTIZAR_DISEÑO)}" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sm js-custom-design-quote" data-source="catalog_cta">${iconoWhatsapp()}Cotizar mi diseño</a>
      </div>
    </article>
  `;
}
