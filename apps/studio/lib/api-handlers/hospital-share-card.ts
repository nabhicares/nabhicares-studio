import { readFileSync } from 'fs';
import { join } from 'path';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { badRequest } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { pathStyleLiveUrl } from '@/lib/cdn';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Bundled fonts — Vercel/Linux has no Segoe/Arial, so SVG text must embed a TTF. */
function loadFontDataUrl(filename: string): string {
  const buf = readFileSync(join(process.cwd(), 'public', 'fonts', filename));
  return `data:font/ttf;base64,${buf.toString('base64')}`;
}

function wrapLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (words.join(' ').length > lines.join(' ').length && lines.length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] =
      last.length > 3 ? `${last.slice(0, Math.max(1, last.length - 1))}…` : `${last}…`;
  }
  return lines.length ? lines : [text.slice(0, maxChars)];
}

/**
 * GET /api/hospitals/:hospitalId/share-card
 * PNG share card: QR + hospital name + Nabhi Labs demo CTA.
 * Uses path-style URL in QR (reliable when subdomain HTTPS flakes).
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

  // Path URL always works; subdomain HTTPS can fail (ERR_CONNECTION_CLOSED).
  const cardUrl = pathStyleLiveUrl(hospital.slug);
  const qrPng = await QRCode.toBuffer(cardUrl, {
    type: 'png',
    margin: 1,
    width: 420,
    color: { dark: '#0f1c1a', light: '#ffffff' },
  });
  const qrDataUrl = `data:image/png;base64,${qrPng.toString('base64')}`;

  const nameLines = wrapLines(hospital.name, 28, 2);
  const shortUrl =
    cardUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').length > 52
      ? `${cardUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 50)}…`
      : cardUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const fontRegular = loadFontDataUrl('DejaVuSans.ttf');
  const fontBold = loadFontDataUrl('DejaVuSans-Bold.ttf');

  const nameSvg = nameLines
    .map(
      (line, i) =>
        `<text x="48" y="${640 + i * 36}" font-family="CardSansBold" font-size="28" fill="#0f1c1a">${escapeXml(line)}</text>`,
    )
    .join('\n  ');
  const ctaY = 640 + nameLines.length * 36 + 28;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
  <defs>
    <style type="text/css"><![CDATA[
      @font-face {
        font-family: "CardSans";
        src: url("${fontRegular}") format("truetype");
        font-weight: 400;
      }
      @font-face {
        font-family: "CardSansBold";
        src: url("${fontBold}") format("truetype");
        font-weight: 700;
      }
    ]]></style>
  </defs>
  <rect width="720" height="960" fill="#f3f1ec"/>
  <rect width="720" height="12" fill="#1f7a6c"/>
  <text x="48" y="64" font-family="CardSansBold" font-size="28" fill="#0f1c1a">Nabhi Labs</text>
  <text x="48" y="96" font-family="CardSans" font-size="18" fill="#5c6b67">Hospital demo for you</text>
  <rect x="134" y="124" width="452" height="452" rx="16" fill="#ffffff"/>
  <image href="${qrDataUrl}" x="150" y="140" width="420" height="420"/>
  ${nameSvg}
  <text x="48" y="${ctaY}" font-family="CardSansBold" font-size="22" fill="#1f7a6c">Access your hospital demo here</text>
  <text x="48" y="${ctaY + 40}" font-family="CardSans" font-size="16" fill="#5c6b67">Scan the QR or open the link we sent.</text>
  <text x="48" y="${ctaY + 66}" font-family="CardSans" font-size="16" fill="#5c6b67">We built this preview for your team.</text>
  <text x="48" y="900" font-family="CardSans" font-size="14" fill="#0f1c1a">${escapeXml(shortUrl)}</text>
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
