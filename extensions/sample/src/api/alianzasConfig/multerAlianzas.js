import multer from 'multer';

/**
 * Middleware multer para la subida de la imagen del mapa de la sección
 * "Alianzas que construyen país" (Quiénes Somos). La imagen es OPCIONAL:
 * el admin puede guardar solo las ciudades / textos sin cambiar la imagen.
 * El campo del form debe llamarse `mapa`.
 *
 * NOTA (CLAUDE.md): este companion es OBLIGATORIO porque el handler declara la
 * dependencia [multerAlianzas]; sin él, sortMiddlewares descartaría el handler
 * en silencio (respondería {} 200 sin persistir).
 */
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB (se recomprime a WebP en el handler)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_request, file, cb) => {
    if (/^image\//.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('El mapa debe ser una imagen.'));
    }
  },
});

export default (request, response, next) => {
  // .single() acepta que no venga archivo (req.file quedará undefined).
  upload.single('mapa')(request, response, (err) => {
    if (err) {
      const msg =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'La imagen supera el límite de 8 MB.'
          : err.message || 'Error al procesar la imagen.';
      return response.status(400).json({ success: false, error: msg });
    }
    return next();
  });
};
