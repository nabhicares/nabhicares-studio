import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Minimal: title + body only, full-bleed surface band */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={{ ...containerStyle, display: 'grid', gap: '1rem' }}>
        <h2 style={{ ...titleStyle, marginBottom: 0 }}>{c.title}</h2>
        <p style={{ ...bodyStyle, marginBottom: 0, maxWidth: '36rem' }}>{c.body}</p>
        {c.image ? (
          <div style={{ marginTop: '0.5rem', borderRadius: 'var(--radius-button)', overflow: 'hidden', maxWidth: 420, maxHeight: 200 }}>
            <img src={c.image} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
