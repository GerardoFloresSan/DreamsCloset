"""
Genera versiones reducidas de las imágenes de producto para el catálogo.

    python scripts/generar-miniaturas.py

Las tarjetas del catálogo se ven a ~340px de ancho, pero hasta ahora se servían
imágenes de 1100px. Este script crea una copia de 700px (suficiente para
pantallas retina) junto a la original, con el sufijo "-card".

    argentinaPolo.webp        1100px  -> ficha de producto y zoom
    argentinaPolo-card.webp    700px  -> tarjetas del catálogo

Es idempotente: si la miniatura ya existe y es más nueva que el original, la saltea.
"""

import os
from pathlib import Path

from PIL import Image

ANCHO_CARD = 700
CALIDAD = 78
BASE = Path("assets/images-optimizadas")


def generar(origen: Path) -> tuple[int, int]:
    """Devuelve (bytes_antes, bytes_despues) de la miniatura generada."""
    destino = origen.with_name(f"{origen.stem}-card{origen.suffix}")

    if destino.exists() and destino.stat().st_mtime >= origen.stat().st_mtime:
        return 0, 0

    with Image.open(origen) as im:
        if im.width <= ANCHO_CARD:
            return 0, 0  # ya es chica, no tiene sentido duplicarla

        alto = round(im.height * ANCHO_CARD / im.width)
        im.resize((ANCHO_CARD, alto), Image.LANCZOS).save(
            destino, "WEBP", quality=CALIDAD
        )

    return origen.stat().st_size, destino.stat().st_size


def main() -> None:
    if not BASE.exists():
        raise SystemExit(f"No existe {BASE}. Correr desde la raíz del proyecto.")

    total_antes = total_despues = 0
    generadas = 0

    for origen in sorted(BASE.rglob("*.webp")):
        if origen.stem.endswith("-card"):
            continue

        antes, despues = generar(origen)
        if not antes:
            continue

        generadas += 1
        total_antes += antes
        total_despues += despues
        print(f"{origen.name}: {antes // 1024} KB -> {despues // 1024} KB")

    if not generadas:
        print("Todas las miniaturas ya estaban al día.")
        return

    ahorro = 100 - (total_despues * 100 // total_antes)
    print(
        f"\n{generadas} miniatura(s): "
        f"{total_antes // 1024} KB -> {total_despues // 1024} KB ({ahorro}% menos)"
    )


if __name__ == "__main__":
    main()
