# MinIO for Render — listens on $PORT (Render injects this).
FROM minio/minio:latest
USER root
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
