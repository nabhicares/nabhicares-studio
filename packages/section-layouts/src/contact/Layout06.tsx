import type { LayoutProps } from '../types';
import { containerStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy } from '../polish';
import { contactRows, ContactCtas, ContactRowCard, ContactMapPanel } from './bits';
import { toMapEmbedSrc } from '../icons';

/** Contact — compact stacked cards (narrow) + map aside on wide screens */
export function Layout06({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const rows = contactRows(c, isTeaser);
  const hasMap = Boolean(c.mapUrl) || Boolean(toMapEmbedSrc(c.mapUrl, c.address));
  const empty = rows.length === 0 && !hasMap;

  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          gridTemplateColumns: isTeaser ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'start',
        }}
      >
        <div style={{ ...containerStyle, maxWidth: 420, margin: 0, display: 'grid', gap: '1.15rem' }}>
          <SectionHeader
            kicker={isTeaser ? 'Plan your visit' : 'Visit'}
            title={c.title}
            body={c.body}
          />
          <ContactCtas c={c} siteLinks={siteLinks} isTeaser={isTeaser} />
          {rows.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {rows.map((row) => (
                <ContactRowCard key={row.label} row={row} />
              ))}
            </div>
          ) : null}
          {empty ? (
            <EmptyCopy>Add phone, address, and hours in Studio — or import from Maps.</EmptyCopy>
          ) : null}
        </div>

        {!isTeaser ? <ContactMapPanel c={c} minHeight={380} /> : null}
      </div>
    </section>
  );
}
