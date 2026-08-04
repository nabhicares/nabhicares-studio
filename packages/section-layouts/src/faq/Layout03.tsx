import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Two-column FAQ grid */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {(c.items ?? []).map((item) => (
            <article key={item.question} style={cardStyle}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{item.question}</h3>
              <p style={{ ...mutedStyle, margin: 0 }}>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
