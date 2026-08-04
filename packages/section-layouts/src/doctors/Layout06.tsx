import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Dense 2-column name/specialty table feel */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem 2rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', padding: '0.75rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)' }}>
              <span style={{ fontWeight: 600 }}>{d.name}</span>
              <span style={mutedStyle}>{d.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
