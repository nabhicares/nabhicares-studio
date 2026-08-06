import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  imageTreatmentStyle,
  kickerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeDoctors } from '../content';

/** Portrait grid — quiet surfaces, no heavy cards */
export function Layout01({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section
      style={{
        ...sectionBaseStyle,
      }}
    >
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Care team</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {doctors.length === 0 ? (
          <div style={{ marginTop: '0.75rem' }}>
            <p className="nabhi-empty" style={mutedStyle}>
              Team profiles coming soon. Add doctors in Studio when ready.
            </p>
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
              gap: 'clamp(1.5rem, 3vw, 2.25rem)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              marginTop: '0.5rem',
            }}
          >
            {doctors.map((d) => (
              <article key={d.name}>
                <div style={{ ...imageTreatmentStyle, aspectRatio: '3 / 4', marginBottom: '1rem' }}>
                  {d.image ? (
                    <img
                      src={d.image}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div
                      className="nabhi-empty-media"
                      style={{
                        width: '100%',
                        height: '100%',
                        background: placeholderGradient,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-accent)' }}>
                        person
                      </span>
                      <span style={{ fontSize: '0.8rem' }}>Photo coming soon</span>
                    </div>
                  )}
                </div>
                <h3
                  style={{
                    margin: '0 0 0.25rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {d.name}
                </h3>
                {d.specialty ? (
                  <p
                    style={{
                      ...mutedStyle,
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {d.specialty}
                  </p>
                ) : null}
                {d.bio ? (
                  <p style={{ ...mutedStyle, margin: '0.55rem 0 0', fontSize: '0.92rem', lineHeight: 1.55 }}>
                    {d.bio}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
