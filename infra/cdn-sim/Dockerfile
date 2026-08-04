FROM node:20-alpine
WORKDIR /app
COPY server.js .
ENV PORT=10000
ENV MINIO_URL=http://localhost:9000
ENV SNAPSHOT_BUCKET=nabhicares-sites
EXPOSE 10000
CMD ["node", "server.js"]
