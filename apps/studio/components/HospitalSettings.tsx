'use client';

import { apiFetch } from '@/lib/api-client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { liveSiteUrl, pathStyleLiveUrl, cdnRootDomain } from '@/lib/cdn';
import { DnsSetupPanel } from './DnsSetupPanel';
import { GeminiHospitalImport } from './GeminiHospitalImport';

function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-md pb-lg border-b border-outline-variant last:border-0 last:pb-0">
      <div>
        <h4 className="font-outfit text-[15px] font-semibold text-on-surface tracking-tight">
          {title}
        </h4>
        {description ? (
          <p className="font-inter text-label-sm text-outline mt-xs">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function HospitalSettings({
  hospitalId,
  hospitalName,
  hospitalSlug,
  seoTitle: initialSeoTitle = '',
  seoDescription: initialSeoDescription = '',
  ogImage: initialOgImage = '',
  customDomain: initialCustomDomain = '',
  onClose,
  onUpdated,
}: {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  customDomain?: string | null;
  onClose: () => void;
  onUpdated: (next: { name: string; slug: string }) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(hospitalName);
  const [slug, setSlug] = useState(hospitalSlug);
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription);
  const [ogImage, setOgImage] = useState(initialOgImage);
  const [customDomain, setCustomDomain] = useState(initialCustomDomain ?? '');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const root = cdnRootDomain();
  const previewTitle = seoTitle.trim() || name || 'Hospital';
  const previewDesc =
    seoDescription.trim() ||
    `${name || 'Hospital'} — hospital website published with Nabhi Studio`;
  const previewImage =
    ogImage.trim() ||
    (slug ? `${liveSiteUrl(slug).replace(/\/$/, '')}/og.png` : '');

  async function save() {
    setSaving(true);
    setStatus('Saving…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug,
        seoTitle,
        seoDescription,
        ogImage,
        customDomain: customDomain.trim() || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setStatus(data.error ?? 'Save failed');
      return;
    }
    onUpdated({ name: data.name, slug: data.slug });
    if (typeof data.customDomain === 'string') setCustomDomain(data.customDomain);
    if (data.customDomain == null) setCustomDomain('');
    if (typeof data.ogImage === 'string') setOgImage(data.ogImage);
    if (data.ogImage == null) setOgImage('');
    setStatus('Saved — publish so WhatsApp / Meta pick up the new card');
    if (data.slug !== hospitalSlug) {
      router.replace(`/h/${data.slug}`);
    }
  }

  return (
    <aside className="w-96 bg-surface-container-lowest border-l border-outline-variant flex flex-col z-40 shrink-0">
      <div className="flex items-center justify-between p-lg border-b border-outline-variant">
        <h3 className="font-outfit text-[18px] font-semibold">Hospital settings</h3>
        <button type="button" className="p-xs" onClick={onClose} title="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="p-lg flex flex-col gap-lg overflow-y-auto flex-1">
        <SettingsGroup title="Identity" description="How this hospital appears in Studio and on the live site.">
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">Display name</label>
            <input
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">Slug (URL)</label>
            <input
              className="field-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="font-inter text-label-sm text-outline break-all">
              {root ? (
                <>
                  Subdomain:{' '}
                  <a
                    className="text-primary underline"
                    href={liveSiteUrl(slug || '…')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {liveSiteUrl(slug || '…')}
                  </a>
                  <br />
                  Path:{' '}
                  <a
                    className="text-primary underline"
                    href={pathStyleLiveUrl(slug || '…')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {pathStyleLiveUrl(slug || '…')}
                  </a>
                </>
              ) : (
                <>
                  Live:{' '}
                  <a
                    className="text-primary underline"
                    href={liveSiteUrl(slug || '…')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {liveSiteUrl(slug || '…')}
                  </a>
                </>
              )}
            </p>
          </div>
        </SettingsGroup>

        <SettingsGroup
          title="Domain & DNS"
          description="Point a custom hostname at Nabhi after DNS is ready."
        >
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">Custom domain</label>
            <input
              className="field-input"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="www.yourhospital.com"
            />
            <p className="font-inter text-label-sm text-outline">
              Optional. Save here after DNS + Vercel Domains are ready.
            </p>
          </div>
          <DnsSetupPanel hospitalSlug={slug} customDomain={customDomain} />
        </SettingsGroup>

        <SettingsGroup
          title="Content import"
          description="Refresh copy from a Gemini hospital bundle JSON."
        >
          <GeminiHospitalImport hospitalId={hospitalId} />
        </SettingsGroup>

        <SettingsGroup
          title="SEO & social share"
          description="Title, description, and image used in Google and WhatsApp / Instagram / Meta link cards. Leave image blank to auto-generate on publish."
        >
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">Share / SEO title</label>
            <input
              className="field-input"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={name || 'Hospital name'}
              maxLength={120}
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">Share / SEO description</label>
            <textarea
              className="field-input min-h-[80px]"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Short blurb for search and link previews"
              maxLength={320}
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">
              Share image URL (optional)
            </label>
            <input
              className="field-input"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://…/your-photo.jpg  ·  blank = auto card"
            />
            <p className="font-inter text-label-sm text-outline">
              Must be a public https image (≈1200×630). If blank: hero photo if set, else an
              auto-generated branded card on publish.
            </p>
          </div>

          <div className="rounded-lg border border-outline-variant overflow-hidden bg-surface-container-low">
            <p className="font-inter text-[10px] uppercase tracking-wider text-outline px-sm py-xs border-b border-outline-variant">
              Link card preview
            </p>
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt=""
                className="w-full aspect-[1.91/1] object-cover bg-surface-container"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="aspect-[1.91/1] flex items-center justify-center text-outline font-inter text-label-sm">
                Image appears after publish
              </div>
            )}
            <div className="p-sm space-y-xs">
              <p className="font-inter text-label-sm text-primary truncate">
                {slug ? liveSiteUrl(slug).replace(/^https?:\/\//, '').replace(/\/$/, '') : 'site'}
              </p>
              <p className="font-outfit text-[15px] font-semibold text-on-surface line-clamp-2">
                {previewTitle}
              </p>
              <p className="font-inter text-label-sm text-outline line-clamp-2">{previewDesc}</p>
            </div>
          </div>
        </SettingsGroup>

        <button
          type="button"
          className="btn-primary w-full"
          disabled={saving || !name.trim() || !slug.trim()}
          onClick={() => void save()}
        >
          Save hospital
        </button>
        {status ? (
          <p className="font-inter text-label-sm text-primary font-semibold">{status}</p>
        ) : null}
      </div>
    </aside>
  );
}
