'use client';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

export type AspectPreset = {
  id: string;
  label: string;
  /** null = free / unlocked */
  value: number | null;
};

export const IMAGE_ASPECT_PRESETS: AspectPreset[] = [
  { id: 'free', label: 'Free', value: null },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '3:4', label: '3:4', value: 3 / 4 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
  { id: '21:9', label: '21:9', value: 21 / 9 },
  { id: '3:2', label: '3:2', value: 3 / 2 },
];

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (e) => reject(e));
    img.src = url;
  });
}

/** Render the cropped region to a JPEG blob (good quality before server WebP). */
export async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  mime: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality = 0.92,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  const w = Math.max(1, Math.round(pixelCrop.width));
  const h = Math.max(1, Math.round(pixelCrop.height));
  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    w,
    h,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('Crop failed'));
        else resolve(blob);
      },
      mime,
      quality,
    );
  });
}

export function ImageCropDialog({
  imageSrc,
  fileName,
  initialAspectId = '16:9',
  onCancel,
  onApply,
}: {
  imageSrc: string;
  fileName: string;
  initialAspectId?: string;
  onCancel: () => void;
  onApply: (blob: Blob, fileName: string) => void;
}) {
  const initial =
    IMAGE_ASPECT_PRESETS.find((p) => p.id === initialAspectId) ??
    IMAGE_ASPECT_PRESETS[4]!;
  const [aspectId, setAspectId] = useState(initial.id);
  const preset = IMAGE_ASPECT_PRESETS.find((p) => p.id === aspectId);
  const aspect: number | undefined =
    preset?.value == null ? undefined : preset.value;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function apply() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError('');
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const base = fileName.replace(/\.[^.]+$/, '') || 'image';
      onApply(blob, `${base}-cropped.jpg`);
    } catch {
      setError('Could not crop — try another image');
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-md bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Crop image"
    >
      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between gap-sm">
          <div>
            <h2 className="font-outfit text-[16px] font-semibold text-on-surface">
              Adjust image
            </h2>
            <p className="font-inter text-label-sm text-outline mt-xs">
              Choose a ratio, then drag or zoom to frame the shot.
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost px-sm py-xs"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
        </div>

        <div className="relative w-full h-[280px] bg-surface-container">
          <Cropper
            key={aspectId}
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        </div>

        <div className="px-lg py-md flex flex-col gap-md">
          <div>
            <p className="font-inter text-[10px] uppercase tracking-wider text-outline mb-xs">
              Aspect ratio
            </p>
            <div className="flex flex-wrap gap-xs">
              {IMAGE_ASPECT_PRESETS.map((p) => {
                const active = p.id === aspectId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={
                      active
                        ? 'rounded-md bg-primary text-on-primary px-sm py-xs font-inter text-label-sm font-semibold'
                        : 'rounded-md border border-outline-variant px-sm py-xs font-inter text-label-sm text-on-surface'
                    }
                    onClick={() => {
                      setAspectId(p.id);
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex flex-col gap-xs">
            <span className="font-inter text-[10px] uppercase tracking-wider text-outline">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </label>

          {error ? (
            <p className="font-inter text-label-sm text-error">{error}</p>
          ) : null}

          <div className="flex gap-sm">
            <button
              type="button"
              className="btn-ghost flex-1"
              disabled={busy}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={busy || !croppedAreaPixels}
              onClick={() => void apply()}
            >
              {busy ? 'Applying…' : 'Apply & upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
