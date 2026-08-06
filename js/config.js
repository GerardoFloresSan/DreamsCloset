/**
 * Configuración centralizada del sitio.
 * Cambiar el número de WhatsApp acá — no hardcodear en ningún otro archivo.
 */
const SITE_CONFIG = {
  whatsappNumber: '51918119560', // formato internacional sin '+' ni espacios
  brandName: "Dream's Closet",
  facebookUrl: 'https://www.facebook.com/dreamsclosets',
  instagramUrl: 'https://www.instagram.com/dreams.closet.shop',
  email: 'dreamsclosetcomercial@gmail.com',
  privacyPolicyUrl: 'privacidad.html',
};

/**
 * Arma un link de WhatsApp con mensaje codificado.
 * @param {string} mensaje
 * @returns {string}
 */
function buildWhatsAppLink(mensaje) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensaje de consulta por un producto puntual.
 * Incluye ficha completa (tipo, material, tallas con precio, colores) para que
 * el cliente llegue al chat sabiendo todo y no haya que reenviar la info.
 *
 * @param {object} producto - objeto de PRODUCTOS
 * @param {string} url - URL compartible del producto
 */
function mensajeConsultaProducto(producto, url) {
  const lineas = [
    `Hola, vi el ${producto.name} en la página web de Dream's Closet.`,
    '',
    `*Código:* ${producto.code}`,
    `*Producto:* ${producto.name}`,
    `*Tipo de prenda:* ${tipoPrendaProducto(producto)}`,
    `*Material:* ${materialProducto(producto)}`,
    '*Personalización:* Estampado DTF',
  ];

  const grupos = tablaPrecios(producto);
  if (grupos.length) {
    lineas.push('', '*Precios:*');
    grupos.forEach((g) => {
      lineas.push(`• Talla${g.tallas.length > 1 ? 's' : ''} ${g.tallas.join(', ')} → S/ ${g.precio}`);
    });
  }
  if (producto.notaPrecio) {
    lineas.push(`(${producto.notaPrecio})`);
  }

  lineas.push('', `*Colores disponibles:* ${producto.colors.join(', ')}`);
  lineas.push('', `Ver diseño: ${url}`);
  lineas.push('', 'Quisiera confirmar disponibilidad y tiempo de elaboración.');

  return lineas.join('\n');
}

const MENSAJE_HACER_PEDIDO = "Hola Dream's Closet, quiero más información sobre sus prendas personalizadas.";
const MENSAJE_COTIZAR_DISEÑO = 'Hola, quiero cotizar un diseño personalizado (prenda + color + estampado).';
