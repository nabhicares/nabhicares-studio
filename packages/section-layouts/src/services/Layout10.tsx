import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Compact definition list on surface */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <dl style={{ margin: 0 }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <div key={item.title} style={{ marginBottom: '1rem' }}>
              <dt style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{item.title}</dt>
              {item.description ? <dd style={{ ...mutedStyle, margin: '0.25rem 0 0' }}>{item.description}</dd> : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
