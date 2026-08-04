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
import { normalizeTestimonials } from '../content';

/** Featured lead quote + smaller supporting */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const [lead, ...rest] = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {lead ? (
            <blockquote style={{ ...surfaceStyle, margin: 0, padding: '2rem' }}>
              <p style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontFamily: 'var(--font-display)', lineHeight: 1.4 }}>&ldquo;{lead.quote}&rdquo;</p>
              <strong>{lead.author}</strong>
              {lead.role ? <div style={mutedStyle}>{lead.role}</div> : null}
            </blockquote>
          ) : null}
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {rest.map((item) => (
              <blockquote key={item.author} style={{ ...cardStyle, margin: 0 }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>&ldquo;{item.quote}&rdquo;</p>
                <strong style={{ fontSize: '0.9rem' }}>{item.author}</strong>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
