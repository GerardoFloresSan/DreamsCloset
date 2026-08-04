"""
Servidor local para desarrollo.

    python _serve.py

Usa ThreadingHTTPServer (no el TCPServer de un solo hilo) porque con una sola
conexión a la vez el servidor se cortaba cada vez que el navegador pedía varias
imágenes juntas.

También registra el tipo MIME de .webp, que Python no trae por defecto y hacía
que las imágenes se descargaran en vez de mostrarse.
"""

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PUERTO = int(os.environ.get("PORT", 5173))


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp",
    }

    def end_headers(self):
        # Sin caché: en desarrollo siempre queremos ver el último cambio.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, *args):
        pass  # silencia el log por request


if __name__ == "__main__":
    with ThreadingHTTPServer(("", PUERTO), Handler) as httpd:
        print(f"Sirviendo en http://localhost:{PUERTO}")
        httpd.serve_forever()
