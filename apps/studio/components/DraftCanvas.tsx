'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState, type CSSProperties } from 'react';
import { resolveLayout, resolveFooterLayout, telHref, toDirectionsUrl, NotFoundView, PrivacyView } from '@nabhicares/section-layouts';
import { DEFAULT_DESIGN_TOKENS, getSectionType, normalizeSystemPages, type DesignTokens } from '@nabhicares/section-registry';
import type { Page } from './StudioEditor';

export type PreviewViewport = 'mobile' | 'tablet' | 'desktop';

/** What the Design canvas shows while editing system pages. */
export type SystemPreviewMode = 'page' | 'notFound' | 'privacy';

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
  systemPreview = 'page',
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
  /** Design → System pages: show 404 / privacy / footer in the canvas. */
  systemPreview?: SystemPreviewMode;
  onSelectSection?: (id: string) => void;
}) {
  const [fetchedTokens, setFetchedTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const tokens = designTokens ?? fetchedTokens;
  const sections = page?.sections ?? [];
  const navPages = (pages ?? []).filter((p) => p.slug);
  const frame = frameFor(viewport);
  const compactNav = viewport === 'mobile';
  const systemPages = normalizeSystemPages(tokens.systemPages);
  const previewPath =
    systemPreview === 'notFound'
      ? '404'
      : systemPreview === 'privacy'
        ? 'privacy'
        : (page?.slug ?? 'home');
  const hideChrome = systemPreview === 'notFound';
  const showPrivacy = systemPreview === 'privacy';
  const showNotFound = systemPreview === 'notFound';
  const activeNavSlug = showPrivacy ? 'privacy' : page?.slug;

  useEffect(() => {
    if (designTokens) return;
    void (async () => {
      const res = await apiFetch(`/api/hospitals/${hospitalId}/design`);
      const data = await res.json();
      if (data.tokens) setFetchedTokens({
        ...DEFAULT_DESIGN_TOKENS,
        ...(data.tokens as DesignTokens),
        systemPages: normalizeSystemPages((data.tokens as DesignTokens).systemPages),
      });
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
            {hospitalSlug}.nabhi.studio/{previewPath}
          </div>
        </div>
      ) : viewport === 'mobile' ? (
        <div className="h-7 flex items-center justify-center shrink-0 bg-on-surface">
          <div className="w-20 h-1.5 rounded-full bg-white/25" />
        </div>
      ) : null}

      <div style={tokensToStyle(tokens)}>
        {!hideChrome ? (
          <>
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
                          p.slug === activeNavSlug
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
              {showPrivacy ? (
                <span
                  style={{
                    color: tokens.colors.accent,
                    fontWeight: 700,
                    borderBottom: `2px solid ${tokens.colors.accent}`,
                    paddingBottom: 2,
                  }}
                >
                  Privacy
                </span>
              ) : null}
              <span
                className="rounded px-md py-xs font-semibold"
                style={{ background: tokens.colors.accent, color: tokens.colors.background }}
              >
                Call Now
              </span>
            </div>
          )}
        </nav>
          </>
        ) : null}
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
          .nabhi-site-footer {
            padding: 2rem 1.25rem 1.75rem;
            font-size: 0.9rem;
            color: var(--color-muted);
            border-top: 1px solid color-mix(in srgb, var(--color-fg) 10%, transparent);
            background: color-mix(in srgb, var(--color-surface) 70%, var(--color-bg));
          }
          .nabhi-footer-inner {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
          .nabhi-footer-bottom {
            margin-top: 1.25rem;
            padding-top: 1rem;
            border-top: 1px solid color-mix(in srgb, var(--color-fg) 10%, transparent);
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem 1.25rem;
            justify-content: space-between;
            font-size: 0.84rem;
          }
          .nabhi-footer-name {
            font-family: var(--font-display);
            font-weight: 700;
            color: var(--color-fg);
            font-size: 1.05rem;
          }
          .nabhi-footer-label {
            font-size: 0.72rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 0.45rem;
            color: var(--color-fg);
          }
          .nabhi-footer-link, .nabhi-footer-credit a {
            color: var(--color-muted);
            text-decoration: none;
            display: block;
            margin-top: 0.35rem;
          }
          .nabhi-footer-credit a { color: var(--color-accent); display: inline; }
          .nabhi-footer-meta { margin: 0.35rem 0 0; line-height: 1.45; }
          .nabhi-footer-cta {
            display: inline-flex; align-items: center; gap: 0.35rem;
            margin-top: 0.75rem; padding: 0.65rem 1rem; border-radius: var(--radius-button);
            background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 600;
          }
          .nabhi-footer-cta-ghost {
            display: inline-flex; align-items: center; margin-top: 0.75rem; padding: 0.65rem 1rem;
            border-radius: var(--radius-button); border: 1px solid color-mix(in srgb, var(--color-fg) 22%, transparent);
            color: var(--color-fg); text-decoration: none; font-weight: 600;
          }
          .nabhi-footer-nav-row, .nabhi-footer-contact-row, .nabhi-footer-heroish-cta {
            display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center;
          }
          .nabhi-footer-l02 .nabhi-footer-centered { justify-items: center; text-align: center; grid-template-columns: 1fr; }
          .nabhi-footer-l02 .nabhi-footer-nav-row, .nabhi-footer-l02 .nabhi-footer-contact-row { justify-content: center; }
          .nabhi-footer-l03 { background: color-mix(in srgb, var(--color-accent) 14%, var(--color-bg)); }
          .nabhi-footer-l04 .nabhi-footer-split { grid-template-columns: 1.1fr 1fr; }
          .nabhi-footer-split-right { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
          .nabhi-footer-l06 .nabhi-footer-slim { grid-template-columns: auto 1fr auto; align-items: center; }
          .nabhi-footer-callout {
            margin: 0 0 1.25rem; padding: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem;
            justify-content: space-between; align-items: center;
            border-radius: calc(var(--radius-button) + 4px);
            background: color-mix(in srgb, var(--color-accent) 16%, var(--color-surface));
          }
          .nabhi-footer-callout .nabhi-footer-cta { margin-top: 0; }
          .nabhi-footer-heroish-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; }
          .nabhi-footer-card {
            padding: 1rem; border-radius: calc(var(--radius-button) + 4px);
            border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
            background: color-mix(in srgb, var(--color-surface) 75%, var(--color-bg));
          }
          .nabhi-footer-l10 .nabhi-footer-minimal { grid-template-columns: auto 1fr; align-items: center; }
          .nabhi-not-found-inner { width: min(100%, 34rem); text-align: left; }
          .nabhi-not-found-kicker {
            margin: 0 0 0.75rem; font-size: 0.78rem; font-weight: 700;
            letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent);
          }
          .nabhi-not-found-code {
            margin: 0; font-family: var(--font-display);
            font-size: clamp(4.5rem, 14vw, 7rem); font-weight: 700; line-height: 0.9;
            letter-spacing: -0.06em; color: color-mix(in srgb, var(--color-accent) 55%, var(--color-fg));
          }
          .nabhi-not-found-title {
            margin: 0.85rem 0 0.65rem; font-family: var(--font-display);
            font-size: clamp(1.75rem, 4vw, 2.35rem); font-weight: 700;
            letter-spacing: -0.03em; color: var(--color-fg);
          }
          .nabhi-not-found-body {
            margin: 0 0 1.75rem; font-size: 1.05rem; line-height: 1.65;
            color: var(--color-muted); max-width: 32rem;
          }
          .nabhi-not-found-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
          .nabhi-not-found-primary {
            display: inline-flex; align-items: center; justify-content: center;
            background: var(--color-accent); color: var(--color-bg); border: none;
            border-radius: var(--radius-button); padding: 0.8rem 1.35rem;
            font-size: 0.95rem; font-weight: 600; text-decoration: none;
          }
          .nabhi-not-found-secondary {
            display: inline-flex; align-items: center; justify-content: center;
            background: transparent; color: var(--color-fg);
            border: 1px solid color-mix(in srgb, var(--color-fg) 22%, transparent);
            border-radius: var(--radius-button); padding: 0.8rem 1.35rem;
            font-size: 0.95rem; font-weight: 600; text-decoration: none;
          }
          .nabhi-not-found-split {
            display: grid; grid-template-columns: minmax(140px, 0.4fr) minmax(220px, 0.6fr);
            width: min(100%, 52rem); min-height: 22rem;
            border-radius: calc(var(--radius-button) + 8px); overflow: hidden;
            border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
          }
          .nabhi-not-found-split-accent {
            display: flex; align-items: center; justify-content: center;
            background: color-mix(in srgb, var(--color-accent) 18%, var(--color-surface));
            padding: 1.5rem;
          }
          .nabhi-not-found-split .nabhi-not-found-inner {
            padding: clamp(1.5rem, 4vw, 2.5rem); display: flex; flex-direction: column; justify-content: center;
          }
          .nabhi-not-found-banner {
            height: clamp(7rem, 18vw, 10rem);
            background: linear-gradient(120deg, color-mix(in srgb, var(--color-accent) 35%, var(--color-surface)), var(--color-surface));
          }
        `}</style>
        <p className="font-inter text-label-sm text-outline uppercase tracking-widest px-xl pt-lg mb-0 opacity-70">
          Draft ·{' '}
          {showNotFound ? '404' : showPrivacy ? 'privacy' : (page?.slug ?? '—')} · {viewport}
        </p>

        {showNotFound ? (
          <NotFoundView
            hospitalName={hospitalName}
            title={systemPages.notFound.title}
            body={systemPages.notFound.body}
            primaryCta={systemPages.notFound.primaryCta}
            secondaryCta={systemPages.notFound.secondaryCta}
            homeHref="#"
            contactHref="#"
            layoutVersion={systemPages.notFound.layoutVersion}
          />
        ) : showPrivacy ? (
          <PrivacyView
            hospitalName={hospitalName}
            title={systemPages.privacy.title}
            intro={systemPages.privacy.intro}
            formsNote={systemPages.privacy.formsNote}
            rightsNote={systemPages.privacy.rightsNote}
            homeHref="#"
            contactPhone={(() => {
              for (const s of sections) {
                if (s.template.key !== 'contact') continue;
                const c = s.content ?? {};
                if (typeof c.phone === 'string' && c.phone.trim()) return c.phone.trim();
              }
              return undefined;
            })()}
            contactEmail={(() => {
              for (const s of sections) {
                if (s.template.key !== 'contact') continue;
                const c = s.content ?? {};
                if (typeof c.email === 'string' && c.email.trim()) return c.email.trim();
              }
              return undefined;
            })()}
            layoutVersion={systemPages.privacy.layoutVersion}
          />
        ) : sections.length === 0 ? (
          <p className="text-on-surface-variant text-body-md p-xl">No sections on this page.</p>
        ) : (
          (() => {
            let phone = '';
            let mapUrl = '';
            let address = '';
            let hours = '';
            let email = '';
            for (const s of sections) {
              if (s.template.key !== 'contact') continue;
              const c = s.content ?? {};
              if (!phone && typeof c.phone === 'string') phone = c.phone.trim();
              if (!mapUrl && typeof c.mapUrl === 'string') mapUrl = c.mapUrl.trim();
              if (!address && typeof c.address === 'string') address = c.address.trim();
              if (!hours && typeof c.hours === 'string') hours = c.hours.trim();
              if (!email && typeof c.email === 'string') email = c.email.trim();
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
            const navForFooter = (navPages.length ? navPages : [{ id: 'home', slug: 'home' }]).map(
              (p) => ({
                slug: p.slug,
                label:
                  p.slug === 'home'
                    ? 'Home'
                    : p.slug.charAt(0).toUpperCase() + p.slug.slice(1),
                href: '#',
              }),
            );
            const contactSummary = {
              phone: phone || undefined,
              email: email || undefined,
              address: address || undefined,
              hours: hours || undefined,
              mapUrl: mapUrl || undefined,
            };
            const hasFooterSection = sections.some((s) => s.template.key === 'footer');
            return (
              <>
                {sections.map((section, index) => {
            const label = getSectionType(section.template.key)?.label ?? section.template.key;
            const selected = section.id === selectedSectionId;
            const Layout = resolveLayout(section.template.key, section.template.version);
            const siteLinks = draftLinks;
            const isHero = section.template.key === 'hero';
            const isFooter = section.template.key === 'footer';
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
                  borderTop: isHero || isFooter
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
                    hospitalName={hospitalName}
                    navPages={navForFooter}
                    contactSummary={contactSummary}
                    studioApiUrl={
                      typeof process !== 'undefined'
                        ? process.env.NEXT_PUBLIC_STUDIO_API_URL
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          })}
                {!hasFooterSection && !hideChrome ? (
                  (() => {
                    const FooterLayout = resolveFooterLayout(1);
                    return (
                      <FooterLayout
                        hospitalName={hospitalName}
                        year={new Date().getFullYear()}
                        privacyHref="#"
                        pages={navForFooter}
                        contact={{
                          phone: phone || undefined,
                          phoneHref: phone ? telHref(phone) : undefined,
                          email: email || undefined,
                          address: address || undefined,
                          hours: hours || undefined,
                          directionsHref: toDirectionsUrl(mapUrl || undefined, address || undefined),
                        }}
                      />
                    );
                  })()
                ) : null}
              </>
            );
          })()
        )}
        {showPrivacy && !hideChrome ? (
          (() => {
            const footerSec = sections.find((s) => s.template.key === 'footer');
            const FooterLayout = resolveFooterLayout(footerSec?.template.version ?? 1);
            let phone = '';
            let mapUrl = '';
            let address = '';
            let hours = '';
            let email = '';
            for (const s of sections) {
              if (s.template.key !== 'contact') continue;
              const c = s.content ?? {};
              if (!phone && typeof c.phone === 'string') phone = c.phone.trim();
              if (!mapUrl && typeof c.mapUrl === 'string') mapUrl = c.mapUrl.trim();
              if (!address && typeof c.address === 'string') address = c.address.trim();
              if (!hours && typeof c.hours === 'string') hours = c.hours.trim();
              if (!email && typeof c.email === 'string') email = c.email.trim();
            }
            return (
              <FooterLayout
                hospitalName={hospitalName}
                year={new Date().getFullYear()}
                privacyHref="#"
                pages={(navPages.length ? navPages : [{ id: 'home', slug: 'home' }]).map((p) => ({
                  slug: p.slug,
                  label:
                    p.slug === 'home'
                      ? 'Home'
                      : p.slug.charAt(0).toUpperCase() + p.slug.slice(1),
                  href: '#',
                }))}
                contact={{
                  phone: phone || undefined,
                  phoneHref: phone ? telHref(phone) : undefined,
                  email: email || undefined,
                  address: address || undefined,
                  hours: hours || undefined,
                  directionsHref: toDirectionsUrl(mapUrl || undefined, address || undefined),
                }}
              />
            );
          })()
        ) : null}
      </div>
    </div>
  );
}
