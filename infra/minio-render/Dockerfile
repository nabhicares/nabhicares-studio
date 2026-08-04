# Self-contained MinIO image for Render (no COPY — works even with empty build context).
# Listens on $PORT (Render injects this, usually 10000).
FROM debian:bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && curl -fsSL https://dl.min.io/server/minio/release/linux-amd64/minio -o /usr/local/bin/minio \
  && chmod +x /usr/local/bin/minio \
  && rm -rf /var/lib/apt/lists/*

ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "mkdir -p /data && exec minio server /data --address \":${PORT:-10000}\" --console-address \":9001\""]
