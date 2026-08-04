import type { CSSProperties } from 'react';

export const sectionBaseStyle: CSSProperties = {
  background: 'var(--color-bg)',
  color: 'var(--color-fg)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-base)',
  padding: 'var(--space-section-y) 1.5rem',
  boxSizing: 'border-box',
  width: '100%',
};

export const containerStyle: CSSProperties = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  width: '100%',
};

export const wideContainerStyle: CSSProperties = {
  maxWidth: 'min(1100px, var(--content-max, 1100px))',
  margin: '0 auto',
  width: '100%',
};

export const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  margin: '0 0 0.75rem',
  color: 'var(--color-fg)',
  lineHeight: 1.2,
};

export const bodyStyle: CSSProperties = {
  margin: '0 0 1.25rem',
  color: 'var(--color-muted)',
  lineHeight: 1.65,
  maxWidth: '42rem',
};

export const buttonPrimaryStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-accent)',
  color: 'var(--color-fg)',
  border: 'none',
  borderRadius: 'var(--radius-button)',
  padding: '0.7rem 1.25rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
};

export const buttonGhostStyle: CSSProperties = {
  ...buttonPrimaryStyle,
  background: 'transparent',
  border: '1px solid color-mix(in srgb, var(--color-fg) 18%, transparent)',
};

export const surfaceStyle: CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'calc(var(--radius-button) + 4px)',
};

export const cardStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))',
  borderRadius: 'calc(var(--radius-button) + 2px)',
  border: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
  padding: '1.25rem',
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

export const placeholderGradient =
  'linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 80%, var(--color-accent)), color-mix(in srgb, var(--color-muted) 35%, var(--color-bg)))';
