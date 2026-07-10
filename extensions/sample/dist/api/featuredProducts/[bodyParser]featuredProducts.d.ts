/**
 * GET  /api/featured-products            → { selected: [{uuid,name,image}] }
 * GET  /api/featured-products?search=kw  → { results:  [{uuid,name,image}] }
 * POST /api/featured-products            → { uuids: string[] } persiste el setting
 */
export default function featuredProducts(request: any, response: any): Promise<any>;
