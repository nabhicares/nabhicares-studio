import type { LayoutProps } from '../types';
import { buttonGhostStyle, mutedStyle, accentLabelStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Featured first doctor large + others compact */
export function Layout05({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  const [lead, ...rest] = doctors;
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
              gap: '1.25rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              marginTop: '0.5rem',
            }}
          >
            {lead ? (
              <article style={{ ...elevatedCardStyle, maxWidth: 260, width: '100%' }}>
                <TreatedMedia
                  src={lead.image}
                  aspectRatio="3 / 4"
                  emptyIcon="person"
                  emptyLabel="Photo coming soon"
                  style={{ marginBottom: '1rem' }}
                />
                <h3
                  style={{
                    margin: '0 0 0.25rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {lead.name}
                </h3>
                {lead.specialty ? (
                  <p
                    style={{
                      ...mutedStyle,
                      ...accentLabelStyle,
                    }}
                  >
                    {lead.specialty}
                  </p>
                ) : null}
                {lead.bio ? (
                  <p
                    style={{
                      ...mutedStyle,
                      margin: '0.55rem 0 0',
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {lead.bio}
                  </p>
                ) : null}
              </article>
            ) : null}
            <div style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}>
              {rest.map((d) => (
                <div key={d.name} style={elevatedCardStyle}>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
