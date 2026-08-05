import type { LayoutProps } from '../types';
import {
  bodyStyle,
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
export function Layout01({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 45%, var(--color-bg))',
      }}
    >
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Care team</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div
          style={{
            display: 'grid',
            gap: 'clamp(1.5rem, 3vw, 2.25rem)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            marginTop: '0.5rem',
          }}
        >
          {(c.doctors ?? []).map((d) => (
            <article key={d.name}>
              <div style={{ ...imageTreatmentStyle, aspectRatio: '3 / 4', marginBottom: '1rem' }}>
                {d.image ? (
                  <img
                    src={d.image}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
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
              {d.bio ? (
                <p style={{ ...mutedStyle, margin: '0.55rem 0 0', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  {d.bio}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
