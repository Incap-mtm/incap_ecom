import { execute, insert } from '@evershop/postgres-query-builder';

export default async (connection) => {
  const exists = await execute(
    connection,
    `SELECT name FROM setting WHERE name = 'storeWhatsappNumber'`
  );
  if (exists.rows && exists.rows.length > 0) return;

  await insert('setting')
    .given({ name: 'storeWhatsappNumber', value: '573002171521' })
    .execute(connection);
};
