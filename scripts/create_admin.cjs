const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: 'evershop',
  host: 'localhost',
  database: 'evershop',
  password: 'evershop_password',
  port: 5435,
});

async function createAdmin() {
  const email = 'gerardoriarte@gmail.com';
  const password = 'incap_admin_2026';
  const fullName = 'Gerardo Riarte';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO admin_user (email, password, full_name, status)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE 
      SET password = $2, full_name = $3, status = $4
      RETURNING *;
    `;
    
    const res = await pool.query(query, [email, hashedPassword, fullName, true]);
    console.log('✅ Usuario Administrador creado/actualizado con éxito:');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
  } catch (err) {
    console.error('❌ Error al crear administrador:', err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
