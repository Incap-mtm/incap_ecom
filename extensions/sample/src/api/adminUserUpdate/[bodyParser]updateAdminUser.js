import { pool } from '@evershop/evershop/lib/postgres';
import { hashPassword } from '@evershop/evershop/lib/util/passwordHelper';
import { select, update } from '@evershop/postgres-query-builder';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * PATCH /api/admin-users/:id
 * Edita nombre, email, status y/o contraseña de un usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default async function updateAdminUser(request, response) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return response.status(400).json({ success: false, error: 'ID de usuario inválido.' });
  }

  const currentUser = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
  const currentUserId = currentUser?.admin_user_id ?? null;

  const { full_name, email, password, status } = request.body || {};
  const fields = {};

  // full_name
  if (full_name !== undefined) {
    if (String(full_name).trim().length === 0) {
      return response.status(400).json({ success: false, error: 'El nombre completo no puede estar vacío.' });
    }
    fields.full_name = String(full_name).trim();
  }

  // email
  if (email !== undefined) {
    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return response.status(400).json({ success: false, error: 'El email no tiene un formato válido.' });
    }
    // Verificar unicidad excluyendo al propio usuario
    const existing = await select()
      .from('admin_user')
      .where('email', 'ILIKE', cleanEmail)
      .load(pool);
    if (existing && existing.admin_user_id !== id) {
      return response.status(409).json({ success: false, error: 'Ese email ya está en uso por otro usuario.' });
    }
    fields.email = cleanEmail;
  }

  // password (opcional — solo se actualiza si viene no vacío y tiene >= 8 chars)
  if (password !== undefined && String(password).length > 0) {
    if (String(password).length < 8) {
      return response.status(400).json({ success: false, error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    fields.password = hashPassword(String(password));
  }

  // status
  if (status !== undefined) {
    // La columna es boolean; el login compara con 1 (truthy). Guardamos como boolean.
    const newStatus = status === true || status === 1 || status === 'true' || status === '1';

    if (!newStatus) {
      // Guarda anti-lockout al desactivar
      if (currentUserId !== null && currentUserId === id) {
        return response.status(409).json({ success: false, error: 'No podés desactivar tu propio usuario.' });
      }
      // Contar cuántos admins activos hay
      const countRow = await select('COUNT(admin_user_id) as cnt')
        .from('admin_user')
        .where('status', '=', true)
        .load(pool);
      const activeCount = parseInt(countRow?.cnt ?? '0', 10);
      if (activeCount <= 1) {
        return response.status(409).json({ success: false, error: 'No podés desactivar al último usuario admin activo.' });
      }
    }

    fields.status = newStatus;
  }

  if (Object.keys(fields).length === 0) {
    return response.status(400).json({ success: false, error: 'No se enviaron campos para actualizar.' });
  }

  await update('admin_user')
    .given(fields)
    .where('admin_user_id', '=', id)
    .execute(pool);

  return response.json({ success: true, data: { adminUserId: id } });
}
