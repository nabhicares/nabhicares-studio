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

/** Two-column FAQ grid */
export function Layout03({ content }: LayoutProps) {
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
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              }}
            >
              {items.map((item) => (
                <details key={item.question} style={elevatedCardStyle}>
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
                      gap: '0.75rem',
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
