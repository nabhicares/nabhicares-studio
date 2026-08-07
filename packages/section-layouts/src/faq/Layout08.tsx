import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeFaq } from '../content';
import { SectionHeader, EmptyCopy, elevatedCardStyle } from '../polish';

const FAQ_SUMMARY_CSS = `
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
`;

/** Q label chips */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="FAQ" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Questions will appear here once added in Studio.</EmptyCopy>
        ) : (
          <>
            <style>{FAQ_SUMMARY_CSS}</style>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {items.map((item) => (
                <details key={item.question} style={{ ...elevatedCardStyle, padding: '1rem 1.15rem' }}>
                  <summary
                    className="nabhi-faq-summary"
                    style={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      letterSpacing: '-0.015em',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '0.75rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-button)',
                        lineHeight: 1,
                      }}
                    >
                      Q
                    </span>
                    <span>{item.question}</span>
                  </summary>
                  <p style={{ ...mutedStyle, margin: '0.75rem 0 0 2.5rem', lineHeight: 1.65 }}>
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
