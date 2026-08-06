# Dashboard unico de analitica

La web registra eventos silenciosos sin agregar pasos al cliente. El cliente toca
WhatsApp y se abre WhatsApp directo.

## Que eventos se envian

- `page_view`: visita de pagina.
- `product_view`: vista de una ficha de producto.
- `whatsapp_click`: click en un boton de WhatsApp.
- `catalog_search`: busquedas dentro del catalogo.
- `social_click`: click hacia Instagram o Facebook.

Cada `whatsapp_click` incluye:

- `whatsapp_code`: codigo de consulta que tambien viaja en el mensaje.
- `product_name`
- `product_code`
- `category`
- `button_text`
- `path`
- `url`
- `title`

Todos los eventos incluyen contexto tecnico del dispositivo:

- `device_type`: `desktop`, `mobile` o `tablet`.
- `browser`
- `browser_version`
- `os`
- `os_version`
- `screen_width` y `screen_height`
- `viewport_width` y `viewport_height`
- `device_pixel_ratio`
- `user_agent`
- `device_model`, cuando el navegador lo permite.
- `user_agent_brands`, cuando el navegador lo permite.

## Codigo de WhatsApp

Cada mensaje de WhatsApp agrega una linea asi:

```text
*Consulta:* DCW-20260806-0001-A7
```

Formato:

- `DCW`: Dream's Closet Web.
- `20260806`: fecha del click.
- `0001`: correlativo del navegador para ese dia.
- `A7`: sufijo corto para evitar choques entre visitantes.

Sin un servidor propio no hay correlativo global perfecto para todos los
visitantes. Este formato mantiene los codigos ordenables y faciles de ubicar en
el dashboard.

## Activar PostHog en Cloudflare Pages

1. Crear un proyecto en PostHog.
2. Copiar la `Project API Key`.
3. En Cloudflare Pages, abrir el proyecto y entrar a `Settings` -> `Environment variables`.
4. Crear estas variables:

```text
POSTHOG_PROJECT_TOKEN=phc_xxxxxxxxxxxxxxxxx
POSTHOG_HOST=https://us.i.posthog.com
```

5. Publicar la web nuevamente.

La web carga `/posthog-config`, que Cloudflare genera desde
`functions/posthog-config.js`. Asi el token no queda escrito dentro de
`js/config.js`.

## Dashboard recomendado

Crear un dashboard con estos bloques:

- Visitas por dia: evento `page_view`.
- Productos mas vistos: evento `product_view`, breakdown por `product_name`.
- Clicks a WhatsApp: evento `whatsapp_click`.
- Productos con mas consultas: `whatsapp_click`, breakdown por `product_name`.
- Conversion simple: funnel `page_view` -> `product_view` -> `whatsapp_click`.
- Busquedas frecuentes: evento `catalog_search`, breakdown por `query`.
- Canales sociales: evento `social_click`, breakdown por `network`.
- Dispositivos: cualquier evento, breakdown por `device_type`.
- Navegadores: cualquier evento, breakdown por `browser`.
- Sistemas operativos: cualquier evento, breakdown por `os`.
- Modelos detectados: cualquier evento, breakdown por `device_model`.

## Como usar el codigo

Cuando llegue un WhatsApp, buscar el codigo `DCW-...` en PostHog. Ahi se ve que
producto estaba viendo, desde que pagina llego y que accion hizo antes de
escribir.
