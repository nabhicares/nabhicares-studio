import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Balanced centered card grid (Stitch-inspired) */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} center />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '1.25rem',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              textAlign: 'left',
            }}
          >
            {items.map((item) => (
              <blockquote
                key={item.author + item.quote.slice(0, 8)}
                style={{ ...elevatedCardStyle, margin: 0, padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem' }}>
                  <QuoteAvatar author={item.author} image={item.image} />
                  <div style={{ flex: 1 }}>
                    <RatingStars rating={item.rating} />
                    <p style={{ margin: '0 0 1.25rem', lineHeight: 1.6 }}>&ldquo;{item.quote}&rdquo;</p>
                    <cite style={{ fontStyle: 'normal', fontWeight: 600 }}>{item.author}</cite>
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
