UPDATE product_description
SET description = '[{"id":"r1","size":1,"columns":[{"id":"c1","size":1,"data":{"time":1746000000000,"blocks":[{"id":"b1","type":"paragraph","data":{"text":"Adhesivo monocomponente de policloropreno, resinas sinteticas y solventes. Alta fuerza de adhesion, resistente a la temperatura y humedad, ideal para la industria del mueble, calzado y tapiceria."}}]}}]}]'
WHERE product_description_product_id IN (50,51,52,54,55);

UPDATE product_description
SET description = '[{"id":"r1","size":1,"columns":[{"id":"c1","size":1,"data":{"time":1746000000000,"blocks":[{"id":"b1","type":"paragraph","data":{"text":"Adhesivo industrial de contacto sin tolueno. Formula libre de tolueno para mayor seguridad del operario, sin sacrificar la fuerza de adhesion. Ideal para procesos industriales que exigen ambientes mas seguros."}}]}}]}]'
WHERE product_description_product_id IN (59,60,61,63,64);

SELECT product_description_product_id, LEFT(description::text, 70) AS fmt FROM product_description WHERE product_description_product_id IN (50,59);
