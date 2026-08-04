import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Minimal numbered roster */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', counterReset: 'doc' }}>
          {(c.doctors ?? []).map((d) => (
            <li key={d.name} style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr', gap: '0.75rem', padding: '0.85rem 0', borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)', counterIncrement: 'doc' }}>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontWeight: 700 }}>
                {String((c.doctors ?? []).indexOf(d) + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>{d.name}</div>
                <div style={mutedStyle}>{d.specialty}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
