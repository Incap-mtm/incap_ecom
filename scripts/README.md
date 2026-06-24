# scripts/

Solo viven aquí los scripts **activos o reutilizables**. Todo lo one-off
(diagnóstico y migraciones ya consumidas) se movió a `scripts/archive/`.

Todos los scripts leen la conexión de `process.env.DATABASE_URL`. No hardcodear
credenciales (ver deuda de seguridad en CLAUDE.md).

## Críticos para el deploy

| Script | Rol |
|--------|-----|
| `start.sh` | Entry point del container (lo invoca el `Dockerfile`: `CMD ["sh","scripts/start.sh"]`). Espera Postgres, siembra imágenes faltantes, crea admin y arranca `npm start`. **No modificar sin testing completo.** |
| `create_admin.cjs` | Crea el usuario admin si faltan credenciales (`ADMIN_EMAIL/PASSWORD/FULLNAME`). Idempotente. Llamado desde `start.sh`. |

## Seed inicial (Railway)

| Script | Uso |
|--------|-----|
| `seed_railway.cjs` | Seed completo: orquesta `import_products` → `import_attrs` → `import_images` (no-op si ya hay ≥300 productos). |
| `import_products.cjs` / `import_attrs.cjs` / `import_images.cjs` | Importan desde `data/Master - Listado prod completo - images_updated.csv` (source of truth). Soportan `--dry-run` / `--clear`. |
| `seed-hero-widget.cjs` | Siembra el widget `hero_slider` (idempotente, `ON CONFLICT`). |
| `seed-social-settings.cjs` | Siembra settings de redes sociales. |

## Mantenimiento (re-ejecutables)

| Script | Uso |
|--------|-----|
| `sync_catalog.cjs` | Re-sincroniza el índice de valores de atributos. |
| `sync_attributes_from_csv.cjs` | Re-sincroniza atributos desde el CSV maestro (`data/`). |
| `sync_categories_from_csv.cjs` | Re-sincroniza categorías desde el CSV maestro (`data/`). |
| `update-store-settings.cjs` | Actualiza la config de la tienda (Settings). |
| `geocode-distribuidores.mjs` | Geocodifica distribuidores (requiere API key). |
| `admin-product-load-fixes.cjs` | Ajustes de esquema/atributos para la carga de productos en admin. |

## archive/

Scripts que ya cumplieron su función y se conservan solo como referencia
histórica. No se ejecutan en el flujo normal.

- `archive/diagnostics/` — checks, auditorías e inspecciones one-off (`check_*`, `audit_*`, `inspect_*`, `list_*`, `verify_*`, `dryrun_*`, etc.).
- `archive/migrations/` — migraciones/importaciones ya ejecutadas (`convert_*`, `fix_*`, `repair_*`, `rename_*`, `recover_*`, `assign_*`, etc.).
- `archive/sql/` — SQL one-off de la migración inicial (descripciones, variantes, índice de valores, seed de atributos).
