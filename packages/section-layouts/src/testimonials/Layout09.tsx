import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Dense quote list */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(c.items ?? []).map((item) => (
            <li key={item.author} style={{ padding: '0.85rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <div style={{ fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</div>
              <div style={{ ...mutedStyle, marginTop: 4, fontSize: '0.9rem' }}>{item.author}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
