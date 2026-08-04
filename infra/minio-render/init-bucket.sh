#!/bin/sh
# Creates nabhicares-sites bucket once MinIO is reachable.
# Used as a one-off Render job / or run locally against Render MinIO URL.
set -e
ENDPOINT="${SNAPSHOT_STORE_ENDPOINT:?}"
KEY="${SNAPSHOT_STORE_KEY:?}"
SECRET="${SNAPSHOT_STORE_SECRET:?}"
BUCKET="${SNAPSHOT_BUCKET:-nabhicares-sites}"

apk add --no-cache curl >/dev/null 2>&1 || true
mc alias set render "$ENDPOINT" "$KEY" "$SECRET"
mc mb -p "render/${BUCKET}" || true
mc anonymous set download "render/${BUCKET}" || true
echo "bucket ${BUCKET} ready on ${ENDPOINT}"
