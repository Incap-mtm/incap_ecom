# INCAP Ecommerce — Contexto del proyecto

Evershop (Node.js/React) para Grupo INCAP (adhesivos industriales Colombia).
Deploy en Railway → **https://www.grupoincap.com.co**. Auto-deploy desde `origin` (`Incap-mtm/incap_ecom`).
Staging → **Railway servicio staging** — branch `staging` → verificar antes de llevar a `main`.

## Stack

- **Framework**: Evershop v2 (Next.js-like, GraphQL, PostgreSQL)
- **Theme**: `themes/industrial-glue/` — solo overridea frontStore
- **Extension**: `extensions/sample/` — overrides de admin + custom pages + APIs
- **DB**: PostgreSQL en Railway (interno). Conexión externa: `postgresql://postgres:jWUghBxUtgsWrmvxzocrtxTeblOlnprU@switchyard.proxy.rlwy.net:33426/railway`
- **Volumen Railway**: `/app/media/` (montado en container) → imágenes en `/app/media/products/`

## Estructura clave

```
themes/industrial-glue/src/pages/   # overrides frontStore (Head, Footer, Hero, Navbar, etc.)
extensions/sample/src/pages/
  admin/productEdit+productNew/     # override del selector de imágenes
  frontStore/industry/              # página custom /industrias/:id
extensions/sample/src/api/          # endpoints REST custom
extensions/sample/src/crons/        # cron jobs (desactivar si no se usan)
```

Tras editar `.tsx` hay que compilar con `npx tsc --project themes/industrial-glue/tsconfig.json --noEmitOnError false` (o `cd extensions/sample && npm run tsc`). **Commitear siempre src + dist.**

---

## Arquitectura de contenido — REGLA FUNDAMENTAL

**Nunca hardcodear contenido editable en componentes React.** Todo texto, imagen, número de contacto o dato que el cliente pueda querer cambiar debe venir de una de estas 4 fuentes, en este orden de preferencia:

### 1. EverShop Settings (datos globales del sitio)
Para: teléfono, WhatsApp, email, dirección, redes sociales, nombre del sitio.
- Se editan desde el admin: `Admin → Settings → Store information`
- Se leen en componentes via GraphQL:

```graphql
query {
  setting {
    storeName
    storePhoneNumber
    storeEmail
    storeAddress
    storeCity
  }
}
```

- Para settings custom (WhatsApp, Instagram, etc.) usar la tabla `setting` via API REST `POST /api/settings`.
- Leer settings custom: `getSetting('whatsapp_number', '573002171521')` desde el módulo `@evershop/evershop/src/modules/setting/services/setting.js`

### 2. EverShop CMS Pages (páginas de contenido)
Para: Quiénes Somos, Políticas, Fabricantes, páginas informativas.
- Se crean y editan desde: `Admin → CMS → Pages`
- Tienen URL key, nombre, contenido EditorJS, SEO metadata
- El router de EverShop las sirve automáticamente en `/{url_key}`
- Para páginas con diseño custom, crear una ruta en la extensión que lea el contenido via GraphQL:

```graphql
query {
  cmsPage(urlKey: "quienes-somos") {
    name
    content   # EditorJS JSON
    metaTitle
    metaDescription
  }
}
```

### 3. EverShop Widgets (secciones del homepage y páginas)
Para: carruseles, banners, bloques de texto, menús editables.
- Se crean desde: `Admin → CMS → Widgets`
- 4 tipos nativos: `text_block`, `banner`, `basic_menu`, `simple_slider`
- Se asignan a `area` (ej. `content`) y `route` (ej. `homepage`)
- Para secciones con diseño muy custom, crear un tipo de widget propio en la extensión

### 4. Atributos de producto (datos de producto)
Para: descripciones técnicas, fichas, FAQ, características, pictogramas GHS.
- Se editan desde: `Admin → Catalog → Products → [producto]`
- Atributos existentes: `usos`, `caracteristicas`, `modo_empleo`, `codigo_industrial`, `ghs_pictogramas`, `precauciones_h`, `consejos_prudencia_p`, `ficha_tecnica_url`, `preguntas_frecuentes`
- La descripción principal usa EditorJS nativo

---

## Reglas de desarrollo

### ✅ Hacer siempre
- Leer datos de Settings, CMS o atributos — nunca del código
- Crear atributos custom en DB antes de usarlos en un componente
- Verificar en staging antes de merge a main
- Compilar src → dist y commitear ambos
- Usar `url_key` para referencias a categorías, nunca IDs numéricos
- Agregar rate limiting a cualquier endpoint que llame APIs externas (Anthropic, Google, etc.)
- Usar `useQuery` con `requestPolicy: 'cache-and-network'` (nunca `network-only` salvo casos justificados)

### ❌ Nunca hacer
- Hardcodear teléfonos, WhatsApp, emails, direcciones en TSX/JS
- Hardcodear textos de secciones que el cliente pueda querer editar
- Usar `<script src="https://cdn.tailwindcss.com">` en producción
- Dejar componentes que devuelven `null` sin eliminarlos (`TrustSection`, etc.)
- Crear endpoints REST sin autenticación o sin rate limiting si llaman APIs de pago
- Dejar cron jobs activos sin función real
- Usar `requestPolicy: 'network-only'` en queries de catálogo completo
- Crear páginas de contenido como TSX hardcodeado cuando EverShop CMS puede manejarlas

### Componente con contenido editable — patrón correcto

```tsx
// ✅ Correcto — datos desde Settings via GraphQL
const SETTINGS_QUERY = `
  query {
    setting { storePhoneNumber }
  }
`;

export default function Footer() {
  const [{ data }] = useQuery({ query: SETTINGS_QUERY });
  const phone = data?.setting?.storePhoneNumber ?? '+57 312 378 6835';
  return <footer>{phone}</footer>;
}
```

```tsx
// ❌ Incorrecto — hardcodeado
export default function Footer() {
  return <footer>+57 312 378 6835</footer>;
}
```

---

## Catálogo

- **322 productos**, 4 categorías oficiales:

| ID | url_key | Nombre |
|----|---------|--------|
| 4 | calzado | Calzado y Marroquinería |
| 12 | multiusos | Hogar y Multiusos |
| 23 | madera | Madera y Muebles |
| 24 | colchones | Colchones y Espumas |

**No hardcodear IDs** — usar `url_key`. Los IDs de madera/colchones cambiaron en el cleanup.

- **Familias**: derivadas en runtime con `name.lastIndexOf(' - ')`. "Super PVA - 20kg" → "Super PVA". Lógica centralizada en `themes/industrial-glue/src/utils/family.ts` — importar desde ahí, no duplicar.
- **Source of truth**: `Master - Listado prod completo - images_updated.csv` en raíz del repo.

---

## Reglas críticas

### Evershop themes vs admin
Themes solo overridean frontStore. Para overrides de admin (productEdit, etc.) usar `extensions/sample/`.
Ver: `node_modules/@evershop/evershop/src/lib/componee/scanForComponents.ts:72`

### Paginación GraphQL
El default es **12 items**. Siempre pasar `filters: [{ key: "limit", operation: eq, value: "500" }]` en queries de listados completos, en cada nivel anidado (`categories` Y `products`).

### Railway SSH (busybox)
No usar heredocs ni `sed` en la shell del container. Para ejecutar scripts en el container:
1. Escribir el script localmente (`.cjs`)
2. Pushearlo a GitHub
3. En container: `wget -q "https://raw.githubusercontent.com/.../script.cjs" -O /tmp/s.cjs && node /tmp/s.cjs`

### Imágenes de productos
Evershop static middleware **no URL-decodea**. Nunca usar espacios ni tildes en filenames → `-` y NFD normalize.

### CSS / Estilos
- Todo CSS global va en `Head.tsx` como `<style>{...}</style>`
- Tailwind se usa via CDN solo en desarrollo local; para producción migrar a PostCSS build
- No mezclar `style={{}}` inline con clases Tailwind en el mismo componente — elegir uno y ser consistente por archivo

### Compilación del tema
```bash
# Tema
npx tsc --project themes/industrial-glue/tsconfig.json --noEmitOnError false

# Extensión
cd extensions/sample && npm run tsc
```
Los errores TS pre-existentes en `TrustSection.tsx` y `ProductBreadcrumb.tsx` son conocidos y no bloquean la compilación.

---

## Brand

- Azul: `#2A4899` | Verde: `#85C639` | Negro: `#181B1C`
- Fuentes: Sora (headings 300/400/600/700/800), Inter (body 300/400/500/600) — cargadas en Head.tsx

---

## Deploy

```bash
# Flujo normal
git push origin staging       # → Railway staging (verificar)
git checkout main
git merge staging
git push origin main          # → Railway producción

# Utilidades
railway logs                  # ver logs
railway ssh                   # SSH al container
railway redeploy --yes        # redeploy manual
```
