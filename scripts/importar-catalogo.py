"""
Importa la selección curada del catálogo de Drive al sitio.

    python scripts/importar-catalogo.py

Por cada imagen elegida en scripts/seleccion.py:
  1. La recorta al cuadrado si hace falta y genera dos versiones WebP
     (1100 px para la ficha, 700 px para la tarjeta del catálogo).
  2. La guarda con un nombre limpio derivado del producto.
  3. Escribe js/data/productos-catalogo.js con los productos listos.

No toca la carpeta de Drive ni js/data/productos.js.
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from seleccion import APOYO, CARPETAS, CIUDADES, EQUIPOS, MUNDIALES, VARIOS  # noqa: E402

ORIGEN = Path('Dreams Closet Catalogo')
DESTINO = Path('assets/catalogo')
SALIDA_DATOS = Path('js/data/productos-catalogo.js')

ANCHO_FICHA = 1100
ANCHO_CARD = 700
CALIDAD = 80

CATEGORIA_DE = {
    id(CIUDADES): 'ciudades',
    id(MUNDIALES): 'mundiales',
    id(EQUIPOS): 'equipos-futbol',
    id(VARIOS): 'varios',
}


def slugify(texto: str) -> str:
    texto = unicodedata.normalize('NFD', texto)
    texto = ''.join(c for c in texto if unicodedata.category(c) != 'Mn')
    texto = re.sub(r'[^a-zA-Z0-9]+', '-', texto).strip('-').lower()
    return texto


def procesar(origen: Path, slug: str, subcarpeta: str) -> dict | None:
    """Genera las dos versiones WebP. Devuelve dimensiones o None si falla."""
    carpeta = DESTINO / subcarpeta
    carpeta.mkdir(parents=True, exist_ok=True)

    try:
        with Image.open(origen) as im:
            im = im.convert('RGB')

            ficha = im.copy()
            if ficha.width > ANCHO_FICHA:
                alto = round(ficha.height * ANCHO_FICHA / ficha.width)
                ficha = ficha.resize((ANCHO_FICHA, alto), Image.LANCZOS)
            ficha.save(carpeta / f'{slug}.webp', 'WEBP', quality=CALIDAD)

            card = im.copy()
            if card.width > ANCHO_CARD:
                alto = round(card.height * ANCHO_CARD / card.width)
                card = card.resize((ANCHO_CARD, alto), Image.LANCZOS)
            card.save(carpeta / f'{slug}-card.webp', 'WEBP', quality=CALIDAD)

            return {'w': ficha.width, 'h': ficha.height}
    except Exception as e:
        print(f'  AVISO  {origen.name}: {e}')
        return None


def main() -> None:
    if not ORIGEN.exists():
        raise SystemExit(f'No existe "{ORIGEN}". Correr desde la raíz del proyecto.')

    productos = []
    codigo = 100
    faltantes = []

    for carpeta, grupos in CARPETAS.items():
        for grupo in grupos:
            categoria = CATEGORIA_DE[id(grupo)]
            for archivo, nombre in grupo.items():
                ruta = ORIGEN / carpeta / archivo
                if not ruta.exists():
                    faltantes.append(f'{carpeta}/{archivo}')
                    continue

                slug = slugify(nombre)
                dim = procesar(ruta, slug, categoria)
                if not dim:
                    continue

                codigo += 1
                productos.append({
                    'code': f'DC-{codigo}',
                    'slug': slug,
                    'name': nombre,
                    'category': categoria,
                    'images': [f'{DESTINO.as_posix()}/{categoria}/{slug}.webp'],
                    'imageWidth': dim['w'],
                    'imageHeight': dim['h'],
                })
                print(f'  OK {nombre}')

    # Imágenes de apoyo (no son producto, se usan en secciones del sitio).
    for archivo, nombre in APOYO.items():
        ruta = ORIGEN / 'Ciudades' / archivo
        if ruta.exists():
            procesar(ruta, nombre, 'apoyo')
            print(f'  OK [apoyo] {nombre}')

    SALIDA_DATOS.write_text(
        '/**\n'
        ' * GENERADO por scripts/importar-catalogo.py — no editar a mano.\n'
        ' * La selección de fotos se define en scripts/seleccion.py.\n'
        ' */\n'
        f'const PRODUCTOS_CATALOGO = {json.dumps(productos, ensure_ascii=False, indent=2)};\n',
        encoding='utf-8',
    )

    print(f'\n{len(productos)} productos -> {SALIDA_DATOS}')
    if faltantes:
        print(f'\nAVISO  No encontrados ({len(faltantes)}):')
        for f in faltantes:
            print(f'   {f}')


if __name__ == '__main__':
    main()
