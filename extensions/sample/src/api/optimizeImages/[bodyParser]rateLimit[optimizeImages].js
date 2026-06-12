// Rate limit para la conversión de imágenes (operación pesada).
const limits = new Map();
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 1000;

export default function rateLimit(request, response, next) {
  const ip = request.ip || request.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = limits.get(ip);
  if (!record || now > record.resetAt) {
    limits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  if (record.count >= MAX_REQUESTS) {
    return response.status(429).json({ error: 'Demasiadas solicitudes. Esperá un minuto.' });
  }
  record.count += 1;
  next();
}
