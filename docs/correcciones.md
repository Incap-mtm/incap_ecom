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
| F2.2 | Crear atributos ficha_tecnica_url y preguntas_frecuentes en DB | ✅ Hecho — migración automática en deploy (commit c4229a6) |

### FASE 3 — Migración al CMS de EverShop
| # | Tarea | Estado |
|---|-------|--------|
| F3.1 | Utility family.ts centralizada (eliminar 3 copias duplicadas de getFamily()) | ✅ Hecho (commit 8a2e8d3) |
| F3.2 | WhatsApp + contacto → EverShop Settings (Hero, Footer, WhatsAppCTA, ConversionFooter) | ✅ Hecho (commit 8a2e8d3) |
| F3.3 | Quiénes Somos → página custom /quienes-somos con stats, marcas, misión/visión | ✅ Hecho (commit ddc76b3) |
| F3.4 | 4 Páginas de Políticas → CMS Pages nativas | ⏳ Pendiente — bloqueado por contenido legal |
| F3.5 | Distribuidores → tabla DB + admin CRUD | ⏳ Pendiente — mapa integrado con JSON+Nominatim; DB CRUD para autogestión desde admin aún no |

---


🟢 BAJA COMPLEJIDAD
Cambios de contenido, texto, assets y ajustes visuales puntuales. Sin lógica nueva.
Tipografía y Branding

 1. Aplicar tipografía Sora Titulares. H1, H2, H3 en todo el sitio. ✅ Hecho 2026-05-22
 2. Centrar el logo en header horizontalmente y aumentar tamaño un 10% ✅ Hecho 2026-05-22
 3. En el footer el logo debe ser completamente Blanco (actualmente tiene una capa css que cambia la C a verde) ✅ Hecho 2026-05-22
 4. Agregar icono de Calzado en card de industria en Home (themes\industrial-glue\public\images\icons\Icono_Calzado.png) ✅ Hecho — IndustriesSection usa Icono_Calzado.png en ribbon de la card Calzado

Páginas del sitio

1.  Agregar página "Quiénes Somos" con el copy provisto: quienes_somos.md ✅ Hecho — página /quienes-somos con stats, marcas, misión/visión y pilares (ver F3.3)
2. En el home agregar sección de "soluciones de pegado" ✅ Hecho — componente SolucionesPegado.tsx, sortOrder 12 (después de HistorySection)
3.  Actualizar foto del agente en el chat con: theme/public/images/icons/imagen_chatflotante.png ✅ Hecho — TechnicalAdvisor.tsx usa imagen-chatflotante.png
4. Verificar y corregir link de WhatsApp del chat: debe estar en todos los botones de contacto y en el botón en el header. ✅ Hecho — número 573002171521 desde EverShop Settings (ver F3.2)
https://api.whatsapp.com/send?phone=+573002171521&text=Quiero%20m%C3%A1s%20informaci%C3%B3n
5. Agregar página "Fabricantes" en Header ✅ Hecho — página custom /fabricantes con GraphQL (filtra por presentación en galones), link en navbar desktop y mobile


Rediseño Footer ✅ Hecho

 Rediseñar Footer completo con 4 columnas — IMPLEMENTADO, pendiente solo URLs de redes sociales del cliente

Col 1: Logo INCAP blanco + íconos de redes sociales ✅ estructura hecha — Instagram/Facebook con href="#" hasta que cliente provea URLs
Col 2: Links Menú principal (Inicio, Quiénes somos, Fabricantes, Industrias, Blog, Contacto) ✅
Col 3: Links por industria (Maderas y Muebles, Colchones y Espumas, Calzado y Marroquinería, Hogar y Multiusos) ✅
Col 4: Dirección + teléfono → desde Settings storeAddress + storePhoneNumber ✅
Barra inferior: Copyright © Grupo INCAP · Dev: MTM Marca tu Marca · A:BRA · 🇨🇴 Hecho en Colombia ✅
   → Pendiente: agregar links Términos y Condiciones cuando estén disponibles



Agregar secciones de Políticas (contenido a redactar o proveer) → VÍA CMS PAGES (ver F3.4)

 Crear página: Política de Devoluciones — ⏳ Bloqueado por contenido
 Crear página: Política de Compras — ⏳ Bloqueado por contenido
 Crear página: Política de Pagos — ⏳ Bloqueado por contenido
 Crear página: Política de Garantías — ⏳ Bloqueado por contenido


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
    1. Quitar temporalmente Cantidad, Precio y add to cart ✅ Hecho — oculto via CSS `#productForm { display: none }` en Head.tsx
    2. Mover la Descripción a Debajo del Título ✅ Hecho — ProductDescription en sortOrder 3 (después de ProductHeaderInfo sortOrder 1); elementos nativos ocultos via CSS
    3. Agregar un botón de "Descargar Ficha Técnica" ✅ Hecho — modal con formulario nombre/email/teléfono, API /ficha-lead con rate limit y notificación Resend opcional; aparece solo si ficha_tecnica_url está asignado en admin. Pendiente: asignar PDFs a productos y configurar RESEND_API_KEY en Railway
4. Integrar página de distribuidores con Google Maps ✅ Hecho — mapa Google Maps JS API con pines por ciudad, panel lateral con búsqueda y filtros; coordenadas geocodificadas con Nominatim (28 exactas, 53 por ciudad)


Menú de Navegación ✅ Hecho

 Actualizar estructura del menú principal:

Quiénes Somos ✅ — link en navbar desktop y mobile, página /quienes-somos activa
Fabricantes ✅ — link en navbar desktop y mobile, página custom /fabricantes activa
Industria ✅ — mega-menú con familias dinámicas por categoría
Distribuidores ✅ — link en navbar desktop y mobile, página /distribuidores activa
Catálogo ✅ — link /catalog en navbar y footer
Blog ⏳ BLOQUEADO — link apunta a /blog pero WordPress pendiente de crear



Crear Link a Blog ( esto será un wordpress) → URL desde Setting store_blog_url ⏳ BLOQUEADO: WordPress pendiente de crear



 Agregar botones CTA al final de "Industrias que servimos" que redirijan a cada industria individual ✅ Hecho — fila de pills por industria + botón "VER SOLUCIONES ESPECIALIZADAS" en cada card


🔴 ALTA COMPLEJIDAD
Requiere integración de APIs externas, lógica de filtrado/búsqueda o arquitectura de datos.
Catálogo con Filtros

DECISIÓN ARQUITECTURAL: Migrar al sistema nativo de variantes de EverShop ANTES de implementar filtros.
Script de migración sobre 322 productos: crea productos padre + vincula variantes de Tamaño.

1 Agrupar Productos por variantes: Las variantes serán Tamaño y Color ✅ Hecho (2026-05-25)
    Convención nombres: [Nombre completo] - [Tamaño] (ej: "Maxón Blanco - 4.5 Gal"). "Blanco" es parte del nombre.
    Familias = productos con mismo nombre base (izquierda del " - "). Ej: todos los "Maxón Blanco" = 1 familia.
    Implementado:
      - 322 productos migrados: 69 variant_groups, 36 attribute_options de tamaño
      - SizeSelector en ficha de producto: chips de tamaños por familia, tamaño actual resaltado
      - IndustryPage agrupa por familia: una card por familia con chips de presentación
      - scripts/migrate-variantes.mjs: incremental — agrega nuevas variantes a familias ya migradas

    BACKLOG — Administración de variantes desde el admin (mejora posterior):
      Problema: al crear un producto nuevo desde el admin, la agrupación en /industrias/* funciona
      automáticamente (solo requiere nombre correcto), pero el SizeSelector en la ficha de producto
      NO aparece hasta que se ejecute el script de migración.
      Flujo actual: Admin crea producto → ejecutar `node scripts/migrate-variantes.mjs` → SizeSelector activo.
      Mejora propuesta: botón en el admin ("Sincronizar variantes") que dispare el script via API REST,
      eliminando la necesidad de acceso técnico al servidor para cada nuevo producto.
      Complejidad: media. Requiere endpoint API protegido (solo admin) que ejecute el script y retorne log.

2. En la industria Calzados y Marroquinería: Se debe crear las categorías ⏳ Pendiente
    Adhesivos → variante de tamaños
    Tintas → variante de colores + tamaño (No visible en el front por el momento, si en DB)
    Cordones (No visible en el front por el momento, si en DB)
    Contrafuertes (No visible en el front por el momento, si en DB)
    Hilos (No visible en el front por el momento, si en DB)
    Suelas(No visible en el front por el momento, si en DB)


3 Crear un Buscador General, este será una barra debajo del header: ⏳ Pendiente
    Busca por nombre, atributo o uso

4 Distribuidores — Integración Google Maps ✅ Hecho — ver Media complejidad ítem 4


⚠️ PENDIENTES / BLOQUEADOS
Ítems que no pueden avanzar sin insumo del cliente.

| Ítem | Bloqueado por |
|------|--------------|
| Botones catálogo/nuevos productos (header) | Catálogo digital PDF no finalizado |
| Catálogo completo con filtros | Requiere migración variantes EverShop primero |
| Páginas de Políticas | Falta contenido / redacción legal |
| Redes sociales (Footer Col 1) | Falta URLs de perfiles oficiales del cliente |
| Blog link (Navbar) | WordPress pendiente de crear |
| Ficha Técnica — asignar PDFs a productos | Modal y API ✅ listos; cliente debe subir PDFs y asignar `ficha_tecnica_url` en admin → Productos |
| Ficha Técnica — email de notificación | Configurar `RESEND_API_KEY` en Railway variables de entorno |
