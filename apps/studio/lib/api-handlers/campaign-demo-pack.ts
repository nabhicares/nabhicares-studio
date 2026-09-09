import QRCode from 'qrcode';
import { notFound } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { liveSiteUrl } from '@/lib/cdn';
import { prisma } from '@/lib/db';

/**
 * GET /api/campaigns/:campaignId/demo-pack
 * Printable HTML sheet of demo URLs + QR codes.
 */
export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } },
) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId },
    include: {
      hospitals: {
        where: { pipelineStatus: { not: 'TRASHED' } },
        orderBy: { name: 'asc' },
      },
    },
  });
  if (!campaign) return notFound('Campaign not found');

  const cards: { name: string; slug: string; url: string; qrDataUrl: string }[] =
    [];
  for (const h of campaign.hospitals) {
    const url = liveSiteUrl(h.slug, h.customDomain);
    const qrDataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 200,
      type: 'image/png',
    });
    cards.push({ name: h.name, slug: h.slug, url, qrDataUrl });
  }

  const title = `${campaign.name}${campaign.placeLabel ? ` — ${campaign.placeLabel}` : ''}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Demo pack — ${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; color: #111; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  .meta { color: #555; font-size: 13px; margin-bottom: 24px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
  .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; break-inside: avoid; text-align: center; }
  .card img { width: 160px; height: 160px; }
  .name { font-weight: 600; font-size: 14px; margin: 8px 0 4px; }
  .url { font-size: 11px; word-break: break-all; color: #333; }
  @media print {
    body { margin: 12px; }
    .noprint { display: none; }
  }
</style>
</head>
<body>
  <p class="noprint"><button onclick="window.print()">Print / Save PDF</button></p>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">${cards.length} demo site${cards.length === 1 ? '' : 's'} · nabhilabs.info</p>
  <div class="grid">
    ${cards
      .map(
        (c) => `<div class="card">
      <img src="${c.qrDataUrl}" alt="QR for ${escapeHtml(c.name)}"/>
      <div class="name">${escapeHtml(c.name)}</div>
      <div class="url">${escapeHtml(c.url)}</div>
    </div>`,
      )
      .join('\n')}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
