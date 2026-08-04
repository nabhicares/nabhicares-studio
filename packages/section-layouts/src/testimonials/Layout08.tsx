import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeTestimonials } from '../content';

/** Large pull-quote carousel feel (static first 3) */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const item = (c.items ?? [])[0];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', maxWidth: 720 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        {item ? (
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: 1.35, margin: '0 0 1.25rem' }}>
              &ldquo;{item.quote}&rdquo;
            </p>
            <cite style={{ fontStyle: 'normal', fontWeight: 600 }}>{item.author}</cite>
            {item.role ? <div style={mutedStyle}>{item.role}</div> : null}
          </blockquote>
        ) : null}
        {(c.items ?? []).length > 1 ? (
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            {(c.items ?? []).map((_, i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-fg) 20%, transparent)' }} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
