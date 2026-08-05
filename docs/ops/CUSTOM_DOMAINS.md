# Custom domains & subdomains

Published sites live in MinIO. The CDN (`nabhi-cdn`) routes by **path** or **hostname**.

## URL shapes

| Mode | Example |
|------|---------|
| Path (always works) | `https://nabhi-cdn.vercel.app/ashirwad-hospital/` |
| Subdomain | `https://ashirwad-hospital.nabhicares.com/` |
| Custom domain | `https://www.ashirwad.com/` |

Subdomain = `{slug}.{CDN_ROOT_DOMAIN}`. Custom domains are stored on `Hospital.customDomain` and synced to MinIO `_cdn/domain-map.json` for the CDN.

## One-time DNS / Vercel setup

1. In Vercel project **nabhi-cdn** → Settings → Domains:
   - Add `nabhicares.com`
   - Add `*.nabhicares.com` (wildcard)
2. At your DNS provider for `nabhicares.com`:
   - Follow Vercel’s records (usually A/CNAME for apex + CNAME `*` → `cname.vercel-dns.com`)
3. Set env on **nabhi-cdn** and **nabhi-studio**:

```bash
CDN_ROOT_DOMAIN=nabhicares.com
NEXT_PUBLIC_CDN_ROOT_DOMAIN=nabhicares.com   # Studio only
```

Optional static map (overrides / supplements MinIO map):

```bash
CDN_DOMAIN_MAP={"www.example.com":"ashirwad-hospital"}
```

Redeploy CDN + Studio after env changes.

## Custom domain for a hospital

1. Hospital DNS: CNAME `www` (or apex via ALIAS) → same Vercel CDN target as above  
2. Add that hostname in Vercel **nabhi-cdn** → Domains (or use wildcard if under nabhicares.com)  
3. In Studio → Hospital settings → **Custom domain** → save  

Studio writes the host→slug mapping; CDN picks it up within ~30s.

## Notes

- Sites are still built with `/{slug}/` asset prefixes; on subdomain/custom hosts the CDN rewrites HTML so links and `/_next` assets work at `/`.
- Free MinIO can wipe `_cdn/domain-map.json` — re-save custom domains after a bucket recreate.
