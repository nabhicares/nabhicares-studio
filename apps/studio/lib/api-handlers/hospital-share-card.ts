import QRCode from 'qrcode';
import sharp from 'sharp';
import { badRequest } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { liveSiteUrl } from '@/lib/cdn';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * GET /api/hospitals/:hospitalId/share-card
 * PNG share card: QR + hospital name + Nabhi Labs demo CTA.
 */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const hospital = await prisma.hospital.findUnique({
    where: { id: access.hospital.id },
  });
  if (!hospital) return badRequest('Hospital not found');

  const liveUrl = liveSiteUrl(hospital.slug, hospital.customDomain);
  const qrPng = await QRCode.toBuffer(liveUrl, {
    type: 'png',
    margin: 1,
    width: 420,
    color: { dark: '#0f1c1a', light: '#ffffff' },
  });
  const qrDataUrl = `data:image/png;base64,${qrPng.toString('base64')}`;

  const name =
    hospital.name.length > 48 ? `${hospital.name.slice(0, 46)}…` : hospital.name;
  const shortUrl = liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
  <rect width="720" height="960" fill="#f3f1ec"/>
  <rect width="720" height="12" fill="#1f7a6c"/>
  <text x="48" y="64" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#0f1c1a">Nabhi Labs</text>
  <text x="48" y="96" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#5c6b67">Hospital demo for you</text>
  <rect x="134" y="124" width="452" height="452" rx="16" fill="#ffffff"/>
  <image href="${qrDataUrl}" x="150" y="140" width="420" height="420"/>
  <text x="48" y="640" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#0f1c1a">${escapeXml(name)}</text>
  <text x="48" y="690" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#1f7a6c">Access your hospital demo here</text>
  <text x="48" y="730" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#5c6b67">Scan the QR or open the link we sent —</text>
  <text x="48" y="756" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#5c6b67">we built this preview for your team.</text>
  <text x="48" y="820" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="#0f1c1a">${escapeXml(shortUrl)}</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
      'Content-Disposition': `inline; filename="${hospital.slug}-nabhi-demo.png"`,
    },
  });
}
