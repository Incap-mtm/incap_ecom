# Rediseño Quiénes Somos — material de referencia

Carpeta de trabajo para el rediseño de la página `/quienes-somos`.

Dejar acá:

- **`diseño.pdf`** (o como se llame) — el mockup del nuevo diseño.
- **`textos.md` / `textos.docx`** — los copys definitivos (títulos, párrafos, stats, etc.).
- **`assets/`** — imágenes fuente tal cual te las pasaron (sin renombrar todavía).

## Flujo

1. Vacías PDF + textos + imágenes acá.
2. Las imágenes finales (renombradas sin espacios/tildes, optimizadas a `.webp`)
   se mueven a `themes/industrial-glue/public/images/quienes-somos/`
   → quedan accesibles como `/images/quienes-somos/<archivo>`.
3. Los textos editables se cargan en EverShop CMS/Settings (no hardcodeados).
4. El layout se reconstruye en
   `extensions/sample/src/pages/frontStore/quienesSomos/QuienesSomosPage.tsx`.

> Esta carpeta es material de referencia; el PDF/originales pueden quedar versionados
> acá o eliminarse una vez terminado el rediseño.
