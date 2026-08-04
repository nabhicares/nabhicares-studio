#!/bin/sh
set -e
PORT="${PORT:-9000}"
exec minio server /data --address ":${PORT}" --console-address ":9001"
