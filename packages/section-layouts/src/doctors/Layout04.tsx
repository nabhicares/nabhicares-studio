import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Split: title left, roster right */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.name}</span>
              <span style={{ ...mutedStyle, fontSize: '0.9rem' }}>{d.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
