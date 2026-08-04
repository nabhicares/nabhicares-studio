import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Accent rail quotes */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <div key={item.author} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
            <blockquote style={{ margin: 0 }}>
              <p style={{ margin: '0 0 0.4rem' }}>{item.quote}</p>
              <footer style={mutedStyle}>{item.author}{item.role ? (' · ' + item.role) : ''}</footer>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
