import { pool } from '@evershop/evershop/lib/postgres';
import { del, select } from '@evershop/postgres-query-builder';
/**
 * DELETE /api/admin-users/:id
 * Elimina un usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default async function deleteAdminUser(request, response) {
    var _a, _b, _c;
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
        return response.status(400).json({ success: false, error: 'ID de usuario inválido.' });
    }
    const currentUser = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    const currentUserId = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.admin_user_id) !== null && _a !== void 0 ? _a : null;
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
        const { rows: countRows } = await pool.query('SELECT COUNT(*)::int AS cnt FROM admin_user WHERE status = true');
        const activeCount = (_c = (_b = countRows[0]) === null || _b === void 0 ? void 0 : _b.cnt) !== null && _c !== void 0 ? _c : 0;
        if (activeCount <= 1) {
            return response.status(409).json({ success: false, error: 'No podés eliminar al último usuario admin activo.' });
        }
    }
    await del('admin_user')
        .where('admin_user_id', '=', id)
        .execute(pool);
    return response.json({ success: true, data: { adminUserId: id } });
}
//# sourceMappingURL=deleteAdminUser.js.map