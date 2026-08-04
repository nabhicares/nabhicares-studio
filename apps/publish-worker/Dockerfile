# Production publish-worker (Fly.io / Railway / any Docker host).
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/publish-worker/package.json apps/publish-worker/
COPY packages/db-builder/package.json packages/db-builder/
COPY packages/queue/package.json packages/queue/
COPY packages/section-registry/package.json packages/section-registry/
COPY packages/section-layouts/package.json packages/section-layouts/
COPY packages/snapshot-store/package.json packages/snapshot-store/
COPY packages/site-renderer/package.json packages/site-renderer/

RUN npm ci --omit=dev || npm ci

COPY . .

WORKDIR /app/packages/db-builder
RUN npx prisma generate

WORKDIR /app/apps/publish-worker
ENV NODE_ENV=production
CMD ["npx", "tsx", "src/index.ts"]
