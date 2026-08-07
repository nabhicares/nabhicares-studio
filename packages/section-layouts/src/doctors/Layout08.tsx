import type { LayoutProps } from '../types';
import { buttonGhostStyle, mutedStyle, accentLabelStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader, TreatedMedia } from '../polish';

/** Circular portrait mosaic */
export function Layout08({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <SectionHeader kicker="Care team" title={c.title} body={c.body} center />
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
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.75rem',
              marginTop: '0.5rem',
            }}
          >
            {doctors.map((d) => (
              <figure key={d.name} style={{ margin: 0, width: 140 }}>
                <TreatedMedia
                  src={d.image}
                  round
                  emptyIcon="person"
                  emptyLabel="Photo coming soon"
                  style={{
                    width: 110,
                    height: 110,
                    margin: '0 auto 0.75rem',
                    border:
                      '3px solid color-mix(in srgb, var(--color-accent) 50%, transparent)',
                  }}
                />
                <figcaption>
                  <div
                    style={{
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                    }}
                  >
                    {d.name}
                  </div>
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
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
