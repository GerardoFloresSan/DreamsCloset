# Publicar el sitio en Cloudflare Pages

El sitio es HTML, CSS y JS estáticos: no necesita compilarse ni tiene servidor
detrás. Cloudflare Pages sirve los archivos tal cual están en el repositorio.

---

## 1. Conectar el repositorio (una sola vez)

1. Entrar a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. **Create** → **Pages** → **Connect to Git**
3. Autorizar GitHub y elegir el repositorio `DreamsCloset`
4. En la pantalla de configuración:

   | Campo | Valor |
   |---|---|
   | Framework preset | **None** |
   | Build command | *(dejar vacío)* |
   | Build output directory | `/` |
   | Root directory | *(dejar vacío)* |

5. **Save and Deploy**

Queda publicado en `dreamscloset.pages.dev` (o el nombre que se elija).

A partir de ahí, **cada vez que se suba un cambio a la rama `main`, Cloudflare
publica solo**. No hay que volver a tocar el panel.

---

## 2. Dominio propio

Cuando esté comprado el dominio:

1. En el proyecto de Pages → **Custom domains** → **Set up a domain**
2. Escribir el dominio y seguir los pasos que indica Cloudflare
3. Si el dominio se compró fuera de Cloudflare, hay que apuntar los
   *nameservers* a los que Cloudflare indique (lo dice en pantalla)

El certificado HTTPS lo emite Cloudflare solo, sin costo ni configuración.

### Después de conectar el dominio, actualizar en el código

Hoy todo apunta a `dreamscloset.pe`, que es un ejemplo. Hay que reemplazarlo por
el dominio real en:

- `index.html` → etiqueta `<link rel="canonical">`
- `index.html` → bloque de datos estructurados (`url` e `image`)
- `index.html` → `og:image`
- `sitemap.xml` → todas las URLs (se regenera con el script de importación)
- `robots.txt` → línea `Sitemap:`

---

## 3. Cabeceras

El archivo `_headers` en la raíz ya configura caché y seguridad. Cloudflare lo
lee al publicar; no hay que configurar nada en el panel.

Resumen de lo que hace:

| Archivos | Caché | Por qué |
|---|---|---|
| `/assets/*` | 1 año | Las fotos no cambian de contenido ni de nombre |
| `/css/*`, `/js/*` | 1 día | Llevan `?v=N`, que se sube al publicar cambios |
| HTML | Sin caché | Es quien decide qué versión de CSS y JS cargar |

---

## 4. Al publicar un cambio de CSS o JS

Subir el número de versión en las etiquetas `?v=N` de `index.html` y
`producto.html`. Sin eso, quien ya visitó el sitio puede seguir viendo la
versión anterior hasta un día.

```bash
python -c "
import re
for a in ['index.html','producto.html']:
    s=open(a,encoding='utf-8').read()
    s=re.sub(r'\?v=\d+','?v=9',s)
    open(a,'w',encoding='utf-8').write(s)
"
```

(Cambiar `9` por el número siguiente.)

---

## 5. Límites del plan gratuito

Sobra de largo para este proyecto:

| | Límite | El sitio hoy |
|---|---|---|
| Ancho de banda | Ilimitado | — |
| Archivos por publicación | 20 000 | ~150 |
| Tamaño por archivo | 25 MB | La foto más pesada, ~200 KB |
| Publicaciones por mes | 500 | — |

---

## 6. Probar en la computadora antes de publicar

```bash
python _serve.py
```

Y abrir `http://localhost:5173`. Es solo para desarrollo: no usa las cabeceras
de `_headers` ni la red de Cloudflare, así que la velocidad real del sitio
publicado va a ser mejor que la que se ve ahí.
