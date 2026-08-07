import type { LayoutProps } from '../types';
import { containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Single-column stacked quotes */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          items.map((item) => (
            <blockquote
              key={item.author + item.quote.slice(0, 8)}
              style={{
                ...elevatedCardStyle,
                margin: '0 0 1.25rem',
                paddingLeft: '1.15rem',
                borderLeft: '3px solid var(--color-accent)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <QuoteAvatar author={item.author} image={item.image} size={40} />
                <div style={{ flex: 1 }}>
                  <RatingStars rating={item.rating} />
                  <p style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>&ldquo;{item.quote}&rdquo;</p>
                  <footer style={mutedStyle}>
                    — {item.author}
                    {item.role ? `, ${item.role}` : ''}
                  </footer>
                </div>
              </div>
            </blockquote>
          ))
        )}
      </div>
    </section>
  );
}
