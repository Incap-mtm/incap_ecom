import { addProcessor } from '@evershop/evershop/lib/util/registry';

export default function () {
  // Filtro fulltext: busca en nombre del producto Y en atributos usos/caracteristicas/modo_empleo
  addProcessor(
    'productCollectionFilters',
    (filters: any[]) => {
      return [
        ...filters,
        {
          key: 'fulltext',
          operation: ['eq'],
          callback: (query: any, _operation: string, value: string, currentFilters: any[]) => {
            const uid = Math.random().toString(36).slice(2, 8);
            const where = query.getWhere();
            where.addRaw(
              'AND',
              `(
                product_description.name ILIKE :ft_name_${uid}
                OR EXISTS (
                  SELECT 1
                  FROM product_attribute_value_index pavi_${uid}
                  JOIN attribute attr_${uid}
                    ON attr_${uid}.attribute_id = pavi_${uid}.attribute_id
                  WHERE pavi_${uid}.product_id = product.product_id
                    AND attr_${uid}.attribute_code IN ('usos', 'caracteristicas', 'modo_empleo')
                    AND pavi_${uid}.option_text ILIKE :ft_attr_${uid}
                )
              )`,
              {
                [`ft_name_${uid}`]: `%${value}%`,
                [`ft_attr_${uid}`]: `%${value}%`,
              }
            );
            currentFilters.push({ key: 'fulltext', operation: 'eq', value });
          },
        },
      ];
    },
    10
  );
}
