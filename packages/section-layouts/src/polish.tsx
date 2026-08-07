import type { CSSProperties, ReactElement, ReactNode } from 'react';
import {
  bodyStyle,
  imageTreatmentStyle,
  kickerStyle,
  mutedStyle,
  placeholderGradient,
  titleStyle,
} from './styles';

/** Soft elevated card — matches Layout01 depth */
export const elevatedShadow =
  '0 4px 18px color-mix(in srgb, var(--color-fg) 6%, transparent)';

export const elevatedCardStyle: CSSProperties = {
  background: 'var(--color-bg)',
  borderRadius: 'min(1.15rem, calc(var(--radius-button) + 2px))',
  border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
  padding: '1.2rem 1.25rem',
  boxShadow: elevatedShadow,
};

export const itemTitleStyle: CSSProperties = {
  margin: '0 0 0.45rem',
  fontFamily: 'var(--font-display)',
  fontSize: '1.15rem',
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
};

export function SectionHeader({
  kicker,
  title,
  body,
  center = false,
}: {
  kicker: string;
  title: string;
  body?: string;
  center?: boolean;
}): ReactElement {
  return (
    <div style={center ? { textAlign: 'center' } : undefined}>
      <p style={{ ...kickerStyle, ...(center ? { textAlign: 'center' } : null) }}>{kicker}</p>
      <h2
        style={{
          ...titleStyle,
          ...(center ? { textAlign: 'center' } : null),
        }}
      >
        {title}
      </h2>
      {body ? (
        <p
          style={{
            ...bodyStyle,
            ...(center ? { marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' } : null),
          }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function EmptyCopy({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className="nabhi-empty" style={{ ...mutedStyle, marginTop: '0.75rem' }}>
      {children}
    </p>
  );
}

export function TreatedMedia({
  src,
  aspectRatio = '4 / 3',
  emptyIcon = 'image',
  emptyLabel = 'Add a photo in Studio',
  style,
  round,
  priority = false,
  sizes,
}: {
  src?: string;
  aspectRatio?: string;
  emptyIcon?: string;
  emptyLabel?: string;
  style?: CSSProperties;
  /** Circular crop (e.g. doctor avatar) */
  round?: boolean;
  /** Hero / LCP image — eager + high fetch priority */
  priority?: boolean;
  sizes?: string;
}): ReactElement {
  const shell: CSSProperties = {
    ...imageTreatmentStyle,
    aspectRatio,
    ...(round ? { borderRadius: '999px' } : null),
    ...style,
  };

  if (src) {
    return (
      <div style={shell}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes || (round ? '112px' : '(max-width: 760px) 100vw, 560px')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div style={shell}>
      <div
        className="nabhi-empty-media"
        style={{
          width: '100%',
          height: '100%',
          minHeight: round ? undefined : 120,
          background: placeholderGradient,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: round ? 22 : 28, color: 'var(--color-accent)' }}
        >
          {emptyIcon}
        </span>
        {!round ? <span style={{ fontSize: '0.8rem' }}>{emptyLabel}</span> : null}
      </div>
    </div>
  );
}
