railway variables set -e staging DB_HOST='${{Postgres.PGHOST}}' DB_PORT='${{Postgres.PGPORT}}' DB_USER='${{Postgres.PGUSER}}' DB_PASSWORD='${{Postgres.PGPASSWORD}}' DB_NAME='${{Postgres.PGDATABASE}}'
