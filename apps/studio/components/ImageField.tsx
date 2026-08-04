'use client';

import { apiFetch } from '@/lib/api-client';

import { useRef, useState } from 'react';

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

export function ImageField({
  label,
  value,
  hospitalId,
  onChange,
}: {
  label: string;
  value: string;
  hospitalId: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError('');
    const body = new FormData();
    body.append('file', file);
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
        placeholder="https://… or upload"
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
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        {value ? (
          <button type="button" className="btn-ghost text-error" onClick={() => onChange('')}>
            Clear
          </button>
        ) : null}
      </div>
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
    </div>
  );
}

export { looksLikeImageField };
