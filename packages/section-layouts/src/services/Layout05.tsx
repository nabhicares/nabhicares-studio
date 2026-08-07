import type { LayoutProps, ServiceItem } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeServices } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import {
  elevatedCardStyle,
  elevatedShadow,
  EmptyCopy,
  itemTitleStyle,
  SectionHeader,
} from '../polish';

/** Large first service + compact rest */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  const [lead, ...rest] = items;

  const renderIcon = (item: ServiceItem, size = 48) => {
    const icon = (item.icon ?? '').trim();
    const iconIsUrl = /^https?:\/\//i.test(icon);
    const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
    return <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} size={size} />;
  };

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
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {lead ? (
              <article
                style={{
                  ...elevatedCardStyle,
                  padding: '1.75rem',
                  background: 'color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))',
                  boxShadow: elevatedShadow,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  {renderIcon(lead, 56)}
                  <div>
                    <h3
                      style={{
                        ...itemTitleStyle,
                        fontSize: '1.35rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {lead.title}
                    </h3>
                    {lead.description ? (
                      <p style={{ ...mutedStyle, margin: 0, lineHeight: 1.65 }}>{lead.description}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : null}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {rest.map((item) => (
                <div
                  key={item.title}
                  style={{
                    ...elevatedCardStyle,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '1rem 1.1rem',
                  }}
                >
                  {renderIcon(item, 40)}
                  <div>
                    <h3 style={{ ...itemTitleStyle, margin: 0, fontSize: '1.05rem' }}>{item.title}</h3>
                    {item.description ? (
                      <p style={{ ...mutedStyle, margin: '0.35rem 0 0', lineHeight: 1.65 }}>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
