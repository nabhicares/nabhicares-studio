'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_DESIGN_TOKENS, normalizeSystemPages, type DesignTokens } from '@nabhicares/section-registry';
import {
  FAVICON_PRESETS,
  isFaviconPresetId,
  type FaviconPresetId,
} from '@nabhicares/section-registry';
import { LayoutWireframe } from './LayoutWireframe';

type ColorPalette = DesignTokens['colors'];
type FontPair = Pick<DesignTokens['typography'], 'displayFamily' | 'bodyFamily'>;

type ThemeBundle = {
  id: string;
  label: string;
  hint: string;
  colors: ColorPalette;
  typography: FontPair;
  radii?: { button: string };
};

const THEME_BUNDLES: ThemeBundle[] = [
  {
    id: 'clinical-teal',
    label: 'Clinical Teal',
    hint: 'Default Nabhi · calm hospital paper',
    colors: {
      background: '#F3F1EC',
      foreground: '#0F1C1A',
      accent: '#1F7A6C',
      muted: '#5C6B67',
      surface: '#E4E8E5',
    },
    typography: {
      displayFamily: 'Sora',
      bodyFamily: 'Source Sans 3',
    },
    radii: { button: '6px' },
  },
  {
    id: 'trust-navy',
    label: 'Trust Navy',
    hint: 'Formal · multi-specialty hospitals',
    colors: {
      background: '#F5F7FA',
      foreground: '#142033',
      accent: '#1B4F72',
      muted: '#5B6B7C',
      surface: '#E8EEF4',
    },
    typography: {
      displayFamily: 'Merriweather',
      bodyFamily: 'Source Sans 3',
    },
    radii: { button: '4px' },
  },
  {
    id: 'soft-sage',
    label: 'Soft Sage',
    hint: 'Warm clinic · approachable care',
    colors: {
      background: '#F6F7F4',
      foreground: '#1A241C',
      accent: '#4F6F52',
      muted: '#667366',
      surface: '#E7EBE4',
    },
    typography: {
      displayFamily: 'Outfit',
      bodyFamily: 'Nunito',
    },
    radii: { button: '10px' },
  },
  {
    id: 'ocean-care',
    label: 'Ocean Care',
    hint: 'Clean · diagnostics & specialty',
    colors: {
      background: '#F4F8FB',
      foreground: '#102A3A',
      accent: '#0E7490',
      muted: '#5A7382',
      surface: '#E2EDF3',
    },
    typography: {
      displayFamily: 'Montserrat',
      bodyFamily: 'Open Sans',
    },
    radii: { button: '8px' },
  },
  {
    id: 'heritage-ink',
    label: 'Heritage Ink',
    hint: 'Established campus · classic type',
    colors: {
      background: '#F7F5F1',
      foreground: '#1C1917',
      accent: '#1E3A5F',
      muted: '#78716C',
      surface: '#EBE6DF',
    },
    typography: {
      displayFamily: 'Playfair Display',
      bodyFamily: 'Lato',
    },
    radii: { button: '2px' },
  },
  {
    id: 'modern-slate',
    label: 'Modern Slate',
    hint: 'Crisp · private hospitals',
    colors: {
      background: '#F8FAFC',
      foreground: '#0F172A',
      accent: '#334155',
      muted: '#64748B',
      surface: '#E2E8F0',
    },
    typography: {
      displayFamily: 'Poppins',
      bodyFamily: 'Inter',
    },
    radii: { button: '12px' },
  },
];

const COLOR_PALETTES: { id: string; label: string; colors: ColorPalette }[] = THEME_BUNDLES.map(
  (t) => ({ id: t.id, label: t.label, colors: t.colors }),
);

const FONT_PAIRS: { id: string; label: string; displayFamily: string; bodyFamily: string }[] = [
  { id: 'sora-source', label: 'Sora + Source Sans 3', displayFamily: 'Sora', bodyFamily: 'Source Sans 3' },
  { id: 'merriweather-source', label: 'Merriweather + Source Sans 3', displayFamily: 'Merriweather', bodyFamily: 'Source Sans 3' },
  { id: 'outfit-nunito', label: 'Outfit + Nunito', displayFamily: 'Outfit', bodyFamily: 'Nunito' },
  { id: 'montserrat-open', label: 'Montserrat + Open Sans', displayFamily: 'Montserrat', bodyFamily: 'Open Sans' },
  { id: 'playfair-lato', label: 'Playfair + Lato', displayFamily: 'Playfair Display', bodyFamily: 'Lato' },
  { id: 'poppins-inter', label: 'Poppins + Inter', displayFamily: 'Poppins', bodyFamily: 'Inter' },
];

const SWATCHES: { key: keyof ColorPalette; label: string; fallback: string }[] = [
  { key: 'accent', label: 'Accent', fallback: '#1F7A6C' },
  { key: 'background', label: 'Background', fallback: '#F3F1EC' },
  { key: 'foreground', label: 'Ink', fallback: '#0F1C1A' },
  { key: 'muted', label: 'Muted', fallback: '#5C6B67' },
  { key: 'surface', label: 'Surface', fallback: '#E4E8E5' },
];

const DISPLAY_FONT_OPTIONS = [
  'Sora',
  'Poppins',
  'Outfit',
  'Merriweather',
  'Playfair Display',
  'Montserrat',
] as const;

const BODY_FONT_OPTIONS = [
  'Source Sans 3',
  'Inter',
  'Lato',
  'Roboto',
  'Open Sans',
  'Nunito',
] as const;

const CUSTOM_FONT_VALUE = '__custom__';

function normalizeFontLabel(value: string) {
  return (
    value
      .split(',')[0]
      ?.trim()
      .replace(/^['"]|['"]$/g, '') ?? ''
  );
}

function colorsMatch(a: ColorPalette, b: ColorPalette) {
  return (
    a.accent.toLowerCase() === b.accent.toLowerCase() &&
    a.background.toLowerCase() === b.background.toLowerCase() &&
    a.foreground.toLowerCase() === b.foreground.toLowerCase() &&
    a.muted.toLowerCase() === b.muted.toLowerCase() &&
    a.surface.toLowerCase() === b.surface.toLowerCase()
  );
}

function fontsMatch(tokens: DesignTokens, display: string, body: string) {
  return (
    normalizeFontLabel(tokens.typography.displayFamily) === display &&
    normalizeFontLabel(tokens.typography.bodyFamily) === body
  );
}

function normalizeTokens(raw: DesignTokens): DesignTokens {
  return {
    ...DEFAULT_DESIGN_TOKENS,
    ...raw,
    colors: { ...DEFAULT_DESIGN_TOKENS.colors, ...raw.colors },
    typography: { ...DEFAULT_DESIGN_TOKENS.typography, ...raw.typography },
    spacing: { ...DEFAULT_DESIGN_TOKENS.spacing, ...raw.spacing },
    radii: { ...DEFAULT_DESIGN_TOKENS.radii, ...raw.radii },
    favicon: isFaviconPresetId(raw.favicon) ? raw.favicon : DEFAULT_DESIGN_TOKENS.favicon,
    systemPages: normalizeSystemPages(raw.systemPages),
  };
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-xs">
      <label className="font-inter text-label-md text-on-surface-variant uppercase tracking-wider block">
        {children}
      </label>
      {hint ? <p className="font-inter text-label-sm text-outline">{hint}</p> : null}
    </div>
  );
}

/** Hospital-level design tokens — shown when Design rail is active. */
export function DesignPanel({
  hospitalId,
  onTokensChange,
}: {
  hospitalId: string;
  /** Called with latest tokens (on load + after save) so the canvas updates live. */
  onTokensChange?: (tokens: DesignTokens) => void;
}) {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const [status, setStatus] = useState('');

  useEffect(() => {
    void (async () => {
      const res = await apiFetch(`/api/hospitals/${hospitalId}/design`);
      const data = await res.json();
      if (data.tokens) {
        const next = normalizeTokens(data.tokens as DesignTokens);
        setTokens(next);
        onTokensChange?.(next);
      }
    })();
    // intentionally only re-fetch when hospital changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  function update(next: DesignTokens) {
    setTokens(next);
    onTokensChange?.(next);
  }

  async function save(override?: DesignTokens) {
    const payload = override ?? tokens;
    setStatus('Saving…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}/design`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens: payload }),
    });
    if (!res.ok) {
      setStatus('Save failed');
      return;
    }
    onTokensChange?.(payload);
    setStatus('Saved — canvas updated · publish to go live');
  }

  async function applyAndSave(next: DesignTokens) {
    update(next);
    await save(next);
  }

  const radiusPx = parseInt(String(tokens.radii.button).replace('px', ''), 10) || 12;
  const displayFontLabel = normalizeFontLabel(tokens.typography.displayFamily);
  const bodyFontLabel = normalizeFontLabel(tokens.typography.bodyFamily);
  const displayFontKnown = DISPLAY_FONT_OPTIONS.includes(
    displayFontLabel as (typeof DISPLAY_FONT_OPTIONS)[number],
  );
  const bodyFontKnown = BODY_FONT_OPTIONS.includes(bodyFontLabel as (typeof BODY_FONT_OPTIONS)[number]);

  const activeThemeId = useMemo(() => {
    const match = THEME_BUNDLES.find(
      (t) => colorsMatch(tokens.colors, t.colors) && fontsMatch(tokens, t.typography.displayFamily, t.typography.bodyFamily),
    );
    return match?.id ?? null;
  }, [tokens]);

  const activePaletteId = useMemo(() => {
    const match = COLOR_PALETTES.find((p) => colorsMatch(tokens.colors, p.colors));
    return match?.id ?? null;
  }, [tokens.colors]);

  const activeFontPairId = useMemo(() => {
    const match = FONT_PAIRS.find((p) => fontsMatch(tokens, p.displayFamily, p.bodyFamily));
    return match?.id ?? null;
  }, [tokens]);

  function applyTheme(theme: ThemeBundle) {
    void applyAndSave({
      ...tokens,
      colors: { ...theme.colors },
      typography: {
        ...tokens.typography,
        displayFamily: theme.typography.displayFamily,
        bodyFamily: theme.typography.bodyFamily,
      },
      radii: theme.radii ? { ...tokens.radii, ...theme.radii } : tokens.radii,
    });
  }

  function applyPalette(colors: ColorPalette) {
    void applyAndSave({ ...tokens, colors: { ...colors } });
  }

  function applyFontPair(displayFamily: string, bodyFamily: string) {
    void applyAndSave({
      ...tokens,
      typography: { ...tokens.typography, displayFamily, bodyFamily },
    });
  }

  return (
    <div className="p-lg space-y-xl overflow-y-auto flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-outfit text-[18px] font-semibold text-on-surface">Design</h4>
        <span className="material-symbols-outlined text-on-surface-variant">palette</span>
      </div>

      {/* 1) Full theme bundles */}
      <div className="space-y-md">
        <SectionLabel hint="One-click look: colors + fonts together.">Themes</SectionLabel>
        <div className="grid grid-cols-1 gap-sm">
          {THEME_BUNDLES.map((theme) => {
            const active = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => applyTheme(theme)}
                className={`w-full text-left rounded-lg border overflow-hidden transition-colors ${
                  active
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <div
                  className="h-12 flex"
                  style={{ background: theme.colors.background }}
                >
                  <div className="flex-1" style={{ background: theme.colors.surface }} />
                  <div className="w-10" style={{ background: theme.colors.accent }} />
                  <div className="w-6" style={{ background: theme.colors.foreground }} />
                </div>
                <div className="px-sm py-sm bg-surface-container-lowest">
                  <div className="flex items-center justify-between gap-sm">
                    <span className="font-inter text-label-md font-semibold text-on-surface">
                      {theme.label}
                    </span>
                    {active ? (
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    ) : null}
                  </div>
                  <span className="font-inter text-label-sm text-outline block mt-xs">{theme.hint}</span>
                  <span className="font-inter text-[11px] text-outline block mt-xs">
                    {theme.typography.displayFamily} · {theme.typography.bodyFamily}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-outline-variant" />

      {/* 2) Colors only */}
      <div className="space-y-md">
        <SectionLabel hint="Change palette without touching fonts.">Colors</SectionLabel>
        <div className="grid grid-cols-2 gap-sm">
          {COLOR_PALETTES.map((palette) => {
            const active = activePaletteId === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                title={palette.label}
                onClick={() => applyPalette(palette.colors)}
                className={`rounded-lg border p-sm text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-container/30'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex h-7 rounded overflow-hidden mb-xs">
                  <span className="flex-1" style={{ background: palette.colors.background }} />
                  <span className="w-5" style={{ background: palette.colors.accent }} />
                  <span className="w-4" style={{ background: palette.colors.foreground }} />
                  <span className="flex-1" style={{ background: palette.colors.surface }} />
                </div>
                <span className="font-inter text-label-sm font-semibold text-on-surface">{palette.label}</span>
              </button>
            );
          })}
        </div>

        <p className="font-inter text-label-sm text-outline pt-xs">Fine-tune individual colors</p>
        <div className="grid grid-cols-1 gap-sm">
          {SWATCHES.map((s) => (
            <label key={s.key} className="flex items-center gap-sm group cursor-pointer">
              <div
                className="w-11 h-11 rounded-lg hairline relative shadow-sm overflow-hidden shrink-0"
                style={{ background: tokens.colors[s.key] || s.fallback }}
              >
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={tokens.colors[s.key] || s.fallback}
                  onChange={(e) =>
                    update({
                      ...tokens,
                      colors: { ...tokens.colors, [s.key]: e.target.value },
                    })
                  }
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-inter text-label-md text-on-surface">{s.label}</div>
                <div className="font-inter text-label-sm text-on-surface-variant uppercase truncate">
                  {tokens.colors[s.key] || s.fallback}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-outline-variant" />

      {/* 3) Fonts only */}
      <div className="space-y-md">
        <SectionLabel hint="Change type without touching colors.">Fonts</SectionLabel>
        <div className="grid grid-cols-1 gap-xs">
          {FONT_PAIRS.map((pair) => {
            const active = activeFontPairId === pair.id;
            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => applyFontPair(pair.displayFamily, pair.bodyFamily)}
                className={`rounded-lg border px-sm py-sm text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-container/40'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span className="font-inter text-label-md font-semibold text-on-surface block">
                  {pair.label}
                </span>
                <span
                  className="block mt-xs text-[15px] text-on-surface"
                  style={{ fontFamily: pair.displayFamily }}
                >
                  Headline sample
                </span>
                <span
                  className="block text-label-sm text-outline"
                  style={{ fontFamily: pair.bodyFamily }}
                >
                  Body text sample for patient copy.
                </span>
              </button>
            );
          })}
        </div>

        <p className="font-inter text-label-sm text-outline pt-xs">Or pick fonts separately</p>
        <div className="space-y-xs">
          <label className="font-inter text-label-sm text-on-surface">Headlines</label>
          <select
            className="field-input"
            value={displayFontKnown ? displayFontLabel : CUSTOM_FONT_VALUE}
            onChange={(e) => {
              const next = e.target.value;
              if (next === CUSTOM_FONT_VALUE) return;
              update({
                ...tokens,
                typography: { ...tokens.typography, displayFamily: next },
              });
            }}
          >
            {DISPLAY_FONT_OPTIONS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
            <option value={CUSTOM_FONT_VALUE}>Custom…</option>
          </select>
          {!displayFontKnown ? (
            <input
              className="field-input"
              value={tokens.typography.displayFamily}
              onChange={(e) =>
                update({
                  ...tokens,
                  typography: { ...tokens.typography, displayFamily: e.target.value },
                })
              }
              placeholder="Custom headline font"
            />
          ) : null}
        </div>
        <div className="space-y-xs">
          <label className="font-inter text-label-sm text-on-surface">Body text</label>
          <select
            className="field-input"
            value={bodyFontKnown ? bodyFontLabel : CUSTOM_FONT_VALUE}
            onChange={(e) => {
              const next = e.target.value;
              if (next === CUSTOM_FONT_VALUE) return;
              update({
                ...tokens,
                typography: { ...tokens.typography, bodyFamily: next },
              });
            }}
          >
            {BODY_FONT_OPTIONS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
            <option value={CUSTOM_FONT_VALUE}>Custom…</option>
          </select>
          {!bodyFontKnown ? (
            <input
              className="field-input"
              value={tokens.typography.bodyFamily}
              onChange={(e) =>
                update({
                  ...tokens,
                  typography: { ...tokens.typography, bodyFamily: e.target.value },
                })
              }
              placeholder="Custom body font"
            />
          ) : null}
        </div>
      </div>

      <div className="h-px bg-outline-variant" />

      <div className="space-y-lg">
        <SectionLabel>Geometry</SectionLabel>
        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <label className="font-inter text-label-sm text-on-surface">Corner Radius</label>
            <span className="font-inter text-label-sm text-primary font-bold">{radiusPx}px</span>
          </div>
          <input
            className="w-full accent-primary"
            type="range"
            min={0}
            max={40}
            value={radiusPx}
            onChange={(e) =>
              update({
                ...tokens,
                radii: { ...tokens.radii, button: `${e.target.value}px` },
              })
            }
          />
        </div>
        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <label className="font-inter text-label-sm text-on-surface">Section spacing</label>
            <span className="font-inter text-label-sm text-primary font-bold">
              {tokens.spacing.sectionY}
            </span>
          </div>
          <input
            className="field-input"
            value={tokens.spacing.sectionY}
            onChange={(e) =>
              update({
                ...tokens,
                spacing: { ...tokens.spacing, sectionY: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="h-px bg-outline-variant" />

      <div className="space-y-md">
        <SectionLabel hint="Browser tab icon. Default uses the hospital’s first letter.">
          Favicon
        </SectionLabel>
        <div className="grid grid-cols-1 gap-xs">
          {FAVICON_PRESETS.map((preset) => {
            const active = tokens.favicon === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`flex items-start gap-sm rounded-lg border px-sm py-sm text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-container/50'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
                onClick={() => update({ ...tokens, favicon: preset.id as FaviconPresetId })}
              >
                <span
                  className={`mt-0.5 material-symbols-outlined text-[20px] ${
                    active ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {preset.id === 'initial'
                    ? 'title'
                    : preset.id === 'cross'
                      ? 'medical_services'
                      : preset.id === 'heart'
                        ? 'favorite'
                        : preset.id === 'pulse'
                          ? 'monitor_heart'
                          : 'apartment'}
                </span>
                <span className="min-w-0">
                  <span className="font-inter text-label-md font-semibold text-on-surface block">
                    {preset.label}
                  </span>
                  <span className="font-inter text-label-sm text-outline">{preset.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-outline-variant" />

      <div className="space-y-lg">
        <SectionLabel hint="Edit copy and layout for /privacy and the 404 page. Publish to go live.">
          System pages
        </SectionLabel>

        <div className="space-y-sm">
          <p className="font-inter text-label-md font-semibold text-on-surface">404 page</p>
          <div className="grid grid-cols-3 gap-xs">
            {[1, 2, 3].map((version) => {
              const active = tokens.systemPages.notFound.layoutVersion === version;
              return (
                <button
                  key={`nf-${version}`}
                  type="button"
                  title={`404 layout ${String(version).padStart(2, '0')}`}
                  onClick={() =>
                    update({
                      ...tokens,
                      systemPages: {
                        ...tokens.systemPages,
                        notFound: { ...tokens.systemPages.notFound, layoutVersion: version },
                      },
                    })
                  }
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border ${
                    active
                      ? 'border-primary ring-1 ring-primary bg-primary-container/40'
                      : 'border-outline-variant bg-surface-container-low'
                  }`}
                >
                  <div className="absolute inset-1.5 text-on-surface-variant">
                    <LayoutWireframe sectionType="notFound" version={version} />
                  </div>
                  <span className="absolute bottom-1 right-1.5 font-inter text-[10px] font-bold opacity-70">
                    {String(version).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
          {(
            [
              ['title', 'Title'],
              ['body', 'Body'],
              ['primaryCta', 'Primary button'],
              ['secondaryCta', 'Secondary button'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex flex-col gap-xs">
              <label className="font-inter text-label-sm text-outline">{label}</label>
              {key === 'body' ? (
                <textarea
                  className="field-input resize-none"
                  rows={3}
                  value={tokens.systemPages.notFound[key]}
                  onChange={(e) =>
                    update({
                      ...tokens,
                      systemPages: {
                        ...tokens.systemPages,
                        notFound: { ...tokens.systemPages.notFound, [key]: e.target.value },
                      },
                    })
                  }
                />
              ) : (
                <input
                  className="field-input"
                  value={tokens.systemPages.notFound[key]}
                  onChange={(e) =>
                    update({
                      ...tokens,
                      systemPages: {
                        ...tokens.systemPages,
                        notFound: { ...tokens.systemPages.notFound, [key]: e.target.value },
                      },
                    })
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-sm">
          <p className="font-inter text-label-md font-semibold text-on-surface">Privacy page</p>
          <div className="grid grid-cols-3 gap-xs">
            {[1, 2, 3].map((version) => {
              const active = tokens.systemPages.privacy.layoutVersion === version;
              return (
                <button
                  key={`pr-${version}`}
                  type="button"
                  title={`Privacy layout ${String(version).padStart(2, '0')}`}
                  onClick={() =>
                    update({
                      ...tokens,
                      systemPages: {
                        ...tokens.systemPages,
                        privacy: { ...tokens.systemPages.privacy, layoutVersion: version },
                      },
                    })
                  }
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border ${
                    active
                      ? 'border-primary ring-1 ring-primary bg-primary-container/40'
                      : 'border-outline-variant bg-surface-container-low'
                  }`}
                >
                  <div className="absolute inset-1.5 text-on-surface-variant">
                    <LayoutWireframe sectionType="privacy" version={version} />
                  </div>
                  <span className="absolute bottom-1 right-1.5 font-inter text-[10px] font-bold opacity-70">
                    {String(version).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-inter text-label-sm text-outline">Title</label>
            <input
              className="field-input"
              value={tokens.systemPages.privacy.title}
              onChange={(e) =>
                update({
                  ...tokens,
                  systemPages: {
                    ...tokens.systemPages,
                    privacy: { ...tokens.systemPages.privacy, title: e.target.value },
                  },
                })
              }
            />
          </div>
          {(
            [
              ['intro', 'Intro (blank = default DPDP intro)'],
              ['formsNote', 'Forms & contact note (optional override)'],
              ['rightsNote', 'Your rights note (optional override)'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex flex-col gap-xs">
              <label className="font-inter text-label-sm text-outline">{label}</label>
              <textarea
                className="field-input resize-none"
                rows={3}
                value={tokens.systemPages.privacy[key]}
                onChange={(e) =>
                  update({
                    ...tokens,
                    systemPages: {
                      ...tokens.systemPages,
                      privacy: { ...tokens.systemPages.privacy, [key]: e.target.value },
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="btn-primary w-full" onClick={() => void save()}>
        Save design
      </button>

      <div className="bg-surface-container p-md rounded-lg flex items-start gap-sm">
        <span className="material-symbols-outlined text-primary text-[20px]">info</span>
        <p className="font-inter text-body-sm text-on-surface-variant">
          Themes/colors/fonts save immediately. Publish to push the live hospital site.
          <span className="block mt-xs font-semibold text-primary">
            {status || 'Live preview in canvas'}
          </span>
        </p>
      </div>
    </div>
  );
}
