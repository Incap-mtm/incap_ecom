/**
 * Sube la ficha técnica (PDF) de un producto al volumen de media de Railway y
 * guarda su URL pública en el atributo `ficha_tecnica_url`.
 *
 * Disco:  <MEDIAPATH>/fichas/<sku>.pdf
 * URL:    /assets/fichas/<sku>.pdf   (static.js mapea /assets → MEDIAPATH, .pdf permitido)
 * Valor:  product_attribute_value_index.option_text  (única tabla de valores en este Evershop)
 */
export default function uploadFicha(request: any, response: any): Promise<any>;
