import type { LayoutProps, ServiceItem } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeServices } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import {
  elevatedCardStyle,
  EmptyCopy,
  SectionHeader,
} from '../polish';

/** Pill / chip cloud of service titles */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as ServiceItem[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <SectionHeader kicker="Services" title={c.title} body={c.body} center />
        {items.length === 0 ? (
          <EmptyCopy>Services will appear here once added in Studio.</EmptyCopy>
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.65rem',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            {items.map((item) => {
              const icon = (item.icon ?? '').trim();
              const iconIsUrl = /^https?:\/\//i.test(icon);
              const symbol = resolveServiceIcon(item.title, iconIsUrl ? undefined : icon);
              return (
                <span
                  key={item.title}
                  style={{
                    ...elevatedCardStyle,
                    padding: '0.55rem 0.95rem 0.55rem 0.55rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <IconBadge name={symbol} imageUrl={iconIsUrl ? icon : undefined} size={32} />
                  {item.title}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
