# Custom domains & subdomains

Published sites live in MinIO. The CDN (`nabhi-cdn`) routes by **path** or **hostname**.

## URL shapes

| Mode | Example |
|------|---------|
| Path (always works) | `https://nabhi-cdn.vercel.app/ashirwad-hospital/` |
| Subdomain | `https://ashirwad-hospital.nabhilabs.info/` (pilot) / `…nabhicares.com` (prod) |
| Custom domain | `https://www.ashirwad.com/` |

Subdomain = `{slug}.{CDN_ROOT_DOMAIN}`. Custom domains are stored on `Hospital.customDomain` and synced to MinIO `_cdn/domain-map.json` for the CDN.

## Pilot: nabhilabs.info (BigRock + Cloudflare + Vercel)

Registrar is **BigRock**; nameservers must be Cloudflare (`javier.ns.cloudflare.com`, `mia.ns.cloudflare.com`). While NS are Cloudflare, **do not edit DNS in BigRock** — only in **Cloudflare → nabhilabs.info → DNS → Records**.

### Vercel project split (do not mix)

| Hostname | Vercel project |
|----------|----------------|
| `studio.nabhilabs.info` | **nabhi-studio** |
| `*.nabhilabs.info` (hospital sites) | **nabhi-cdn** |
| `nabhilabs.info` / `www.nabhilabs.info` (optional apex) | **nabhi-cdn** |

Never add `nabilabs.info` (missing **h**) — that typo will never match the real domain.

### Cloudflare records (required)

Public DNS must **not** point at `127.0.0.1`. Vercel expects something like:

| Type | Name | Content | Proxy |
|------|------|---------|--------|
| A | `@` | `76.76.21.21` | **DNS only** (grey) until Valid |
| A | `www` | `76.76.21.21` | DNS only first |
| A | `studio` | `76.76.21.21` | DNS only first |
| A | `*` | `76.76.21.21` | DNS only first |

If Vercel **View DNS configuration** shows CNAME → `cname.vercel-dns.com` instead, use that. Always prefer what the dashboard shows.

Automated fix (needs a Cloudflare API token with Zone.DNS Edit):

```powershell
$env:CLOUDFLARE_API_TOKEN = "..."
# optional: $env:CLOUDFLARE_ZONE_ID = "..."
.\scripts\ops\fix-nabhilabs-cloudflare-dns.ps1
```

Then Vercel Domains → **Refresh**. Expect `studio.nabhilabs.info` and `*.nabhilabs.info` → **Valid Configuration**.

### Env (pilot)

```bash
CDN_ROOT_DOMAIN=nabhilabs.info
NEXT_PUBLIC_CDN_ROOT_DOMAIN=nabhilabs.info   # Studio
CDN_PUBLIC_URL=https://nabhi-cdn.vercel.app  # path fallback until content store is healthy
NEXT_PUBLIC_CDN_PUBLIC_URL=https://nabhi-cdn.vercel.app
```

Redeploy **nabhi-studio** and **nabhi-cdn** after env changes.

### Verify

1. `Resolve-DnsName studio.nabhilabs.info -Server 1.1.1.1` → `76.76.21.21` (not `127.0.0.1`)
2. Vercel: domains Valid
3. `https://studio.nabhilabs.info` loads Studio
4. `https://ashirwad-hospital.nabhilabs.info/` hits CDN (may still 404 content until MinIO has a `LIVE` pointer — DNS ≠ publish)

## One-time DNS / Vercel setup (generic / nabhicares.com)

1. In Vercel project **nabhi-cdn** → Settings → Domains:
   - Add apex + `*.yourdomain.com` (wildcard)
2. At Cloudflare (or your DNS host for that zone):
   - A/CNAME records per Vercel Domains → View DNS configuration
   - Start **DNS only** (grey cloud); enable proxy after Valid if desired
3. Set env on **nabhi-cdn** and **nabhi-studio**:

```bash
CDN_ROOT_DOMAIN=nabhicares.com
NEXT_PUBLIC_CDN_ROOT_DOMAIN=nabhicares.com   # Studio only
# Optional overrides for Studio DNS panel:
# NEXT_PUBLIC_CDN_DNS_A=76.76.21.21
# NEXT_PUBLIC_CDN_DNS_CNAME=cname.vercel-dns.com
```

**Studio UI:** Hospital settings → **DNS setup** shows platform records, this hospital’s `{slug}.{root}` mapping, and custom-domain CNAMEs with copy buttons. Studio does not push DNS to Cloudflare/Vercel for you.

Optional static map (overrides / supplements MinIO map):

```bash
CDN_DOMAIN_MAP={"www.example.com":"ashirwad-hospital"}
```

Redeploy CDN + Studio after env changes.

## Custom domain for a hospital

1. Hospital DNS: CNAME `www` (or apex via ALIAS) → same Vercel CDN target as above  
2. Add that hostname in Vercel **nabhi-cdn** → Domains (or use wildcard if under your root)  
3. In Studio → Hospital settings → **Custom domain** → save  

Studio writes the host→slug mapping; CDN picks it up within ~30s.

## Notes

- Sites are still built with `/{slug}/` asset prefixes; on subdomain/custom hosts the CDN rewrites HTML so links and `/_next` assets work at `/`.
- Free MinIO can wipe `_cdn/domain-map.json` — re-save custom domains after a bucket recreate.
- Domain **Valid** only proves hostname → Vercel. Hospital HTML still requires a successful publish (`{slug}/LIVE` in the object store).
