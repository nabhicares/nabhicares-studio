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
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: '42rem' }}>
        <p style={kickerStyle}>FAQ</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {items.length === 0 ? (
          <p className="nabhi-empty" style={mutedStyle}>
            Questions will appear here once added in Studio.
          </p>
        ) : (
          <>
            <style>{`
              .nabhi-faq-summary { list-style: none; }
              .nabhi-faq-summary::-webkit-details-marker { display: none; }
              .nabhi-faq-summary::after {
                content: '+';
                font-size: 1.25rem;
                font-weight: 500;
                color: var(--color-accent);
                flex-shrink: 0;
              }
              details[open] > .nabhi-faq-summary::after { content: '−'; }
            `}</style>
            <div
              style={{
                display: 'grid',
                gap: 0,
                borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
                marginTop: '0.5rem',
              }}
            >
              {items.map((item) => (
                <details
                  key={item.question}
                  style={{
                    padding: '1.15rem 0',
                    borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
                  }}
                >
                  <summary
                    className="nabhi-faq-summary"
                    style={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      letterSpacing: '-0.015em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    {item.question}
                  </summary>
                  <p style={{ ...mutedStyle, margin: '0.75rem 0 0', lineHeight: 1.65 }}>
                    {item.answer || 'Answer coming soon.'}
                  </p>
                </details>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
