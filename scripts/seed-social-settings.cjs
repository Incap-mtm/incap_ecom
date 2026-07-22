const { Client } = require('pg');

const DB_URL = process.env.DATABASE_URL;

const settings = [
  { name: 'storeInstagram', value: 'https://www.instagram.com/incap_col/?hl=es' },
  { name: 'storeFacebook',  value: 'https://www.facebook.com/share/1D7BbLWtgs/?mibextid=wwXIfr' },
  { name: 'storeLinkedin',  value: 'https://www.linkedin.com/company/incap-s-a/?viewAsMember=true' },
  { name: 'storeTiktok',    value: 'https://www.tiktok.com/@incap.s.a' },
  { name: 'storeYoutube',   value: 'https://www.youtube.com/@IncapSA_Col' },
];

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  for (const s of settings) {
    const res = await client.query(
      `INSERT INTO setting (name, value, is_json)
       VALUES ($1, $2, false)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value
       RETURNING name, value`,
      [s.name, s.value]
    );
    console.log('✓', res.rows[0].name, '=', res.rows[0].value);
  }
  await client.end();
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
