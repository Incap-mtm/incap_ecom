/**
 * POST /api/unlink-variant
 * Desvincula un producto de su grupo de variantes sin borrarlo.
 *
 * Corrección respecto al endpoint del core:
 *   El core hace SET visibility = NULL pero la columna es NOT NULL en esta DB.
 *   Aquí usamos visibility = false en su lugar.
 *
 * Body JSON: { productId: number }
 */
export default function unlinkVariant(request: any, response: any): Promise<any>;
