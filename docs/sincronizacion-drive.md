# Sincronización automática con Google Drive

> Pedido de Manuel (documento "DC - Pagina.docx"):
> *"Yo pueda añadir o quitar imágenes y desde la página los lea y los muestre
> actualizado, no tanto en línea, pero quizás al final del día o cada cierto tiempo."*

Este documento explica **qué se puede hacer, cómo, y qué hace falta** para lograrlo.

---

## 1. El obstáculo principal (leer antes que nada)

Una foto en Drive es **solo una imagen**. No trae adentro el nombre del producto,
ni el precio, ni la descripción, ni el código.

Si el archivo se llama `IMG_20240914_183045.jpg`, la web no tiene forma de saber
que eso es "Hoodie Argentina, DC-001, S/ 65".

Esto parte la solución en dos casos muy distintos:

| Caso | ¿Se puede automatizar 100%? | Por qué |
|---|---|---|
| **Galería de fotos** (Trabajos terminados, Varios) | ✅ Sí | Solo se necesita la imagen. No hace falta nombre ni precio. |
| **Productos del catálogo** (Mundiales, Ciudades, Equipos) | ⚠️ Parcial | Necesita nombre, código y precio, que la foto no tiene. |

### Solución para el caso parcial: nombre de archivo con formato

Si Manuel nombra los archivos siguiendo un formato, el script puede leer los datos
del propio nombre:

```
Argentina 1986 - polera.jpg
      ↓            ↓
   nombre       tipo de prenda (define el precio)
```

Reglas propuestas:

- `Nombre del diseño - polera.jpg` → precio de polera (S/65 a S/95)
- `Nombre del diseño - polo.jpg` → precio de polo (S/40 a S/50)
- Si no dice `- polera` ni `- polo`, se asume **polera**.
- El código (DC-0XX) lo asigna el script solo, en orden.

Ejemplos válidos:
```
Alianza Lima - polera.jpg
Universitario retro - polo.jpg
Cusco.jpg                        ← se asume polera
```

---

## 2. Estructura de carpetas en Drive

Las carpetas tienen que llamarse **exactamente** así (ya están definidas en
`js/data/productos.js`, campo `carpetaDrive`):

```
Dreams Closet 2024/
├── Mundiales/
├── Ciudades/
├── Equipos de futbol/
├── Reencuentros/
├── Trabajos terminados/
└── Varios/
```

⚠️ Hoy las fotos están sueltas en la raíz y en carpetas viejas
("Poleras", "Polos", "Colores de poleras"). **Hay que reorganizarlas**
en estas 6 carpetas antes de que la sincronización sirva de algo.

---

## 3. Arquitectura recomendada

**GitHub Actions + Google Service Account.** Gratis, sin servidor propio,
y aprovecha el repositorio que ya existe.

```
                  (todos los días a las 3am)
                             │
                             ▼
   Drive  ──►  GitHub Action  ──►  genera productos.js  ──►  commit
                                                               │
                                                               ▼
                                                    Netlify redespliega solo
                                                               │
                                                               ▼
                                                       Web actualizada
```

### Por qué NO se puede hacer directo desde el navegador

Leer Drive desde el JavaScript de la página exigiría poner la clave de acceso
de Google dentro del código, visible para cualquiera que abra el sitio.
Eso permitiría a un tercero usar (o abusar) de la cuenta de Drive.
**No es una opción.**

---

## 4. Qué hace falta para activarlo

Esto **no lo puedo generar yo solo** — requiere crear cuentas y claves con el
usuario de Manuel/Gerardo:

1. **Proyecto en Google Cloud** (gratis)
   - console.cloud.google.com → crear proyecto
   - Habilitar "Google Drive API"

2. **Cuenta de servicio** (service account)
   - Crear cuenta de servicio → descargar el archivo JSON de credenciales
   - Compartir la carpeta "Dreams Closet 2024" de Drive **con el email de esa
     cuenta de servicio** (aparece dentro del JSON, campo `client_email`)

3. **Guardar la clave en GitHub**
   - Repositorio → Settings → Secrets and variables → Actions
   - Nuevo secret llamado `GOOGLE_SERVICE_ACCOUNT_JSON`
   - Pegar ahí el contenido completo del JSON

4. **Reorganizar las fotos en Drive** según la sección 2.

Con esos 4 pasos hechos, el script de `scripts/sync-drive.mjs` queda funcionando.

---

## 5. Limitaciones honestas

- **Las fotos deben ser del producto ya personalizado.** Las que hay hoy en la
  carpeta "Poleras" son prendas en blanco de otras marcas (se ven logos de
  Champion y Diesel). Publicarlas daría a entender que Dream's Closet vende esas
  marcas. No se pueden usar.
- **La sincronización es de una vía:** Drive → web. Borrar una foto en Drive la
  saca de la web; no funciona al revés.
- **Retardo de hasta 24 h** (o el intervalo que se configure). No es instantáneo.
- **Descripciones y tags** no se pueden deducir de una foto. Los productos
  sincronizados quedan con una descripción genérica hasta que alguien la escriba
  a mano en `productos.js`.

---

## 6. Alternativa más simple (si lo de arriba es mucho)

Si armar las credenciales de Google resulta complicado, hay un camino intermedio
que cubre el 80% del beneficio con 10% del trabajo:

**Gerardo agrega los productos a mano en `js/data/productos.js`** (son ~6 líneas
por producto) y sube las fotos al repositorio. Toma unos 3 minutos por producto y
no necesita ninguna credencial ni configuración.

Conviene la sincronización automática recién cuando el catálogo crezca mucho
(50+ productos) o cuando Manuel quiera cargar productos él mismo sin depender
de nadie.
