import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Centered title + simple stacked list */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left', maxWidth: 480, marginInline: 'auto' }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <li key={item.title} style={{ padding: '0.85rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <strong>{item.title}</strong>
              {item.description ? <p style={{ ...mutedStyle, margin: '0.3rem 0 0' }}>{item.description}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
