import multer from 'multer';
/**
 * Middleware multer para la subida de portadas del blog (imágenes, máx 5 MB).
 * Se guarda en memoria (buffer) y el handler [multerCover]blogCover.js lo
 * convierte a WebP con sharp y lo escribe en el volumen de media.
 * El campo del form debe llamarse `cover`.
 *
 * NOTA (CLAUDE.md): este companion es OBLIGATORIO porque el handler usa el
 * prefijo [multerCover]; sin este archivo, sortMiddlewares lo descartaría en
 * silencio respondiendo {} 200 sin efecto.
 */
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB (antes de conversión a WebP)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES, files: 1 },
    fileFilter: (_request, file, cb) => {
        if (/^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten imágenes (JPEG, PNG, WebP, GIF).'));
        }
    },
});
export default (request, response, next) => {
    upload.single('cover')(request, response, (err) => {
        if (err) {
            const msg = err.code === 'LIMIT_FILE_SIZE'
                ? 'La imagen supera el límite de 5 MB.'
                : err.message || 'Error al procesar la imagen.';
            return response.status(400).json({ success: false, error: msg });
        }
        return next();
    });
};
//# sourceMappingURL=multerCover.js.map