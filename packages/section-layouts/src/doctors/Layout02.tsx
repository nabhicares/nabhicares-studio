import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Centered intro + horizontal scroll-friendly row */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
      </div>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: 8 }}>
        {(c.doctors ?? []).map((d) => (
          <article key={d.name} style={{ ...cardStyle, minWidth: 220, flex: '0 0 auto', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 0.75rem', background: placeholderGradient, overflow: 'hidden' }}>
              {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <h3 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{d.name}</h3>
            <p style={{ ...mutedStyle, margin: 0 }}>{d.specialty}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
