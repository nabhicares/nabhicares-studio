import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Stacked list rows */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(c.doctors ?? []).map((d) => (
            <li key={d.name} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, background: placeholderGradient, overflow: 'hidden' }}>
                {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <div>
                <strong style={{ fontFamily: 'var(--font-display)' }}>{d.name}</strong>
                <div style={mutedStyle}>{d.specialty}</div>
                {d.bio ? <p style={{ ...mutedStyle, margin: '0.35rem 0 0', fontSize: '0.9rem' }}>{d.bio}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
