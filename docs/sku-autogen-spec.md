# Auto-generación de SKU — Especificación

Estado: **propuesta / por implementar**. Basado en el análisis de los 322 SKU ya cargados en prod.

## 1. Patrón de SKU existente

Formato de 3 segmentos separados por guion: **`LINEA-VARIANTE-TAMAÑO`**

Ejemplo: `LA-LF-005` = Lamifort, 5000cc.

| Seg | Long. | Significado | Cómo se forma |
|-----|-------|-------------|---------------|
| 1 — LINEA | 2 letras | Código de línea/producto | Curado a mano. Ej: Incaspray→`IS`, Incafom→`IN`, Maxón→`MA`, PVA→`PV`, Lamifort→`LA`, Madefort→`MD`(en seg.2 sobre `LA`), Acuapiel→`AC`, Emulsión→`EM`. **No es 1:1 con el nombre** (Andino, Incatack y Montagrass comparten `CO`). |
| 2 — VARIANTE | 2 chars | Abreviatura de la variante/modelo | Curado. Ej: Forte→`FT`, Ultra→`UL`, Rápido→`RP`, NF7→`N7`, 8000D→`8D`, "1"→`1`. |
| 3 — TAMAÑO | 3 dígitos | Tamaño codificado | cc<1000 → tal cual (375cc→`375`); cc≥1000 → litros (2000cc→`002`, 5000cc→`005`); kg → número (30kg→`030`, 200kg→`200`); Gal → ×10 (8 Gal→`080`, 53 Gal→`530`). **Con anomalías** (55 Gal→`046`, 4.5 Gal→`050`). |

## 2. Hallazgos clave (DB prod)

1. Los SKU **vienen curados del CSV** (`scripts/import_products.cjs` lee `row.sku`). No existe algoritmo previo → habría que ingeniería inversa.
2. ⭐ **Los 69 familias tienen prefijo `LINEA-VARIANTE` 100% único** (0 mezclados). Dentro de una familia, todas las presentaciones comparten seg.1+2 y **solo cambia seg.3 (tamaño)**.
3. 322/322 SKU únicos, 0 vacíos.
4. El segmento de tamaño **no tiene una fórmula única** que reproduzca el 100% del histórico.

## 3. Alcance de la solución

### Caso A — nueva presentación de un producto existente (común) → AUTOMÁTICO
Ej: cargar "Lamifort - 10kg" cuando ya existe "Lamifort - 5000cc".
- **Prefijo `LINEA-VARIANTE`: determinístico** → copiar de un hermano de la misma familia (usar `getFamily()` de `themes/industrial-glue/src/utils/family.ts` / la lógica de `migrate-variantes`).
- **Segmento tamaño**: codificar el tamaño nuevo con las reglas de §1 (reusar `normalizeSize` + `parsePresentationSize`).
- Confiable. El admin puede confirmar.

### Caso B — producto/línea nueva → SUGERENCIA EDITABLE (nunca final)
- Generar seg.1 (2 letras libres, sin colisión) y seg.2 (abreviatura del nombre) como **sugerencia**; el admin la revisa/edita.
- Riesgo de colisión y de no coincidir con criterio humano → siempre editable.

## 4. Plan de implementación

1. **Servicio de codificación de tamaño** (`encodeSizeToken(sizeStr) → '###'`): reglas cc/ml/L/kg/Gal de §1. Tests con los 322 SKU como fixture (medir % de match para detectar reglas faltantes).
2. **Endpoint admin** `POST /api/suggest-sku` (access:private, rate-limit) que recibe `{ name }` (o family+size):
   - Deriva `family` y `size` del nombre (convención " - ").
   - Busca hermanos por familia en DB; si hay → toma su prefijo LINEA-VARIANTE (Caso A).
   - Si no hay → genera sugerencia (Caso B): seg.1 = 2 letras libres derivadas del nombre, seg.2 = abreviatura, marca `needsReview: true`.
   - Codifica seg.3 con el servicio del paso 1.
   - Verifica unicidad contra `product.sku`; si colisiona, ajusta/avisa.
   - Devuelve `{ sku, needsReview, source: 'sibling'|'generated' }`.
3. **Hook en el admin** (productNew): botón "Sugerir SKU" o auto-fill del campo `sku` al tipear el nombre (override del form de producto en `extensions/sample/src/pages/admin/productEdit+productNew/`). Siempre editable.
4. (Opcional) Endpoint para **auditar** SKU faltantes/duplicados.

## 5. Limitaciones a comunicar
- "100% automático y exacto a la convención, sin intervención" **no es alcanzable**: el seg. tamaño tiene anomalías y las líneas nuevas requieren criterio humano.
- El sugeridor es **determinístico para nuevas presentaciones de productos existentes** (caso frecuente) y **best-effort + revisión** para líneas nuevas.

## 6. Estimación
~Media jornada para un sugeridor sólido (servicio de tamaño + endpoint + hook admin + chequeo de unicidad), reusando `family.ts`/`normalizeSize`.

## Referencias
- Patrón derivado de la DB de prod (322 productos, 69 familias).
- Lógica reutilizable: `themes/industrial-glue/src/utils/family.ts`, `scripts/migrate-variantes.mjs` (normalizeSize/getFamily/getSize), `scripts/import_products.cjs`.
- Endpoints admin de referencia (auth/rate-limit): `extensions/sample/src/api/syncVariants/`, `optimizeImages/`.
