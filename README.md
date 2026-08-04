# nabhicares infra

Local infrastructure for the Nabhi Labs platform: builder database, HMS
database (with RLS), job queue, snapshot store, and a CDN simulator - the
same shape that runs in production, just swapped for local equivalents.

| Production | Local (this repo) |
|---|---|
| Managed Postgres (builder) | `postgres-builder` container |
| Managed Postgres (HMS, RLS) | `postgres-hms` container |
| Managed Redis | `redis` container |
| S3 / Cloudflare R2 | `minio` container |
| Cloudflare CDN | `cdn-sim` (nginx) container |

## Run it

```bash
cp .env.example .env
docker-compose up -d
npm install

# set up both databases
npm run db:migrate:builder
npm run db:migrate:hms
# then apply RLS (see apps/hms-backend/prisma/sql/rls.sql) with:
docker cp apps/hms-backend/prisma/sql/rls.sql nabhicares-postgres-hms:/tmp/rls.sql
docker exec nabhicares-postgres-hms psql -U hms -d nabhicares_hms -f /tmp/rls.sql

# seed builder content + start worker
cd apps/publish-worker && npm run seed && npm run dev
```

HMS app connections must use `hms_app` (see `.env`) — the docker `hms`
role is a superuser and bypasses RLS.

## Test the full publish -> CDN pipeline

```bash
cd apps/publish-worker
npm run test:pipeline
```

## Studio

```bash
cd apps/studio && npm run dev
# http://localhost:3000
```

Sign in (after `npm run seed --workspace=publish-worker`):
- `admin@nabhi.local` / `admin123` — super admin (all hospitals)
- `editor@nabhi.local` / `editor123` — EDITOR on `demo-hospital` only (cannot publish)

Studio API routes require a session cookie. Publish/rollback need PUBLISHER+ role.
See `PRODUCTION_READINESS.md` for the go-live checklist.

```bash
npm test --workspace=@nabhicares/section-registry   # content validation unit tests
npm run test:tenant                                  # cross-tenant membership checks (DB up)
npm run test:pipeline --workspace=publish-worker     # publish → CDN → rollback (worker+cdn up)
powershell -File scripts/backup-builder.ps1          # dump builder DB
powershell -File scripts/verify-backup-drill.ps1     # backup → scratch restore → verify
```

Production deploy (CDN/TLS/Vercel/worker/R2): see **`docs/ops/DEPLOY.md`**.  
Legal sign-off template: **`docs/legal/DATA_CLASSIFICATION.md`**.

Studio API routes are the only path to the builder DB. Publish enqueues
BullMQ jobs; rollback calls `promoteToLive` (pointer flip, no rebuild).
