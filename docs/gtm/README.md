# Etiquetado GA4 vía GTM — Grupo INCAP

El sitio empuja eventos al `dataLayer` desde el tema (ver
`themes/industrial-glue/src/utils/analytics.ts` y los `*Tracker.tsx`).
GTM (contenedor **GTM-K5C72GVM**) los escucha y los manda a **GA4
`G-ZQW400QHCZ`**. Acá quedan los tags/triggers/variables listos.

## Eventos que dispara el sitio

| Evento (dataLayer) | Cuándo | Parámetros |
|---|---|---|
| `whatsapp_click` | click en cualquier link de WhatsApp (flotante, CTAs de producto, navbar, footer) | `link_url`, `link_text`, `page_path` |
| `file_download` | click en cualquier `.pdf` o link con `download` (catálogo, ficha técnica) | `file_name`, `file_extension`, `link_url`, `page_path` |
| `view_item` | vista de página de producto | `ecommerce.items[]` (`item_id`, `item_name`, `item_brand`) |
| `view_item_list` | carga de página de categoría | `ecommerce.item_list_name`, `ecommerce.items[]` |
| `select_item` | click en un producto dentro de un listado de categoría | `ecommerce.item_list_name`, `ecommerce.items[]` |

> Cobertura v1 de ecommerce: **producto + categorías**. Buscador e
> `/industrias/*` quedan como follow-up (mismo patrón de tracker).

## Opción A — Importar el contenedor (rápido)

1. GTM → **Admin → Importar contenedor**.
2. Archivo: `incap-gtm-container.json` (este directorio).
3. Espacio de trabajo: **Existing → Default Workspace**.
4. Opción de import: **Merge → Rename conflicting tags/...** (NO "Overwrite").
   Así NO toca tu tag de configuración de GA4 ya existente; solo agrega los 5
   tags de evento, 5 triggers y 5 variables.
5. **Revisar** la vista previa del import (debe agregar, no borrar).
6. **Confirmar**, después **Vista previa (Preview)** para probar, y por último
   **Enviar → Publicar**.

> Nota: el JSON usa `measurementIdOverride = G-ZQW400QHCZ` en cada tag de
> evento, así no depende de tu tag de configuración. Si preferís que hereden
> del tag de config, podés borrar ese campo en cada tag tras importar.
> Si algún tag aparece con un campo en rojo (las versiones de GTM cambian
> nombres internos), usá la receta manual de abajo para ese tag puntual.

## Opción B — Receta manual (a prueba de balas)

### Variables (Data Layer Variables, versión 2)
Crear una por cada nombre: `link_url`, `link_text`, `file_name`,
`file_extension`, `page_path`. (Variables → Nueva → Variable de capa de datos.)

### Triggers (Eventos personalizados)
Uno por cada evento, con "Nombre del evento" exacto:
`whatsapp_click`, `file_download`, `view_item`, `view_item_list`, `select_item`.
(Activadores → Nuevo → Evento personalizado.)

### Tags (Google Analytics: evento de GA4)
Para los 5, "ID de medición" = `G-ZQW400QHCZ` (o seleccioná tu tag de
configuración):

- **GA4 - whatsapp_click** · evento `whatsapp_click` · params: `link_url={{DLV - link_url}}`,
  `link_text={{DLV - link_text}}`, `page_path={{DLV - page_path}}` · trigger `CE - whatsapp_click`.
- **GA4 - file_download** · evento `file_download` · params: `file_name`, `file_extension`,
  `link_url` · trigger `CE - file_download`.
- **GA4 - view_item / view_item_list / select_item** · evento homónimo ·
  marcar **"Enviar datos de comercio electrónico" = Verdadero**, origen **Capa de datos** ·
  trigger homónimo.

## Marcar conversiones (eventos clave) en GA4
GA4 → **Administrar → Eventos clave** → marcar como clave:
`whatsapp_click` (el lead principal) y opcionalmente `file_download`.
(Aparecen en la lista recién después de recibir el primer hit de cada uno.)

## Verificar
- **GTM Preview / Tag Assistant**: navegá el sitio y confirmá que cada tag
  dispara en su interacción.
- **GA4 → Tiempo real → Recuento de eventos**: deben aparecer los eventos al
  hacer las acciones.
