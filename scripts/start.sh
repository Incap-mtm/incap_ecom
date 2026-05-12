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

# Seed media volume on first run (volume is empty initially)
if [ -z "$(ls -A /app/media 2>/dev/null)" ]; then
  if [ -d /app/media-default ]; then
    echo "Seeding media volume from image..."
    cp -r /app/media-default/. /app/media/
    echo "Media seeded: $(find /app/media -type f | wc -l) files."
  else
    echo "Seeding media volume from GitHub..."
    REPO="https://raw.githubusercontent.com/Incap-mtm/incap_ecom/main/media"
    mkdir -p /app/media/home /app/media/industrias/Maderas_y_muebles \
              "/app/media/industrias/Calzados_y_marroquineria" \
              "/app/media/industrias/Colchones" \
              "/app/media/industrias/hoga_manualidades_multiuso"
    wget -q "${REPO}/home/Banner_Home_Principal.png"            -O "/app/media/home/Banner_Home_Principal.png" || true
    wget -q "${REPO}/home/Uniendo_Legado_Home.png"              -O "/app/media/home/Uniendo_Legado_Home.png" || true
    wget -q "${REPO}/home/Fallas_De_Pegue%20-contacto.png"      -O "/app/media/home/Fallas_De_Pegue -contacto.png" || true
    wget -q "${REPO}/industrias/Maderas_y_muebles/Banner_maderas_y_muebles.png" \
                                                                -O "/app/media/industrias/Maderas_y_muebles/Banner_maderas_y_muebles.png" || true
    wget -q "${REPO}/industrias/Calzados_y_marroquineria/Banner_Calzado_Marroquiner%C3%ADa.png" \
                                                                -O "/app/media/industrias/Calzados_y_marroquineria/Banner_Calzado_Marroquinería.png" || true
    wget -q "${REPO}/industrias/Colchones/Banner_Colchones_Secci%C3%B3n.png" \
                                                                -O "/app/media/industrias/Colchones/Banner_Colchones_Sección.png" || true
    wget -q "${REPO}/industrias/hoga_manualidades_multiuso/Banner_Hogar_Multiusos.png" \
                                                                -O "/app/media/industrias/hoga_manualidades_multiuso/Banner_Hogar_Multiusos.png" || true
    echo "Media seeded: $(find /app/media -type f | wc -l) files."
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

exec npm start
