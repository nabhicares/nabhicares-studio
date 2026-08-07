import type { CSSProperties, ReactElement } from 'react';
import { sanitizeMapUrl } from './links';

/** Resolve a Material Symbols name from explicit icon or service title keywords. */
export function resolveServiceIcon(title: string, icon?: string): string {
  const explicit = (icon ?? '').trim();
  if (explicit && !/^https?:\/\//i.test(explicit) && explicit.length < 40) {
    return explicit.replace(/\s+/g, '_').toLowerCase();
  }

  const t = title.toLowerCase();
  if (/emerg|trauma|ambulance|casualty|icu/.test(t)) return 'emergency';
  if (/cardio|heart/.test(t)) return 'monitor_heart';
  if (/materni|gynae|obgyn|obstetric|pregnancy/.test(t)) return 'pregnant_woman';
  if (/pedia|child|neonat/.test(t)) return 'child_care';
  if (/ortho|bone|fracture/.test(t)) return 'personal_injury';
  if (/dental|tooth|oral/.test(t)) return 'dentistry';
  if (/diag|lab|patholog|imaging|x[\s-]?ray|scan|mri|ct/.test(t)) return 'biotech';
  if (/pharma|medicine|drug/.test(t)) return 'local_pharmacy';
  if (/outpatient|opd|consult|clinic/.test(t)) return 'clinical_notes';
  if (/surg|operation|ot\b/.test(t)) return 'stethoscope';
  if (/physio|rehab/.test(t)) return 'physical_therapy';
  if (/neuro|brain/.test(t)) return 'psychology';
  if (/eye|ophthal/.test(t)) return 'visibility';
  if (/ent|ear|nose|throat/.test(t)) return 'hearing';
  if (/dialysis|nephro|kidney/.test(t)) return 'water_drop';
  if (/general|medicine|internal|specialist|experience|patient|tech/.test(t)) return 'medical_services';
  return 'medical_services';
}

export function contactRowIcon(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('phone')) return 'call';
  if (l.includes('email')) return 'mail';
  if (l.includes('address')) return 'location_on';
  if (l.includes('hour')) return 'schedule';
  return 'info';
}

const iconWrapStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '999px',
  border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
  background: 'color-mix(in srgb, var(--color-accent) 10%, var(--color-bg))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  overflow: 'hidden',
  color: 'var(--color-accent)',
};

export function IconBadge({
  name,
  imageUrl,
  size = 48,
}: {
  name: string;
  imageUrl?: string;
  size?: number;
}): ReactElement {
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
    return (
      <div style={{ ...iconWrapStyle, width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{ ...iconWrapStyle, width: size, height: size }} aria-hidden>
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: Math.round(size * 0.52),
          fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
          lineHeight: 1,
        }}
      >
        {name}
      </span>
    </div>
  );
}

/** Convert Maps share/search URLs into an embeddable iframe src when possible. */
export function toMapEmbedSrc(mapUrl?: string, address?: string): string | null {
  const url = sanitizeMapUrl(mapUrl) ?? (mapUrl ?? '').trim();
  const addr = (address ?? '').trim();

  if (url.includes('/maps/embed') || url.includes('output=embed')) return url;

  const fromQuery = (q: string) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;

  if (url) {
    try {
      const u = new URL(url);
      const q =
        u.searchParams.get('q') ||
        u.searchParams.get('query') ||
        u.searchParams.get('destination');
      if (q) return fromQuery(q);

      const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (at) return fromQuery(`${at[1]},${at[2]}`);

      const place = url.match(/\/place\/([^/]+)/);
      if (place?.[1]) {
        return fromQuery(decodeURIComponent(place[1].replace(/\+/g, ' ')));
      }
    } catch {
      // fall through
    }
  }

  if (addr) return fromQuery(addr);
  if (url) return fromQuery(url);
  return null;
}
