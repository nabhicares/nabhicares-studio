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

/** Accent rail vertical list */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <SectionHeader kicker="Services" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Services will appear here once added in Studio.</EmptyCopy>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {items.map((item) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <div
                  key={item.title}
                  style={{
                    ...elevatedCardStyle,
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '0.85rem',
                    padding: '1.1rem 1.15rem',
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      alignSelf: 'stretch',
                      background: 'var(--color-accent)',
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} size={42} />
                  <div>
                    <h3 style={{ ...itemTitleStyle, margin: 0 }}>{item.title}</h3>
                    {item.description ? (
                      <p style={{ ...mutedStyle, margin: '0.3rem 0 0', lineHeight: 1.65 }}>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
