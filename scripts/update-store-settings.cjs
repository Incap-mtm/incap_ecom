const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const settings = [
  { name: 'storePhoneNumber', value: '+57 312 378 6835' },
  { name: 'storeAddress',     value: 'Cra. 72 #62-27 sur' },
  { name: 'storeCity',        value: 'Bogotá' },
  { name: 'storeEmail',       value: 'incapsa@incap.com.co' },
];

async function run() {
  await client.connect();
  for (const { name, value } of settings) {
    await client.query(
      `INSERT INTO setting (name, value) VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value`,
      [name, value]
    );
    console.log(`✓ ${name} = ${value}`);
  }
  await client.end();
  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });
