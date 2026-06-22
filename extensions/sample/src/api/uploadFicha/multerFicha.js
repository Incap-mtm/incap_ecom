import multer from 'multer';

/**
 * Middleware multer para la subida de la ficha técnica (PDF, máx 1 MB).
 * Se guarda en memoria (buffer) y el handler [multerFicha]uploadFicha.js lo
 * escribe en el volumen de media. El campo del form debe llamarse `file`.
 *
 * NOTA (CLAUDE.md): este archivo DEBE existir porque el handler declara la
 * dependencia [multerFicha]; sin él, sortMiddlewares descartaría el handler en
 * silencio (respondería {} 200 sin persistir).
 */
const MAX_BYTES = 1024 * 1024; // 1 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (request, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF.'));
    }
  }
});

export default (request, response, next) => {
  upload.single('file')(request, response, (err) => {
    if (err) {
      const msg =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'El PDF supera el límite de 1 MB.'
          : err.message || 'Error al procesar el archivo.';
      return response.status(400).json({ success: false, error: msg });
    }
    return next();
  });
};
