import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import opentype from 'opentype.js';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { badRequest } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { pathStyleLiveUrl } from '@/lib/cdn';

type Font = opentype.Font;

function loadFontBuffer(filename: string): Buffer {
  const candidates = [
    join(process.cwd(), 'lib', 'fonts', filename),
    join(process.cwd(), 'apps', 'studio', 'lib', 'fonts', filename),
    join(process.cwd(), 'public', 'fonts', filename),
    join(__dirname, '..', 'fonts', filename),
    join(__dirname, 'fonts', filename),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p);
  }
  throw new Error(`Share-card font missing: ${filename}`);
}

function parseFont(filename: string): Font {
  const buf = loadFontBuffer(filename);
  return opentype.parse(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  );
}

let regularFont: Font | null = null;
let boldFont: Font | null = null;

function fonts() {
  if (!regularFont) regularFont = parseFont('Roboto-Regular.ttf');
  if (!boldFont) boldFont = parseFont('Roboto-Bold.ttf');
  return { regular: regularFont, bold: boldFont };
}

/**
 * Per-glyph SVG paths — Vercel Linux Sharp/librsvg ignores @font-face,
 * and opentype getPath() crashes on GSUB features in many modern fonts.
 */
function textPath(
  font: Font,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fill: string,
): string {
  let cursor = x;
  const parts: string[] = [];
  const scale = (1 / font.unitsPerEm) * fontSize;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const gp = glyph.getPath(cursor, y, fontSize);
    const d = gp.toPathData(2);
    if (d) parts.push(d);
    cursor += (glyph.advanceWidth || 0) * scale;
  }
  if (!parts.length) return '';
  return `<path d="${parts.join(' ')}" fill="${fill}"/>`;
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
      last.length > 3 ? `${last.slice(0, Math.max(1, last.length - 1))}...` : `${last}...`;
  }
  return lines.length ? lines : [text.slice(0, maxChars)];
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

  let regular: Font;
  let bold: Font;
  try {
    ({ regular, bold } = fonts());
  } catch (e) {
    console.error('[share-card] font load failed', e);
    return badRequest('Share card fonts unavailable — redeploy Studio');
  }

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
  let shortUrl = cardUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (shortUrl.length > 52) shortUrl = `${shortUrl.slice(0, 50)}...`;

  const namePaths = nameLines
    .map((line, i) => textPath(bold, line, 48, 640 + i * 36, 28, '#0f1c1a'))
    .join('\n  ');
  const ctaY = 640 + nameLines.length * 36 + 28;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
  <rect width="720" height="960" fill="#f3f1ec"/>
  <rect width="720" height="12" fill="#1f7a6c"/>
  ${textPath(bold, 'Nabhi Labs', 48, 64, 28, '#0f1c1a')}
  ${textPath(regular, 'Hospital demo for you', 48, 96, 18, '#5c6b67')}
  <rect x="134" y="124" width="452" height="452" rx="16" fill="#ffffff"/>
  <image href="${qrDataUrl}" x="150" y="140" width="420" height="420"/>
  ${namePaths}
  ${textPath(bold, 'Access your hospital demo here', 48, ctaY, 22, '#1f7a6c')}
  ${textPath(regular, 'Scan the QR or open the link we sent.', 48, ctaY + 40, 16, '#5c6b67')}
  ${textPath(regular, 'We built this preview for your team.', 48, ctaY + 66, 16, '#5c6b67')}
  ${textPath(regular, shortUrl, 48, 900, 14, '#0f1c1a')}
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
      'Content-Disposition': `inline; filename="${hospital.slug}-nabhi-demo.png"`,
      'X-Nabhi-Share-Card': 'opentype-paths-v3',
    },
  });
}
