/** Favicon presets for published hospital sites. */

export const FAVICON_PRESETS = [
  { id: 'initial', label: 'Initial letter', hint: 'First letter of hospital name' },
  { id: 'cross', label: 'Medical cross', hint: 'Classic care mark' },
  { id: 'heart', label: 'Heart', hint: 'Care / cardiology feel' },
  { id: 'pulse', label: 'Pulse', hint: 'Monitor line' },
  { id: 'building', label: 'Building', hint: 'Hospital facility' },
] as const;

export type FaviconPresetId = (typeof FAVICON_PRESETS)[number]['id'];

export function isFaviconPresetId(value: unknown): value is FaviconPresetId {
  return typeof value === 'string' && FAVICON_PRESETS.some((p) => p.id === value);
}

function esc(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** SVG favicon string for publish / browser tab. */
export function buildFaviconSvg(opts: {
  preset: FaviconPresetId;
  hospitalName: string;
  accent?: string;
}): string {
  const accent = opts.accent?.trim() || '#1F7A6C';
  const ink = '#F7F9F8';
  const letter = (opts.hospitalName.trim().charAt(0) || 'H').toUpperCase();

  if (opts.preset === 'initial') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img">
  <rect width="32" height="32" rx="7" fill="${esc(accent)}"/>
  <text x="16" y="22" text-anchor="middle" fill="${ink}" font-family="system-ui,Segoe UI,sans-serif" font-size="16" font-weight="700">${esc(letter)}</text>
</svg>`;
  }

  if (opts.preset === 'cross') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img">
  <rect width="32" height="32" rx="7" fill="${esc(accent)}"/>
  <rect x="13" y="7" width="6" height="18" rx="1.5" fill="${ink}"/>
  <rect x="7" y="13" width="18" height="6" rx="1.5" fill="${ink}"/>
</svg>`;
  }

  if (opts.preset === 'heart') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img">
  <rect width="32" height="32" rx="7" fill="${esc(accent)}"/>
  <path fill="${ink}" d="M16 25.2c-.4 0-.7-.1-1-.4C11.2 21.2 8 18.1 8 14.4 8 11.9 9.9 10 12.3 10c1.3 0 2.5.6 3.3 1.6.8-1 2-1.6 3.3-1.6C21.3 10 23.2 11.9 23.2 14.4c0 3.7-3.2 6.8-6.2 10.4-.3.3-.6.4-1 .4z"/>
</svg>`;
  }

  if (opts.preset === 'pulse') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img">
  <rect width="32" height="32" rx="7" fill="${esc(accent)}"/>
  <path fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 17h5l2.5-6 4 12 3-8H27"/>
</svg>`;
  }

  // building
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img">
  <rect width="32" height="32" rx="7" fill="${esc(accent)}"/>
  <rect x="8" y="9" width="16" height="15" rx="1.5" fill="${ink}" opacity="0.95"/>
  <rect x="11" y="12" width="3" height="3" rx="0.5" fill="${esc(accent)}"/>
  <rect x="18" y="12" width="3" height="3" rx="0.5" fill="${esc(accent)}"/>
  <rect x="11" y="18" width="3" height="3" rx="0.5" fill="${esc(accent)}"/>
  <rect x="18" y="18" width="3" height="3" rx="0.5" fill="${esc(accent)}"/>
  <rect x="14" y="21" width="4" height="3" rx="0.4" fill="${esc(accent)}"/>
</svg>`;
}
