# Nabhi / nabhicares — Data classification & legal sign-off

**Status:** draft for counsel / founder review  
**Product:** Nabhi Studio (hospital *marketing* websites) — not the clinical HMS  
**Date:** _______________

## 1. What lives where

| Store | Contents | PHI? | Notes |
|-------|----------|------|-------|
| Builder DB | Hospital name/slug, page/section marketing copy, design tokens, publish metadata, Studio users | **No clinical PHI by design** | May contain **PII** (doctor names/photos/bios, patient *testimonial* names/quotes/photos) |
| MinIO / R2 | Static HTML/CSS/JS + uploaded images | Same as published marketing content | Public via CDN once published |
| HMS DB | Patients, appointments, staff (RLS) | **Yes — clinical** | Out of scope for Studio publish path |
| Redis | Publish job payloads (hospital slug, publish id, user id) | No | |

## 2. Classification decision (sign here)

We classify published Studio content as:

- [ ] **Marketing / publicly intended information only** — not medical records; still subject to consumer privacy / advertising rules in target jurisdictions (e.g. India DPDP, US state laws, GDPR if EU visitors).
- [ ] **Other:** ________________________________

Doctor credentials and patient testimonials on the public site:

- [ ] Require hospital publisher attestation (Studio `reviewNote` / `approvedBy`) before each publish.
- [ ] Require written patient/doctor consent stored **outside** the builder DB (hospital process).

Applicable regimes reviewed:

- [ ] India DPDP  
- [ ] HIPAA (US) — *marketing sites usually not a Covered Entity record, but counsel must confirm*  
- [ ] GDPR / UK GDPR  
- [ ] Other: ________

## 3. Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product / Nabhi | | | |
| Legal / counsel | | | |
| Security | | | |

**Pilot hospitals must not go live until this page is signed.**  
Engineering checklist item: `PRODUCTION_READINESS.md` §4.1
