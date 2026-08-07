'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState, type CSSProperties } from 'react';
import { resolveLayout, telHref, toDirectionsUrl } from '@nabhicares/section-layouts';
import { DEFAULT_DESIGN_TOKENS, getSectionType, type DesignTokens } from '@nabhicares/section-registry';
import type { Page } from './StudioEditor';

export type PreviewViewport = 'mobile' | 'tablet' | 'desktop';

export const PREVIEW_VIEWPORTS: {
  id: PreviewViewport;
  label: string;
  icon: string;
  width: number;
}[] = [
  { id: 'mobile', label: 'Mobile', icon: 'smartphone', width: 390 },
  { id: 'tablet', label: 'Tablet', icon: 'tablet_mac', width: 768 },
  { id: 'desktop', label: 'Desktop', icon: 'desktop_windows', width: 1200 },
];

function tokensToStyle(tokens: DesignTokens): CSSProperties {
  return {
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
    fontSize: tokens.typography.baseSize,
  };
}

function googleFontHrefFromTokens(tokens: DesignTokens): string {
  const normalize = (value: string) =>
    value
      .split(',')[0]
      ?.trim()
      .replace(/^['"]|['"]$/g, '');
  const families = [normalize(tokens.typography.displayFamily), normalize(tokens.typography.bodyFamily)].filter(
    (name): name is string => Boolean(name && name.length > 0),
  );
  const unique = Array.from(new Set(families));
  const parts = unique.map((name) => `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@400;500;600;700`);
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

function frameFor(viewport: PreviewViewport) {
  // h-auto + overflow-visible so the parent pane scrolls the full page.
  // (overflow-hidden + flex stretch was clipping sections below the fold.)
  if (viewport === 'mobile') {
    return {
      width: 390,
      className:
        'nabhi-draft-canvas bg-white rounded-[32px] shadow-canvas border-[10px] border-on-surface relative flex flex-col shrink-0 h-auto overflow-visible',
      chrome: 'device' as const,
    };
  }
  if (viewport === 'tablet') {
    return {
      width: 768,
      className:
        'nabhi-draft-canvas bg-white rounded-2xl shadow-canvas border-[8px] border-on-surface/80 relative flex flex-col shrink-0 h-auto overflow-visible',
      chrome: 'device' as const,
    };
  }
  return {
    width: 1200,
    className:
      'nabhi-draft-canvas w-full max-w-[1200px] bg-white rounded-xl shadow-canvas hairline flex flex-col shrink-0 h-auto overflow-visible',
    chrome: 'browser' as const,
  };
}

export function ViewportToggle({
  value,
  onChange,
}: {
  value: PreviewViewport;
  onChange: (v: PreviewViewport) => void;
}) {
  return (
    <div
      className="flex items-center bg-surface-container-low rounded-lg p-xs hairline gap-xs"
      role="group"
      aria-label="Preview viewport"
    >
      {PREVIEW_VIEWPORTS.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            type="button"
            title={v.label}
            aria-pressed={active}
            onClick={() => onChange(v.id)}
            className={`flex items-center gap-xs px-sm py-xs rounded-md transition-colors ${
              active
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${active ? 'filled' : ''}`}>
              {v.icon}
            </span>
            <span className="font-inter text-label-sm font-semibold hidden lg:inline">
              {v.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function DraftCanvas({
  hospitalId,
  hospitalName,
  hospitalSlug,
  page,
  pages,
  selectedSectionId,
  viewport = 'desktop',
  designTokens,
  onSelectSection,
}: {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  page?: Page;
  pages?: Page[];
  selectedSectionId?: string;
  viewport?: PreviewViewport;
  /** When provided, overrides fetched tokens (live Style edits). */
  designTokens?: DesignTokens;
  onSelectSection?: (id: string) => void;
}) {
  const [fetchedTokens, setFetchedTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const tokens = designTokens ?? fetchedTokens;
  const sections = page?.sections ?? [];
  const navPages = (pages ?? []).filter((p) => p.slug);
  const frame = frameFor(viewport);
  const compactNav = viewport === 'mobile';

  useEffect(() => {
    if (designTokens) return;
    void (async () => {
      const res = await apiFetch(`/api/hospitals/${hospitalId}/design`);
      const data = await res.json();
      if (data.tokens) setFetchedTokens(data.tokens as DesignTokens);
    })();
  }, [hospitalId, designTokens]);

  useEffect(() => {
    const id = 'nabhi-patient-fonts';
    const href = googleFontHrefFromTokens(tokens);
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== href) {
      link.href = href;
    }
  }, [tokens.typography.displayFamily, tokens.typography.bodyFamily]);

  useEffect(() => {
    const id = 'nabhi-material-symbols';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0,0&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className={frame.className}
      style={viewport === 'desktop' ? undefined : { width: frame.width, maxWidth: '100%' }}
    >
      {frame.chrome === 'browser' ? (
        <div className="h-10 bg-surface-container border-b border-outline-variant flex items-center px-md gap-sm shrink-0">
          <div className="flex gap-xs">
            <div className="w-3 h-3 rounded-full bg-outline-variant" />
            <div className="w-3 h-3 rounded-full bg-outline-variant" />
            <div className="w-3 h-3 rounded-full bg-outline-variant" />
          </div>
          <div className="bg-white px-md py-xs rounded text-[10px] text-outline flex-grow mx-xl flex items-center gap-xs">
            <span className="material-symbols-outlined text-[12px]">lock</span>
            {hospitalSlug}.nabhi.studio/{page?.slug ?? 'home'}
          </div>
        </div>
      ) : viewport === 'mobile' ? (
        <div className="h-7 flex items-center justify-center shrink-0 bg-on-surface">
          <div className="w-20 h-1.5 rounded-full bg-white/25" />
        </div>
      ) : null}

      <div style={tokensToStyle(tokens)}>
        <div
          className="flex items-center justify-between gap-sm px-lg py-sm text-label-sm font-semibold border-b"
          style={{
            background: `color-mix(in srgb, ${tokens.colors.accent} 14%, ${tokens.colors.background})`,
            borderColor: 'color-mix(in srgb, var(--color-fg) 8%, transparent)',
          }}
        >
          <span className="inline-flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            Emergency line
          </span>
          <span className="inline-flex items-center gap-xs" style={{ color: tokens.colors.accent }}>
            <span className="material-symbols-outlined text-[18px]">call</span>
            Call Now
          </span>
        </div>
        <nav
          className={`flex justify-between items-center border-b shrink-0 ${
            compactNav ? 'px-md py-md' : 'px-lg py-md'
          }`}
          style={{
            background: tokens.colors.background,
            borderColor: 'color-mix(in srgb, var(--color-fg) 10%, transparent)',
            color: tokens.colors.foreground,
          }}
        >
          <span
            className="text-lg font-bold truncate"
            style={{
              fontFamily: tokens.typography.displayFamily,
              letterSpacing: '-0.03em',
              color: tokens.colors.accent,
            }}
          >
            {hospitalName}
          </span>
          {compactNav ? (
            <span className="material-symbols-outlined" style={{ color: tokens.colors.muted }}>
              menu
            </span>
          ) : (
            <div
              className="flex items-center gap-lg text-label-md flex-wrap justify-end"
              style={{ fontFamily: tokens.typography.bodyFamily, color: tokens.colors.muted }}
            >
              {navPages.length > 0
                ? navPages.map((p) => {
                    const label =
                      p.slug === 'home'
                        ? 'Home'
                        : p.slug.charAt(0).toUpperCase() + p.slug.slice(1);
                    return (
                      <span
                        key={p.id}
                        style={
                          p.slug === page?.slug
                            ? {
                                color: tokens.colors.accent,
                                fontWeight: 700,
                                borderBottom: `2px solid ${tokens.colors.accent}`,
                                paddingBottom: 2,
                              }
                            : undefined
                        }
                      >
                        {label}
                      </span>
                    );
                  })
                : (
                  <>
                    <span>Home</span>
                    <span>Doctors</span>
                    <span>Contact</span>
                  </>
                )}
              <span
                className="rounded px-md py-xs font-semibold"
                style={{ background: tokens.colors.accent, color: tokens.colors.background }}
              >
                Call Now
              </span>
            </div>
          )}
        </nav>
      </div>

      <div
        style={{
          ...tokensToStyle(tokens),
          // Live sites keep tall heroes (88vh). Draft canvas sets --hero-vh lower
          // so the full page is visible while scrolling the editor pane.
          ['--hero-vh' as string]: '52vh',
        }}
        className="w-full"
      >
        <style>{`
          .nabhi-btn:hover { filter: brightness(1.06); transform: translateY(-1px); }
          .nabhi-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            line-height: 1;
            display: inline-block;
            font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
          }
          .nabhi-empty-media {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
            gap: 0.35rem;
            width: 100%;
            height: 100%;
            min-height: 160px;
            padding: 1rem;
            box-sizing: border-box;
            color: var(--color-muted);
            font-size: 0.88rem;
          }
        `}</style>
        <p className="font-inter text-label-sm text-outline uppercase tracking-widest px-xl pt-lg mb-0 opacity-70">
          Draft · {page?.slug ?? '—'} · {viewport}
        </p>

        {sections.length === 0 ? (
          <p className="text-on-surface-variant text-body-md p-xl">No sections on this page.</p>
        ) : (
          (() => {
            let phone = '';
            let mapUrl = '';
            let address = '';
            for (const s of sections) {
              if (s.template.key !== 'contact') continue;
              const c = s.content ?? {};
              if (!phone && typeof c.phone === 'string') phone = c.phone.trim();
              if (!mapUrl && typeof c.mapUrl === 'string') mapUrl = c.mapUrl.trim();
              if (!address && typeof c.address === 'string') address = c.address.trim();
            }
            const draftLinks = {
              home: '#',
              contact: '#',
              doctors: '#',
              services: '#services',
              privacy: '#',
              tel: phone ? telHref(phone) : undefined,
              directions: toDirectionsUrl(mapUrl || undefined, address || undefined),
            };
            return sections.map((section, index) => {
            const label = getSectionType(section.template.key)?.label ?? section.template.key;
            const selected = section.id === selectedSectionId;
            const Layout = resolveLayout(section.template.key, section.template.version);
            const siteLinks = draftLinks;
            const isHero = section.template.key === 'hero';
            const emphasize =
              section.template.key === 'services' ||
              section.template.key === 'testimonials' ||
              section.template.key === 'contact' ||
              section.template.key === 'doctors' ||
              section.template.key === 'map' ||
              section.template.key === 'appointments';
            // Use a div, not <button>: section layouts are block-level and nesting
            // them in a button is invalid HTML — browsers clip/break the tree so
            // only the first section appears and the pane won't scroll.
            return (
              <div
                key={section.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSection?.(section.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSection?.(section.id);
                  }
                }}
                className={`relative block w-full text-left transition-shadow cursor-pointer ${
                  selected ? 'ring-4 ring-primary ring-inset' : 'hover:ring-2 hover:ring-primary/30 hover:ring-inset'
                } ${section.enabled ? '' : 'opacity-50'}`}
                style={{
                  ['--section-bg' as string]: emphasize
                    ? `color-mix(in srgb, ${tokens.colors.surface} 45%, ${tokens.colors.background})`
                    : index % 2 === 0
                      ? tokens.colors.background
                      : `color-mix(in srgb, ${tokens.colors.surface} 55%, ${tokens.colors.background})`,
                  borderTop: isHero
                    ? undefined
                    : '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
                }}
              >
                {selected ? (
                  <div className="absolute top-3 left-3 z-10 bg-primary text-white px-sm py-xs text-[10px] font-bold uppercase rounded pointer-events-none">
                    {label} · L{String(section.template.version).padStart(2, '0')}
                  </div>
                ) : null}
                <div
                  id={
                    section.template.key === 'services'
                      ? 'services'
                      : section.template.key === 'appointments'
                        ? 'appointments'
                        : undefined
                  }
                  data-section-type={section.template.key}
                >
                  <Layout
                    content={section.content ?? {}}
                    siteLinks={siteLinks}
                    hospitalSlug={hospitalSlug}
                    studioApiUrl={
                      typeof process !== 'undefined'
                        ? process.env.NEXT_PUBLIC_STUDIO_API_URL
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          });
          })()
        )}
        <div
          className="px-xl py-lg border-t text-label-sm"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-fg) 10%, transparent)',
            color: tokens.colors.muted,
            background: `color-mix(in srgb, ${tokens.colors.surface} 70%, ${tokens.colors.background})`,
          }}
        >
          <div className="flex flex-wrap justify-between gap-sm">
            <span>© {hospitalName}</span>
            <span>
              Website by{' '}
              <a
                href="https://www.nabhilabs.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: tokens.colors.accent, fontWeight: 600, textDecoration: 'none' }}
              >
                Nabhi Labs
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
