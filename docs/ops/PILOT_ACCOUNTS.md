# Pilot accounts & review gate

## Seed passwords (local only)

`seed-builder` creates:

| Email | Password | Role |
|-------|----------|------|
| `admin@nabhi.local` | `admin123` | Super admin |
| `editor@nabhi.local` | `editor123` | EDITOR on demo-hospital |

**These must never exist in production.** Seed skips auth users when `NODE_ENV=production`.

## First production admin (until onboarding exists)

Manual insert against builder Postgres:

1. Hash a strong password with Studio’s scrypt format (`salt:hex` via `hashPassword` in `apps/studio/lib/auth.ts`, or a one-off script).
2. Insert `User` (`isSuperAdmin` only if Nabhi staff).
3. Insert `HospitalMembership` with `ADMIN` or `PUBLISHER` for the hospital.
4. Sign in via Studio login.

No invite email flow yet — accepted for a 1–2 hospital pilot.

## Review gate policy (pilot decision)

**Default (self-attestation):** Publisher must enter a non-empty `reviewNote`. `approvedBy` is set to the same user. This is an **audit trail** (“who published and what they claimed to check”), **not** a second-person medical-credentials gate.

**Stricter (optional):** Set `REQUIRE_DISTINCT_APPROVER=true`. Then POST `/publish` must include `approvedBy` ≠ publisher; approver must be PUBLISHER/ADMIN for that hospital (or super admin). Needs ≥2 such members unless approver is super admin.

Pilot recommendation: keep default self-attestation; require hospitals to name a responsible publisher in the contract; turn on `REQUIRE_DISTINCT_APPROVER` when a hospital has two trained operators.

## Session lifetime & revocation

- Cookie: `nabhi_session`, **httpOnly**, **SameSite=Lax**, **Secure** in production, **max age 14 days**.
- Payload includes `sessionVersion`. Bump `User.sessionVersion` (via `bumpSessionVersion(userId)`) to invalidate all existing cookies immediately.
- Logout only clears the current browser cookie; use version bump for compromised accounts.

## CSRF

Mutating `/api/*` requests require header `X-Nabhi-Requested-With: studio` plus Origin/Referer host match when those headers are present. Studio clients use `apiFetch` from `lib/api-client.ts`.
