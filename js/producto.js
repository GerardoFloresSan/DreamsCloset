document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

function captureEvent(event, properties) {
  window.posthog?.capture(event, properties);
}

const btnHacerPedido = document.getElementById('btnHacerPedido');
btnHacerPedido.href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);
btnHacerPedido.addEventListener('click', () => captureEvent('whatsapp_inquiry_started', { source: 'header_order' }));

const whatsappFloat = document.getElementById('whatsappFloat');
whatsappFloat.href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);
whatsappFloat.addEventListener('click', () => captureEvent('whatsapp_inquiry_started', { source: 'floating_button' }));

function renderMigas(producto) {
  document.getElementById('migas').innerHTML = `
    <a href="index.html#inicio">Inicio</a> /
    <a href="index.html#catalogo">Catálogo</a> /
    <span aria-current="page">${escapeHTML(producto.name)}</span>
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
  const imagenPrincipal = safeRelativeAssetPath(producto.images[0]);
  const nombre = escapeAttribute(producto.name);
  const ancho = Number(producto.imageWidth) || 0;
  const alto = Number(producto.imageHeight) || 0;
  const miniaturas = producto.images.length > 1
    ? `<div class="detalle__miniaturas">
        ${producto.images.map((src, i) => {
          const ruta = safeRelativeAssetPath(src);
          return `<button type="button" class="detalle__miniatura${i === 0 ? ' is-activa' : ''}" data-src="${escapeAttribute(ruta)}"><img src="${escapeAttribute(ruta)}" alt="${nombre} vista ${i + 1}"></button>`;
        }).join('')}
      </div>`
    : '';

  return `
    <div class="detalle__galeria">
      <div class="detalle__img-principal">
        <img src="${escapeAttribute(imagenPrincipal)}" alt="${nombre}" id="imgPrincipal" width="${ancho}" height="${alto}">
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
        <span class="detalle__precio-tallas">Talla${g.tallas.length > 1 ? 's' : ''} ${escapeHTML(g.tallas.join(', '))}</span>
        <span class="detalle__precio-monto">S/ ${escapeHTML(g.precio)}</span>
      </li>`
    )
    .join('');

  const nota = producto.notaPrecio
    ? `<p class="detalle__precio-nota">${escapeHTML(producto.notaPrecio)}</p>`
    : '';

  return `<ul class="detalle__precios">${filas}</ul>${nota}`;
}

function renderColores(producto) {
  const colores = coloresProducto(producto);
  if (!colores.length) {
    return '<p class="detalle__colores-vacio">Consultar disponibilidad por WhatsApp.</p>';
  }

  const chips = colores
    .map(
      (c) => `
      <li class="color-chip">
        <span class="color-chip__muestra color-chip__muestra--${escapeAttribute(safeClassToken(c.nombre))}"></span>
        <span class="color-chip__nombre">${escapeHTML(c.nombre)}</span>
      </li>`
    )
    .join('');

  return `
    <ul class="colores-lista">${chips}</ul>
    <p class="detalle__colores-nota">El tono real puede variar ligeramente según el lote de tela.</p>
  `;
}

function renderDetalle(producto) {
  const categoriaLabel = CATEGORIAS.find(c => c.slug === producto.category)?.label || '';
  const url = urlProducto(producto);
  const mensaje = mensajeConsultaProducto(producto, url);

  document.getElementById('detalleProducto').innerHTML = `
    <div class="container detalle">
      ${renderGaleria(producto)}
      <div class="detalle__info">
        <span class="eyebrow">${escapeHTML(categoriaLabel)}</span>
        <h1>${escapeHTML(producto.name)}</h1>
        <p class="detalle__codigo">Código: ${escapeHTML(producto.code)}</p>
        <p class="detalle__desc">${escapeHTML(producto.shortDescription)}</p>

        <ul class="detalle__specs">
          <li><strong>Tipo de prenda</strong><span>${escapeHTML(tipoPrendaProducto(producto))}</span></li>
          <li><strong>Personalización</strong><span>Estampado DTF</span></li>
          <li><strong>Material</strong><span>${escapeHTML(materialProducto(producto))}</span></li>
        </ul>

        <div class="detalle__bloque">
          <div class="detalle__bloque-cabecera">
            <h2 class="detalle__bloque-titulo">Tallas disponibles</h2>
            <button type="button" class="enlace-boton" id="btnGuiaTallas">Ver guía de tallas</button>
          </div>
          <ul class="tallas-lista">
            ${producto.sizes.map((t) => `<li class="talla-chip">${escapeHTML(t)}</li>`).join('')}
          </ul>
        </div>

        <div class="detalle__bloque">
          <h2 class="detalle__bloque-titulo">Colores disponibles</h2>
          ${renderColores(producto)}
        </div>

        <div class="detalle__precio-bloque">
          <h2 class="detalle__precio-titulo">Precios por talla</h2>
          ${renderTablaPrecios(producto)}
        </div>

        <div class="detalle__acciones">
          <a href="${escapeAttribute(buildWhatsAppLink(mensaje))}" target="_blank" rel="noopener" class="btn btn--whatsapp" id="btnConsultaProducto">${iconoWhatsapp()}Consultar este diseño</a>
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
    abrirLightbox(document.getElementById('imgPrincipal').src, producto.name, producto);
  });

  document.getElementById('btnGuiaTallas').addEventListener('click', () => {
    captureEvent('product_size_guide_opened', {
      product_slug: producto.slug,
      product_category: producto.category,
    });
    abrirGuiaTallas(producto);
  });

  document.getElementById('btnConsultaProducto').addEventListener('click', () => {
    captureEvent('whatsapp_inquiry_started', {
      source: 'product_detail',
      product_slug: producto.slug,
      product_category: producto.category,
    });
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

// ---------- Guía de tallas ----------
const modalTallas = document.getElementById('modalTallas');
const contenidoTallas = document.getElementById('contenidoTallas');

function tablaTallasHTML(producto) {
  const medidas = GUIA_TALLAS[producto.garmentFamily];

  // Sin medidas cargadas no se inventa nada: se deriva la consulta a WhatsApp.
  if (!hayGuiaTallas(producto.garmentFamily)) {
    const mensaje = `Hola, quiero consultar por las medidas de las tallas del ${producto.name} (${producto.code}).`;
    return `
      <p class="modal__aviso">Todavía no publicamos la tabla de medidas de esta prenda.</p>
      <p class="modal__texto">Escribinos y te decimos exactamente qué talla te corresponde.</p>
      <a href="${escapeAttribute(buildWhatsAppLink(mensaje))}" target="_blank" rel="noopener" class="btn btn--whatsapp">${iconoWhatsapp()}Consultar mi talla</a>
    `;
  }

  const filas = producto.sizes
    .filter((t) => medidas[t])
    .map(
      (t) => `<tr><th scope="row">${escapeHTML(t)}</th><td>${escapeHTML(medidas[t].pecho)} cm</td><td>${escapeHTML(medidas[t].largo)} cm</td></tr>`
    )
    .join('');

  return `
    <table class="tabla-tallas">
      <thead>
        <tr><th scope="col">Talla</th><th scope="col">Pecho</th><th scope="col">Largo</th></tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
    <p class="modal__texto">Medidas tomadas sobre la prenda en plano. El pecho se mide de axila a axila.</p>
  `;
}

function abrirGuiaTallas(producto) {
  contenidoTallas.innerHTML = tablaTallasHTML(producto);
  modalTallas.classList.remove('is-oculto');
  document.body.style.overflow = 'hidden';
  document.getElementById('tallasCerrar').focus();
}

function cerrarGuiaTallas() {
  modalTallas.classList.add('is-oculto');
  document.body.style.overflow = '';
}

document.getElementById('tallasCerrar').addEventListener('click', cerrarGuiaTallas);
modalTallas.addEventListener('click', (e) => {
  if (e.target === modalTallas) cerrarGuiaTallas();
});

// ---------- Lightbox (zoom de imagen) ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function abrirLightbox(src, alt, producto) {
  captureEvent('product_image_expanded', {
    product_slug: producto.slug,
    product_category: producto.category,
  });
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
  if (e.key !== 'Escape') return;
  cerrarLightbox();
  cerrarGuiaTallas();
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
