import type { LayoutProps } from '../types';
import {
  bodyStyle,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Pill / chip cloud of service titles */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
          {(c.items as { title: string }[]).map((item) => (
            <span key={item.title} style={{ ...surfaceStyle, padding: '0.65rem 1.1rem', display: 'inline-block', fontWeight: 600 }}>
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
