# Nabhi Gemini Paste (Chrome MV3)

Field-day helper: paste Gemini hospital JSON → Studio creates the site, imports the bundle, and enqueues publish.

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this folder (`extensions/nabhi-gemini-paste`)
4. In Studio → **CRM** → **Issue token** → paste into the extension
5. Set Studio URL (`https://studio.nabhilabs.info` or `http://localhost:3000`)

## Daily flow

1. Open hospital on Google Maps
2. Extension → **Copy Gemini prompt** → paste into Gemini with listing details
3. Paste Gemini JSON into the extension → **Create + publish**
4. Copy live URL / show QR for the print sheet

## Auth

Uses `Authorization: Bearer nabxt_…` (issued in CRM). No Maps API or Gemini API key required.

## Related

- Studio CRM: `/crm`
- API: `POST /api/extension/demo-from-gemini`
- Ops: [docs/ops/HOME_MINIO_UBUNTU.md](../../docs/ops/HOME_MINIO_UBUNTU.md), [docs/ops/FIELD_DEMO_DAY.md](../../docs/ops/FIELD_DEMO_DAY.md)
