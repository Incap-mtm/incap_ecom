Correcciones Sitio Web — Grupo INCAP

Organizado por grado de complejidad: Baja → Media → Alta


---
## DECISIONES ARQUITECTURALES (2026-05-22)

Antes de implementar, se realizó auditoría técnica completa y se establecieron las siguientes decisiones que aplican a TODO el trabajo de aquí en adelante:

### Arquitectura de contenido (ver CLAUDE.md para detalle)
- **EverShop Settings** → datos globales: WhatsApp, teléfono, dirección, email, redes sociales, blog URL
- **EverShop CMS Pages** → páginas de contenido: Quiénes Somos, Políticas, páginas informativas
- **EverShop Widgets** → secciones administrables del homepage: carrusel (widget simple_slider nativo), banners
- **Atributos de producto** → datos de producto: fichas técnicas, FAQ, características, GHS
- **Hardcodeado en componente** → solo contenido que NUNCA cambia (ej: Sección Soluciones de Pegado)
- **PROHIBIDO** hardcodear: teléfonos, WhatsApp, emails, direcciones, textos editables por el cliente

### Variantes de producto (Alta complejidad)
- Migrar al sistema nativo de variantes de EverShop (Opción B)
- Convención " - " en nombres se mantiene: [Nombre completo] - [Tamaño] (ej: "MAXON Blanco - 1 Galón")
- "Blanco" en MAXON Blanco es parte del nombre del producto, NO atributo de color
- Variante Tamaño → todos los productos
- Variante Color → solo Tintas (por ahora)
- Migración vía script automatizado sobre los 322 productos

### Footer y Navbar
- Datos de contacto en Footer vienen de EverShop Settings (no hardcodeados)
- URLs de redes sociales en Footer vienen de Settings custom (store_instagram, store_tiktok, etc.)
- URL del Blog en Navbar viene de Settings custom (store_blog_url)
- Fabricantes = página custom con GraphQL (filtra por atributo tamaño = Galón/Gal), NO CMS Page

---
## PLAN DE CORRECCIONES TÉCNICAS

### FASE 1 — Correcciones urgentes
| # | Tarea | Estado |
|---|-------|--------|
| F1.1 | Eliminar FAQ fallback genérico en ProductFAQ.tsx | ✅ Hecho 2026-05-22 |
| F1.2 | Fix config/default.json: language → es, currency → COP | ✅ Hecho 2026-05-22 |
| F1.3 | Eliminar componentes zombie (TrustSection, PresentacionSelector, Hello, FreeShippingMessage) | ✅ Hecho 2026-05-22 |
| F1.4 | Eliminar cron job everyMinute (solo hacía console.log) | ✅ Hecho 2026-05-22 |

### FASE 2 — Seguridad y atributos DB
| # | Tarea | Estado |
|---|-------|--------|
| F2.1 | Rate limiting endpoint /api/technical-advisor (10 req/min por IP) | ✅ Hecho |
| F2.2 | Crear atributos ficha_tecnica_url y preguntas_frecuentes en DB | ⏳ Pendiente |

### FASE 3 — Migración al CMS de EverShop
| # | Tarea | Estado |
|---|-------|--------|
| F3.1 | Utility family.ts centralizada (eliminar 3 copias duplicadas de getFamily()) | ⏳ Pendiente |
| F3.2 | WhatsApp + contacto → EverShop Settings (Hero, Footer, WhatsAppCTA, ConversionFooter) | ⏳ Pendiente |
| F3.3 | Quiénes Somos → CMS Page nativa (/quienes-somos) | ⏳ Pendiente |
| F3.4 | 4 Páginas de Políticas → CMS Pages nativas | ⏳ Pendiente |
| F3.5 | Distribuidores → tabla DB + admin CRUD (desbloquea cuando haya API Key + listado) | ⏳ Pendiente |

---


🟢 BAJA COMPLEJIDAD
Cambios de contenido, texto, assets y ajustes visuales puntuales. Sin lógica nueva.
Tipografía y Branding

 1. Aplicar tipografía Sora Titulares. H1, H2, H3 en todo el sitio. ✅ Hecho 2026-05-22
 2. Centrar el logo en header horizontalmente y aumentar tamaño un 10% ✅ Hecho 2026-05-22
 3. En el footer el logo debe ser completamente Blanco (actualmente tiene una capa css que cambia la C a verde) ✅ Hecho 2026-05-22
 4. Agregar icono de Calzado en card de industria en Home (themes\industrial-glue\public\images\icons\Icono_Calzado.png)

Páginas del sitio

1.  Agregar página "Quiénes Somos" con el copy provisto: quienes_somos.md → VÍA CMS PAGE NATIVA (ver F3.3)
2. En el home agregar sección de  "soluciones de pegado", estas soluciones explican los iconos en la carpeta theme/public/images/icons : Ubicación Despues de la sección de uniendo el legado de la industria y antes de los logos de clientes. ( En soluciones_pegado.md está la información y la indicacion de iconos) → HARDCODEADO en componente (contenido estático)
3.  Actualizar foto del agente en el chat con: theme/public/images/icons/imagen_chatflotante.png
4. Verificar y corregir link de WhatsApp del chat: debe estar en todos los botones de contacto y en el botón en el header. → VÍA SETTINGS (ver F3.2)
https://api.whatsapp.com/send?phone=+573002171521&text=Quiero%20m%C3%A1s%20informaci%C3%B3n
5. Agregar página "Fabricantes" en Header: El contenido son todos los productos donde su atributo su tamaño sea en Galones o Gal. → PÁGINA CUSTOM con GraphQL (como IndustryPage, NO CMS Page)


Rediseño Footer

 Rediseñar Footer completo con 4 columnas:
 NOTA: Col 1 redes sociales y Col 4 contacto vienen de EverShop Settings — implementar DESPUÉS de F3.2

Col 1: Logo INCAP blanco + íconos de redes sociales (Instagram, Tiktok, Linkedin, Facebook) → URLs desde Settings (store_instagram, store_tiktok, store_linkedin, store_facebook) — BLOQUEADO: falta URLs cliente
Col 2: Links Menú principal (Inicio, Quiénes somos, Fabricantes, Industrias, Blog, Contacto)
Col 3: Links por industria (Maderas y Muebles, Colchones y Espumas, Calzado y Marroquinería, Hogar y Multiusos)
Col 4: Dirección (Cra. 72 No. 62-27 Sur, Bogotá) + teléfono (+57 312 378 6835) → desde Settings storeAddress + storePhoneNumber
Barra inferior: Copyright © 2026 Grupo INCAP · Dev: MTM Marca tu marca · Política de privacidad · Términos y condiciones · Badge "Fabricado en Colombia"



Agregar secciones de  Políticas (contenido a redactar o proveer) → VÍA CMS PAGES (ver F3.4)

 Crear página: Política de Devoluciones
 Crear página: Política de Compras
 Crear página: Política de Pagos
 Crear página: Política de Garantías


🟡 MEDIA COMPLEJIDAD
Requiere lógica de UI, integración de assets externos o configuración de componentes.
Banners Rotativos (Home)

 1. Crear carrusel/slider de imágenes responsive. ✅ Hecho 2026-05-25 — implementado en Hero.tsx con 4 banners, fade cross, dots INCAP, responsive desktop/mobile via `<picture>`.
    → BACKLOG: Widget personalizado `hero_slider` para gestión desde Admin → CMS → Widgets.
      Justificación: banners se cambiarán ~mensualmente. El widget nativo (simple_slider) no soporta imagen desktop+mobile por slide.
      Diseño del widget custom:
        - Por slide: imagen desktop (URL/media picker), imagen mobile (URL/media picker), alt text
        - Slides reordenables, cantidad variable
        - Opción velocidad autoplay (ms)
        - Se registra en extensions/sample/bootstrap con registerWidget({ type: 'hero_slider', ... })
        - Componente admin: extensions/sample/src/components/admin/HeroSliderSetting.tsx
        - Componente front: themes/industrial-glue/src/pages/homepage/Hero.tsx lee datos del widget vía GraphQL
      Prioridad: media. Implementar cuando el cliente confirme que necesita autogestión.
 2. En le header a la derecha arriba, discretamente Agregar dos link de catálogo Pdf y Nuevos productos en Header lado Derecho - (descarga de PDF) → URLs de PDF desde Settings cuando estén disponibles. BLOQUEADO: catálogo digital no finalizado
 3. En el detalle de Producto: 
    1. Quitar temporalmente Cantidad, Precio y add to cart
    2. Mover la Descripción a Debajo del Título
    3. Agregar un boton de "Descargar Ficha Técnica" (Al hacer clic, abre un formulario con los cambos Nombre completo, Correo electrónico, Teléfono. Al completar descarga la Ficha Técica, el boton aparece si hay asignado una ficha técnica desde admin), Se envía a correo inicialmente, y el pdf si se almacena en app/media → REQUIERE F2.2 primero (atributo ficha_tecnica_url en DB)
4. Integrar página de distribuidores con Google Maps para la posición de pines en puntos exactos


Menú de Navegación

 Actualizar estructura del menú principal:

Quiénes Somos ( página nueva) → requiere F3.3
Fabricantes (nueva sección — página custom GraphQL)
Industria (mantener como está)
Distribuidores (requiere integración de mapa — ver Alta)
Catálogo (nueva sección con filtros — ver Alta)
Blog (nueva sección) → URL desde Settings (store_blog_url) — BLOQUEADO: WordPress pendiente de crear



Crear Link a Blog ( esto será un wordpress) → URL desde Setting store_blog_url




 Agregar botones CTA al final de "Industrias que servimos" que redirijan a cada industria individual


🔴 ALTA COMPLEJIDAD
Requiere integración de APIs externas, lógica de filtrado/búsqueda o arquitectura de datos.
Catálogo con Filtros

DECISIÓN ARQUITECTURAL: Migrar al sistema nativo de variantes de EverShop ANTES de implementar filtros.
Script de migración sobre 322 productos: crea productos padre + vincula variantes de Tamaño.

1 Agrupar Productos por variantes: Las variantes serán Tamaño y Color
    Convención nombres: [Nombre completo] - [Tamaño] (ej: "MAXON Blanco - 1 Galón"). "Blanco" es parte del nombre.
    Familias = productos con mismo nombre base (izquierda del " - "). Ej: todos los "MAXON Blanco" = 1 familia.
    Todos los nombres de familias y productos en MAYÚSCULAS

2. En la industria Calzados y Marroquinería: Se debe crear las categorías
    Adhesivos → variante de tamaños
    Tintas → variante de colores + tamaño (No visible en el front por el momento, si en DB)
    Cordones (No visible en el front por el momento, si en DB)
    Contrafuertes (No visible en el front por el momento, si en DB)
    Hilos (No visible en el front por el momento, si en DB)
    Suelas(No visible en el front por el momento, si en DB)


3 Crear un Buscador General, este será una barra debajo del header:  
    Busca por nombre, atributo o uso

4 Distribuidores — Integración Google Maps (pendiente de api) → ver F3.5


⚠️ PENDIENTES / BLOQUEADOS
Ítems que no pueden avanzar sin insumo del cliente.

| Ítem | Bloqueado por |
|------|--------------|
| Botones catálogo/nuevos productos (header) | Catálogo digital PDF no finalizado |
| Sección Distribuidores (mapa) | Falta API Key Google Maps + listado de distribuidores |
| Catálogo completo con filtros | Requiere migración variantes EverShop primero |
| Páginas de Políticas | Falta contenido / redacción legal |
| Redes sociales (Footer Col 1) | Falta URLs de perfiles oficiales |
| Blog link (Navbar) | WordPress pendiente de crear |
