import { select } from '@evershop/postgres-query-builder';
import { getSetting } from '@evershop/evershop/setting/services';
import { getProductsBaseQuery } from '@evershop/evershop/catalog/services';
import { camelCase } from '@evershop/evershop/lib/util/camelCase';
import { compareSizes } from '../../../lib/sizeSort.js';

const SIZE_ATTRIBUTE_ID = 2;
const RELATED_LIMIT = 4;

/**
 * Familia derivada del nombre: "Super PVA - 20kg" → "Super PVA".
 * Misma lógica que themes/industrial-glue/src/utils/family.ts (mantener en sync).
 */
function familyOf(name) {
  if (!name) return '';
  const i = name.lastIndexOf(' - ');
  return (i === -1 ? name : name.substring(0, i)).trim();
}

export default {
  Product: {
    sizeVariants: async (product, _, { pool }) => {
      const { variantGroupId, productId } = product;
      if (!variantGroupId) return null;

      const query = select();
      query.from('product');
      query.select('product.product_id');
      query.select('product.uuid');
      query.select('product_attribute_value_index.option_text');
      query.select('product_attribute_value_index.option_id');

      query
        .leftJoin('product_attribute_value_index')
        .on('product.product_id', '=', 'product_attribute_value_index.product_id');

      query.where('product.variant_group_id', '=', variantGroupId);
      query.andWhere('product_attribute_value_index.attribute_id', '=', SIZE_ATTRIBUTE_ID);

      const rows = await query.execute(pool);

      // Leer orden guardado en settings
      let orderIds = [];
      try {
        const raw = await getSetting('variant_size_order', '[]');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) orderIds = parsed.map(Number);
      } catch {
        orderIds = [];
      }

      // Ordenar: primero los que tienen posición en el array, luego el resto por option_text
      rows.sort((a, b) => {
        const idxA = orderIds.indexOf(Number(a.option_id));
        const idxB = orderIds.indexOf(Number(b.option_id));

        const posA = idxA === -1 ? Infinity : idxA;
        const posB = idxB === -1 ? Infinity : idxB;

        if (posA !== posB) return posA - posB;
        // Ambos no listados: ordenar de menor a mayor por tamaño
        return compareSizes(a.option_text, b.option_text);
      });

      return rows.map((r) => ({
        label: r.option_text,
        url: `/product/${r.uuid}`,
        isCurrent: r.product_id === productId
      }));
    },

    /**
     * Miembros de la familia: todos los productos activos/visibles de la misma
     * categoría cuyo nombre comparte familia con el producto ("Super PVA - 20kg"
     * y "Super PVA - 5kg" → familia "Super PVA"). Sirve para que las cards
     * (relacionados/destacados) muestren todas las presentaciones como chips,
     * igual que el catálogo. Incluye al propio producto.
     */
    familyMembers: async (product, _, { pool }) => {
      try {
        const { productId } = product;
        if (!productId) return [];

        // SQL crudo: encadenar .where() después de .on() en el query-builder
        // opera sobre el nodo ON (Join.on() no devuelve el query), perdiendo el
        // WHERE → la carga fallaba y el catch devolvía []. pool.query es a prueba
        // de balas (patrón recomendado en CLAUDE.md).
        const { rows: curRows } = await pool.query(
          `SELECT p.category_id, pd.name
             FROM product p
             LEFT JOIN product_description pd
               ON pd.product_description_product_id = p.product_id
            WHERE p.product_id = $1
            LIMIT 1`,
          [productId]
        );
        const current = curRows[0];
        if (!current) return [];

        const categoryId = current.category_id;
        const family = familyOf(current.name);
        if (!categoryId || !family) return [];

        const query = getProductsBaseQuery();
        query.where('product.category_id', '=', categoryId);
        query.andWhere('product.status', '=', true);
        query.andWhere('product.visibility', '=', true);
        const rows = await query.execute(pool);

        const members = rows.filter((r) => familyOf(r.name) === family);
        return members.map((r) => camelCase(r));
      } catch (e) {
        return [];
      }
    },

    /**
     * Productos relacionados: hasta 4 FAMILIAS distintas de la misma categoría,
     * excluyendo la familia del producto actual. Devuelve un representante por
     * familia (objeto Product completo) para que los resolvers core (url, image)
     * lo formateen; el front muestra todas las presentaciones vía familyMembers.
     * Las variantes hijas quedan fuera solas porque tienen visibility = false.
     */
    relatedProducts: async (product, _, { pool }) => {
      try {
        const { productId } = product;
        if (!productId) return [];

        // En esta versión de Evershop la categoría vive en la columna
        // product.category_id (NO existe tabla product_category). SQL crudo
        // porque el join fluido del query-builder rompe el WHERE (ver familyMembers).
        const { rows: curRows } = await pool.query(
          `SELECT p.category_id, pd.name
             FROM product p
             LEFT JOIN product_description pd
               ON pd.product_description_product_id = p.product_id
            WHERE p.product_id = $1
            LIMIT 1`,
          [productId]
        );
        const current = curRows[0];
        const categoryId = current && current.category_id;
        if (!categoryId) return [];
        const currentFamily = familyOf(current.name);

        const query = getProductsBaseQuery();
        query.where('product.category_id', '=', categoryId);
        query.andWhere('product.product_id', '<>', productId);
        query.andWhere('product.status', '=', true);
        query.andWhere('product.visibility', '=', true);
        query.orderBy('product.product_id', 'DESC');

        const rows = await query.execute(pool);

        // Un representante por familia, saltando la familia del producto actual.
        const seen = new Set(currentFamily ? [currentFamily] : []);
        const reps = [];
        for (const r of rows) {
          const f = familyOf(r.name);
          if (seen.has(f)) continue;
          seen.add(f);
          reps.push(camelCase(r));
          if (reps.length >= RELATED_LIMIT) break;
        }
        return reps;
      } catch (e) {
        // Nunca romper la ficha de producto por los relacionados
        return [];
      }
    }
  }
};
