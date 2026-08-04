# Nabhi Studio — Production readiness procedure

Status key: **Present** · **Partial** · **Missing** · **Descope** · **Written, unverified** (YAML/docs exist; never executed green in CI/remote)

Work top-down. Do not start P1 until P0 blockers for a controlled pilot are green.
Update the Status column when an item ships (and note the PR/date).

**Re-audit note (2026-08-04):** GitHub Actions and nightly backup are **not** Present until a remote exists and workflows run green once. Local backup drill and code paths can still be Present/Partial independently.

---

## Phase 0 — Foundations (do first)

| # | Item | Pri | Status | Acceptance |
|---|------|-----|--------|------------|
| 0.1 | Git repo + `.gitignore` (ignore `.env`, `node_modules`, `.next`, secrets) | P0 | Partial | `.gitignore` added; init git when ready |
| 0.2 | `SESSION_SECRET` / secrets via env (not hardcoded defaults in prod) | P0 | Partial | `SESSION_SECRET` in `.env.example`; prod throws if missing |
| 0.3 | Auth on all Studio API + UI routes | P0 | Present | Cookie session; middleware + `requireUser` / hospital ACL |
| 0.4 | Per-hospital authorization (membership) | P0 | Present | `HospitalMembership` + 403 cross-tenant |
| 0.5 | Publisher role for publish/rollback | P1 | Present | `PUBLISHER`+ required on publish/rollback |
| 0.6 | Audit log table for publish / rollback / hospital delete | P0 | Partial | `AuditLog` + writes on create/update/delete/publish/rollback |

---

## Phase 1 — P0 security & tenancy

| # | Item | Pri | Status | Notes |
|---|------|-----|--------|-------|
| 1.1 | Schema-validate section content on API PATCH (not client-only) | P0 | Present | `validateSectionContent` on section PATCH |
| 1.2 | Reject `javascript:` / HTML payloads in string fields | P0 | Present | `sanitize-html` empty allowlist (reject if strip changes value) |
| 1.2a | CSRF on mutating Studio APIs | P0 | Present | `X-Nabhi-Requested-With` + Origin/Referer host check; SameSite=Lax cookie |
| 1.2b | Session revocation / max lifetime | P0 | Present | 14-day cookie; `User.sessionVersion` kill switch (`bumpSessionVersion`) |
| 1.3 | Image upload magic-byte sniff + allow-list | P1 | Partial | MIME+size today; sniff next |
| 1.4 | Rate limit login + media upload | P1 | Missing | |
| 1.5 | Cross-tenant isolation automated tests in CI | P0 | Present | `test:tenant` + CI job with Postgres |
| 1.6 | Builder DB RLS (or enforced tenant middleware) | P1 | Missing | Copy HMS pattern when ready |

---

## Phase 2 — P0 publish reliability

| # | Item | Pri | Status | Notes |
|---|------|-----|--------|-------|
| 2.1 | One in-flight publish per hospital | P1 | Present | 409 if PENDING/BUILDING/UPLOADING |
| 2.2 | Atomic promote-to-live (manifest / pointer swap) | P0 | Present | Single `LIVE` pointer; CDN serves versions/{id} |
| 2.3 | Idempotent retry (never promote partial upload) | P0 | Present | `.complete` marker last; promote asserts it |
| 2.4 | Rollback blocked if snapshot incomplete | P1 | Present | IncompleteSnapshotError → 400 |
| 2.5 | Hospital delete purges MinIO + jobs + audit | P1 | Present | `purgeHospitalStorage`; queue purge deferred |

---

## Phase 3 — P0 ops / CDN / data

| # | Item | Pri | Status |
|---|------|-----|--------|
| 3.1 | Real CDN + cache purge on publish/rollback | P0 | Partial | Cloudflare purge hooked; edge Worker + R2 still to provision (see `docs/ops/DEPLOY.md`) |
| 3.2 | TLS everywhere (Studio + published sites) | P0 | Partial | Vercel/Cloudflare path documented; local remains HTTP |
| 3.3 | Builder DB automated backup + tested restore (RPO/RTO) | P0 | Partial | Local drill Present; nightly Action **Written, unverified** (no remote / secrets) |
| 3.3a | Object store backup / retention | P1 | Partial | Policy: `docs/ops/OBJECT_STORE_RETENTION.md` — no separate bucket backup yet |
| 3.4 | Encryption at rest (Postgres + object store) | P0 | Partial | Acceptance = managed Neon/R2 (documented); local Docker not encrypted |
| 3.5 | Structured logs + error tracking (tenant/job ids) | P0/P1 | Partial |
| 3.6 | Staging environment mirroring prod topology | P1 | Missing |
| 3.7 | CI: lint / typecheck / test on every PR | P0 | Present | `.github/workflows/ci.yml` green on `main` (2026-08-04) |
| 3.8 | Automated deploy for studio + worker | P0 | Written, unverified | Workflows skip until Vercel/registry secrets are set |
| 3.9 | E2E: create → publish → live → rollback | P0 | Present | `test:pipeline` re-run green after LIVE + privacy + CDN path fix (2026-08-04) |

---

## Phase 4 — Compliance & product (before first external hospital)

| # | Item | Pri | Status |
|---|------|-----|--------|
| 4.1 | Written legal classification of marketing-site PII | P0 | Partial | Template ready: `docs/legal/DATA_CLASSIFICATION.md` — needs human sign-off |
| 4.2 | Consent / takedown for testimonials & patient photos | P1 | Missing |
| 4.3 | DPA / ToS before onboarding | P1 | Missing |
| 4.4 | Remove or ship AI Suggest UI | P2 | Partial (disabled placeholder) |
| 4.5 | Undo/redo for section content | P1 | Missing |
| 4.6 | A11y checks across layouts | P1 | Missing |
| 4.7 | Custom domain: ship E2E **or** mark unavailable in UI | P2 | Present | Marked unavailable in Hospital settings |
| 4.8 | Published-site privacy / cookie consent template | P1 | Present | `/privacy/` page + footer link on published sites |

---

## Phase 5 — Content lifecycle, SEO, scale (second-pass gaps)

| # | Item | Pri | Status | Notes |
|---|------|-----|--------|-------|
| 5.1 | **Schema evolution / content migration** | P0 | Present | `contentSchemaVersion` + `migrateSectionContent`; migrate on open/save/publish |
| 5.2 | Content review before publish (approvedBy / gate) | P1 | Partial | Default = self-attestation + `reviewNote` (audit trail). Optional `REQUIRE_DISTINCT_APPROVER`. Policy: `docs/ops/PILOT_ACCOUNTS.md` |
| 5.3 | SEO: meta, OG, sitemap.xml, robots.txt | P1 | Present | Hospital SEO fields; export robots + sitemap; OG in layout |
| 5.4 | schema.org MedicalOrganization (or Hospital) JSON-LD | P2 | Present | Basic JSON-LD in site-renderer layout |
| 5.5 | Performance budgets / CWV targets | P2 | Missing | 70 inline-styled layouts; no budget or measurement |
| 5.6 | i18n / multi-locale content per hospital | P2 | **Descope** until customer asks | Assume English-only for pilot; document in product scope |
| 5.7 | Redis auth/ACL + global publish backpressure | P1 | Partial | Local Redis `requirepass`; global queue concurrency still open |

---

## Phase 6 — Business / ops (production SaaS, not just eng)

| # | Item | Pri | Status | Notes |
|---|------|-----|--------|-------|
| 6.1 | Hospital onboarding flow (provision, defaults, first admin) | P1 | Partial | Create hospital + starter pages; first prod admin = manual insert (`docs/ops/PILOT_ACCOUNTS.md`) |
| 6.2 | Offboarding / content export (JSON or zip of site) | P1 | Missing | Delete exists; no portable export |
| 6.3 | Billing / metering per tenant | P2 | **Descope** for pilot | Pricing not in brief |
| 6.4 | Support / escalation path for operators | P2 | Missing | Process, not code |

---

## Explicit descope for v1 pilot

Document these as **not available** unless a customer blocks on them:

- Custom domains
- AI copy generation
- Rich text editor
- Per-tenant quotas
- Visual regression suite (70 layouts)
- Load test at multi-tenant scale
- Brand presets across hospitals
- **i18n / multi-language** (5.6)
- **Billing / metering** (6.3)

---

## Pilot go-live gate

Controlled pilot (1–2 friendly hospitals) only when **all** are green:

- [ ] 0.1–0.4, 0.6
- [ ] 1.1, 1.5
- [ ] 2.2, 2.3
- [ ] 3.1–3.4, 3.7–3.9
- [ ] 4.1 (legal sign-off)

Public multi-tenant launch also needs: publisher roles (0.5), rate limits (1.4), builder RLS or equivalent (1.6), retention policy, on-call runbook, **content schema migration (5.1)**, SEO basics (5.3), review gate or documented publisher accountability (5.2).

---

## Change log

| Date | Change |
|------|--------|
| 2026-08-04 | Initial procedure from Claude checklist × repo gap analysis |
| 2026-08-04 | Phase 0.3–0.5: cookie sessions, memberships, publisher gate, AuditLog; `.gitignore` |
| 2026-08-04 | Content validate+sanitize on PATCH; LIVE pointer promote; CDN Node proxy; publish 409 lock |
| 2026-08-04 | MinIO purge on delete; CI + tenant tests; backup scripts; pipeline rollback E2E |
| 2026-08-04 | Phase 5–6: schema migration, SEO, review, i18n descope, Redis, onboarding/export/billing |
| 2026-08-04 | Shipped 5.1–5.4: contentSchemaVersion migrate, reviewNote, SEO+OG+sitemap/robots, JSON-LD |
| 2026-08-04 | Prod ops: Vercel/worker deploy workflows, CF purge, backup drill, legal template, privacy page, Redis auth |
| 2026-08-04 | Claude re-audit: Actions → Written/unverified; CSRF; sessionVersion; sanitize-html; review/object-store/pilot docs |