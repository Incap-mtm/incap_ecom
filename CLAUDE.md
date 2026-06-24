# INCAP Ecommerce — Contexto del proyecto

Evershop (Node.js/React) para Grupo INCAP (adhesivos industriales Colombia).
Deploy en Railway → **https://www.grupoincap.com.co**. Auto-deploy desde `origin` (`Incap-mtm/incap_ecom`).
Staging → **Railway servicio staging** — branch `staging` → verificar antes de llevar a `main`.

## Stack

- **Framework**: Evershop v2 (Next.js-like, GraphQL, PostgreSQL)
- **Theme**: `themes/industrial-glue/` — solo overridea frontStore
- **Extension**: `extensions/sample/` — overrides de admin + custom pages + APIs
- **DB**: PostgreSQL en Railway (interno). La URL de conexión va en `DATABASE_URL` (env / `.env` local) — **nunca hardcodearla en código ni en este doc**.
  - ⚠️ **Deuda de seguridad conocida (pendiente):** la credencial de Postgres quedó commiteada en el historial de git (CLAUDE.md previo + ~9 scripts). **Rotar la contraseña en Railway** y confirmar que todo lea de `process.env.DATABASE_URL`.
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
- Dejar componentes que devuelven `null` sin eliminarlos (eliminar el archivo, no dejar el stub)
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
- **Source of truth**: `data/Master - Listado prod completo - images_updated.csv`.

---

## Convenciones de archivos en Evershop — CRÍTICO

Evershop distingue componentes React de middleware Express **por la primera letra del nombre del archivo**:

| Primera letra | Tratamiento | Ejemplos |
|--------------|-------------|---------|
| **Mayúscula** | Componente React (renderizado en SSR) | `Navbar.js`, `BuscarPage.js`, `FabricantesPage.js` |
| **Minúscula** | Middleware Express (ejecutado en Node.js) | `urlKeyResolver[index].js`, `auth.js`, `index.js` |

**Regla:** Todo archivo `.tsx/.js` que exporte un componente React con `layout` debe tener nombre en **PascalCase** (mayúscula inicial).

```
✅ extensions/sample/src/pages/frontStore/buscar/BuscarPage.tsx
❌ extensions/sample/src/pages/frontStore/buscar/index.tsx   ← se ejecuta como middleware → React error #321
```

Los archivos de middleware legítimos sí van en minúscula: `urlKeyResolver[index].js` resuelve slugs a UUIDs antes del render.

**Por qué:** `scanForMiddlewareFunctions` llama al default export con `(request, response)`. Si ese export es un componente React, los hooks se ejecutan fuera del contexto de React → error.

---

### Endpoints API POST/PATCH — el `bodyParser.js` companion es OBLIGATORIO ⚠️

**Evershop NO tiene un body-parser global.** `addDefaultMiddlewareFuncs` agrega session, cookies y estáticos, pero **no** parsea JSON del body. El parseo se hace con un middleware `bodyParser` **definido por carpeta de ruta**.

El prefijo en corchetes de un handler declara una **dependencia de orden**: `[bodyParser]createX.js` significa "ejecutame DESPUÉS del middleware con id `bodyParser`". Si en esa misma carpeta **no existe** un `bodyParser.js`, la dependencia es irresoluble y **`sortMiddlewares` DESCARTA el handler silenciosamente** → la ruta solo corre los middlewares globales → el `apiResponse` global responde `{}` con **status 200** → el front cree que fue éxito **pero el handler nunca corrió** (cero efecto, cero error en logs).

**Regla:** toda carpeta de endpoint cuyo handler use el prefijo `[bodyParser]` (o cualquier `[xxx]`) **debe** incluir un archivo que defina ese middleware. Para body JSON, copiar el patrón de `extensions/sample/src/api/createFoo/bodyParser.js`:

```js
// extensions/sample/src/api/<ruta>/bodyParser.js
import bodyParser from 'body-parser';

export default (request, response, next) => {
  bodyParser.json({ inflate: false })(request, response, next);
};
```

```
✅ api/adminUsers/{ route.json, bodyParser.js, [bodyParser]createAdminUser.js }
❌ api/adminUsers/{ route.json, [bodyParser]createAdminUser.js }   ← handler descartado → {} 200, no persiste
```

Alternativa (sin body): un handler sin corchetes (`deleteAdminUser.js`) recibe deps por defecto resolubles (`apiResponse`, `escapeHtml`, `auth`) → **no se descarta** y corre. Usar este patrón para DELETE/GET que no leen body.

**Cómo detectarlo:** el síntoma es un POST que devuelve **`{}` con 200** (no el JSON esperado del handler) y no aparece ningún log del handler. Verificar con DevTools → Network → Response (`content-length: 2` = `{}`).

> **Estado (auditado 2026-06-24):** todos los endpoints con prefijo `[bodyParser]`/`[multerFicha]` (`syncVariants`, `optimizeImages`, `fichaLead`, `mapsKey`, `technicalAdvisor`, `suggestSku`, `uploadFicha`, `adminUsers`, etc.) **ya tienen su companion** → no hay handlers descartados. Mantener esta regla al crear endpoints nuevos.

---

### Imports de paquetes Evershop

El `package.json` de `@evershop/evershop` usa un `exports` map con wildcards:
```json
"./lib/util/*": { "import": "./dist/lib/util/*.js" }
```
El wildcard ya añade `.js` → **nunca agregar `.js` al import**:
```ts
✅ import { addProcessor } from '@evershop/evershop/lib/util/registry'
❌ import { addProcessor } from '@evershop/evershop/lib/util/registry.js'   // genera registry.js.js
❌ import { addProcessor } from '@evershop/evershop/src/lib/util/registry.js' // no está en exports
```

---

### Query builder — COUNT y alias (`@evershop/postgres-query-builder`)

`SelectQuery.select(field, alias)` toma campo y alias **separados**. Si pasás un solo string con `as`, `isValueASQL` no lo reconoce como SQL y el builder lo encierra en comillas → `SELECT "COUNT(...) as cnt"` → columna inexistente → **excepción 500**.

```js
❌ select('COUNT(admin_user_id) as cnt').from('admin_user')...   // SELECT "COUNT(...) as cnt" → 500
✅ pool.query('SELECT COUNT(*)::int AS cnt FROM admin_user WHERE status = true')  // SQL crudo, a prueba de balas
```

Para agregados/COUNT en endpoints, preferir `pool.query` con SQL crudo (como hace `api/sitemap`). `COUNT(*)` devuelve bigint → string en node-pg; castear con `::int` para recibir un number.

### Manejo de errores de la API en el front (evitar pantalla en blanco)

Los endpoints pueden responder `{ error: 'texto' }` (nuestros handlers) **o** `{ error: { status, message } }` (errores 500 / no manejados de Evershop). **Nunca** hacer `setError(data.error)` directo: si es objeto, React crashea al renderizarlo como hijo → **página en blanco**. Extraer siempre un string:

```ts
const msg = typeof data?.error === 'string' ? data.error : (data?.error?.message || 'Error.');
setError(msg);
```

---

### SSR y hooks de React (urql / useState)

Evershop renderiza páginas con `renderToString` sin un Provider de urql. Durante SSR:
- `useEffect` **no se ejecuta** → leer URL params ahí es seguro
- `useQuery` con `pause: true` es seguro en SSR
- `useQuery` sin `pause` ejecuta la query durante SSR vía el cliente por defecto de urql

Patrón correcto para queries que dependen del cliente (window, localStorage, URL):
```tsx
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);
const [result] = useQuery({ query: MY_QUERY, pause: !isClient });
```

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
Los errores TS pre-existentes en `ProductBreadcrumb.tsx` son conocidos y no bloquean la compilación.

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
