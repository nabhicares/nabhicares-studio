# Object store retention & backup (pilot)

Builder **Postgres** has automated backup scripts + optional nightly GitHub Action (`backup-builder.yml`).

**Object storage** (MinIO locally / R2 in prod) holds:

- Uploaded hospital media (`{slug}/assets/…`)
- Published version trees (`{slug}/versions/{publishId}/…`)
- Atomic live pointer (`{slug}/LIVE`)

## Pilot policy (accepted risk)

| Item | Policy |
|------|--------|
| Version snapshots | Retained indefinitely until hospital delete or manual purge |
| Separate object-store backup | **None yet** — versions on the same bucket are the only recovery path |
| Media without a published version | At risk if bucket corrupted/deleted |
| Hospital delete | `purgeHospitalStorage` removes that slug’s prefix |

**Accepted for pilot:** if R2/MinIO is lost, rebuild content from Builder DB + re-publish; unrecovered orphan media is acceptable for 1–2 friendly hospitals. Document customer expectation accordingly.

## Before public multi-tenant

- Enable R2 versioning **or** periodic `rclone`/`aws s3 sync` of the bucket to a second region/account.
- Define retention (e.g. keep last N publishes per hospital; GC older `versions/`).
- Add restore drill for object store analogous to `verify-backup-drill.ps1`.

## Data subject photo/testimonial removal

No automated takedown API yet. Manual ops:

1. Remove/replace image URL in Studio section content; re-publish.
2. Optionally delete object key from the bucket.
3. Log request in support/ticket system.

Track product work under PRODUCTION_READINESS **4.2** (consent/takedown).
