import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Bordered outline cards */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <article key={item.title} style={{ border: '1px solid color-mix(in srgb, var(--color-fg) 14%, transparent)', borderRadius: 'var(--radius-button)', padding: '1.25rem' }}>
              <div style={{ height: 3, width: 32, background: 'var(--color-accent)', marginBottom: 12 }} />
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem' }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
