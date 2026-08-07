import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Surface band with inline quotes */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '0.75rem',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {items.map((item) => (
              <blockquote
                key={item.author + item.quote.slice(0, 8)}
                style={{ ...elevatedCardStyle, margin: 0, padding: '1.15rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <QuoteAvatar author={item.author} image={item.image} size={40} />
                  <div style={{ flex: 1 }}>
                    <RatingStars rating={item.rating} />
                    <p style={{ margin: '0 0 0.65rem' }}>&ldquo;{item.quote}&rdquo;</p>
                    <strong>{item.author}</strong>
                    {item.role ? (
                      <div style={{ ...mutedStyle, fontSize: '0.85rem', marginTop: 2 }}>{item.role}</div>
                    ) : null}
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
