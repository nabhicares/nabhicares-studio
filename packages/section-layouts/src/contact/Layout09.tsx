import type { LayoutProps } from '../types';
import { buttonPrimaryStyle, containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy } from '../polish';
import {
  contactRows,
  ContactCtas,
  ContactRowCard,
  ContactMapPanel,
  contactTelHref,
} from './bits';
import { toMapEmbedSrc } from '../icons';

/** Contact — phone-forward: big call CTA + phone card; secondary details; optional small map */
export function Layout09({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const rows = contactRows(c, isTeaser);
  const phoneRow = rows.find((r) => r.label === 'Phone');
  const otherRows = rows.filter((r) => r.label !== 'Phone');
  const telHref = contactTelHref(c);
  const hasMap = Boolean(c.mapUrl) || Boolean(toMapEmbedSrc(c.mapUrl, c.address));
  const empty = rows.length === 0 && !hasMap;

  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...containerStyle,
          display: 'grid',
          gap: 'clamp(1.35rem, 3vw, 2rem)',
          justifyItems: 'center',
          textAlign: 'center',
        }}
      >
        <SectionHeader
          kicker={isTeaser ? 'Plan your visit' : 'Visit'}
          title={c.title}
          body={c.body}
          center
        />

        {telHref ? (
          <a
            href={telHref}
            className="nabhi-btn"
            style={{
              ...buttonPrimaryStyle,
              fontSize: '1.15rem',
              padding: '0.95rem 1.75rem',
              minWidth: 'min(100%, 280px)',
            }}
          >
            Call {c.phone}
          </a>
        ) : null}

        {phoneRow ? (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <ContactRowCard row={phoneRow} />
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ContactCtas c={c} siteLinks={siteLinks} isTeaser={isTeaser} />
        </div>

        {otherRows.length > 0 ? (
          <div
            style={{
              width: '100%',
              display: 'grid',
              gap: '0.75rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              textAlign: 'left',
              opacity: 0.92,
            }}
          >
            {otherRows.map((row) => (
              <ContactRowCard key={row.label} row={row} />
            ))}
          </div>
        ) : null}

        {!isTeaser ? (
          <div style={{ width: '100%', maxWidth: 520 }}>
            <p style={{ ...mutedStyle, margin: '0 0 0.65rem', fontSize: '0.85rem' }}>Find us</p>
            <ContactMapPanel c={c} minHeight={220} />
          </div>
        ) : null}

        {empty ? (
          <EmptyCopy>Add phone, address, and hours in Studio — or import from Maps.</EmptyCopy>
        ) : null}
      </div>
    </section>
  );
}
