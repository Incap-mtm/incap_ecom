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

# Seed product images from GitHub archive if missing from volume
PRODUCT_FILES=$(find /app/media/products -maxdepth 1 -type d 2>/dev/null | wc -l)
if [ "$PRODUCT_FILES" -le 1 ]; then
  echo "Product images missing — downloading from GitHub..."
  mkdir -p /app/media/products /tmp/mediaseed
  cd /tmp/mediaseed
  wget -q "https://github.com/gerriarte/Incap/archive/refs/heads/main.tar.gz" -O repo.tar.gz
  tar -xzf repo.tar.gz --wildcards 'Incap-main/media/products/*' --strip-components=3 -C /app/media/products/ 2>/dev/null || \
  tar -xzf repo.tar.gz -C /tmp/mediaseed/
  if [ -d /tmp/mediaseed/Incap-main/media/products ]; then
    cp -r /tmp/mediaseed/Incap-main/media/products/. /app/media/products/
  fi
  rm -rf /tmp/mediaseed
  cd /app
  echo "Product images seeded: $(find /app/media/products -type f | wc -l) files."
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
