import { cdnBase } from '@/lib/cdn';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { uploadAsset } from '@nabhicares/snapshot-store';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024;
/** Longest edge for published photos — cuts Lighthouse oversized-image waste. */
const MAX_EDGE = 1920;

async function optimizeToWebp(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();
}

/** Upload an image for a hospital. multipart field name: `file`. */
export async function POST(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;
  const hospital = access.hospital;

  const form = await req.formData().catch(() => null);
  if (!form) return badRequest('Expected multipart form data');
  const file = form.get('file');
  if (!(file instanceof File)) return badRequest('file is required');
  if (!ALLOWED.has(file.type)) {
    return badRequest('Only JPEG, PNG, WebP, or GIF images are allowed');
  }
  if (file.size > MAX_BYTES) return badRequest('Image must be under 5MB');

  const raw = Buffer.from(await file.arrayBuffer());

  // Keep animated GIFs as-is; everything else → WebP for share/LCP weight.
  let buffer: Buffer = raw;
  let contentType = file.type;
  let ext = 'webp';
  if (file.type === 'image/gif') {
    ext = 'gif';
  } else {
    try {
      buffer = Buffer.from(await optimizeToWebp(raw));
      contentType = 'image/webp';
      ext = 'webp';
    } catch (err) {
      console.error('[media optimize]', err);
      return badRequest('Could not process image — try a different JPG/PNG');
    }
  }

  const filename = `${randomUUID()}.${ext}`;

  try {
    await uploadAsset(hospital.slug, filename, buffer, contentType);
  } catch (err) {
    console.error('[media upload]', err);
    return json({ error: 'Upload failed — is MinIO running?' }, 502);
  }

  return json({
    url: `${cdnBase()}/${hospital.slug}/assets/${filename}`,
    filename,
  });
}
