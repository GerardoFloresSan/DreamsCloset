import http.server, socketserver, os
http.server.SimpleHTTPRequestHandler.extensions_map['.webp'] = 'image/webp'
port = int(os.environ.get('PORT', 5173))
with socketserver.TCPServer(("", port), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
