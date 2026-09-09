# Home MinIO on Ubuntu (permanent Cloudflare Tunnel)

Always-on Ubuntu PC runs **MinIO** + **publish worker**. Studio/CDN stay on Vercel; Neon + Upstash stay as-is. Objects live on the PC disk.

Use a **named Cloudflare Tunnel** with a stable hostname. Do **not** use `cloudflared tunnel --url` / `*.trycloudflare.com` — that URL changes every restart and breaks Studio + CDN.

Windows variant (legacy): [HOME_MINIO_WINDOWS.md](./HOME_MINIO_WINDOWS.md).

## Prerequisites

On the Ubuntu box:

1. Docker Engine + Compose plugin (`docker compose version`)
2. Node.js 20 LTS (publish worker)
3. Git clone of this repo
4. Cloudflare account that manages DNS for a domain you control (e.g. `nabhilabs.info`)

## 1. MinIO (localhost only)

```bash
cd ~/nabhicares/infra/home-minio   # or your clone path
cp .env.example .env
# edit .env — strong MINIO_ROOT_USER / MINIO_ROOT_PASSWORD

docker compose up -d
docker compose --profile init run --rm minio-init
curl -fsS http://127.0.0.1:9000/minio/health/live
```

Console (optional, local only): http://127.0.0.1:9001

Compose already binds `127.0.0.1:9000` / `9001` — do **not** open those ports on the router. The tunnel is the only public path.

## 2. Permanent Cloudflare Tunnel

### Create the tunnel (Dashboard)

1. [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → **Networks** → **Tunnels** → **Create a tunnel**
2. Connector: **Cloudflared**
3. Name: e.g. `nabhi-minio`
4. Copy the install token Cloudflare shows (one-time; treat as a secret)

### Install cloudflared as a systemd service (Ubuntu)

```bash
# Official package (Debian/Ubuntu) — see Cloudflare docs if the URL changes:
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install -y cloudflared

# Paste the token from the dashboard (do not commit it):
sudo cloudflared service install <TUNNEL_TOKEN>
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared --no-pager
```

### Public hostname (stable URL)

In the tunnel → **Public Hostname** → Add:

| Field | Value |
| --- | --- |
| Subdomain | `minio` (or another unused name) |
| Domain | `nabhilabs.info` (or your zone) |
| Type | HTTP |
| URL | `http://127.0.0.1:9000` |

Resulting public endpoint:

```text
https://minio.nabhilabs.info
```

Confirm from any machine:

```bash
curl -fsSI https://minio.nabhilabs.info/minio/health/live
```

You should see a healthy HTTP response (not a connection error). DNS may take a minute after create.

## 3. Point the app at the permanent URL

### On the Ubuntu box — repo root `.env`

```env
SNAPSHOT_STORE_ENDPOINT="https://minio.nabhilabs.info"
SNAPSHOT_STORE_KEY="<MINIO_ROOT_USER>"
SNAPSHOT_STORE_SECRET="<MINIO_ROOT_PASSWORD>"
SNAPSHOT_BUCKET="nabhicares-sites"
```

Same Neon / Upstash values as Studio.

### Vercel — project **nabhi-cdn**

| Variable | Value |
| --- | --- |
| `MINIO_URL` | `https://minio.nabhilabs.info` |
| `SNAPSHOT_BUCKET` | `nabhicares-sites` |

Redeploy CDN after changing env. Remove any old `*.trycloudflare.com` value.

### Studio / publish worker

Anything that reads `SNAPSHOT_STORE_ENDPOINT` (local `.env`, Render, or the Ubuntu worker) must use the **same** stable hostname.

## 4. Publish worker 24/7 (systemd)

```bash
cd ~/nabhicares
npm ci   # or yarn / pnpm as used in this repo
```

Example unit `/etc/systemd/system/nabhi-publish-worker.service` (adjust `User`, paths, and load secrets via `EnvironmentFile`):

```ini
[Unit]
Description=Nabhi publish-v2 worker
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=simple
User=nabhi
WorkingDirectory=/home/nabhi/nabhicares
EnvironmentFile=/home/nabhi/nabhicares/.env
# Avoid clashing with other Node apps that set PORT/RENDER
Environment=PORT=
Environment=RENDER=
ExecStart=/usr/bin/npx tsx apps/publish-worker/src/index.ts
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nabhi-publish-worker
sudo journalctl -u nabhi-publish-worker -f
```

You should see something like: `Publish worker listening on queue "publish-v2"...` and `SNAPSHOT_STORE_ENDPOINT=https://minio.nabhilabs.info`.

## 5. Cutover checklist

1. Tunnel healthy: `systemctl is-active cloudflared`
2. MinIO healthy locally and via `https://minio.nabhilabs.info/...`
3. `.env` + Vercel `MINIO_URL` both use the permanent hostname
4. Publish worker running on Ubuntu
5. Publish once from Studio (or requeue a known hospital)
6. Confirm live site / CDN serves the new snapshot
7. Discard any old temporary `trycloudflare.com` bookmarks and env values

## Field demos (~120 sites)

See [FIELD_DEMO_DAY.md](./FIELD_DEMO_DAY.md) for CRM + Chrome Gemini-paste extension checklist. Keep this permanent tunnel — demos enqueue into the same MinIO bucket and `publish-v2` worker.

## Notes

- Volume `nabhi_minio_data` keeps objects across container restarts. Avoid `docker compose down -v` unless you intend to wipe.
- After reboot: Docker + `cloudflared` + `nabhi-publish-worker` should all come back via systemd.
- Brief Wi‑Fi / ISP blips → CDN may 502 until cloudflared reconnects.
- Keep MinIO credentials secret. Public anonymous **GetObject** on `nabhicares-sites` is intentional (same as the pilot setup).
- If you already had a Windows tunnel token, create a **new** tunnel (or reinstall the connector) on Ubuntu — do not reuse a dead Windows connector install.
