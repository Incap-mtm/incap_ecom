const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const INPUT_CSV = path.join(__dirname, '../plantilla_productos_incap.csv');
const OUTPUT_CSV = path.join(__dirname, '../evershop_import.csv');

/**
 * Normalizes strings for URL keys (slugs)
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Simple CSV Parser to avoid external dependencies
 */
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(';'); // Assuming semicolon based on previous views
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(';');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

/**
 * Main Migration Logic
 */
async function migrate() {
  console.log('🚀 Iniciando conversión para EverShop...');

  try {
    const rawData = fs.readFileSync(INPUT_CSV, 'utf-8');
    const products = parseCSV(rawData);

    // EverShop Header
    // Note: EverShop often uses specific column names. Adjusting to a standard set.
    const esHeaders = [
      'sku', 'name', 'url_key', 'description', 'status', 'visibility', 
      'manage_stock', 'qty', 'price', 'category', 'group_id', 
      'attribute_size', 'attribute_industrial_code', 'attribute_use',
      'attribute_ghs', 'attribute_h_phrases', 'attribute_p_phrases'
    ];

    const outputRows = [esHeaders.join(',')];

    products.forEach(p => {
      if (!p.nombre_producto || !p.sku) return;

      const descriptionHTML = `
        <div className="product-info">
          <h3>Descripción</h3><p>${p.descripcion_comercial}</p>
          <h3>Modo de Empleo</h3><p>${p.modo_empleo}</p>
          <h3>Características</h3><p>${p.caracteristicas_principales}</p>
        </div>
      `.replace(/\n/g, ' ').replace(/"/g, '""');

      const row = [
        `"${p.sku}"`,
        `"${p.nombre_producto} - ${p.presentacion}"`,
        `"${slugify(p.nombre_producto + '-' + p.presentacion)}"`,
        `"${descriptionHTML}"`,
        '1', // Status Active
        '1', // Visible
        '1', // Manage Stock
        '100', // Default Qty
        '0',   // Price (to be defined in EverShop)
        `"${p.categoria_industria}/${p.subcategoria}"`,
        `"${p.grupo_variante || slugify(p.nombre_producto)}"`, // Group variants
        `"${p.presentacion}"`,
        `"${p.id_industrial}"`,
        `"${p.uso_aplicacion}"`,
        `"${p.pictogramas_ghs}"`,
        `"${p.frases_h}"`,
        `"${p.frases_p}"`
      ];

      outputRows.push(row.join(','));
    });

    fs.writeFileSync(OUTPUT_CSV, outputRows.join('\n'), 'utf-8');
    console.log(`✅ ¡Éxito! Archivo generado en: ${OUTPUT_CSV}`);
    console.log(`📊 Total de variantes procesadas: ${products.length}`);

  } catch (err) {
    console.error('❌ Error durante la migración:', err.message);
  }
}

migrate();
