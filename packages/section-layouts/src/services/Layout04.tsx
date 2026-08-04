import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeServices } from '../content';

/** Split headline / service list */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <li key={item.title} style={{ marginBottom: '1rem' }}>
              <strong>{item.title}</strong>
              {item.description ? <div style={mutedStyle}>{item.description}</div> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
