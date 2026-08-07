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

/** Numbered process-style row */
export function Layout09({ content }: LayoutProps) {
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            }}
          >
            {items.map((item, i) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <article key={item.title} style={{ ...elevatedCardStyle, padding: '1.25rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: 'var(--color-accent)',
                      marginBottom: 10,
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
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
