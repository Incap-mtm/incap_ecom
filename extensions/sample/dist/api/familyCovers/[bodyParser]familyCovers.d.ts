/**
 * GET  /api/family-covers  → { success:true, families:[{family, variants:[{uuid,name,presentation,image}]}], covers }
 *   Solo familias con 2+ variaciones (las de una sola presentación no necesitan portada elegible).
 * POST /api/family-covers  → body { covers: { [family]: uuid } } persiste el setting `family_covers`.
 */
export default function familyCovers(request: any, response: any): Promise<any>;
