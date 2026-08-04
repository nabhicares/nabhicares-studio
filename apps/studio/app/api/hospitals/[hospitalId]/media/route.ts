import { cdnBase } from '@/lib/cdn';
import { randomUUID } from 'crypto';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { uploadAsset } from '@nabhicares/snapshot-store';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024;

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

  const ext =
    file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
        ? 'webp'
        : file.type === 'image/gif'
          ? 'gif'
          : 'jpg';
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await uploadAsset(hospital.slug, filename, buffer, file.type);
  } catch (err) {
    console.error('[media upload]', err);
    return json({ error: 'Upload failed — is MinIO running?' }, 502);
  }

  return json({
    url: `${cdnBase()}/${hospital.slug}/assets/${filename}`,
    filename,
  });
}
