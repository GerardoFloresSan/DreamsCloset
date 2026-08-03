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

/** Colores básicos disponibles (stock del taller). */
const COLORES_BASICOS = [
  'Blanco', 'Negro', 'Plomo', 'Celeste', 'Rojo', 'Naranja',
  'Guinda', 'Melange', 'Verde Perico', 'Verde Militar', 'Azul Acero',
];

const TALLAS_POLERA = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const TALLAS_POLO = ['S', 'M', 'L', 'XL', 'XXL'];

const PRODUCTOS = [
  {
    code: 'DC-001',
    slug: 'hoodie-argentina',
    name: 'Hoodie Argentina',
    shortDescription: 'Diseño retro celeste y blanco, estampado estilo vintage.',
    category: 'mundiales',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/argentinaPolo.webp'],
    imageWidth: 1100,
    imageHeight: 880,
    tags: ['argentina', 'mundial', 'retro', 'futbol', 'celeste'],
    featured: true,
    available: true,
  },
  {
    code: 'DC-002',
    slug: 'hoodie-espana-82',
    name: 'Hoodie España 82',
    shortDescription: 'Homenaje al mundial 82, rojo intenso con mascota Naranjito.',
    category: 'mundiales',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/EspañaPolo.webp'],
    imageWidth: 1100,
    imageHeight: 942,
    tags: ['españa', 'mundial 82', 'retro', 'futbol', 'naranjito'],
    featured: true,
    available: true,
  },
  {
    code: 'DC-003',
    slug: 'hoodie-francia-98',
    name: 'Hoodie Francia 98',
    shortDescription: 'Blanco clásico, emblema mundialista estampado en pecho.',
    category: 'mundiales',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/FranciaPolo.webp'],
    imageWidth: 1100,
    imageHeight: 944,
    tags: ['francia', 'mundial 98', 'retro', 'futbol'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-004',
    slug: 'hoodie-italia-90',
    name: "Hoodie Italia '90",
    shortDescription: 'Azul intenso, ícono tricolor estampado, corte unisex.',
    category: 'mundiales',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Italia90.webp'],
    imageWidth: 1100,
    imageHeight: 923,
    tags: ['italia', 'mundial 90', 'retro', 'futbol', 'unisex'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-005',
    slug: 'hoodie-mexico-86',
    name: 'Hoodie México 86',
    shortDescription: 'Clásico mundialista, blanco con detalles verde y rojo.',
    category: 'mundiales',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/mexicoPolo.webp'],
    imageWidth: 1100,
    imageHeight: 950,
    tags: ['mexico', 'mundial 86', 'retro', 'futbol'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-006',
    slug: 'hoodie-peruano',
    name: 'Hoodie Peruano',
    shortDescription: 'El clásico de la colección Orgullo Peruano. Versión hombre y mujer.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDePeruano.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['peru', 'peruano', 'orgullo peruano', 'gentilicio'],
    featured: true,
    available: true,
  },
  {
    code: 'DC-007',
    slug: 'hoodie-arequipeno-cusquena',
    name: 'Arequipeño / Cusqueña',
    shortDescription: 'Vino tinto con letras doradas. Gentilicio a tu elección.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDeArequipeñp.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['arequipa', 'cusco', 'gentilicio', 'orgullo peruano'],
    featured: true,
    available: true,
  },
  {
    code: 'DC-008',
    slug: 'hoodie-chalaco-chalaca',
    name: 'Chalaco / Chalaca',
    shortDescription: 'Rosa suave, letras en contraste. Callao con orgullo.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDeChalaco.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['callao', 'chalaco', 'gentilicio', 'orgullo peruano'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-009',
    slug: 'hoodie-chiclayano',
    name: 'Chiclayano',
    shortDescription: 'Celeste cielo con estampado negro. Unisex.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDeChiclayano.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['chiclayo', 'chiclayano', 'gentilicio', 'orgullo peruano'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-010',
    slug: 'hoodie-piurano-piurana',
    name: 'Piurano / Piurana',
    shortDescription: 'Naranja vibrante, estampado negro. Calor norteño.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDePiurano.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['piura', 'piurano', 'gentilicio', 'orgullo peruano'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-011',
    slug: 'hoodie-tarapotino-tarapotina',
    name: 'Tarapotino / Tarapotina',
    shortDescription: 'Verde selva, letras claras. Orgullo de la Amazonía.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDeTarapotino.webp'],
    imageWidth: 1024,
    imageHeight: 1024,
    tags: ['tarapoto', 'tarapotino', 'selva', 'gentilicio', 'orgullo peruano'],
    featured: false,
    available: true,
  },
  {
    code: 'DC-012',
    slug: 'hoodie-trujillano-trujillana',
    name: 'Trujillano / Trujillana',
    shortDescription: 'Amarillo intenso, estampado negro. Capital de la primavera.',
    category: 'ciudades',
    garmentType: 'hoodie',
    garmentFamily: 'polera',
    sizes: TALLAS_POLERA,
    colors: COLORES_BASICOS,
    images: ['assets/images-optimizadas/productos/Departamentos/PoleraDeTrujillano.webp'],
    imageWidth: 733,
    imageHeight: 1100,
    tags: ['trujillo', 'trujillano', 'gentilicio', 'orgullo peruano'],
    featured: false,
    available: true,
  },
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
