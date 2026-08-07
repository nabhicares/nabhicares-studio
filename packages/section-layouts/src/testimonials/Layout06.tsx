import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Avatar row testimonials */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
            {items.map((item) => (
              <figure
                key={item.author + item.quote.slice(0, 8)}
                style={{
                  ...elevatedCardStyle,
                  margin: 0,
                  flex: '1 1 200px',
                  maxWidth: 280,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <QuoteAvatar author={item.author} image={item.image} size={64} />
                <div style={{ marginTop: '0.75rem', width: '100%' }}>
                  <RatingStars rating={item.rating} />
                  <blockquote style={{ margin: '0 0 0.5rem', fontStyle: 'italic' }}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption style={{ fontWeight: 600 }}>{item.author}</figcaption>
                  {item.role ? (
                    <div style={{ ...mutedStyle, fontSize: '0.85rem', marginTop: 2 }}>{item.role}</div>
                  ) : null}
                </div>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
