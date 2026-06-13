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
    var _a, _b, _c;
    console.error('[createAdminUser] HANDLER REACHED body=', JSON.stringify(request.body || null));
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
    let result;
    try {
        result = await insert('admin_user')
            .given({
            full_name: cleanName,
            email: cleanEmail,
            password: hashPassword(String(password))
        })
            .execute(pool);
        console.error('[createAdminUser] INSERT OK result=', JSON.stringify(result));
    }
    catch (err) {
        console.error('[createAdminUser] INSERT ERROR=', err && err.message, err && err.stack);
        return response.status(500).json({
            success: false,
            error: 'INSERT falló: ' + (err && err.message ? err.message : String(err))
        });
    }
    // insert() devuelve el row con RETURNING * y añade insertId apuntando a la PK
    const adminUserId = (_b = (_a = result === null || result === void 0 ? void 0 : result.admin_user_id) !== null && _a !== void 0 ? _a : result === null || result === void 0 ? void 0 : result.insertId) !== null && _b !== void 0 ? _b : null;
    // Read-back de verificación: ¿realmente quedó en la DB?
    let readBackId = null;
    try {
        const check = await select()
            .from('admin_user')
            .where('email', 'ILIKE', cleanEmail)
            .load(pool);
        readBackId = (_c = check === null || check === void 0 ? void 0 : check.admin_user_id) !== null && _c !== void 0 ? _c : null;
        console.error('[createAdminUser] READ-BACK admin_user_id=', readBackId);
    }
    catch (err) {
        console.error('[createAdminUser] READ-BACK ERROR=', err && err.message);
    }
    return response.status(201).json({
        success: true,
        data: {
            adminUserId,
            email: cleanEmail,
            fullName: cleanName
        },
        _debug: {
            insertReturned: result !== null && result !== void 0 ? result : null,
            readBackId
        }
    });
}
//# sourceMappingURL=%5BbodyParser%5DcreateAdminUser.js.map