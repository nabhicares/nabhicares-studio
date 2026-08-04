import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Split intro + list */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <div>
          {(c.items ?? []).map((item) => (
            <div key={item.question} style={{ marginBottom: '1.25rem' }}>
              <strong>{item.question}</strong>
              <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
