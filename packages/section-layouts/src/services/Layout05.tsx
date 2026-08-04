import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Large first service + compact rest */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = c.items as { title: string; description?: string }[];
  const [lead, ...rest] = items;
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {lead ? (
            <article style={{ ...surfaceStyle, padding: '1.75rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>{lead.title}</h3>
              {lead.description ? <p style={{ ...mutedStyle, margin: 0 }}>{lead.description}</p> : null}
            </article>
          ) : null}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {rest.map((item) => (
              <div key={item.title} style={cardStyle}>
                <strong>{item.title}</strong>
                {item.description ? <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{item.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
