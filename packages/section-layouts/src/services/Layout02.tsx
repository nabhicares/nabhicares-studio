import type { LayoutProps, ServiceItem } from '../types';
import { containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeServices } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import {
  elevatedCardStyle,
  EmptyCopy,
  itemTitleStyle,
  SectionHeader,
} from '../polish';

/** Centered title + simple stacked list */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <SectionHeader kicker="Services" title={c.title} body={c.body} center />
        {items.length === 0 ? (
          <EmptyCopy>Services will appear here once added in Studio.</EmptyCopy>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              margin: '1rem auto 0',
              padding: 0,
              textAlign: 'left',
              maxWidth: 480,
            }}
          >
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
                    marginBottom: '0.75rem',
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
          </ul>
        )}
      </div>
    </section>
  );
}
