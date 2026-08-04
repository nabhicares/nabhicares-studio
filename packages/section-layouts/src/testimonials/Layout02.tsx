import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Balanced centered card grid (Stitch-inspired) */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', textAlign: 'left' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author + item.quote.slice(0, 8)} style={{ ...surfaceStyle, margin: 0, padding: '1.5rem' }}>
              <p style={{ margin: '0 0 1.25rem', lineHeight: 1.6 }}>&ldquo;{item.quote}&rdquo;</p>
              <cite style={{ fontStyle: 'normal', fontWeight: 600 }}>{item.author}</cite>
              {item.role ? <div style={{ ...mutedStyle, fontSize: '0.85rem', marginTop: 2 }}>{item.role}</div> : null}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
