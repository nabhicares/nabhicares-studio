FROM node:20-alpine
WORKDIR /app
COPY server.js .
ENV PORT=80
ENV MINIO_URL=http://minio:9000
ENV SNAPSHOT_BUCKET=nabhicares-sites
EXPOSE 80
CMD ["node", "server.js"]
