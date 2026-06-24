UPDATE product_description
SET description = '[{"id":"1","type":"paragraph","data":{"text":"Adhesivo monocomponente de policloropreno, resinas sinteticas y solventes. Alta fuerza de adhesion, resistente a la temperatura y humedad, ideal para la industria del mueble, calzado y tapiceria."}}]'
WHERE product_description_product_id IN (50,51,52,54,55);

UPDATE product_description
SET description = '[{"id":"1","type":"paragraph","data":{"text":"Adhesivo industrial de contacto sin tolueno. Formula libre de tolueno para mayor seguridad del operario, sin sacrificar la fuerza de adhesion. Ideal para procesos industriales que exigen ambientes mas seguros."}}]'
WHERE product_description_product_id IN (59,60,61,63,64);

SELECT p.sku, LEFT(pd.description, 80) AS desc_ok
FROM product_description pd
JOIN product p ON p.product_id = pd.product_description_product_id
WHERE p.product_id IN (50,59);
