#!/bin/sh
set -e

# Wait for Postgres to accept TCP connections before doing anything else
echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
RETRIES=30
until node -e "
const net = require('net');
const s = net.createConnection({ host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) });
s.on('connect', () => { s.end(); process.exit(0); });
s.on('error', () => process.exit(1));
" 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "ERROR: Database not reachable after 30 attempts. Exiting."
    exit 1
  fi
  echo "Database not ready, retrying in 3s... ($RETRIES attempts left)"
  sleep 3
done
echo "Database is ready."

# Seed product images if missing from volume.
# Preferencia 1: copiar desde /app/media-default/products (viene del build = repo principal).
# Preferencia 2 (fallback): descargar tarball de gerriarte/Incap.
PRODUCT_FILES=$(find /app/media/products -maxdepth 1 -type d 2>/dev/null | wc -l)
if [ "$PRODUCT_FILES" -le 1 ]; then
  if [ -d /app/media-default/products ] && [ "$(find /app/media-default/products -type f 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "Product images missing — copying from /app/media-default/products..."
    mkdir -p /app/media/products
    cp -r /app/media-default/products/. /app/media/products/
    echo "Product images seeded from media-default: $(find /app/media/products -type f | wc -l) files."
  else
    echo "No hay imágenes de productos en media-default — se omite descarga. Subir imágenes via admin."
    mkdir -p /app/media/products
  fi
fi

# Create admin user if credentials are set (idempotent — uses INSERT ON CONFLICT)
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ] && [ -n "$ADMIN_FULLNAME" ]; then
  echo "Creating admin user ${ADMIN_EMAIL}..."
  node_modules/.bin/evershop user:create \
    --name "$ADMIN_FULLNAME" \
    --email "$ADMIN_EMAIL" \
    --password "$ADMIN_PASSWORD" || true
fi

# Diagnóstico puntual de errores 500 de API (normalmente OCULTOS en prod).
# El apiErrorHandler del core solo loguea el stack si isDevelopmentMode() o
# process.argv.includes('--debug'). Con DEBUG_API=1 arrancamos Evershop con
# --debug para que loguee el stack de las excepciones de API y de páginas.
# `evershop start` corre in-process → --debug queda en process.argv del server.
# Gate por env var → en prod queda APAGADO por defecto; prender solo para
# capturar un error y APAGAR (unset DEBUG_API) apenas se capture.
if [ "$DEBUG_API" = "1" ]; then
  echo "DEBUG_API=1 → arrancando Evershop con --debug (logging de errores de API/páginas activado)"
  exec npm start -- --debug
else
  exec npm start
fi
