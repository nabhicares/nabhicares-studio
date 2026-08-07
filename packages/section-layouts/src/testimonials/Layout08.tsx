import type { LayoutProps } from '../types';
import { containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeTestimonials } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';
import { QuoteAvatar, RatingStars } from './bits';

/** Large pull-quote carousel feel (static first item) */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  const item = items[0];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', maxWidth: 720 }}>
        <SectionHeader kicker="Stories" title={c.title} body={c.body} center />
        {items.length === 0 ? (
          <EmptyCopy>Patient stories coming soon.</EmptyCopy>
        ) : item ? (
          <blockquote
            style={{
              ...elevatedCardStyle,
              margin: '1rem auto 0',
              maxWidth: 560,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2rem 1.5rem',
            }}
          >
            <QuoteAvatar author={item.author} image={item.image} size={56} />
            <div style={{ marginTop: '1rem' }}>
              <RatingStars rating={item.rating} />
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.02em',
                  margin: '0 0 1.25rem',
                }}
              >
                &ldquo;{item.quote}&rdquo;
              </p>
              <cite style={{ fontStyle: 'normal', fontWeight: 600 }}>{item.author}</cite>
              {item.role ? <div style={mutedStyle}>{item.role}</div> : null}
            </div>
          </blockquote>
        ) : null}
        {items.length > 1 ? (
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            {items.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    i === 0
                      ? 'var(--color-accent)'
                      : 'color-mix(in srgb, var(--color-fg) 20%, transparent)',
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
