import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Numbered process-style row */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = c.items as { title: string; description?: string }[];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {items.map((item, i) => (
            <article key={item.title}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem' }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
