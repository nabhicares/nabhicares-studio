import type { LayoutProps, ServiceItem } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeServices } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import {
  elevatedCardStyle,
  EmptyCopy,
  itemTitleStyle,
  SectionHeader,
} from '../polish';

/** Two-column alternating rows */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="Services" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Services will appear here once added in Studio.</EmptyCopy>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {items.map((item, i) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <article
                  key={item.title}
                  style={{
                    ...elevatedCardStyle,
                    background:
                      i % 2 === 0
                        ? 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))'
                        : 'var(--color-bg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem' }}>
                    <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} />
                    <div>
                      <h3 style={itemTitleStyle}>{item.title}</h3>
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
