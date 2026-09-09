/** Plain-text setup checklist bundled with every site zip. */
export function buildSiteSetupGuide(opts: {
  hospitalName: string;
  slug: string;
  publishId: string;
  preferredHostedUrl: string;
  exportedAt: string;
}): string {
  const { hospitalName, slug, publishId, preferredHostedUrl, exportedAt } = opts;
  return `# ${hospitalName} — website setup guide

Exported from Nabhi Studio on ${exportedAt}
Publish id: ${publishId}
Slug: ${slug}

This zip is a **static website** (HTML, CSS, JS, images). It is not the Nabhi Studio app.
You can host these files on any static host (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, shared hosting, etc.).

---

## Prefer staying on Nabhi (recommended)

Keeping the site on Nabhi means we handle HTTPS, CDN, and future publish updates.

1. Point your domain DNS (CNAME or ALIAS) at the Nabhi CDN target your Nabhi contact gave you.
2. Ask Nabhi to attach the hostname on the CDN project (or use a wildcard under nabhilabs.info).
3. In Studio → Hospital settings → **Custom domain**, save your hostname (e.g. www.yourhospital.com).

Live URL while on Nabhi: ${preferredHostedUrl}

Only use this zip if you want to **self-host** and maintain DNS/hosting yourself.

---

## Self-host checklist

### 1. Unzip
- Unzip this archive to a folder.
- You should see \`index.html\`, an \`_next\` folder, optional \`assets\`, and this guide.

### 2. Upload to your host
- Upload **all** files so that \`index.html\` is at the **web root** of the site
  (or the folder your host treats as \`/\`).
- Do not nest the files under an extra folder unless your host docs require it.
- Paths in this export are rewritten for **domain root** hosting
  (\`https://www.yourhospital.com/\`, not \`https://…/${slug}/\`).

### 3. DNS
- Create an **A** / **ALIAS** / **CNAME** record for \`www\` (and apex if supported) to your host.
- Wait for DNS to propagate (often minutes; sometimes up to 48 hours).

### 4. HTTPS
- Turn on your host’s free TLS certificate (Let’s Encrypt / automatic HTTPS).
- Prefer redirecting HTTP → HTTPS and apex → \`www\` (or the reverse — pick one canonical host).

### 5. SPA / folder routes
- Pages like \`/contact/\` are static folders with \`index.html\`.
- If a deep link 404s, configure “serve \`index.html\` for missing paths” **only if** your host needs it;
  most static hosts serve folder \`index.html\` automatically.

### 6. Forms & appointments
- Appointment / contact forms that posted to Nabhi APIs will **stop working** on a self-hosted domain
  unless you reconnect them to your own backend.
- Update phone, WhatsApp, and email links in your CMS or by editing HTML if numbers change.

### 7. Images
- Media that lived under Nabhi CDN is included in \`assets/\` when available and rewritten to \`/assets/…\`.
- If some images still point at an external URL, download them and update the \`src\` or re-export after a fresh publish.

### 8. After you publish updates in Studio
- Re-download a new zip from Studio → Publish → **Download site zip**.
- Replace the old files on your host with the new unzipped contents (full replace is safest).

---

## Quick local preview

From the unzipped folder:

\`\`\`bash
npx --yes serve -l 4173 .
\`\`\`

Open http://localhost:4173/

---

## Support

Questions about Nabhi-hosted custom domains: contact your Nabhi representative.
This package does not include Studio source code or database access.
`;
}
