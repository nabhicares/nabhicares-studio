import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy } from '../polish';
import { contactRows, ContactCtas, ContactRowCard, ContactMapPanel } from './bits';
import { toMapEmbedSrc } from '../icons';

/** Contact — alternating full-width detail strips + map at bottom */
export function Layout10({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const rows = contactRows(c, isTeaser);
  const hasMap = Boolean(c.mapUrl) || Boolean(toMapEmbedSrc(c.mapUrl, c.address));
  const empty = rows.length === 0 && !hasMap;

  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: 'clamp(1.35rem, 3vw, 2rem)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <SectionHeader
            kicker={isTeaser ? 'Plan your visit' : 'Visit'}
            title={c.title}
            body={c.body}
          />
          <ContactCtas c={c} siteLinks={siteLinks} isTeaser={isTeaser} />
        </div>

        {rows.length > 0 ? (
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {rows.map((row, i) => (
              <div
                key={row.label}
                style={{
                  background:
                    i % 2 === 1
                      ? 'color-mix(in srgb, var(--color-surface) 70%, transparent)'
                      : undefined,
                  borderRadius: 'calc(var(--radius-button) + 4px)',
                  padding: i % 2 === 1 ? '0.35rem' : 0,
                }}
              >
                <ContactRowCard row={row} />
              </div>
            ))}
          </div>
        ) : null}

        {!isTeaser ? <ContactMapPanel c={c} minHeight={300} /> : null}

        {empty ? (
          <EmptyCopy>Add phone, address, and hours in Studio — or import from Maps.</EmptyCopy>
        ) : null}
      </div>
    </section>
  );
}
