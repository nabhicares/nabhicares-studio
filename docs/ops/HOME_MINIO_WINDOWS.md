# Home MinIO on Windows (persistent, free)

Run MinIO + the publish worker on an always-on Windows PC. Studio/CDN stay on Vercel; Neon + Upstash stay as-is. Data lives on the PC’s disk, so it survives sleep/redeploy unlike free Render MinIO.

## 1. Install on the Windows box

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) — WSL2 backend on, start Docker
2. [Node.js 20 LTS](https://nodejs.org/) (for the publish worker)
3. Git + clone this repo (or copy `nabhicares` onto the machine)
4. [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) (Cloudflare Tunnel)

## 2. Start MinIO (persistent volume)

```powershell
cd path\to\nabhicares\infra\home-minio
copy .env.example .env
# edit .env — set a strong MINIO_ROOT_USER / MINIO_ROOT_PASSWORD

docker compose up -d
docker compose --profile init run --rm minio-init
```

Check locally:

```powershell
curl http://127.0.0.1:9000/minio/health/live
```

Console (optional): http://127.0.0.1:9001

## 3. Expose with Cloudflare Tunnel (HTTPS, no router ports)

### Quick test (temporary URL)

```powershell
cloudflared tunnel --url http://127.0.0.1:9000
```

Copy the `https://….trycloudflare.com` URL. Use it as `SNAPSHOT_STORE_ENDPOINT` / `MINIO_URL` for a smoke test. The URL changes each run — fine for testing only.

### Stable setup (recommended)

1. Free Cloudflare account; add a domain (or use a subdomain you control)
2. Zero Trust → Networks → Tunnels → Create → name e.g. `nabhi-minio`
3. Install the Windows connector (cloudflared service) with the token Cloudflare shows
4. Public hostname: `minio.yourdomain.com` → `http://127.0.0.1:9000` (HTTP, not HTTPS to origin)
5. Leave MinIO bound to `127.0.0.1` only (compose already does this)

Public URL: `https://minio.yourdomain.com`

## 4. Point the app at home MinIO

On the Windows box, in repo-root `.env` (same Neon/Upstash as Studio):

```env
SNAPSHOT_STORE_ENDPOINT="https://minio.yourdomain.com"
SNAPSHOT_STORE_KEY="<MINIO_ROOT_USER>"
SNAPSHOT_STORE_SECRET="<MINIO_ROOT_PASSWORD>"
SNAPSHOT_BUCKET="nabhicares-sites"
```

Vercel project **nabhi-cdn** → Environment Variables:

- `MINIO_URL` = `https://minio.yourdomain.com`
- `SNAPSHOT_BUCKET` = `nabhicares-sites`

Redeploy CDN after changing env.

## 5. Publish worker on the same PC (24/7)

```powershell
cd path\to\nabhicares
# load .env into the session, then:
Remove-Item Env:PORT -ErrorAction SilentlyContinue
npx tsx apps/publish-worker/src/index.ts
```

Keep that window open, or install as a Windows Task Scheduler / NSSM service that runs on login.

Then publish once from Studio (or requeue Ashirwad). CDN should serve from the home bucket.

## 6. Cut over from Render MinIO

1. Confirm https://nabhi-cdn.vercel.app/ashirwad-hospital/ works after republish
2. Stop/delete the Render MinIO web service when ready
3. Do **not** rely on the old Render URL anymore

## Notes

- Docker volume `nabhi_minio_data` keeps objects across container restarts. Don’t `docker compose down -v` unless you intend to wipe.
- PC reboot: Docker Desktop “Start when Windows starts” + tunnel service + worker autostart.
- Wi‑Fi blips → brief CDN errors until cloudflared reconnects.
- Credentials must stay secret; public read is only on `nabhicares-sites` objects (anonymous GetObject), same as the pilot setup today.
