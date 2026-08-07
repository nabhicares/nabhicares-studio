'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState } from 'react';
import { resolveLayout } from '@nabhicares/section-layouts';
import {
  DEFAULT_DESIGN_TOKENS,
  type DesignTokens,
} from '@nabhicares/section-registry';
import { ViewportToggle, type PreviewViewport } from './DraftCanvas';
import { liveSiteUrl } from '@/lib/cdn';

type PreviewSection = {
  id: string;
  type: string;
  layoutVersion: number;
  order: number;
  enabled: boolean;
  content: Record<string, unknown>;
};

type PreviewPage = {
  slug: string;
  sections: PreviewSection[];
};

const VIEWPORT_WIDTH: Record<PreviewViewport, number | undefined> = {
  mobile: 390,
  tablet: 768,
  desktop: undefined,
};

export function DraftPreview({
  hospitalId,
  hospitalName,
  hospitalSlug,
  initialSlug,
  onClose,
}: {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  initialSlug?: string;
  onClose: () => void;
}) {
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const [slug, setSlug] = useState(initialSlug ?? 'home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/api/hospitals/${hospitalId}/preview?includeDisabled=0`,
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to load preview');
          return;
        }
        if (data.designTokens) setTokens(data.designTokens as DesignTokens);
        const nextPages = (data.pages ?? []) as PreviewPage[];
        setPages(nextPages);
        if (initialSlug && nextPages.some((p) => p.slug === initialSlug)) {
          setSlug(initialSlug);
        } else if (nextPages[0]) {
          setSlug(nextPages[0].slug);
        }
      } catch {
        setError('Failed to load preview');
      } finally {
        setLoading(false);
      }
    })();
  }, [hospitalId, initialSlug]);

  const page = pages.find((p) => p.slug === slug) ?? pages[0];
  const cssVars = {
    ['--color-bg' as string]: tokens.colors.background,
    ['--color-fg' as string]: tokens.colors.foreground,
    ['--color-accent' as string]: tokens.colors.accent,
    ['--color-muted' as string]: tokens.colors.muted,
    ['--color-surface' as string]: tokens.colors.surface,
    ['--font-display' as string]: tokens.typography.displayFamily,
    ['--font-body' as string]: tokens.typography.bodyFamily,
    ['--font-size-base' as string]: tokens.typography.baseSize,
    ['--space-section-y' as string]: tokens.spacing.sectionY,
    ['--content-max' as string]: tokens.spacing.contentMax,
    ['--radius-button' as string]: tokens.radii.button,
    background: tokens.colors.background,
    color: tokens.colors.foreground,
    fontFamily: tokens.typography.bodyFamily,
    minHeight: '100%',
  };

  return (
    <div className="fixed inset-0 z-[60] bg-surface-dim/80 backdrop-blur-sm flex flex-col">
      <header className="h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-lg shrink-0">
        <div className="flex items-center gap-md min-w-0">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
          <div className="h-6 w-px bg-outline-variant" />
          <span className="font-outfit font-semibold truncate">{hospitalName}</span>
          <span className="font-inter text-label-sm text-outline">Draft preview</span>
        </div>
        <div className="flex items-center gap-sm overflow-x-auto">
          <ViewportToggle value={viewport} onChange={setViewport} />
          <div className="h-6 w-px bg-outline-variant shrink-0" />
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSlug(p.slug)}
              className={`px-sm py-xs rounded-lg text-label-md font-semibold whitespace-nowrap ${
                p.slug === (page?.slug ?? '')
                  ? 'bg-primary-container text-on-primary-container'
                  : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              /{p.slug}
            </button>
          ))}
          <a
            href={liveSiteUrl(hospitalSlug)}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost whitespace-nowrap"
            title="Open live CDN"
          >
            Live site
          </a>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-surface-dim/40">
        <div className="flex justify-center items-start p-lg pb-24 min-h-full">
        {loading ? (
          <p className="p-xl text-on-surface-variant">Loading draft…</p>
        ) : error ? (
          <p className="p-xl text-error">{error}</p>
        ) : (
          <div
            className={`bg-white shadow-canvas h-auto ${
              viewport === 'mobile'
                ? 'rounded-[28px] border-[10px] border-on-surface'
                : viewport === 'tablet'
                  ? 'rounded-2xl border-[8px] border-on-surface/80'
                  : 'rounded-xl hairline w-full max-w-5xl'
            }`}
            style={{
              ...cssVars,
              width: VIEWPORT_WIDTH[viewport],
              maxWidth: '100%',
              ['--hero-vh' as string]: '52vh',
            }}
          >
            <nav className="p-lg flex justify-between items-center border-b border-outline-variant/40 bg-[var(--color-bg)] gap-md">
              <span
                className="text-lg font-semibold truncate"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {hospitalName}
              </span>
              {viewport === 'mobile' ? (
                <span className="material-symbols-outlined" style={{ color: 'var(--color-muted)' }}>
                  menu
                </span>
              ) : (
                <div className="flex gap-lg text-sm flex-wrap justify-end" style={{ color: 'var(--color-muted)' }}>
                  {pages.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setSlug(p.slug)}
                      style={{
                        color:
                          p.slug === page?.slug
                            ? 'var(--color-accent)'
                            : 'var(--color-muted)',
                        fontWeight: p.slug === page?.slug ? 700 : 500,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {p.slug}
                    </button>
                  ))}
                </div>
              )}
            </nav>
            {(page?.sections ?? []).map((section) => {
              const Layout = resolveLayout(section.type, section.layoutVersion ?? 1);
              return (
                <div key={section.id} data-section-type={section.type}>
                  <Layout
                    content={(section.content ?? {}) as Record<string, unknown>}
                    hospitalSlug={hospitalSlug}
                    studioApiUrl={
                      typeof process !== 'undefined'
                        ? process.env.NEXT_PUBLIC_STUDIO_API_URL
                        : undefined
                    }
                  />
                </div>
              );
            })}
            {(page?.sections ?? []).length === 0 ? (
              <p className="p-xl" style={{ color: 'var(--color-muted)' }}>
                No enabled sections on this page.
              </p>
            ) : null}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
