import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeContact } from '../content';
import { SectionHeader, EmptyCopy } from '../polish';
import { contactRows, ContactCtas, ContactRowCard, ContactMapPanel } from './bits';
import { toMapEmbedSrc } from '../icons';

/** Contact — surface-band background; floating cards over/above map */
export function Layout08({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const rows = contactRows(c, isTeaser);
  const hasMap = Boolean(c.mapUrl) || Boolean(toMapEmbedSrc(c.mapUrl, c.address));
  const empty = rows.length === 0 && !hasMap;

  return (
    <section
      style={{
        ...sectionBaseStyle,
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)) 0%, var(--color-bg) 100%)',
      }}
    >
      <div style={{ ...wideContainerStyle, display: 'grid', gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 560 }}>
          <SectionHeader
            kicker={isTeaser ? 'Plan your visit' : 'Visit'}
            title={c.title}
            body={c.body}
          />
          <ContactCtas c={c} siteLinks={siteLinks} isTeaser={isTeaser} />
        </div>

        <div style={{ position: 'relative', display: 'grid', gap: '1rem' }}>
          {!isTeaser ? (
            <div style={{ marginTop: rows.length > 0 ? '0.5rem' : 0 }}>
              <ContactMapPanel c={c} minHeight={340} />
            </div>
          ) : null}

          {rows.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gap: '0.85rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                ...(isTeaser
                  ? null
                  : {
                      marginTop: '-3.5rem',
                      position: 'relative' as const,
                      zIndex: 1,
                      padding: '0 0.75rem',
                    }),
              }}
            >
              {rows.map((row) => (
                <ContactRowCard key={row.label} row={row} />
              ))}
            </div>
          ) : null}
        </div>

        {empty ? (
          <EmptyCopy>Add phone, address, and hours in Studio — or import from Maps.</EmptyCopy>
        ) : null}
      </div>
    </section>
  );
}
