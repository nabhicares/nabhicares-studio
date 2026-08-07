'use client';

import { apiFetch } from '@/lib/api-client';
import { liveSiteUrl } from '@/lib/cdn';
import { useMemo, useState } from 'react';
import { ImageField } from './ImageField';

export type OgCardStyle = 'hero' | 'brand' | 'custom';

const CARD_STYLES: Array<{
  id: OgCardStyle;
  label: string;
  blurb: string;
  icon: string;
}> = [
  {
    id: 'hero',
    label: 'Hospital photo',
    blurb: 'Uses your hero image on publish',
    icon: 'photo_camera',
  },
  {
    id: 'brand',
    label: 'Brand color',
    blurb: 'Solid accent card with hospital colors',
    icon: 'palette',
  },
  {
    id: 'custom',
    label: 'Custom image',
    blurb: 'Upload or paste a 1200×630 image',
    icon: 'upload',
  },
];

type PreviewChrome = 'whatsapp' | 'facebook' | 'x';

function firstHeroImage(pages: Array<{ sections: Array<{ template: { key: string }; content: Record<string, unknown> }> }>): string {
  for (const page of pages) {
    for (const section of page.sections) {
      if (section.template.key !== 'hero') continue;
      const img = section.content?.image;
      if (typeof img === 'string' && img.trim()) return img.trim();
    }
  }
  return '';
}

export function SocialMediaPanel({
  hospitalId,
  hospitalName,
  hospitalSlug,
  seoTitle: initialSeoTitle = '',
  seoDescription: initialSeoDescription = '',
  ogImage: initialOgImage = '',
  ogCardStyle: initialStyle = 'hero',
  accent = '#1F7A6C',
  pages,
}: {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  ogCardStyle?: string;
  accent?: string;
  pages: Array<{ sections: Array<{ template: { key: string }; content: Record<string, unknown> }> }>;
}) {
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription);
  const [ogImage, setOgImage] = useState(initialOgImage);
  const [ogCardStyle, setOgCardStyle] = useState<OgCardStyle>(
    initialStyle === 'brand' || initialStyle === 'custom' ? initialStyle : 'hero',
  );
  const [chrome, setChrome] = useState<PreviewChrome>('whatsapp');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const heroImage = useMemo(() => firstHeroImage(pages), [pages]);
  const previewTitle = seoTitle.trim() || hospitalName || 'Hospital';
  const previewDesc =
    seoDescription.trim() ||
    `${hospitalName || 'Hospital'} — care you can trust`;
  const siteHost = hospitalSlug
    ? liveSiteUrl(hospitalSlug).replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'site';

  const previewImage = useMemo(() => {
    if (ogCardStyle === 'custom' && ogImage.trim()) return ogImage.trim();
    if (ogCardStyle === 'hero' && heroImage) return heroImage;
    if (ogCardStyle === 'brand') return ''; // CSS mock
    return ogImage.trim() || heroImage || '';
  }, [ogCardStyle, ogImage, heroImage]);

  async function save() {
    setSaving(true);
    setStatus('Saving…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seoTitle,
        seoDescription,
        ogImage: ogCardStyle === 'custom' ? ogImage : '',
        ogCardStyle,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setStatus(data.error ?? 'Save failed');
      return;
    }
    if (typeof data.ogImage === 'string') setOgImage(data.ogImage);
    if (data.ogImage == null) setOgImage('');
    if (typeof data.ogCardStyle === 'string') {
      setOgCardStyle(
        data.ogCardStyle === 'brand' || data.ogCardStyle === 'custom'
          ? data.ogCardStyle
          : 'hero',
      );
    }
    setStatus('Saved — publish so WhatsApp / Meta refresh the card');
  }

  return (
    <div className="max-w-3xl mx-auto px-lg py-xl flex flex-col gap-xl">
      <div>
        <h2 className="font-outfit text-h2 text-on-surface tracking-tight">Social media</h2>
        <p className="font-inter text-body-sm text-outline mt-xs">
          Title, description, and link-preview card for WhatsApp, Instagram, Facebook, and X.
        </p>
      </div>

      <section className="flex flex-col gap-md">
        <h3 className="font-outfit text-[15px] font-semibold text-on-surface">Share text</h3>
        <div className="flex flex-col gap-xs">
          <label className="font-inter text-label-sm text-outline">Title</label>
          <input
            className="field-input"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={hospitalName || 'Hospital name'}
            maxLength={120}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-inter text-label-sm text-outline">Description</label>
          <textarea
            className="field-input min-h-[88px]"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Short blurb for search and link previews"
            maxLength={320}
          />
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div>
          <h3 className="font-outfit text-[15px] font-semibold text-on-surface">Card image</h3>
          <p className="font-inter text-label-sm text-outline mt-xs">
            Choose how the preview image is built on publish.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
          {CARD_STYLES.map((style) => {
            const active = ogCardStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setOgCardStyle(style.id)}
                className={`text-left rounded-lg border p-md transition-colors ${
                  active
                    ? 'border-primary bg-primary-container/40'
                    : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    active ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {style.icon}
                </span>
                <p className="font-outfit text-[14px] font-semibold text-on-surface mt-sm">
                  {style.label}
                </p>
                <p className="font-inter text-label-sm text-outline mt-xs">{style.blurb}</p>
              </button>
            );
          })}
        </div>
        {ogCardStyle === 'custom' ? (
          <ImageField
            label="Custom share image"
            hospitalId={hospitalId}
            value={ogImage}
            onChange={setOgImage}
          />
        ) : null}
        {ogCardStyle === 'hero' && !heroImage ? (
          <p className="font-inter text-label-sm text-outline">
            No hero image yet — add one on the home page, or pick Brand / Custom.
          </p>
        ) : null}
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex flex-wrap items-end justify-between gap-sm">
          <div>
            <h3 className="font-outfit text-[15px] font-semibold text-on-surface">Card preview</h3>
            <p className="font-inter text-label-sm text-outline mt-xs">
              Approximate look — exact crop varies by app.
            </p>
          </div>
          <div className="flex gap-xs">
            {(
              [
                ['whatsapp', 'WhatsApp'],
                ['facebook', 'Facebook'],
                ['x', 'X'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setChrome(id)}
                className={`rounded-md px-sm py-xs font-inter text-label-sm ${
                  chrome === id
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface-container text-outline hover:bg-surface-container-high'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <OgCardPreview
          chrome={chrome}
          title={previewTitle}
          description={previewDesc}
          host={siteHost}
          imageUrl={previewImage}
          brandAccent={accent}
          brandMode={ogCardStyle === 'brand' && !previewImage}
          hospitalName={hospitalName}
        />
      </section>

      <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
        <button
          type="button"
          className="btn-primary sm:w-auto"
          disabled={saving || (ogCardStyle === 'custom' && !ogImage.trim())}
          onClick={() => void save()}
        >
          {saving ? 'Saving…' : 'Save social settings'}
        </button>
        {status ? (
          <p className="font-inter text-label-sm text-primary font-semibold">{status}</p>
        ) : null}
      </div>
    </div>
  );
}

function OgCardPreview({
  chrome,
  title,
  description,
  host,
  imageUrl,
  brandAccent,
  brandMode,
  hospitalName,
}: {
  chrome: PreviewChrome;
  title: string;
  description: string;
  host: string;
  imageUrl: string;
  brandAccent: string;
  brandMode: boolean;
  hospitalName: string;
}) {
  const media = brandMode ? (
    <div
      className="w-full aspect-[1.91/1] flex flex-col justify-end p-md"
      style={{ background: brandAccent }}
    >
      <p className="font-outfit text-[18px] font-semibold text-white/95 line-clamp-2 drop-shadow">
        {hospitalName || title}
      </p>
    </div>
  ) : imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt=""
      className={`w-full object-cover bg-surface-container ${
        chrome === 'x' ? 'aspect-[2/1]' : 'aspect-[1.91/1]'
      }`}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  ) : (
    <div className="aspect-[1.91/1] flex items-center justify-center text-outline font-inter text-label-sm bg-surface-container">
      Image after publish
    </div>
  );

  if (chrome === 'facebook') {
    return (
      <div className="rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest max-w-md">
        {media}
        <div className="p-md space-y-xs bg-[#f0f2f5]">
          <p className="font-inter text-[11px] uppercase tracking-wide text-[#65676b]">{host}</p>
          <p className="font-outfit text-[16px] font-semibold text-[#050505] line-clamp-2">{title}</p>
          <p className="font-inter text-[13px] text-[#65676b] line-clamp-2">{description}</p>
        </div>
      </div>
    );
  }

  if (chrome === 'x') {
    return (
      <div className="rounded-2xl border border-outline-variant overflow-hidden bg-surface-container-lowest max-w-md">
        {media}
        <div className="p-md space-y-xs">
          <p className="font-outfit text-[15px] font-semibold text-on-surface line-clamp-2">{title}</p>
          <p className="font-inter text-label-sm text-outline line-clamp-2">{description}</p>
          <p className="font-inter text-label-sm text-outline flex items-center gap-xs">
            <span className="material-symbols-outlined text-[14px]">link</span>
            {host}
          </p>
        </div>
      </div>
    );
  }

  // WhatsApp
  return (
    <div className="rounded-lg overflow-hidden max-w-sm border border-outline-variant bg-[#d1f4cc]">
      <div className="m-sm rounded-md overflow-hidden bg-surface-container-lowest shadow-sm">
        {media}
        <div className="p-sm space-y-xs bg-[#f5f6f6]">
          <p className="font-outfit text-[14px] font-semibold text-on-surface line-clamp-2">{title}</p>
          <p className="font-inter text-[12px] text-outline line-clamp-2">{description}</p>
          <p className="font-inter text-[11px] text-outline uppercase tracking-wide">{host}</p>
        </div>
      </div>
    </div>
  );
}
