import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Two-column alternating rows */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {(c.items as { title: string; description?: string }[]).map((item, i) => (
            <article key={item.title} style={{ ...cardStyle, background: i % 2 === 0 ? 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))' : 'var(--color-surface)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0 }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
