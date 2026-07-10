/**
 * POST /api/unlink-variant
 * Desvincula un producto de su grupo de variantes sin borrarlo.
 *
 * Corrección respecto al endpoint del core:
 *   El core hace SET visibility = NULL pero la columna es NOT NULL en esta DB.
 *   Aquí usamos visibility = false en su lugar.
 *
 * ⚠️ Esta carpeta se llama `incapUnlinkVariant` (NO `unlinkVariant`) A PROPÓSITO.
 * Evershop core trae su propio módulo `catalog/api/unlinkVariant/` (handler
 * `unlinkVariants.js`, ruta DELETE /variants/:id). Evershop agrupa los
 * middlewares por NOMBRE DE CARPETA (route id): si nuestra carpeta se llamara
 * `unlinkVariant` (igual que la del core), Evershop fusiona ambos grupos y corre
 * el handler del core con su `multerNone` (que no parsea JSON) → `request.body`
 * queda undefined → `request.body.id` → 500 "Cannot read properties of undefined
 * (reading 'id')". Con nombre único NO hay fusión. NO renombrar a `unlinkVariant`.
 *
 * Body JSON: { productId: number }
 */
export default function unlinkVariant(request: any, response: any): Promise<any>;
