/**
 * Configuración centralizada del sitio.
 * Cambiar el número de WhatsApp acá — no hardcodear en ningún otro archivo.
 */
const SITE_CONFIG = {
  whatsappNumber: '51918119560', // formato internacional sin '+' ni espacios
  brandName: "Dream's Closet",
  facebookUrl: 'https://www.facebook.com/dreamsclosets',
  email: 'dreamsclosetcomercial@gmail.com',
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
 * Mensaje estándar de consulta por un producto puntual.
 * @param {{name: string, code: string, url: string}} producto
 */
function mensajeConsultaProducto(producto) {
  return `Hola, vi el ${producto.name} en la página web de Dream's Closet.\n\nCódigo: ${producto.code}\nProducto: ${producto.name}\nEnlace: ${producto.url}\n\nQuisiera consultar por las tallas, colores disponibles, precio y tiempo de elaboración.`;
}

const MENSAJE_HACER_PEDIDO = "Hola Dream's Closet, quiero más información sobre sus prendas personalizadas.";
const MENSAJE_COTIZAR_DISEÑO = 'Hola, quiero cotizar un diseño personalizado (prenda + color + estampado).';
