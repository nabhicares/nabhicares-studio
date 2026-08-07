import type { CSSProperties, ReactElement } from 'react';
import { TreatedMedia } from '../polish';

export function initials(name: string) {
  const parts = name
    .split(/\s+/g)
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '•';
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function starsText(rating?: number) {
  if (typeof rating !== 'number' || !Number.isFinite(rating)) return null;
  const filled = clamp(Math.round(rating), 0, 5);
  return Array.from({ length: 5 }, (_, i) => (i < filled ? '*' : '-')).join('');
}

export const ratingStyle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 800,
  color: 'var(--color-accent)',
  letterSpacing: '0.12em',
  fontSize: '0.95rem',
  marginBottom: '0.35rem',
};

export function RatingStars({ rating }: { rating?: number }): ReactElement | null {
  if (rating === undefined) return null;
  const text = starsText(rating);
  if (!text) return null;
  return <div style={ratingStyle}>{text}</div>;
}

const avatarShell = (size: number): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: '999px',
  overflow: 'hidden',
  flexShrink: 0,
  background: 'color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))',
  border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-accent)',
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  fontSize: size > 48 ? '1.1rem' : '0.85rem',
});

/** Round photo via TreatedMedia, or initials when no image */
export function QuoteAvatar({
  author,
  image,
  size = 44,
}: {
  author: string;
  image?: string;
  size?: number;
}): ReactElement {
  if (image) {
    return (
      <TreatedMedia
        src={image}
        round
        aspectRatio="1"
        emptyIcon="person"
        style={{ width: size, height: size, flexShrink: 0 }}
      />
    );
  }
  return <div style={avatarShell(size)}>{initials(author)}</div>;
}
