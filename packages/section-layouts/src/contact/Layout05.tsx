import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy, elevatedCardStyle } from '../polish';
import { contactRows, ContactCtas, ContactRowCard, ContactMapPanel } from './bits';
import { contactRowIcon, IconBadge, toMapEmbedSrc } from '../icons';

/** Contact — hours featured large; other rows as cards beside map */
export function Layout05({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const rows = contactRows(c, isTeaser);
  const hoursRow = rows.find((r) => r.label === 'Hours');
  const otherRows = rows.filter((r) => r.label !== 'Hours');
  const hasMap = Boolean(c.mapUrl) || Boolean(toMapEmbedSrc(c.mapUrl, c.address));
  const empty = rows.length === 0 && !hasMap;

  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
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

        {hoursRow ? (
          <div
            style={{
              ...elevatedCardStyle,
              display: 'flex',
              gap: '1.15rem',
              alignItems: 'flex-start',
              padding: 'clamp(1.35rem, 3vw, 1.85rem)',
            }}
          >
            <IconBadge name={contactRowIcon(hoursRow.label)} size={52} />
            <div>
              <div
                style={{
                  ...mutedStyle,
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {hoursRow.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.35,
                  whiteSpace: 'pre-line',
                }}
              >
                {hoursRow.value}
              </div>
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: 'grid',
            gap: '1.15rem',
            gridTemplateColumns:
              isTeaser || otherRows.length === 0
                ? '1fr'
                : 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'start',
          }}
        >
          {otherRows.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {otherRows.map((row) => (
                <ContactRowCard key={row.label} row={row} />
              ))}
            </div>
          ) : null}
          {!isTeaser ? <ContactMapPanel c={c} minHeight={300} /> : null}
        </div>

        {empty ? (
          <EmptyCopy>Add phone, address, and hours in Studio — or import from Maps.</EmptyCopy>
        ) : null}
      </div>
    </section>
  );
}
