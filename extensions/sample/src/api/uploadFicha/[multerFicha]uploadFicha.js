import path from 'path';
import fs from 'fs';
import { CONSTANTS } from '@evershop/evershop/lib/helpers';
import { pool } from '@evershop/evershop/lib/postgres';

const FICHA_ATTR_CODE = 'ficha_tecnica_url';
const MAX_BYTES = 1024 * 1024; // 1 MB

// Nombre de archivo seguro: sin tildes ni espacios (el static middleware de
// Evershop no URL-decodea bien) → NFD + solo [a-z0-9._-].
const sanitize = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

/**
 * Sube la ficha técnica (PDF) de un producto al volumen de media de Railway y
 * guarda su URL pública en el atributo `ficha_tecnica_url`.
 *
 * Disco:  <MEDIAPATH>/fichas/<sku>.pdf
 * URL:    /assets/fichas/<sku>.pdf   (static.js mapea /assets → MEDIAPATH, .pdf permitido)
 * Valor:  product_attribute_value_index.option_text  (única tabla de valores en este Evershop)
 */
export default async function uploadFicha(request, response) {
  const admin =
    typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
  if (!admin) {
    return response.status(401).json({ success: false, error: 'No autorizado' });
  }

  try {
    const file = request.file;
    if (!file) {
      return response
        .status(400)
        .json({ success: false, error: 'No se recibió ningún archivo PDF.' });
    }
    if (file.mimetype !== 'application/pdf') {
      return response
        .status(400)
        .json({ success: false, error: 'El archivo debe ser un PDF.' });
    }
    if (file.size > MAX_BYTES) {
      return response
        .status(400)
        .json({ success: false, error: 'El PDF supera el límite de 1 MB.' });
    }

    const productId = parseInt(request.body?.productId, 10);
    if (!productId) {
      return response.status(400).json({
        success: false,
        error: 'Falta el producto. Guardá el producto antes de subir la ficha.'
      });
    }

    const { rows: arows } = await pool.query(
      `SELECT attribute_id FROM attribute WHERE attribute_code = $1 LIMIT 1`,
      [FICHA_ATTR_CODE]
    );
    if (!arows.length) {
      return response.status(500).json({
        success: false,
        error: `No existe el atributo ${FICHA_ATTR_CODE}.`
      });
    }
    const attributeId = arows[0].attribute_id;

    const { rows: prows } = await pool.query(
      `SELECT sku FROM product WHERE product_id = $1`,
      [productId]
    );
    if (!prows.length) {
      return response
        .status(404)
        .json({ success: false, error: 'Producto no encontrado.' });
    }
    const sku = prows[0].sku;

    // Guardar el PDF en el volumen
    const dir = path.join(CONSTANTS.MEDIAPATH, 'fichas');
    fs.mkdirSync(dir, { recursive: true });
    const base = sanitize(sku) || `producto-${productId}`;
    const fileName = `${base}.pdf`;
    fs.writeFileSync(path.join(dir, fileName), file.buffer);
    const url = `/assets/fichas/${fileName}`;

    // Upsert del valor del atributo (única tabla de valores de producto)
    const { rows: exist } = await pool.query(
      `SELECT product_attribute_value_index_id
         FROM product_attribute_value_index
        WHERE product_id = $1 AND attribute_id = $2`,
      [productId, attributeId]
    );
    if (exist.length) {
      await pool.query(
        `UPDATE product_attribute_value_index
            SET option_text = $1, option_id = NULL
          WHERE product_id = $2 AND attribute_id = $3`,
        [url, productId, attributeId]
      );
    } else {
      await pool.query(
        `INSERT INTO product_attribute_value_index
           (product_id, attribute_id, option_id, option_text)
         VALUES ($1, $2, NULL, $3)`,
        [productId, attributeId, url]
      );
    }

    return response.json({
      success: true,
      url,
      message: 'Ficha técnica subida y guardada correctamente.'
    });
  } catch (err) {
    return response.status(500).json({ success: false, error: err.message });
  }
}
