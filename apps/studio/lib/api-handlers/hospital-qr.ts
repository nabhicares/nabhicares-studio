import QRCode from 'qrcode';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { liveSiteUrl } from '@/lib/cdn';
import { prisma } from '@/lib/db';

/**
 * GET /api/hospitals/:hospitalId/qr?format=png|svg|json
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

  const url = new URL(req.url);
  const format = (url.searchParams.get('format') || 'png').toLowerCase();
  const liveUrl = liveSiteUrl(hospital.slug, hospital.customDomain);

  if (format === 'json') {
    return json({ url: liveUrl, slug: hospital.slug, name: hospital.name });
  }

  if (format === 'svg') {
    const svg = await QRCode.toString(liveUrl, {
      type: 'svg',
      margin: 1,
      width: 256,
    });
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  const png = await QRCode.toBuffer(liveUrl, {
    type: 'png',
    margin: 1,
    width: 512,
  });
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
