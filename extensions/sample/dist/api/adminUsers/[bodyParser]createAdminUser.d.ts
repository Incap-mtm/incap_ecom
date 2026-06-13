/**
 * POST /api/admin-users
 * Crea un nuevo usuario admin.
 * access: private — el middleware global de auth garantiza que solo admins logueados lleguen aquí.
 */
export default function createAdminUser(request: any, response: any): Promise<any>;
