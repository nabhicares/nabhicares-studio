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

/** Icon/title cards grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {(c.items as { title: string; description?: string; icon?: string }[]).map((item) => (
            <article key={item.title} style={cardStyle}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent)', marginBottom: 12, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700 }}>
                {item.icon ? item.icon.slice(0, 1) : item.title.slice(0, 1)}
              </div>
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0 }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
