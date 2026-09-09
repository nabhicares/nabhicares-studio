'use client';

import { apiFetch } from '@/lib/api-client';
import { useRef, useState } from 'react';
import { ImageCropDialog } from '@/components/ImageCropDialog';

function looksLikeImageField(name: string, label: string) {
  const n = name.toLowerCase();
  const l = label.toLowerCase();
  return (
    n === 'image' ||
    n === 'src' ||
    n.endsWith('image') ||
    l.includes('image url') ||
    l === 'image'
  );
}

/** Suggest a starting crop ratio from the field name/label. */
function suggestedAspectId(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('doctor') || l.includes('portrait') || l.includes('team')) {
    return '3:4';
  }
  if (l.includes('logo') || l.includes('avatar') || l.includes('icon')) {
    return '1:1';
  }
  if (l.includes('hero') || l.includes('banner') || l.includes('cover')) {
    return '16:9';
  }
  if (l.includes('og') || l.includes('share')) {
    return '16:9';
  }
  return '16:9';
}

export function ImageField({
  label,
  value,
  hospitalId,
  onChange,
  aspectHint,
}: {
  label: string;
  value: string;
  hospitalId: string;
  onChange: (url: string) => void;
  /** Optional preset id: free | 1:1 | 4:3 | 3:4 | 16:9 | 21:9 | 3:2 */
  aspectHint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState('image.jpg');

  function revokeCrop() {
    if (cropSrc?.startsWith('blob:')) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  async function uploadBlob(blob: Blob, filename: string) {
    setUploading(true);
    setError('');
    const body = new FormData();
    body.append('file', blob, filename);
    try {
      const res = await apiFetch(`/api/hospitals/${hospitalId}/media`, {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Upload failed');
        return;
      }
      onChange(data.url as string);
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError('');

    // Animated GIFs: skip crop (would flatten frames)
    if (file.type === 'image/gif') {
      await uploadBlob(file, file.name);
      return;
    }

    const url = URL.createObjectURL(file);
    setCropFileName(file.name || 'image.jpg');
    setCropSrc(url);
  }

  return (
    <div className="flex flex-col gap-xs">
      <label className="font-inter text-label-sm text-outline ml-1">{label}</label>
      {value ? (
        <div className="rounded-lg overflow-hidden hairline bg-surface-container aspect-video relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      ) : null}
      <input
        className="field-input"
        placeholder="https://… or upload & crop"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex gap-xs">
        <button
          type="button"
          className="btn-ghost flex-1"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Upload & crop'}
        </button>
        {value ? (
          <button type="button" className="btn-ghost text-error" onClick={() => onChange('')}>
            Clear
          </button>
        ) : null}
      </div>
      <p className="font-inter text-[11px] text-outline ml-1">
        Pick a ratio (16:9, 3:4, 1:1…) and frame the image before it uploads.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {error ? <p className="font-inter text-label-sm text-error">{error}</p> : null}

      {cropSrc ? (
        <ImageCropDialog
          imageSrc={cropSrc}
          fileName={cropFileName}
          initialAspectId={aspectHint || suggestedAspectId(label)}
          onCancel={() => revokeCrop()}
          onApply={(blob, name) => {
            revokeCrop();
            void uploadBlob(blob, name);
          }}
        />
      ) : null}
    </div>
  );
}

export { looksLikeImageField };
