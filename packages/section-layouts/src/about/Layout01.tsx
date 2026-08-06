import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  imageTreatmentStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';

/** Text + image; highlight cards with icons */
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
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '1.5rem 0 0',
                display: 'grid',
                gap: '0.85rem',
              }}
            >
              {c.highlights.map((h) => (
                <li
                  key={h.label}
                  style={{
                    ...cardStyle,
                    display: 'flex',
                    gap: '0.9rem',
                    alignItems: 'flex-start',
                    background: 'var(--color-bg)',
                    border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
                    boxShadow: '0 4px 16px color-mix(in srgb, var(--color-fg) 5%, transparent)',
                  }}
                >
                  <IconBadge name={resolveServiceIcon(h.label)} size={42} />
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
            <div className="nabhi-empty-media" style={{ minHeight: 280 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-accent)' }}>
                image
              </span>
              <span>Add a hospital photo in Studio</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
