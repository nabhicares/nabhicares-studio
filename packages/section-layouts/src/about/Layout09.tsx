import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Horizontal highlight strip under title */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights?.length
    ? c.highlights
    : [
        { label: 'Years', text: 'Trusted care' },
        { label: 'Staff', text: 'Dedicated team' },
        { label: 'Patients', text: 'Community first' },
      ];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={titleStyle}>{c.title}</h2>
            <p style={{ ...bodyStyle, marginBottom: 0 }}>{c.body}</p>
          </div>
          <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 160 }}>
            {c.image ? (
        <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)', paddingTop: '1.25rem' }}>
          {highlights.map((h) => (
            <div key={h.label} style={{ flex: '1 1 140px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{h.label}</div>
              <div style={mutedStyle}>{h.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
