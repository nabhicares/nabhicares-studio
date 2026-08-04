import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Split: title left, quotes right */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author} style={{ ...cardStyle, margin: 0 }}>
              <p style={{ margin: '0 0 0.65rem' }}>&ldquo;{item.quote}&rdquo;</p>
              <strong>{item.author}</strong>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
