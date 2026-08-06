import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeServices } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';

/** Services — icon + card grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as { title: string; description?: string; icon?: string }[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Services</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {items.length === 0 ? (
          <p className="nabhi-empty" style={mutedStyle}>
            Services will appear here once added in Studio.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 'clamp(0.9rem, 2vw, 1.25rem)',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {items.map((item) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <article
                  key={item.title}
                  style={{
                    ...cardStyle,
                    background: 'var(--color-bg)',
                    padding: '1.35rem 1.25rem',
                    border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
                    boxShadow: '0 4px 18px color-mix(in srgb, var(--color-fg) 6%, transparent)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem' }}>
                    <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} />
                    <div>
                      <h3
                        style={{
                          margin: '0 0 0.45rem',
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.2rem',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p style={{ ...mutedStyle, margin: 0, lineHeight: 1.65 }}>{item.description}</p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
