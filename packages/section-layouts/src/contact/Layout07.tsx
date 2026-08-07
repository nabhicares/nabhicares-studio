import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy, elevatedCardStyle } from '../polish';
import { contactRows, ContactCtas, ContactRowCard, ContactMapPanel } from './bits';
import { toMapEmbedSrc } from '../icons';

/** Contact — CTA bar on top; two columns: cards | map */
export function Layout07({ content, siteLinks }: LayoutProps) {
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
            ...elevatedCardStyle,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.15rem 1.35rem',
          }}
        >
          <SectionHeader
            kicker={isTeaser ? 'Plan your visit' : 'Visit'}
            title={c.title}
            body={c.body}
          />
          <ContactCtas c={c} siteLinks={siteLinks} isTeaser={isTeaser} />
        </div>

        <div
          style={{
            display: 'grid',
            gap: '1.15rem',
            gridTemplateColumns: isTeaser
              ? '1fr'
              : 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'start',
          }}
        >
          {rows.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {rows.map((row) => (
                <ContactRowCard key={row.label} row={row} />
              ))}
            </div>
          ) : null}
          {!isTeaser ? <ContactMapPanel c={c} minHeight={320} /> : null}
        </div>

        {empty ? (
          <EmptyCopy>Add phone, address, and hours in Studio — or import from Maps.</EmptyCopy>
        ) : null}
      </div>
    </section>
  );
}
