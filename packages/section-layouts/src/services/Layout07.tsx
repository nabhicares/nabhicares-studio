import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Accent rail vertical list */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items as { title: string; description?: string }[]).map((item) => (
          <div key={item.title} style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
            <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
            <div>
              <strong style={{ fontFamily: 'var(--font-display)' }}>{item.title}</strong>
              {item.description ? <p style={{ ...mutedStyle, margin: '0.3rem 0 0' }}>{item.description}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
