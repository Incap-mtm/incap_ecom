import path from 'path';
import { fileURLToPath } from 'url';
import { addProcessor } from '@evershop/evershop/lib/util/registry';
import { registerWidget } from '@evershop/evershop/lib/widget';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function () {
    // Widget custom Hero Slider — gestionable desde Admin → CMS → Widgets.
    // Soporta imagen desktop + mobile (WebP) por slide, a diferencia del simple_slider nativo.
    registerWidget({
        type: 'hero_slider',
        settingComponent: path.resolve(__dirname, 'components/HeroSliderSetting.js'),
        component: path.resolve(__dirname, 'components/HeroSlider.js'),
        name: 'Hero Slider INCAP',
        description: 'Carrusel full-bleed del home con imagen desktop/mobile por slide',
        defaultSettings: {
            slides: [],
            autoplaySpeed: 8000
        },
        enabled: true
    });
    // Filtro fulltext: busca en nombre del producto Y en atributos usos/caracteristicas/modo_empleo
    addProcessor('productCollectionFilters', (filters) => {
        return [
            ...filters,
            {
                key: 'fulltext',
                operation: ['eq'],
                callback: (query, _operation, value, currentFilters) => {
                    const uid = Math.random().toString(36).slice(2, 8);
                    const where = query.getWhere();
                    where.addRaw('AND', `(
                product_description.name ILIKE :ft_name_${uid}
                OR COALESCE(product_description.description, '') ILIKE :ft_desc_${uid}
                OR EXISTS (
                  SELECT 1
                  FROM product_attribute_value_index pavi_${uid}
                  JOIN attribute attr_${uid}
                    ON attr_${uid}.attribute_id = pavi_${uid}.attribute_id
                  WHERE pavi_${uid}.product_id = product.product_id
                    AND attr_${uid}.attribute_code IN ('usos', 'caracteristicas', 'modo_empleo')
                    AND pavi_${uid}.option_text ILIKE :ft_attr_${uid}
                )
              )`, {
                        [`ft_name_${uid}`]: `%${value}%`,
                        [`ft_desc_${uid}`]: `%${value}%`,
                        [`ft_attr_${uid}`]: `%${value}%`,
                    });
                    currentFilters.push({ key: 'fulltext', operation: 'eq', value });
                },
            },
        ];
    }, 10);
}
//# sourceMappingURL=bootstrap.js.map