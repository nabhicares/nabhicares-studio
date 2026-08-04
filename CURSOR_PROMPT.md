# Cursor prompt: bring up nabhicares infra, verify it, then build Studio

Paste this into Cursor at the root of this repo. Work through the phases
in order - do not start Phase 2 until Phase 1's verification step passes,
and do not start Phase 3 until Phase 2's verification step passes.

---

## Phase 1 - Bring up and verify the infra

Context: this repo has docker-compose services for two Postgres databases
(builder + HMS), Redis, MinIO (S3-compatible snapshot store), and an nginx
CDN simulator. There's also a BullMQ publish worker at
`apps/publish-worker` with a stubbed build step.

Tasks:
1. Run `docker-compose up -d` and confirm all six containers are healthy
   (`docker ps` should show postgres-builder, postgres-hms, redis, minio,
   minio-init exited 0, cdn-sim all running).
2. Install root deps (`npm install` at root, then inside
   `apps/hms-backend` and `apps/publish-worker`).
3. Run `npx prisma generate` and `npx prisma migrate dev --name init` in
   both `packages/db-builder` and `apps/hms-backend` against their
   respective `DATABASE_URL`s from `.env`.
4. Apply `apps/hms-backend/prisma/sql/rls.sql` to the HMS database. Verify
   RLS is actually active by connecting as the `hms` user, NOT setting
   `app.current_tenant_id`, and confirming a `SELECT * FROM "Patient"`
   returns zero rows even though rows exist - if it returns all rows, RLS
   isn't working and you must find out why before proceeding.
5. Start the publish worker (`npm run dev` in `apps/publish-worker`).
6. Run `npm run test:pipeline` in `apps/publish-worker`. This must print
   "✅ Pipeline works" and show the HTML actually served from
   `http://localhost:8080/demo-hospital/`.

**Verification gate**: paste me the output of `test:pipeline` and the
result of the RLS zero-rows check before moving to Phase 2. If either
fails, debug it here - don't paper over it and move on, since both are
foundational safety/correctness guarantees for everything built after.

---

## Phase 2 - Replace the stubbed build step with a real static export

Context: `apps/publish-worker/src/index.ts` has a `buildStaticSite()`
function that currently returns one hardcoded HTML file. Replace it with a
real build.

Tasks:
1. Create a minimal Next.js 14 app inside a new package,
   `packages/site-renderer`, configured with `output: 'export'`. It should
   accept a hospital's resolved page/section data as build-time input
   (e.g. written to a JSON file the Next.js app reads via
   `getStaticProps`/app-router equivalent) and render one static page per
   `Page` row for that hospital, iterating enabled `Section`s in `order`.
2. For now, each section type (hero, about, doctors, services, gallery,
   faq, testimonials) can render a simple placeholder component that just
   dumps its `content` JSON - the real designed components come later.
   The point of this phase is proving the *pipeline* renders real HTML
   files, not visual polish.
3. Update `buildStaticSite()` in the worker to: query the builder DB
   (`packages/db-builder`'s Prisma client) for the hospital's Pages +
   Sections + resolved Template versions, write that as input, run the
   Next.js export as a child process, and return the resulting files
   from the `out/` directory instead of the hardcoded HTML.
4. Re-run `npm run test:pipeline` - it should now show real exported
   Next.js HTML/CSS/JS being served through the CDN simulator, not the
   placeholder string.
5. Add a second test hospital with multiple pages and sections (some
   `enabled: false`) and confirm disabled sections are correctly excluded
   from the build output.

**Verification gate**: paste me the directory listing of a generated
`out/` folder and confirm the CDN simulator serves multi-page output
(e.g. `/demo-hospital/doctors/` in addition to `/demo-hospital/`) before
moving to Phase 3.

---

## Phase 3 - Build Studio (the builder frontend) completely

Context: everything below Studio now works and is proven. This phase
builds the actual product surface at `apps/studio`.

Tasks:
1. Scaffold `apps/studio` as a Next.js 14 app (this one runs dynamically,
   it's an internal tool, not published) with a thin API layer
   (`app/api/*` routes or a small NestJS BFF - your call) that is the
   *only* thing allowed to read/write the builder DB. The browser never
   talks to Postgres directly.
2. Build the section registry: a config-driven list of available section
   types, each mapping to (a) an editable-fields schema matching
   `Template.schema` in the builder DB, and (b) the actual React
   component used by `packages/site-renderer` for rendering. Adding a new
   section type should mean adding one entry here, not touching existing
   hospitals' data.
3. Build the page editor: list of sections on a page, drag-to-reorder
   (persist `Section.order`), toggle enable/disable per section, and a
   form (generated from the section's schema) to edit `Section.content`.
   Enforce that this form only ever edits content fields - never exposes
   raw color/spacing values, since those belong to the global design
   system, not per-hospital content.
4. Build the global design system settings screen: colors, typography,
   spacing, button radius etc., stored once per hospital (or per brand
   tier if you want shared presets), consumed by `site-renderer` as CSS
   custom properties injected at build time - never hardcoded into any
   section component.
5. Wire the "Publish" button: creates a `Publish` row in the builder DB
   with `status: PENDING`, enqueues a job via `publishQueue.add(...)`
   (import from `apps/publish-worker/src/queue.ts` - move this to a
   shared package if importing across app boundaries gets awkward), and
   polls/shows status until the worker flips it to `LIVE`.
6. Build a simple publish history view per hospital (list of `Publish`
   rows) with a "rollback to this version" button that calls
   `promoteToLive(hospitalId, olderPublishId)` directly - prove that a
   rollback is instant and doesn't trigger a rebuild.
7. Add draft vs. published state handling: Studio should always show and
   edit `Page`/`Section` rows regardless of publish status, and a
   "preview" mode that renders draft content without affecting what's
   live - don't let editing accidentally mutate what's served by the CDN
   until Publish is explicitly clicked.

Work through these in order within Phase 3 too; each one is meaningfully
testable before starting the next. Flag any point where a design decision
in the earlier architecture (schema shape, RLS scope, template versioning)
turns out to be wrong once you're actually building against it - don't
silently work around a bad assumption, surface it.
