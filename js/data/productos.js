/**
 * Fuente única de datos del catálogo.
 *
 * Para agregar un producto nuevo: copiar un objeto, cambiar los valores,
 * usar el siguiente código correlativo (DC-0XX) y un slug único en minúsculas sin tildes.
 * No hay que tocar ningún otro archivo — catálogo, detalle y buscador leen de acá.
 *
 * Los precios y materiales NO se escriben por producto: se derivan de `garmentFamily`
 * usando las tablas PRECIOS y MATERIALES de abajo. Si sube el precio de las poleras,
 * se cambia en un solo lugar y se actualiza todo el catálogo.
 */

/**
 * Categorías del catálogo. `carpetaDrive` es el nombre exacto de la carpeta
 * en el Drive de Dream's Closet, para la futura sincronización automática.
 */
const CATEGORIAS = [
  { slug: 'todos', label: 'Todos', carpetaDrive: null },
  { slug: 'mundiales', label: 'Mundiales', carpetaDrive: 'Mundiales' },
  { slug: 'ciudades', label: 'Ciudades', carpetaDrive: 'Ciudades' },
  { slug: 'equipos-futbol', label: 'Equipos de Fútbol', carpetaDrive: 'Equipos de futbol' },
  { slug: 'reencuentros', label: 'Reencuentros', carpetaDrive: 'Reencuentros' },
  { slug: 'trabajos-terminados', label: 'Trabajos Terminados', carpetaDrive: 'Trabajos terminados' },
  { slug: 'varios', label: 'Varios', carpetaDrive: 'Varios' },
];

/** Precios en soles (S/) por familia de prenda y talla. */
const PRECIOS = {
  polera: { S: 65, M: 65, L: 65, XL: 75, XXL: 85, XXXL: 95 },
  polo: { S: 40, M: 40, L: 40, XL: 45, XXL: 50 },
};

/** Material por familia de prenda. */
const MATERIALES = {
  polera: 'Franela reactiva 20/1',
  polo: 'Algodón 20/1',
};

/** Nombre visible de cada familia/tipo de prenda. */
const TIPO_PRENDA = {
  hoodie: 'Hoodie – Polera con capucha',
  crewneck: 'Polera cuello redondo',
  polo: 'Polo de algodón',
};

/**
 * Colores básicos disponibles (stock del taller).
 * El `hex` es una referencia visual aproximada para los cuadraditos de la ficha;
 * el tono real de la tela puede variar un poco según el lote.
 */
const PALETA = [
  { nombre: 'Blanco', hex: '#F7F5F0' },
  { nombre: 'Negro', hex: '#1C1C1C' },
  { nombre: 'Plomo', hex: '#8C8C8C' },
  { nombre: 'Melange', hex: '#B4B2AC' },
  { nombre: 'Celeste', hex: '#A5D3EC' },
  { nombre: 'Azul Acero', hex: '#3E5A73' },
  { nombre: 'Rojo', hex: '#C8102E' },
  { nombre: 'Guinda', hex: '#6E1423' },
  { nombre: 'Naranja', hex: '#F26522' },
  { nombre: 'Verde Perico', hex: '#3FA34D' },
  { nombre: 'Verde Militar', hex: '#4B5320' },
];

const COLORES_BASICOS = PALETA.map((c) => c.nombre);

const TALLAS_POLERA = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const TALLAS_POLO = ['S', 'M', 'L', 'XL', 'XXL'];

/**
 * Medidas de cada talla, en centímetros, tomadas sobre la prenda apoyada en plano.
 *
 * ⚠️ PENDIENTE: faltan las medidas reales del taller. Mientras estos objetos
 * estén vacíos, la web muestra un aviso invitando a consultar por WhatsApp
 * en vez de mostrar números inventados.
 *
 * Para completarlo, medir una prenda de cada talla y cargar así:
 *
 *   polera: {
 *     S:   { pecho: 52, largo: 68 },
 *     M:   { pecho: 55, largo: 70 },
 *     ...
 *   }
 *
 *   pecho = ancho de axila a axila (prenda cerrada, en plano)
 *   largo = del hombro al ruedo inferior
 */
const GUIA_TALLAS = {
  polera: {},
  polo: {},
};

/** true si ya se cargaron las medidas de esa familia de prenda. */
function hayGuiaTallas(familia) {
  return Object.keys(GUIA_TALLAS[familia] || {}).length > 0;
}

/**
 * Productos cargados a mano. Los del catálogo grande (ciudades, mundiales,
 * equipos) vienen de productos-catalogo.js, que genera el script de importación.
 */
const PRODUCTOS_MANUALES = [
  {
    code: 'DC-013',
    slug: 'promocion-reencuentro',
    name: 'Promoción / Reencuentro',
    shortDescription: 'Poleras y hoodies para tu reencuentro escolar. Año, nombres y colores a elección — pedido grupal con descuento.',
    category: 'reencuentros',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Reencuentros/Promociones.webp'],
    imageWidth: 1100,
    imageHeight: 733,
    tags: ['promocion', 'reencuentro', 'colegio', 'grupal'],
    featured: true,
    available: true,
    notaPrecio: 'Consultar descuento por cantidad',
  },
  {
    code: 'DC-014',
    slug: 'promocion-85',
    name: 'Promoción 85',
    shortDescription: 'Polera blanca con escudo y apellido estampado — ideal para el reencuentro de tu año.',
    category: 'reencuentros',
    garmentType: 'crewneck',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Reencuentros/Promocion85.webp'],
    imageWidth: 1024,
    imageHeight: 1024,
    tags: ['promocion 85', 'reencuentro', 'colegio', 'crewneck'],
    featured: true,
    available: true,
    notaPrecio: 'Consultar descuento por cantidad',
  },
  {
    code: 'DC-015',
    slug: 'promocion-90',
    name: 'Promoción 90',
    shortDescription: 'Hoodie gris con número de promoción grande al pecho — el más pedido para grupos.',
    category: 'reencuentros',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Reencuentros/Promocion90.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['promocion 90', 'reencuentro', 'colegio'],
    featured: false,
    available: true,
    notaPrecio: 'Consultar descuento por cantidad',
  },
  {
    code: 'DC-016',
    slug: 'promocion-95',
    name: 'Promoción 95',
    shortDescription: 'Polera roja con número de promoción — combina bien en fotos grupales.',
    category: 'reencuentros',
    garmentType: 'crewneck',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Reencuentros/Promocion95.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['promocion 95', 'reencuentro', 'colegio', 'crewneck'],
    featured: false,
    available: true,
    notaPrecio: 'Consultar descuento por cantidad',
  },
];

/**
 * Descripción por defecto según la categoría, para los productos importados
 * desde Drive (una foto no trae texto adentro).
 */
function descripcionPorCategoria(producto) {
  switch (producto.category) {
    case 'ciudades':
      return `Polera con capucha estampada con el diseño de ${producto.name}. Elige color y talla.`;
    case 'mundiales':
      return `Diseño retro del mundial ${producto.name}, en versión hombre y mujer.`;
    case 'equipos-futbol':
      return `Polera con capucha con el diseño de ${producto.name}. Elige color y talla.`;
    default:
      return `${producto.name} — estampado DTF, personalizable en color y talla.`;
  }
}

/** Completa un producto importado con los campos comunes a todo el catálogo. */
function completarProducto(producto) {
  return {
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    shortDescription: descripcionPorCategoria(producto),
    tags: [producto.name.toLowerCase(), producto.category, 'estampado', 'personalizado'],
    featured: false,
    available: true,
    ...producto,
  };
}

// Los importados van primero: son las fotos más nuevas y las que mejor
// representan la marca, así son las que se ven al entrar sin filtrar.
const PRODUCTOS = [
  ...(typeof PRODUCTOS_CATALOGO !== 'undefined' ? PRODUCTOS_CATALOGO.map(completarProducto) : []),
  ...PRODUCTOS_MANUALES,
];

// ---------- Derivados (no editar a mano) ----------

/** Material del producto según su familia de prenda. */
function materialProducto(producto) {
  return MATERIALES[producto.garmentFamily] || '';
}

/** Nombre visible del tipo de prenda. */
function tipoPrendaProducto(producto) {
  return TIPO_PRENDA[producto.garmentType] || producto.garmentType;
}

/** Tabla de precios del producto: [{ talla, precio }] agrupada por precio. */
function tablaPrecios(producto) {
  const tabla = PRECIOS[producto.garmentFamily];
  if (!tabla) return [];

  const grupos = [];
  producto.sizes.forEach((talla) => {
    const precio = tabla[talla];
    if (precio == null) return;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.precio === precio) {
      ultimo.tallas.push(talla);
    } else {
      grupos.push({ precio, tallas: [talla] });
    }
  });
  return grupos;
}

/** Precio más bajo del producto, o null si no hay tabla. */
function precioDesde(producto) {
  const grupos = tablaPrecios(producto);
  if (!grupos.length) return null;
  return Math.min(...grupos.map((g) => g.precio));
}

/** Texto corto de precio para las tarjetas del catálogo. */
function etiquetaPrecio(producto) {
  const desde = precioDesde(producto);
  return desde ? `Desde S/ ${desde}` : 'Consultar precio';
}

/** Datos de color (nombre + hex) de un producto, para dibujar los cuadraditos. */
function coloresProducto(producto) {
  return producto.colors
    .map((nombre) => PALETA.find((c) => c.nombre === nombre))
    .filter(Boolean);
}

/**
 * Ruta de la versión reducida de una imagen, la que usan las tarjetas del catálogo.
 * Las genera scripts/generar-miniaturas.py con el sufijo "-card".
 */
function imagenCard(ruta) {
  return ruta.replace(/(\.[^.]+)$/, '-card$1');
}

/** URL absoluta compartible de un producto (para WhatsApp, redes, OG). */
function urlProducto(producto) {
  const carpeta = window.location.pathname.replace(/[^/]*$/, '');
  return `${window.location.origin}${carpeta}producto.html?slug=${producto.slug}`;
}

function buscarProductoPorSlug(slug) {
  return PRODUCTOS.find((p) => p.slug === slug) || null;
}

function productosRelacionados(producto, max = 3) {
  return PRODUCTOS.filter((p) => p.category === producto.category && p.slug !== producto.slug).slice(0, max);
}

/** Categorías que hoy tienen al menos un producto (las vacías no se muestran como filtro). */
function categoriasConProductos() {
  return CATEGORIAS.filter(
    (cat) => cat.slug === 'todos' || PRODUCTOS.some((p) => p.category === cat.slug)
  );
}
