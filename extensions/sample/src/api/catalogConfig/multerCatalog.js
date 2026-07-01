import multer from 'multer';

/**
 * Middleware multer para la subida del catálogo (PDF, máx 15 MB). El archivo es
 * OPCIONAL: el admin puede guardar solo el texto del botón sin subir un PDF nuevo.
 * El campo del form debe llamarse `catalog`.
 *
 * NOTA (CLAUDE.md): este companion es OBLIGATORIO porque el handler declara la
 * dependencia [multerCatalog]; sin él, sortMiddlewares descartaría el handler en
 * silencio (respondería {} 200 sin persistir).
 */
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_request, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('El catálogo debe ser un archivo PDF.'));
    }
  },
});

export default (request, response, next) => {
  // .single() acepta que no venga archivo (req.file quedará undefined).
  upload.single('catalog')(request, response, (err) => {
    if (err) {
      const msg =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'El PDF supera el límite de 15 MB.'
          : err.message || 'Error al procesar el archivo.';
      return response.status(400).json({ success: false, error: msg });
    }
    return next();
  });
};
