# Blog INCAP — Guía de gestión

Arquitectura de contenido del blog de Grupo INCAP desde el refactor del 2026-06-28.

## Dónde se edita

Todo el blog se gestiona desde **una sola pantalla** en el admin:

```
/admin/blog-admin
```

No se usa Admin → CMS → Pages para el cuerpo de los artículos.

---

## Campos de cada artículo

| Campo | Descripción |
|-------|-------------|
| **Título** | Texto completo del artículo. Genera el slug automáticamente. |
| **Slug** | URL del artículo (`/blog/<slug>`). Auto-derivado del título; editable. Solo letras minúsculas, dígitos y guiones. |
| **Excerpt** | Resumen de ~30 palabras. Aparece en las cards del listado y como meta description. |
| **Fecha** | Fecha de publicación (`YYYY-MM-DD`). Formato visible: "15 de junio de 2026". |
| **Tags** | Etiquetas separadas por coma. Se usan para el filtro en `/blog`. |
| **Destacado** | Checkbox. El artículo destacado aparece resaltado arriba del listado. Solo uno a la vez tiene efecto visual. |
| **Portada** | Imagen de cabecera. Ver sección "Portadas" abajo. |
| **Cuerpo** | Texto en Markdown. Ver sección "Markdown" abajo. |

---

## Portadas

Las portadas se suben desde el formulario (botón "Subir imagen"):

- Formatos aceptados: JPEG, PNG, WebP, GIF (máximo 5 MB antes de conversión).
- El servidor convierte automáticamente a **WebP a 75% de calidad, máximo 1200px de ancho**.
- Las imágenes quedan en el volumen Railway:
  - **Disco**: `/app/media/blog/<nombre>-<timestamp>.webp`
  - **URL pública**: `/assets/blog/<nombre>-<timestamp>.webp`
- También podés pegar una URL directamente en el campo de texto (ej. `/images/blog/mi-imagen.webp` para imágenes subidas manualmente al volumen).

---

## Cuerpo en Markdown

El cuerpo del artículo se escribe en **Markdown** en el textarea del formulario. Hay un preview en tiempo real activable con "Mostrar preview".

### Referencia rápida de Markdown

```markdown
## Subtítulo de sección

Un párrafo de texto normal. Las líneas vacías separan párrafos.

**texto en negrita**

*texto en itálica*

> Una cita destacada que aparece con borde azul. — Autor

- Ítem 1 de lista
- Ítem 2 de lista
- Ítem 3 de lista

1. Ítem numerado
2. Otro ítem numerado

[texto del enlace](https://www.grupoincap.com.co)

`código inline`
```

### Mini-barra de herramientas

Los botones de la barra insertan la sintaxis en la posición del cursor:

| Botón | Inserta |
|-------|---------|
| **H2** | `## ` al inicio de línea |
| **H3** | `### ` al inicio de línea |
| **B** | `**texto**` (negrita) |
| **I** | `*texto*` (itálica) |
| **- Lista** | `- ` al inicio de línea |
| **> Cita** | `> ` al inicio de línea |
| **Link** | `[texto](https://)` |

### Seguridad

El renderer escapa HTML antes de aplicar Markdown. No es posible inyectar HTML arbitrario. Los URLs en links solo aceptan `http://`, `https://`, rutas relativas (`/`), anclas (`#`) y `mailto:`.

---

## Dónde se almacena

Todo el contenido del blog (lista de artículos + cuerpos) vive en el setting `blog_index` de la tabla `setting` de PostgreSQL.

- Se guarda mediante el endpoint `POST /api/blog-index`.
- Se lee mediante el campo GraphQL `setting { blogIndex }` en los componentes React.

---

## Flujo completo para publicar un artículo nuevo

1. Ir a `/admin/blog-admin`.
2. Clic en **+ Nuevo artículo**.
3. Escribir el **Título** (el slug se genera solo).
4. Opcionalmente, acortar o ajustar el **Slug** (se fija al editarlo).
5. Subir la **Portada** con "Subir imagen" (o pegar URL si ya está en el servidor).
6. Escribir el **Excerpt** (resumen breve).
7. Escribir el **Cuerpo** en Markdown. Usar "Mostrar preview" para verificar el resultado.
8. Elegir la **Fecha**, agregar **Tags** y marcar **Destacado** si corresponde.
9. Clic en **Guardar artículo**.
10. Usar "Ver →" en la tabla para verificar la publicación en el front.

---

## Destacar un artículo

Solo puede haber un artículo destacado visible en el listado a la vez (el componente toma el primero que tenga `featured: true`). Para cambiar el destacado:

1. Editá el artículo que está destacado y desmarcá "Artículo destacado" → Guardar.
2. Editá el nuevo artículo que querés destacar y marcá "Artículo destacado" → Guardar.

---

## Borrar un artículo

Botón **Borrar** en la tabla. Pide confirmación. El artículo se elimina del setting y deja de aparecer en el front inmediatamente.

---

## Seed inicial (primera vez en staging/prod)

```bash
DATABASE_URL="$DATABASE_URL" PGSSL_INSECURE=1 node scripts/seed-blog.cjs
```

Esto upsertea el `blog_index` con los 2 artículos iniciales (Interzum 2026 y calzado) con su cuerpo Markdown completo. Idempotente.

Para prueba sin persistir:
```bash
DRY_RUN=1 DATABASE_URL="$DATABASE_URL" PGSSL_INSECURE=1 node scripts/seed-blog.cjs
```
