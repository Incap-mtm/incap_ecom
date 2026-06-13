import { pool } from '@evershop/evershop/lib/postgres';
import { hashPassword } from '@evershop/evershop/lib/util/passwordHelper';
import { insert, select } from '@evershop/postgres-query-builder';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/admin-users
 * Crea un nuevo usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default async function createAdminUser(request, response) {
  const { full_name, email, password } = request.body || {};

  // Validaciones
  if (!full_name || String(full_name).trim().length === 0) {
    return response.status(400).json({ success: false, error: 'El nombre completo es requerido.' });
  }
  if (!email || !isValidEmail(String(email).trim())) {
    return response.status(400).json({ success: false, error: 'El email no tiene un formato válido.' });
  }
  if (!password || String(password).length < 8) {
    return response.status(400).json({ success: false, error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(full_name).trim();

  // Verificar email duplicado
  const existing = await select()
    .from('admin_user')
    .where('email', 'ILIKE', cleanEmail)
    .load(pool);

  if (existing) {
    return response.status(409).json({ success: false, error: 'Ese email ya está registrado.' });
  }

  // Crear usuario — sin setear status (usa el default de la columna: TRUE)
  const result = await insert('admin_user')
    .given({
      full_name: cleanName,
      email: cleanEmail,
      password: hashPassword(String(password))
    })
    .execute(pool);

  // insert() devuelve el row con RETURNING * y añade insertId apuntando a la PK
  const adminUserId = result?.admin_user_id ?? result?.insertId ?? null;

  return response.status(201).json({
    success: true,
    data: {
      adminUserId,
      email: cleanEmail,
      fullName: cleanName
    }
  });
}
