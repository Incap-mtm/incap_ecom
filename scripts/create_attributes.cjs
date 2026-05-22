/**
 * Crea los atributos ficha_tecnica_url y preguntas_frecuentes en EverShop.
 * Uso en Railway container:
 *   wget -q "https://raw.githubusercontent.com/Incap-mtm/incap_ecom/staging/scripts/create_attributes.cjs" -O /tmp/attrs.cjs && node /tmp/attrs.cjs
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
});

const ATTRIBUTES = [
  {
    attribute_code: 'ficha_tecnica_url',
    attribute_name: 'Ficha Técnica (URL)',
    type: 'text',
    is_required: false,
    display_on_frontend: false,
    sort_order: 50,
    is_filterable: false,
  },
  {
    attribute_code: 'preguntas_frecuentes',
    attribute_name: 'Preguntas Frecuentes (JSON)',
    type: 'textarea',
    is_required: false,
    display_on_frontend: false,
    sort_order: 51,
    is_filterable: false,
  },
];

async function run() {
  const client = await pool.connect();
  try {
    // Buscar el group_id de los atributos INCAP existentes (ej. usos)
    const groupRes = await client.query(`
      SELECT agl.group_id
      FROM attribute a
      JOIN attribute_group_link agl ON agl.attribute_id = a.attribute_id
      WHERE a.attribute_code = 'usos'
      LIMIT 1
    `);

    if (groupRes.rows.length === 0) {
      console.error('No se encontró el grupo de atributos INCAP (atributo "usos" no existe).');
      process.exit(1);
    }
    const groupId = groupRes.rows[0].group_id;
    console.log(`Usando group_id: ${groupId}`);

    for (const attr of ATTRIBUTES) {
      // Verificar si ya existe
      const exists = await client.query(
        'SELECT attribute_id FROM attribute WHERE attribute_code = $1',
        [attr.attribute_code]
      );
      if (exists.rows.length > 0) {
        console.log(`✓ Ya existe: ${attr.attribute_code} (id=${exists.rows[0].attribute_id})`);
        continue;
      }

      // Insertar atributo
      const ins = await client.query(
        `INSERT INTO attribute
          (attribute_code, attribute_name, type, is_required, display_on_frontend, sort_order, is_filterable)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING attribute_id`,
        [
          attr.attribute_code,
          attr.attribute_name,
          attr.type,
          attr.is_required,
          attr.display_on_frontend,
          attr.sort_order,
          attr.is_filterable,
        ]
      );
      const attrId = ins.rows[0].attribute_id;

      // Vincular al grupo
      await client.query(
        'INSERT INTO attribute_group_link (attribute_id, group_id) VALUES ($1, $2)',
        [attrId, groupId]
      );

      console.log(`✅ Creado: ${attr.attribute_code} (id=${attrId})`);
    }

    console.log('\nListo.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
