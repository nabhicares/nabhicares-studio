import type { LayoutProps } from '../types';
import { buttonGhostStyle, mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';

/** Split: title left, roster right */
export function Layout04({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        <SectionHeader kicker="Care team" title={c.title} body={c.body} />
        {doctors.length === 0 ? (
          <div>
            <EmptyCopy>Team profiles coming soon. Add doctors in Studio when ready.</EmptyCopy>
            {siteLinks?.doctors ? (
              <a
                href={siteLinks.doctors}
                className="nabhi-btn"
                style={{ ...buttonGhostStyle, marginTop: '1rem' }}
              >
                Doctors page
              </a>
            ) : null}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {doctors.map((d) => (
              <div
                key={d.name}
                style={{
                  ...elevatedCardStyle,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.name}</span>
                {d.specialty ? (
                  <span
                    style={{
                      ...mutedStyle,
                      fontSize: '0.9rem',
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {d.specialty}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
