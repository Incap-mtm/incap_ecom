#!/bin/sh
set -e

# Create admin user if credentials are set (idempotent — uses INSERT ON CONFLICT)
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ] && [ -n "$ADMIN_FULLNAME" ]; then
  echo "Creating admin user $ADMIN_EMAIL..."
  node_modules/.bin/evershop user:create \
    --name "$ADMIN_FULLNAME" \
    --email "$ADMIN_EMAIL" \
    --password "$ADMIN_PASSWORD" || true
fi

exec npm start
