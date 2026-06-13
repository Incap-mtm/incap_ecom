import { pool } from '@evershop/evershop/lib/postgres';
import { del, select } from '@evershop/postgres-query-builder';

/**
 * DELETE /api/admin-users/:id
 * Elimina un usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default async function deleteAdminUser(request, response) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return response.status(400).json({ success: false, error: 'ID de usuario inválido.' });
  }

  const currentUser = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
  const currentUserId = currentUser?.admin_user_id ?? null;

  // Guarda: no eliminar el propio usuario
  if (currentUserId !== null && currentUserId === id) {
    return response.status(409).json({ success: false, error: 'No podés eliminar tu propio usuario.' });
  }

  // Guarda: no eliminar el último admin activo
  // Primero verificar si el usuario a eliminar está activo
  const targetUser = await select()
    .from('admin_user')
    .where('admin_user_id', '=', id)
    .load(pool);

  if (!targetUser) {
    return response.status(404).json({ success: false, error: 'Usuario no encontrado.' });
  }

  if (targetUser.status) {
    const countRow = await select('COUNT(admin_user_id) as cnt')
      .from('admin_user')
      .where('status', '=', true)
      .load(pool);
    const activeCount = parseInt(countRow?.cnt ?? '0', 10);
    if (activeCount <= 1) {
      return response.status(409).json({ success: false, error: 'No podés eliminar al último usuario admin activo.' });
    }
  }

  await del('admin_user')
    .where('admin_user_id', '=', id)
    .execute(pool);

  return response.json({ success: true, data: { adminUserId: id } });
}
