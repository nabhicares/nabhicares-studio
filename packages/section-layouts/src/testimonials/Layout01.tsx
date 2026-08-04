import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Quote cards grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author + item.quote.slice(0, 12)} style={{ ...cardStyle, margin: 0 }}>
              <p style={{ margin: '0 0 1rem', fontStyle: 'italic', lineHeight: 1.55 }}>&ldquo;{item.quote}&rdquo;</p>
              <footer style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: placeholderGradient, overflow: 'hidden', flexShrink: 0 }}>
                  {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.author}</div>
                  {item.role ? <div style={{ ...mutedStyle, fontSize: '0.85rem' }}>{item.role}</div> : null}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
