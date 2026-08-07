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

/** Split headline / service list */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          alignItems: 'start',
        }}
      >
        <SectionHeader kicker="Services" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Services will appear here once added in Studio.</EmptyCopy>
        ) : (
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {items.map((item) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <li
                  key={item.title}
                  style={{
                    ...elevatedCardStyle,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.95rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} size={42} />
                  <div>
                    <h3 style={{ ...itemTitleStyle, margin: 0 }}>{item.title}</h3>
                    {item.description ? (
                      <p style={{ ...mutedStyle, margin: '0.3rem 0 0', lineHeight: 1.65 }}>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
