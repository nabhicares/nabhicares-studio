import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Classic stacked Q/A */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {(c.items ?? []).map((item) => (
            <details key={item.question} style={{ ...cardStyle }} open>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-display)', listStyle: 'none' }}>{item.question}</summary>
              <p style={{ ...mutedStyle, margin: '0.65rem 0 0' }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
