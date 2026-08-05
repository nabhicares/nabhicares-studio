import type { LayoutProps } from '../types';
import {
  accentBarStyle,
  bodyStyle,
  imageTreatmentStyle,
  kickerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeAbout } from '../content';

/** Text + image; highlights as accent rows, not card clutter */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 'clamp(2rem, 5vw, 3.5rem)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={kickerStyle}>About</p>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={bodyStyle}>{c.body}</p>
          {c.highlights?.length ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0', display: 'grid', gap: '1rem' }}>
              {c.highlights.map((h) => (
                <li key={h.label} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <span style={{ ...accentBarStyle, alignSelf: 'stretch', minHeight: 40 }} />
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: 4,
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                      }}
                    >
                      {h.label}
                    </strong>
                    <span style={{ ...mutedStyle, lineHeight: 1.55 }}>{h.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div style={{ ...imageTreatmentStyle, minHeight: 300, aspectRatio: '4 / 5' }}>
          {c.image ? (
            <img
              src={c.image}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: 280, background: placeholderGradient }} />
          )}
        </div>
      </div>
    </section>
  );
}
