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

/** Compact definition list on surface */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <SectionHeader kicker="Services" title={c.title} body={c.body} />
        {items.length === 0 ? (
          <EmptyCopy>Services will appear here once added in Studio.</EmptyCopy>
        ) : (
          <dl style={{ margin: '1rem 0 0' }}>
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
                    alignItems: 'flex-start',
                    gap: '0.95rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} size={42} />
                  <div>
                    <dt style={{ ...itemTitleStyle, margin: 0 }}>{item.title}</dt>
                    {item.description ? (
                      <dd style={{ ...mutedStyle, margin: '0.3rem 0 0', lineHeight: 1.65 }}>
                        {item.description}
                      </dd>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </section>
  );
}
