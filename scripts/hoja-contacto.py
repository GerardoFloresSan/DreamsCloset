"""
Arma hojas de contacto: grillas de miniaturas con el nombre de archivo debajo,
para poder revisar decenas de fotos de una sola mirada.

    python scripts/hoja-contacto.py "Dreams Closet Catalogo/Ciudades" _revision/ciudades

Es una herramienta de trabajo, no forma parte del sitio publicado.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

MINIATURA = 210
ETIQUETA = 26
COLUMNAS = 6
POR_HOJA = 30
EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp"}


def construir(origen: Path, destino_base: Path) -> int:
    archivos = sorted(
        [f for f in origen.iterdir() if f.suffix.lower() in EXTENSIONES],
        key=lambda f: f.name.lower(),
    )
    if not archivos:
        print(f"Sin imágenes en {origen}")
        return 0

    destino_base.parent.mkdir(parents=True, exist_ok=True)
    celda_alto = MINIATURA + ETIQUETA
    hojas = 0

    for inicio in range(0, len(archivos), POR_HOJA):
        lote = archivos[inicio : inicio + POR_HOJA]
        filas = (len(lote) + COLUMNAS - 1) // COLUMNAS
        hoja = Image.new("RGB", (COLUMNAS * MINIATURA, filas * celda_alto), "white")
        dibujo = ImageDraw.Draw(hoja)

        for i, archivo in enumerate(lote):
            x = (i % COLUMNAS) * MINIATURA
            y = (i // COLUMNAS) * celda_alto
            try:
                with Image.open(archivo) as im:
                    im = im.convert("RGB")
                    im.thumbnail((MINIATURA, MINIATURA), Image.LANCZOS)
                    hoja.paste(im, (x + (MINIATURA - im.width) // 2, y))
            except Exception as e:  # archivo corrupto o formato raro
                dibujo.text((x + 6, y + 90), f"ERROR\n{e}"[:40], fill="red")

            nombre = archivo.name
            if len(nombre) > 30:
                nombre = nombre[:27] + "..."
            dibujo.text((x + 4, y + MINIATURA + 6), f"{inicio + i + 1}. {nombre}", fill="black")

        hojas += 1
        salida = destino_base.with_name(f"{destino_base.name}-{hojas}.jpg")
        hoja.save(salida, quality=72)
        print(f"{salida}  ({len(lote)} imágenes)")

    return hojas


if __name__ == "__main__":
    construir(Path(sys.argv[1]), Path(sys.argv[2]))
