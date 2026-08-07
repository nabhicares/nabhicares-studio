import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy } from '../polish';
import { contactRows, ContactCtas, ContactRowCard, ContactMapPanel } from './bits';
import { toMapEmbedSrc } from '../icons';

/** Contact — centered header + CTA; responsive row grid; full-width map */
export function Layout02({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const rows = contactRows(c, isTeaser);
  const hasMap = Boolean(c.mapUrl) || Boolean(toMapEmbedSrc(c.mapUrl, c.address));
  const empty = rows.length === 0 && !hasMap;

  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
        <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center', textAlign: 'center' }}>
          <SectionHeader
            kicker={isTeaser ? 'Plan your visit' : 'Visit'}
            title={c.title}
            body={c.body}
            center
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCtas c={c} siteLinks={siteLinks} isTeaser={isTeaser} />
          </div>
        </div>

        {rows.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {rows.map((row) => (
              <ContactRowCard key={row.label} row={row} />
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
