'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState } from 'react';
import { DEFAULT_DESIGN_TOKENS, type DesignTokens } from '@nabhicares/section-registry';

const SWATCHES: { key: keyof DesignTokens['colors']; label: string; fallback: string }[] = [
  { key: 'accent', label: 'Primary Lime', fallback: '#B1EA55' },
  { key: 'background', label: 'Background', fallback: '#F5F5F3' },
  { key: 'foreground', label: 'Ink Black', fallback: '#0C0900' },
  { key: 'muted', label: 'Mid Grey', fallback: '#888888' },
  { key: 'surface', label: 'Soft Sage Surface', fallback: '#B8BDB1' },
];

/** Token editor body — rendered inside the shared Style | Content inspector. */
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
        const next = data.tokens as DesignTokens;
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
          <input
            className="field-input"
            value={tokens.typography.displayFamily}
            onChange={(e) =>
              update({
                ...tokens,
                typography: { ...tokens.typography, displayFamily: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-xs">
          <label className="font-inter text-label-sm text-on-surface">Body Text</label>
          <input
            className="field-input"
            value={tokens.typography.bodyFamily}
            onChange={(e) =>
              update({
                ...tokens,
                typography: { ...tokens.typography, bodyFamily: e.target.value },
              })
            }
          />
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
