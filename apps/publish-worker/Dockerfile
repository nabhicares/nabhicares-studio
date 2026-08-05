# Production publish-worker (Render free Web Service / Fly / Railway).
# Uses full npm ci (needs prisma + tsx + next for site export).
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

# Keep devDeps: prisma CLI, tsx, typescript used at runtime/build
RUN npm ci

COPY . .

RUN npx prisma generate --schema=packages/db-builder/prisma/schema.prisma

WORKDIR /app/apps/publish-worker
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["npx", "tsx", "src/index.ts"]
