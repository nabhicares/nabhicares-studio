import type { LayoutProps } from '../types';
import {
  buttonGhostStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Centered intro + horizontal scroll-friendly row */
export function Layout02({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, marginBottom: '1.5rem' }}>
        <SectionHeader kicker="Care team" title={c.title} body={c.body} center />
      </div>
      {doctors.length === 0 ? (
        <div style={wideContainerStyle}>
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
            ...wideContainerStyle,
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: 8,
          }}
        >
          {doctors.map((d) => (
            <article
              key={d.name}
              style={{
                ...elevatedCardStyle,
                minWidth: 220,
                flex: '0 0 auto',
                textAlign: 'center',
              }}
            >
              <TreatedMedia
                src={d.image}
                round
                emptyIcon="person"
                emptyLabel="Photo coming soon"
                style={{ width: 72, height: 72, margin: '0 auto 0.75rem' }}
              />
              <h3
                style={{
                  margin: '0 0 0.25rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
