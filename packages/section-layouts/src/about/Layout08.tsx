import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Overlapping visual: image strip + floating text card */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={{ ...sectionBaseStyle, paddingBottom: 'calc(var(--space-section-y) + 2rem)' }}>
      <div style={{ ...wideContainerStyle, position: 'relative' }}>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 240, maxHeight: 320 }}>
          {c.image ? (
        <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}
        </div>
        <div style={{ ...cardStyle, maxWidth: 480, margin: '-3rem 1.5rem 0 auto', position: 'relative', boxShadow: '0 12px 40px color-mix(in srgb, var(--color-fg) 12%, transparent)' }}>
          <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>{c.title}</h2>
          <p style={{ ...bodyStyle, marginBottom: 0, maxWidth: 'none' }}>{c.body}</p>
        </div>
      </div>
    </section>
  );
}
