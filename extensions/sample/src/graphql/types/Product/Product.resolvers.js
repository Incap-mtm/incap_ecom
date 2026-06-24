import { select } from '@evershop/postgres-query-builder';
import { getSetting } from '@evershop/evershop/setting/services';

const SIZE_ATTRIBUTE_ID = 2;

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
        // Ambos no listados: ordenar alfabéticamente por option_text
        return (a.option_text || '').localeCompare(b.option_text || '');
      });

      return rows.map((r) => ({
        label: r.option_text,
        url: `/product/${r.uuid}`,
        isCurrent: r.product_id === productId
      }));
    }
  }
};
