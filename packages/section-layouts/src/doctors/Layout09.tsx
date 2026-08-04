import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Surface band with inline chips */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-button)', padding: '0.65rem 1rem' }}>
              <strong>{d.name}</strong>
              <span style={{ ...mutedStyle, marginLeft: 8 }}>{d.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
