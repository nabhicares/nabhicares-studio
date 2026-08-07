import type { LayoutProps } from '../types';
import { buttonGhostStyle, mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader, elevatedCardStyle } from '../polish';

/** Surface band with inline chips */
export function Layout09({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.5rem' }}>
            {doctors.map((d) => (
              <div
                key={d.name}
                style={{
                  ...elevatedCardStyle,
                  padding: '0.65rem 1rem',
                }}
              >
                <strong>{d.name}</strong>
                {d.specialty ? (
                  <span
                    style={{
                      ...mutedStyle,
                      marginLeft: 8,
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
