# Field demo day checklist (~30 hospitals / place)

Use with permanent MinIO tunnel ([HOME_MINIO_UBUNTU.md](./HOME_MINIO_UBUNTU.md)) and the Chrome extension ([extensions/nabhi-gemini-paste](../../extensions/nabhi-gemini-paste)).

## Before leaving (Ubuntu always-on box)

```bash
# MinIO
curl -fsS http://127.0.0.1:9000/minio/health/live

# Tunnel
sudo systemctl is-active cloudflared
curl -fsSI https://minio.nabhilabs.info/minio/health/live

# Publish worker
sudo systemctl is-active nabhi-publish-worker
sudo journalctl -u nabhi-publish-worker -n 30 --no-pager
# expect: Publish worker listening on queue "publish-v2"
# expect: SNAPSHOT_STORE_ENDPOINT=https://minio.nabhilabs.info
```

Vercel **nabhi-cdn** env: `MINIO_URL=https://minio.nabhilabs.info` (not a `trycloudflare.com` URL).

## Studio CRM

1. Open `https://studio.nabhilabs.info/crm`
2. Create a **campaign** for today’s place (e.g. “Coimbatore north”)
3. Copy the campaign ID into the Chrome extension
4. **Issue token** → paste into the extension (one laptop)

## Capture loop (per hospital)

1. Google Maps listing → extension **Copy Gemini prompt** → Gemini chat
2. Paste Gemini JSON into extension → **Create + publish**
3. Copy live URL `https://{slug}.nabhilabs.info/` or show on-screen QR
4. After the day: CRM → **QR pack** for the campaign → print sheets

## Pipeline

| Status | Meaning |
|--------|---------|
| DEMO | Live demo, `seoIndex=false` |
| ACCEPTED | Keep; indexing on; restore republishes |
| TRASHED | Soft-unpublish; 30 days then hard delete (worker purge every 6h) |

Decline → trash. Accept from trash → restore + republish.

## Capacity notes

- ~30 publishes/day is fine with worker `concurrency: 1` if you keep publishing through the afternoon.
- Serving ~120 static demos is OK on wildcard `*.nabhilabs.info` + home MinIO; the bottleneck is build time, not CDN DNS.
- Do **not** use temporary Cloudflare quick tunnels for field days.
