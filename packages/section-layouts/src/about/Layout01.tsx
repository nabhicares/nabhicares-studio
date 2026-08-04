import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Split: text left, image right */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'center' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={bodyStyle}>{c.body}</p>
          {c.highlights?.length ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              {c.highlights.map((h) => (
                <li key={h.label} style={{ ...cardStyle, padding: '0.85rem 1rem' }}>
                  <strong style={{ display: 'block', marginBottom: 4 }}>{h.label}</strong>
                  <span style={mutedStyle}>{h.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 280, aspectRatio: '4 / 3' }}>
          {c.image ? (
        <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}
        </div>
      </div>
    </section>
  );
}
