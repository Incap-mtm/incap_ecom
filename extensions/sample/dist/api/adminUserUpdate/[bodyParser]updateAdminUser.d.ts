/**
 * PATCH /api/admin-users/:id
 * Edita nombre, email, status y/o contraseña de un usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default function updateAdminUser(request: any, response: any): Promise<any>;
