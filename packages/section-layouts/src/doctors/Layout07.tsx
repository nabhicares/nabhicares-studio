import type { LayoutProps } from '../types';
import { buttonGhostStyle, containerStyle, mutedStyle, sectionBaseStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader } from '../polish';

/** Accent rail list */
export function Layout07({ content, siteLinks }: LayoutProps) {
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
          <div style={{ display: 'grid', gap: '1rem', marginTop: '0.5rem' }}>
            {doctors.map((d) => (
              <div key={d.name} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.name}</div>
                  {d.specialty ? (
                    <div
                      style={{
                        ...mutedStyle,
                        fontSize: '0.9rem',
                        color: 'var(--color-accent)',
                        fontWeight: 600,
                      }}
                    >
                      {d.specialty}
                    </div>
                  ) : null}
                  {d.bio ? (
                    <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{d.bio}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
