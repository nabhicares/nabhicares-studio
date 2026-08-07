import type { LayoutProps } from '../types';
import { buttonGhostStyle, containerStyle, mutedStyle, accentLabelStyle, sectionBaseStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader, TreatedMedia } from '../polish';

/** Stacked list rows */
export function Layout03({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
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
          <ul style={{ listStyle: 'none', margin: '0.5rem 0 0', padding: 0 }}>
            {doctors.map((d) => (
              <li
                key={d.name}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom:
                    '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
                }}
              >
                <TreatedMedia
                  src={d.image}
                  round
                  emptyIcon="person"
                  emptyLabel="Photo coming soon"
                  style={{ width: 56, height: 56, flexShrink: 0 }}
                />
                <div>
                  <strong style={{ fontFamily: 'var(--font-display)' }}>{d.name}</strong>
                  {d.specialty ? (
                    <div
                      style={{
                        ...mutedStyle,
                        ...accentLabelStyle,
                      }}
                    >
                      {d.specialty}
                    </div>
                  ) : null}
                  {d.bio ? (
                    <p style={{ ...mutedStyle, ...accentLabelStyle, margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
                      {d.bio}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
