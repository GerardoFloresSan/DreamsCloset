document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

document.getElementById('btnHacerPedido').href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);
document.getElementById('whatsappFloat').href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);

function renderMigas(producto) {
  document.getElementById('migas').innerHTML = `
    <a href="index.html#inicio">Inicio</a> /
    <a href="index.html#catalogo">Catálogo</a> /
    <span aria-current="page">${producto.name}</span>
  `;
}

function actualizarMeta(producto, url) {
  document.title = `${producto.name} | Dream's Closet`;
  document.getElementById('metaDescripcion').content = producto.shortDescription;
  document.getElementById('metaCanonical').href = url;
  document.getElementById('ogTitulo').content = `${producto.name} | Dream's Closet`;
  document.getElementById('ogDescripcion').content = producto.shortDescription;
  document.getElementById('ogImagen').content = `${window.location.origin}/${producto.images[0]}`;

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.name,
    sku: producto.code,
    description: producto.shortDescription,
    image: producto.images.map(src => `${window.location.origin}/${src}`),
    category: producto.category,
    material: materialProducto(producto),
  };

  const desde = precioDesde(producto);
  if (desde) {
    ldJson.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'PEN',
      lowPrice: desde,
      highPrice: Math.max(...tablaPrecios(producto).map((g) => g.precio)),
      availability: producto.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    };
  }
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ldJson);
  document.head.appendChild(script);
}

function renderGaleria(producto) {
  const miniaturas = producto.images.length > 1
    ? `<div class="detalle__miniaturas">
        ${producto.images.map((src, i) => `<button type="button" class="detalle__miniatura${i === 0 ? ' is-activa' : ''}" data-src="${src}"><img src="${src}" alt="${producto.name} vista ${i + 1}"></button>`).join('')}
      </div>`
    : '';

  return `
    <div class="detalle__galeria">
      <div class="detalle__img-principal">
        <img src="${producto.images[0]}" alt="${producto.name}" id="imgPrincipal" width="${producto.imageWidth}" height="${producto.imageHeight}">
      </div>
      ${miniaturas}
    </div>
  `;
}

function renderTablaPrecios(producto) {
  const grupos = tablaPrecios(producto);
  if (!grupos.length) {
    return '<p class="detalle__precio-nota">Consultar precio por WhatsApp.</p>';
  }

  const filas = grupos
    .map(
      (g) => `
      <li>
        <span class="detalle__precio-tallas">Talla${g.tallas.length > 1 ? 's' : ''} ${g.tallas.join(', ')}</span>
        <span class="detalle__precio-monto">S/ ${g.precio}</span>
      </li>`
    )
    .join('');

  const nota = producto.notaPrecio
    ? `<p class="detalle__precio-nota">${producto.notaPrecio}</p>`
    : '';

  return `<ul class="detalle__precios">${filas}</ul>${nota}`;
}

function renderDetalle(producto) {
  const categoriaLabel = CATEGORIAS.find(c => c.slug === producto.category)?.label || '';
  const colores = producto.colors.length ? producto.colors.join(', ') : 'Consultar disponibilidad';
  const url = urlProducto(producto);
  const mensaje = mensajeConsultaProducto(producto, url);

  document.getElementById('detalleProducto').innerHTML = `
    <div class="container detalle">
      ${renderGaleria(producto)}
      <div class="detalle__info">
        <span class="eyebrow">${categoriaLabel}</span>
        <h1>${producto.name}</h1>
        <p class="detalle__codigo">Código: ${producto.code}</p>
        <p class="detalle__desc">${producto.shortDescription}</p>

        <ul class="detalle__specs">
          <li><strong>Tipo de prenda</strong><span>${tipoPrendaProducto(producto)}</span></li>
          <li><strong>Personalización</strong><span>Estampado DTF</span></li>
          <li><strong>Material</strong><span>${materialProducto(producto)}</span></li>
          <li><strong>Colores</strong><span>${colores}</span></li>
        </ul>

        <div class="detalle__precio-bloque">
          <h2 class="detalle__precio-titulo">Precios por talla</h2>
          ${renderTablaPrecios(producto)}
        </div>

        <div class="detalle__acciones">
          <a href="${buildWhatsAppLink(mensaje)}" target="_blank" rel="noopener" class="btn btn--whatsapp">${iconoWhatsapp()}Consultar este diseño</a>
          <a href="index.html#catalogo" class="btn btn--ghost">Volver al catálogo</a>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.detalle__miniatura').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('imgPrincipal').src = btn.dataset.src;
      document.querySelectorAll('.detalle__miniatura').forEach(b => b.classList.remove('is-activa'));
      btn.classList.add('is-activa');
    });
  });

  document.getElementById('imgPrincipal').addEventListener('click', () => {
    abrirLightbox(document.getElementById('imgPrincipal').src, producto.name);
  });

  renderMigas(producto);
  actualizarMeta(producto, url);
}

function renderRelacionados(producto) {
  const relacionados = productosRelacionados(producto);
  const seccion = document.getElementById('seccionRelacionados');
  if (!relacionados.length) {
    seccion.classList.add('is-oculto');
    return;
  }
  document.getElementById('gridRelacionados').innerHTML = relacionados.map(tarjetaHTML).join('');
}

// ---------- Lightbox (zoom de imagen) ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function abrirLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.remove('is-oculto');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  lightbox.classList.add('is-oculto');
  document.body.style.overflow = '';
}

document.getElementById('lightboxCerrar').addEventListener('click', cerrarLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) cerrarLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarLightbox();
});

function init() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const producto = slug ? buscarProductoPorSlug(slug) : null;

  if (!producto) {
    document.getElementById('productoNoEncontrado').classList.remove('is-oculto');
    document.getElementById('seccionRelacionados').classList.add('is-oculto');
    document.title = 'Producto no encontrado | Dream\'s Closet';
    return;
  }

  renderDetalle(producto);
  renderRelacionados(producto);
}

init();
