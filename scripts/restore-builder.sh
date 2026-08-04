#!/usr/bin/env bash
# Restore builder DB from a gzipped pg_dump.
# Usage: ./scripts/restore-builder.sh backups/builder-YYYYMMDD.sql.gz
# WARNING: overwrites nabhicares_builder. Prefer restoring into a scratch DB first.
set -euo pipefail
FILE="${1:-}"
if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  echo "Usage: $0 path/to/builder-*.sql.gz"
  exit 1
fi
CONTAINER="${POSTGRES_CONTAINER:-nabhicares-postgres-builder}"
echo "Restoring $FILE into $CONTAINER / nabhicares_builder …"
gunzip -c "$FILE" | docker exec -i "$CONTAINER" psql -U builder -d nabhicares_builder -v ON_ERROR_STOP=1
echo "Restore finished. Spot-check: docker exec $CONTAINER psql -U builder -d nabhicares_builder -c 'SELECT count(*) FROM \"Hospital\";'"
