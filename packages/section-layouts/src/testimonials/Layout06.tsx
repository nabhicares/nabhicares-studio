import type { LayoutProps } from '../types';
import {
  bodyStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Avatar row testimonials */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {(c.items ?? []).map((item) => (
            <figure key={item.author} style={{ margin: 0, flex: '1 1 200px', maxWidth: 280, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 0.75rem', background: placeholderGradient, overflow: 'hidden' }}>
                {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <blockquote style={{ margin: '0 0 0.5rem', fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption style={{ fontWeight: 600 }}>{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
