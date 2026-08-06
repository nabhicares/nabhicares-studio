'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState } from 'react';
import { DEFAULT_DESIGN_TOKENS, type DesignTokens } from '@nabhicares/section-registry';
import {
  FAVICON_PRESETS,
  isFaviconPresetId,
  type FaviconPresetId,
} from '@nabhicares/section-registry';

const SWATCHES: { key: keyof DesignTokens['colors']; label: string; fallback: string }[] = [
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
  return value
    .split(',')[0]
    ?.trim()
    .replace(/^['"]|['"]$/g, '');
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
  };
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

  async function save() {
    setStatus('Saving…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}/design`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens }),
    });
    if (!res.ok) {
      setStatus('Save failed');
      return;
    }
    onTokensChange?.(tokens);
    setStatus('Saved — canvas updated · publish to go live');
  }

  const radiusPx = parseInt(String(tokens.radii.button).replace('px', ''), 10) || 12;
  const displayFontLabel = normalizeFontLabel(tokens.typography.displayFamily);
  const bodyFontLabel = normalizeFontLabel(tokens.typography.bodyFamily);
  const displayFontKnown = DISPLAY_FONT_OPTIONS.includes(displayFontLabel as (typeof DISPLAY_FONT_OPTIONS)[number]);
  const bodyFontKnown = BODY_FONT_OPTIONS.includes(bodyFontLabel as (typeof BODY_FONT_OPTIONS)[number]);

  return (
    <div className="p-lg space-y-xl overflow-y-auto flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-outfit text-[18px] font-semibold text-on-surface">Global Tokens</h4>
        <span className="material-symbols-outlined text-on-surface-variant">tune</span>
      </div>

      <div className="space-y-md">
        <label className="font-inter text-label-md text-on-surface-variant uppercase tracking-wider">
          Brand Palette
        </label>
        <div className="grid grid-cols-1 gap-sm">
          {SWATCHES.map((s) => (
            <label key={s.key} className="flex items-center gap-sm group cursor-pointer">
              <div
                className="w-12 h-12 rounded-lg hairline relative shadow-sm overflow-hidden"
                style={{ background: tokens.colors[s.key] || s.fallback }}
              >
                <div className="w-2 h-2 rounded-full bg-white/40 absolute top-1 right-1" />
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
              <div className="flex-grow">
                <div className="font-inter text-label-md text-on-surface">{s.label}</div>
                <div className="font-inter text-label-sm text-on-surface-variant uppercase">
                  {tokens.colors[s.key] || s.fallback}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-outline-variant" />

      <div className="space-y-lg">
        <label className="font-inter text-label-md text-on-surface-variant uppercase tracking-wider">
          Typography
        </label>
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
          <label className="font-inter text-label-sm text-on-surface">Body Text</label>
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
        <label className="font-inter text-label-md text-on-surface-variant uppercase tracking-wider">
          Geometry
        </label>
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
        <label className="font-inter text-label-md text-on-surface-variant">
          Favicon
        </label>
        <p className="font-inter text-label-sm text-outline">
          Browser tab icon. Default uses the hospital’s first letter.
        </p>
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
                onClick={() =>
                  update({ ...tokens, favicon: preset.id as FaviconPresetId })
                }
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

      <button type="button" className="btn-primary w-full" onClick={save}>
        Save design tokens
      </button>

      <div className="bg-surface-container p-md rounded-lg flex items-start gap-sm">
        <span className="material-symbols-outlined text-primary text-[20px]">info</span>
        <p className="font-inter text-body-sm text-on-surface-variant">
          Draft canvas updates as you edit. Save to persist; publish to update the live site.
          <span className="block mt-xs font-semibold text-primary">
            {status || 'Live preview in canvas'}
          </span>
        </p>
      </div>
    </div>
  );
}
