import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Circular portrait mosaic */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.75rem' }}>
          {(c.doctors ?? []).map((d) => (
            <figure key={d.name} style={{ margin: 0, width: 140 }}>
              <div style={{ width: 110, height: 110, borderRadius: '50%', margin: '0 auto 0.75rem', background: placeholderGradient, overflow: 'hidden', border: '3px solid color-mix(in srgb, var(--color-accent) 50%, transparent)' }}>
                {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <figcaption>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{d.name}</div>
                <div style={{ ...mutedStyle, fontSize: '0.8rem' }}>{d.specialty}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
