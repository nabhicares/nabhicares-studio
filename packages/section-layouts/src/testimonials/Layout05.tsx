import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Featured lead quote + smaller supporting */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  const [lead, ...rest] = items;
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '1.25rem',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {lead ? (
              <blockquote style={{ ...elevatedCardStyle, margin: 0, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <QuoteAvatar author={lead.author} image={lead.image} size={52} />
                  <div style={{ flex: 1 }}>
                    <RatingStars rating={lead.rating} />
                    <p
                      style={{
                        margin: '0 0 1.25rem',
                        fontSize: '1.25rem',
                        fontFamily: 'var(--font-display)',
                        lineHeight: 1.4,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      &ldquo;{lead.quote}&rdquo;
                    </p>
                    <strong>{lead.author}</strong>
                    {lead.role ? <div style={mutedStyle}>{lead.role}</div> : null}
                  </div>
                </div>
              </blockquote>
            ) : null}
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {rest.map((item) => (
                <blockquote
                  key={item.author + item.quote.slice(0, 8)}
                  style={{ ...elevatedCardStyle, margin: 0 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <QuoteAvatar author={item.author} image={item.image} size={36} />
                    <div style={{ flex: 1 }}>
                      <RatingStars rating={item.rating} />
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>&ldquo;{item.quote}&rdquo;</p>
                      <strong style={{ fontSize: '0.9rem' }}>{item.author}</strong>
                    </div>
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
