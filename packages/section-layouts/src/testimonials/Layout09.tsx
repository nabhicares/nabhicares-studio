import type { LayoutProps } from '../types';
import { containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Dense quote list */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          <ul style={{ listStyle: 'none', margin: '1rem 0 0', padding: 0, display: 'grid', gap: '0.75rem' }}>
            {items.map((item) => (
              <li
                key={item.author + item.quote.slice(0, 8)}
                style={{
                  ...elevatedCardStyle,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '0.95rem 1.1rem',
                }}
              >
                <QuoteAvatar author={item.author} image={item.image} size={36} />
                <div style={{ flex: 1 }}>
                  <RatingStars rating={item.rating} />
                  <div style={{ fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</div>
                  <div style={{ ...mutedStyle, marginTop: 4, fontSize: '0.9rem' }}>
                    {item.author}
                    {item.role ? ` · ${item.role}` : ''}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
