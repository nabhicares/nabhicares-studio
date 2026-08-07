import type { LayoutProps } from '../types';
import { buttonGhostStyle, mutedStyle, accentLabelStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader } from '../polish';

/** Dense 2-column name/specialty table feel */
export function Layout06({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.5rem 2rem',
              marginTop: '0.5rem',
            }}
          >
            {doctors.map((d) => (
              <div
                key={d.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '0.5rem',
                  padding: '0.75rem 0',
                  borderBottom:
                    '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
                }}
              >
                <span style={{ fontWeight: 600 }}>{d.name}</span>
                {d.specialty ? (
                  <span
                    style={{
                      ...mutedStyle,
                      ...accentLabelStyle,
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
