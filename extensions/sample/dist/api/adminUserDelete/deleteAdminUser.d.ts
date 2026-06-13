/**
 * DELETE /api/admin-users/:id
 * Elimina un usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default function deleteAdminUser(request: any, response: any): Promise<any>;
