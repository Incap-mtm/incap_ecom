const limits = new Map(); // IP → { count, resetAt }
const MAX_REQUESTS = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
export default function rateLimit(request, response, next) {
    const ip = request.ip || request.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = limits.get(ip);
    if (!record || now > record.resetAt) {
        limits.set(ip, {
            count: 1,
            resetAt: now + WINDOW_MS
        });
        return next();
    }
    if (record.count >= MAX_REQUESTS) {
        return response.status(429).json({
            error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
        });
    }
    record.count += 1;
    next();
}
