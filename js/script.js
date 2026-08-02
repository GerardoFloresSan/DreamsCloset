document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

// ---------- Botones de WhatsApp con mensaje centralizado ----------
const btnHacerPedido = document.getElementById('btnHacerPedido');
if (btnHacerPedido) {
  btnHacerPedido.href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);
}

const btnCotizar = document.getElementById('btnCotizar');
if (btnCotizar) {
  btnCotizar.href = buildWhatsAppLink(MENSAJE_COTIZAR_DISEÑO);
}

const numeroVisible = SITE_CONFIG.whatsappNumber.replace(/^51/, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');

const contactoWhatsapp = document.getElementById('contactoWhatsapp');
if (contactoWhatsapp) {
  contactoWhatsapp.href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);
  document.getElementById('contactoWhatsappNumero').textContent = numeroVisible;
}

const contactoEmail = document.getElementById('contactoEmail');
if (contactoEmail) {
  contactoEmail.href = `mailto:${SITE_CONFIG.email}`;
  document.getElementById('contactoEmailTexto').textContent = SITE_CONFIG.email;
}

const whatsappFloat = document.getElementById('whatsappFloat');
if (whatsappFloat) {
  whatsappFloat.href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);
}

['btnFacebookNosotros', 'contactoFacebook', 'footerFacebook'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = SITE_CONFIG.facebookUrl;
});

const footerWhatsapp = document.getElementById('footerWhatsapp');
if (footerWhatsapp) footerWhatsapp.href = buildWhatsAppLink(MENSAJE_HACER_PEDIDO);

const footerNumero = document.getElementById('footerNumero');
if (footerNumero) footerNumero.textContent = numeroVisible;

const footerInstagram = document.getElementById('footerInstagram');
if (footerInstagram && SITE_CONFIG.instagramUrl) {
  footerInstagram.href = SITE_CONFIG.instagramUrl;
  footerInstagram.classList.remove('is-oculto');
}

// ---------- Resaltar sección activa en el nav al hacer scroll ----------
const seccionesNav = ['inicio', 'catalogo', 'personalizacion', 'nosotros', 'contacto']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const enlacesNav = Array.from(nav.querySelectorAll('a'));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    enlacesNav.forEach(a => a.classList.toggle('is-actual', a.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });

seccionesNav.forEach(sec => navObserver.observe(sec));

const TAMANO_PAGINA = 9;

const gridProductos = document.getElementById('gridProductos');
const filtrosCategoria = document.getElementById('filtrosCategoria');
const buscadorInput = document.getElementById('buscadorProductos');
const contadorResultados = document.getElementById('contadorResultados');
const estadoVacio = document.getElementById('estadoVacio');
const contenedorVerMas = document.getElementById('contenedorVerMas');
const btnVerMas = document.getElementById('btnVerMas');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

const estadoCatalogo = {
  categoria: 'todos',
  busqueda: '',
  visibles: TAMANO_PAGINA,
};

function renderFiltros() {
  filtrosCategoria.innerHTML = CATEGORIAS.map(cat => `
    <button type="button" class="filtro${cat.slug === estadoCatalogo.categoria ? ' is-activo' : ''}" data-filtro="${cat.slug}">${cat.label}</button>
  `).join('');

  filtrosCategoria.querySelectorAll('.filtro').forEach(boton => {
    boton.addEventListener('click', () => {
      estadoCatalogo.categoria = boton.dataset.filtro;
      estadoCatalogo.visibles = TAMANO_PAGINA;
      filtrosCategoria.querySelectorAll('.filtro').forEach(b => b.classList.remove('is-activo'));
      boton.classList.add('is-activo');
      renderCatalogo();
    });
  });
}

function productoCoincide(producto, query) {
  if (!query) return true;
  const haystack = [producto.name, producto.code, producto.category, producto.garmentType, ...(producto.tags || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function productosFiltrados() {
  return PRODUCTOS.filter(p =>
    (estadoCatalogo.categoria === 'todos' || p.category === estadoCatalogo.categoria) &&
    productoCoincide(p, estadoCatalogo.busqueda)
  );
}

function renderCatalogo() {
  const resultados = productosFiltrados();
  const visibles = resultados.slice(0, estadoCatalogo.visibles);
  const esUltimaPagina = resultados.length <= estadoCatalogo.visibles;

  gridProductos.innerHTML = visibles.map(tarjetaHTML).join('') + (esUltimaPagina && visibles.length ? ctaCardHTML() : '');

  const hayResultados = resultados.length > 0;
  estadoVacio.classList.toggle('is-oculto', hayResultados);
  gridProductos.classList.toggle('is-oculto', !hayResultados);

  contadorResultados.textContent = hayResultados
    ? `${resultados.length} ${resultados.length === 1 ? 'producto' : 'productos'}`
    : '';

  contenedorVerMas.classList.toggle('is-oculto', esUltimaPagina);
}

buscadorInput.addEventListener('input', () => {
  estadoCatalogo.busqueda = buscadorInput.value.trim();
  estadoCatalogo.visibles = TAMANO_PAGINA;
  renderCatalogo();
});

btnVerMas.addEventListener('click', () => {
  estadoCatalogo.visibles += TAMANO_PAGINA;
  renderCatalogo();
});

btnLimpiarFiltros.addEventListener('click', () => {
  estadoCatalogo.categoria = 'todos';
  estadoCatalogo.busqueda = '';
  estadoCatalogo.visibles = TAMANO_PAGINA;
  buscadorInput.value = '';
  renderFiltros();
  renderCatalogo();
});

renderFiltros();
renderCatalogo();

// ---------- Scroll reveal ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
