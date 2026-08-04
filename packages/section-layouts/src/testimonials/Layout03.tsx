import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Single-column stacked quotes */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <blockquote key={item.author} style={{ margin: '0 0 1.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--color-accent)' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>&ldquo;{item.quote}&rdquo;</p>
            <footer style={mutedStyle}>— {item.author}{item.role ? (', ' + item.role) : ''}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
