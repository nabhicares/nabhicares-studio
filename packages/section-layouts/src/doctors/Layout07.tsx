import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Accent rail list */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.name}</div>
                <div style={mutedStyle}>{d.specialty}</div>
                {d.bio ? <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{d.bio}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
