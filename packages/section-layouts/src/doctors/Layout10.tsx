import type { LayoutProps } from '../types';
import { buttonGhostStyle, containerStyle, mutedStyle, accentLabelStyle, sectionBaseStyle } from '../styles';
import { normalizeDoctors } from '../content';
import { EmptyCopy, SectionHeader } from '../polish';

/** Minimal numbered roster */
export function Layout10({ content, siteLinks }: LayoutProps) {
  const c = normalizeDoctors(content);
  const doctors = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
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
          <ol style={{ margin: '0.5rem 0 0', padding: 0, listStyle: 'none', counterReset: 'doc' }}>
            {doctors.map((d, i) => (
              <li
                key={d.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5rem 1fr',
                  gap: '0.75rem',
                  padding: '0.85rem 0',
                  borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
                  counterIncrement: 'doc',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent)',
                    fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.name}</div>
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
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
