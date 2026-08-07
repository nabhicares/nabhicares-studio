import type { LayoutProps } from '../types';
import { containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Accent rail quotes */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : (
          items.map((item) => (
            <div
              key={item.author + item.quote.slice(0, 8)}
              style={{
                ...elevatedCardStyle,
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.25rem',
                padding: '1.15rem 1.2rem',
              }}
            >
              <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2, flexShrink: 0 }} />
              <QuoteAvatar author={item.author} image={item.image} size={40} />
              <blockquote style={{ margin: 0, flex: 1 }}>
                <RatingStars rating={item.rating} />
                <p style={{ margin: '0 0 0.4rem' }}>&ldquo;{item.quote}&rdquo;</p>
                <footer style={mutedStyle}>
                  {item.author}
                  {item.role ? ` · ${item.role}` : ''}
                </footer>
              </blockquote>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
