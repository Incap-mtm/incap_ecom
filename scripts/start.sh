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

# Create admin user if credentials are set (idempotent — uses INSERT ON CONFLICT)
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ] && [ -n "$ADMIN_FULLNAME" ]; then
  echo "Creating admin user ${ADMIN_EMAIL}..."
  node_modules/.bin/evershop user:create \
    --name "$ADMIN_FULLNAME" \
    --email "$ADMIN_EMAIL" \
    --password "$ADMIN_PASSWORD" || true
fi

exec npm start
