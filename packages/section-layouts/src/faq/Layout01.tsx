import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
} from '../styles';
import { normalizeFaq } from '../content';

/** Stacked Q/A with hairline rules */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: '42rem' }}>
        <p style={kickerStyle}>FAQ</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div
          style={{
            display: 'grid',
            gap: 0,
            borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
            marginTop: '0.5rem',
          }}
        >
          {(c.items ?? []).map((item) => (
            <details
              key={item.question}
              style={{
                padding: '1.15rem 0',
                borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  listStyle: 'none',
                  fontSize: '1.05rem',
                  letterSpacing: '-0.015em',
                }}
              >
                {item.question}
              </summary>
              <p style={{ ...mutedStyle, margin: '0.75rem 0 0', lineHeight: 1.65 }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
