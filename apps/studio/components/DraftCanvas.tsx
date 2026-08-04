'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState, type CSSProperties } from 'react';
import { resolveLayout } from '@nabhicares/section-layouts';
import { DEFAULT_DESIGN_TOKENS, getSectionType, type DesignTokens } from '@nabhicares/section-registry';
import type { Page } from './StudioEditor';

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

export function DraftCanvas({
  hospitalId,
  hospitalName,
  hospitalSlug,
  page,
  pages,
  selectedSectionId,
  mode,
  designTokens,
  onSelectSection,
}: {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  page?: Page;
  pages?: Page[];
  selectedSectionId?: string;
  mode: 'device' | 'browser';
  /** When provided, overrides fetched tokens (live Style edits). */
  designTokens?: DesignTokens;
  onSelectSection?: (id: string) => void;
}) {
  const [fetchedTokens, setFetchedTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const tokens = designTokens ?? fetchedTokens;
  const sections = page?.sections ?? [];
  const navPages = (pages ?? []).filter((p) => p.slug);
  const frameClass =
    mode === 'device'
      ? 'w-full bg-white rounded-[32px] overflow-hidden shadow-canvas border-[12px] border-on-surface mt-sm relative min-h-[900px]'
      : 'w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-canvas hairline min-h-[800px] flex flex-col';

  useEffect(() => {
    if (designTokens) return;
    void (async () => {
      const res = await apiFetch(`/api/hospitals/${hospitalId}/design`);
      const data = await res.json();
      if (data.tokens) setFetchedTokens(data.tokens as DesignTokens);
    })();
  }, [hospitalId, designTokens]);

  return (
    <div className={frameClass}>
      {mode === 'browser' ? (
        <div className="h-10 bg-surface-container border-b border-outline-variant flex items-center px-md gap-sm">
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
      ) : null}

      <nav className="p-lg flex justify-between items-center bg-white border-b border-outline-variant/40">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-3xl">local_hospital</span>
          <span className="font-outfit text-lg font-semibold text-on-surface">{hospitalName}</span>
        </div>
        <div className="hidden sm:flex gap-lg font-inter text-label-md text-on-surface-variant">
          {navPages.length > 0
            ? navPages.map((p) => (
                <span
                  key={p.id}
                  className={p.slug === page?.slug ? 'text-primary font-bold' : ''}
                >
                  {p.slug}
                </span>
              ))
            : (
              <>
                <span>Services</span>
                <span>Doctors</span>
                <span>About</span>
                <span className="text-primary font-bold">Contact</span>
              </>
            )}
        </div>
      </nav>

      <div style={tokensToStyle(tokens)}>
        <p className="font-inter text-label-sm text-outline uppercase tracking-widest px-xl pt-lg mb-0 opacity-70">
          Draft · {page?.slug ?? '—'}
        </p>

        {sections.length === 0 ? (
          <p className="text-on-surface-variant text-body-md p-xl">No sections on this page.</p>
        ) : (
          sections.map((section) => {
            const label = getSectionType(section.template.key)?.label ?? section.template.key;
            const selected = section.id === selectedSectionId;
            const Layout = resolveLayout(section.template.key, section.template.version);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelectSection?.(section.id)}
                className={`relative block w-full text-left transition-all border-0 p-0 bg-transparent ${
                  selected ? 'ring-4 ring-primary ring-inset' : ''
                } ${section.enabled ? '' : 'opacity-50'}`}
              >
                {selected ? (
                  <div className="absolute top-3 left-3 z-10 bg-primary text-white px-sm py-xs text-[10px] font-bold uppercase rounded">
                    {label} · L{String(section.template.version).padStart(2, '0')}
                  </div>
                ) : null}
                <Layout content={section.content ?? {}} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
