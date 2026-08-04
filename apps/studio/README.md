# Studio (builder frontend)

Next.js 14 app at `apps/studio`. Browser talks only to `app/api/*`; those
routes are the only code that reads/writes the builder DB.

```bash
# from repo root, with docker-compose already up
cp .env.example .env   # if needed
npm install
cd packages/db-builder && npx prisma migrate dev
cd ../../apps/publish-worker && npm run seed && npm run dev

# another terminal
cd apps/studio && npm run dev
# open http://localhost:3000
```

Tabs per hospital: page editor, design system, publish/history/rollback,
draft preview.
