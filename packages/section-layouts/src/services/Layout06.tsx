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

/** Bordered outline cards */
export function Layout06({ content }: LayoutProps) {
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
              gap: '1rem',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            {items.map((item) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <article key={item.title} style={{ ...elevatedCardStyle, padding: '1.25rem' }}>
                  <div style={{ height: 3, width: 32, background: 'var(--color-accent)', marginBottom: 12 }} />
                  <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} size={40} />
                  <h3 style={{ ...itemTitleStyle, marginTop: '0.75rem', fontSize: '1rem' }}>{item.title}</h3>
                  {item.description ? (
                    <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem', lineHeight: 1.65 }}>
                      {item.description}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
