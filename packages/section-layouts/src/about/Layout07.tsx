import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, elevatedCardStyle } from '../polish';

/** Accent bar + two-column highlights */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1.25rem' }}>
        <div style={{ width: 4, background: 'var(--color-accent)', borderRadius: 2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <SectionHeader kicker="About" title={c.title} body={c.body} />
          {highlights.length ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '0.25rem',
              }}
            >
              {highlights.map((h) => (
                <div
                  key={h.label}
                  style={{
                    ...elevatedCardStyle,
                    display: 'flex',
                    gap: '0.9rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <IconBadge name={resolveServiceIcon(h.label)} size={42} />
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: 4,
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                      }}
                    >
                      {h.label}
                    </strong>
                    <p style={{ ...mutedStyle, margin: 0, lineHeight: 1.55 }}>{h.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
