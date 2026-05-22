import { execute, insert } from '@evershop/postgres-query-builder';

export default async (connection) => {
  // Buscar el grupo al que pertenece el atributo 'usos' (grupo INCAP existente)
  const groupResult = await execute(
    connection,
    `SELECT agl.group_id
     FROM attribute a
     JOIN attribute_group_link agl ON agl.attribute_id = a.attribute_id
     WHERE a.attribute_code = 'usos'
     LIMIT 1`
  );

  if (!groupResult.rows || groupResult.rows.length === 0) {
    throw new Error("No se encontró el grupo de atributos INCAP (atributo 'usos' no existe). Verifica que el seed de atributos se haya ejecutado.");
  }
  const groupId = groupResult.rows[0].group_id;

  const attributes = [
    {
      attribute_code: 'ficha_tecnica_url',
      attribute_name: 'Ficha Técnica (URL del PDF)',
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

  for (const attr of attributes) {
    // Solo crear si no existe
    const exists = await execute(
      connection,
      `SELECT attribute_id FROM attribute WHERE attribute_code = '${attr.attribute_code}'`
    );
    if (exists.rows && exists.rows.length > 0) {
      continue;
    }

    const result = await insert('attribute')
      .given(attr)
      .execute(connection);

    await insert('attribute_group_link')
      .given({ attribute_id: result.insertId, group_id: groupId })
      .execute(connection);
  }
};
