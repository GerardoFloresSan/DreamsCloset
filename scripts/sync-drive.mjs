/**
 * Sincroniza el catálogo desde Google Drive.
 *
 *   node scripts/sync-drive.mjs
 *
 * Requiere la variable de entorno GOOGLE_SERVICE_ACCOUNT_JSON con el contenido
 * del JSON de la cuenta de servicio (ver docs/sincronizacion-drive.md).
 *
 * ⚠️ SIN PROBAR: escrito a partir de la documentación de la API de Drive, pero
 * todavía no se ejecutó porque no existen las credenciales. Al correrlo por
 * primera vez es probable que haya que ajustar detalles.
 *
 * Qué hace:
 *   1. Lee las carpetas de categoría dentro de la carpeta raíz de Drive.
 *   2. Descarga las imágenes nuevas a assets/images-drive/<categoria>/.
 *   3. Genera js/data/productos-drive.js con los productos encontrados.
 *
 * Lo que NO hace (a propósito):
 *   - No toca js/data/productos.js (los productos cargados a mano se respetan).
 *   - No borra imágenes locales que ya no estén en Drive; solo avisa.
 */

import { google } from 'googleapis';
import fs from 'node:fs/promises';
import path from 'node:path';

const CARPETA_RAIZ = 'Dreams Closet 2024';

/** slug de categoría -> nombre exacto de la carpeta en Drive */
const CATEGORIAS_DRIVE = {
  mundiales: 'Mundiales',
  ciudades: 'Ciudades',
  'equipos-futbol': 'Equipos de futbol',
  reencuentros: 'Reencuentros',
  'trabajos-terminados': 'Trabajos terminados',
  varios: 'Varios',
};

const TALLAS = {
  polera: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  polo: ['S', 'M', 'L', 'XL', 'XXL'],
};

const DIR_IMAGENES = 'assets/images-drive';
const ARCHIVO_SALIDA = 'js/data/productos-drive.js';

// ---------- Utilidades ----------

function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Interpreta el nombre del archivo según la convención documentada:
 *   "Argentina 1986 - polera.jpg" -> { nombre: 'Argentina 1986', familia: 'polera' }
 * Si no trae sufijo de prenda, se asume polera.
 */
function parsearNombreArchivo(titulo) {
  const sinExtension = titulo.replace(/\.[^.]+$/, '').trim();
  const match = sinExtension.match(/^(.*?)\s*-\s*(polera|polo)$/i);
  if (match) {
    return { nombre: match[1].trim(), familia: match[2].toLowerCase() };
  }
  return { nombre: sinExtension, familia: 'polera' };
}

function autenticar() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      'Falta GOOGLE_SERVICE_ACCOUNT_JSON. Ver docs/sincronizacion-drive.md, sección 4.'
    );
  }
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}

async function buscarCarpeta(drive, nombre, parentId = null) {
  const filtros = [
    `name = '${nombre.replace(/'/g, "\\'")}'`,
    "mimeType = 'application/vnd.google-apps.folder'",
    'trashed = false',
  ];
  if (parentId) filtros.push(`'${parentId}' in parents`);

  const res = await drive.files.list({
    q: filtros.join(' and '),
    fields: 'files(id, name)',
    pageSize: 1,
  });
  return res.data.files?.[0] || null;
}

async function listarImagenes(drive, carpetaId) {
  const imagenes = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${carpetaId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'nextPageToken, files(id, name, modifiedTime)',
      pageSize: 100,
      pageToken,
    });
    imagenes.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return imagenes;
}

async function descargarImagen(drive, fileId, destino) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  await fs.mkdir(path.dirname(destino), { recursive: true });
  await fs.writeFile(destino, Buffer.from(res.data));
}

// ---------- Proceso principal ----------

async function main() {
  const auth = autenticar();
  const drive = google.drive({ version: 'v3', auth });

  const raiz = await buscarCarpeta(drive, CARPETA_RAIZ);
  if (!raiz) {
    throw new Error(
      `No se encontró la carpeta "${CARPETA_RAIZ}" en Drive. ` +
        'Verificá que esté compartida con el email de la cuenta de servicio.'
    );
  }
  console.log(`Carpeta raíz encontrada: ${raiz.id}`);

  const productos = [];
  let contadorCodigo = 100; // los productos de Drive arrancan en DC-100 para no chocar con los manuales

  for (const [slugCategoria, nombreCarpeta] of Object.entries(CATEGORIAS_DRIVE)) {
    const carpeta = await buscarCarpeta(drive, nombreCarpeta, raiz.id);
    if (!carpeta) {
      console.warn(`⚠️  Carpeta "${nombreCarpeta}" no existe en Drive — se omite.`);
      continue;
    }

    const imagenes = await listarImagenes(drive, carpeta.id);
    console.log(`${nombreCarpeta}: ${imagenes.length} imagen(es)`);

    for (const img of imagenes) {
      const { nombre, familia } = parsearNombreArchivo(img.name);
      const slug = slugify(nombre);
      const extension = path.extname(img.name) || '.jpg';
      const rutaRelativa = `${DIR_IMAGENES}/${slugCategoria}/${slug}${extension}`;

      // Solo descarga si el archivo no existe todavía.
      try {
        await fs.access(rutaRelativa);
      } catch {
        await descargarImagen(drive, img.id, rutaRelativa);
        console.log(`  ↓ ${rutaRelativa}`);
      }

      contadorCodigo += 1;
      productos.push({
        code: `DC-${contadorCodigo}`,
        slug,
        name: nombre,
        shortDescription: `${nombre} — estampado DTF personalizable en color y talla.`,
        category: slugCategoria,
        garmentType: familia === 'polo' ? 'polo' : 'hoodie',
        garmentFamily: familia,
        sizes: TALLAS[familia],
        images: [rutaRelativa],
        tags: nombre.toLowerCase().split(/\s+/),
        featured: false,
        available: true,
        origenDrive: true,
      });
    }
  }

  const cabecera = `/**
 * GENERADO AUTOMÁTICAMENTE — no editar a mano.
 * Se regenera con: node scripts/sync-drive.mjs
 * Última sincronización: ${new Date().toISOString()}
 */
`;

  const contenido =
    cabecera +
    `const PRODUCTOS_DRIVE = ${JSON.stringify(productos, null, 2)};\n`;

  await fs.writeFile(ARCHIVO_SALIDA, contenido, 'utf8');
  console.log(`\n✅ ${productos.length} producto(s) escritos en ${ARCHIVO_SALIDA}`);
}

main().catch((err) => {
  console.error('❌ Error en la sincronización:', err.message);
  process.exit(1);
});
