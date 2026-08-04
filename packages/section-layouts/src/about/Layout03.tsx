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

/** Image first, then text + highlight cards */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights?.length
    ? c.highlights
    : [
        { label: 'Mission', text: 'Patient-first care every day.' },
        { label: 'Team', text: 'Specialists across key disciplines.' },
        { label: 'Facility', text: 'Modern diagnostics on site.' },
      ];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 200, marginBottom: '1.75rem' }}>
          {c.image ? (
        <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}
        </div>
        <h2 style={titleStyle}>{c.title}</h2>
        <p style={bodyStyle}>{c.body}</p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {highlights.map((h) => (
            <div key={h.label} style={cardStyle}>
              <div style={{ width: 28, height: 4, background: 'var(--color-accent)', marginBottom: 10, borderRadius: 2 }} />
              <strong>{h.label}</strong>
              <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
