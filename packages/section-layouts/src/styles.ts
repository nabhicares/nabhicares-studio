import type { CSSProperties } from 'react';

export const sectionBaseStyle: CSSProperties = {
  background: 'var(--color-bg)',
  color: 'var(--color-fg)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-base)',
  padding: 'var(--space-section-y) clamp(1.25rem, 4vw, 2rem)',
  boxSizing: 'border-box',
  width: '100%',
};

export const containerStyle: CSSProperties = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  width: '100%',
};

export const wideContainerStyle: CSSProperties = {
  maxWidth: 'min(1120px, var(--content-max, 1120px))',
  margin: '0 auto',
  width: '100%',
};

export const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  margin: '0 0 0.85rem',
  color: 'var(--color-fg)',
  lineHeight: 1.15,
};

export const bodyStyle: CSSProperties = {
  margin: '0 0 1.35rem',
  color: 'var(--color-muted)',
  lineHeight: 1.7,
  maxWidth: '38rem',
  fontSize: '1.05rem',
};

export const buttonPrimaryStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-accent)',
  color: '#F7F9F8',
  border: 'none',
  borderRadius: 'var(--radius-button)',
  padding: '0.8rem 1.4rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  letterSpacing: '0.01em',
  transition: 'transform 180ms ease, filter 180ms ease',
};

export const buttonGhostStyle: CSSProperties = {
  ...buttonPrimaryStyle,
  background: 'transparent',
  color: 'var(--color-fg)',
  border: '1px solid color-mix(in srgb, var(--color-fg) 22%, transparent)',
};

export const surfaceStyle: CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'calc(var(--radius-button) + 2px)',
};

/** Soft list row — not a heavy card chrome */
export const cardStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))',
  borderRadius: 'calc(var(--radius-button) + 2px)',
  border: '1px solid color-mix(in srgb, var(--color-fg) 7%, transparent)',
  padding: '1.2rem 1.25rem',
};

export const mutedStyle: CSSProperties = {
  color: 'var(--color-muted)',
};

export const accentBarStyle: CSSProperties = {
  width: '3px',
  background: 'var(--color-accent)',
  borderRadius: '2px',
  flexShrink: 0,
};

export const kickerStyle: CSSProperties = {
  margin: '0 0 0.65rem',
  fontSize: '0.78rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: 'var(--color-accent)',
  fontFamily: 'var(--font-body)',
};

export const imageTreatmentStyle: CSSProperties = {
  overflow: 'hidden',
  borderRadius: 'calc(var(--radius-button) + 4px)',
  background: 'var(--color-surface)',
};

export const placeholderGradient =
  'linear-gradient(145deg, color-mix(in srgb, var(--color-surface) 88%, var(--color-accent)), color-mix(in srgb, var(--color-muted) 28%, var(--color-bg)))';
