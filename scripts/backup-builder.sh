#!/usr/bin/env bash
# Backup builder Postgres. RPO target: run this on a schedule (e.g. hourly).
# Restore: gunzip -c backups/builder-YYYYMMDD.sql.gz | docker exec -i nabhicares-postgres-builder psql -U builder -d nabhicares_builder
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$ROOT/backups}"
mkdir -p "$OUT_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$OUT_DIR/builder-$STAMP.sql.gz"
docker exec nabhicares-postgres-builder pg_dump -U builder -d nabhicares_builder | gzip > "$FILE"
echo "Wrote $FILE"
# Keep last 14 days
find "$OUT_DIR" -name 'builder-*.sql.gz' -mtime +14 -delete 2>/dev/null || true
