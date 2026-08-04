import type { LayoutProps } from '../types';
import {
  bodyStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Surface band with inline quotes */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author} style={{ margin: 0, background: 'var(--color-bg)', borderRadius: 'var(--radius-button)', padding: '1.15rem' }}>
              <p style={{ margin: '0 0 0.65rem' }}>&ldquo;{item.quote}&rdquo;</p>
              <strong>{item.author}</strong>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
