import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Accent bar + two-column highlights */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1.25rem' }}>
        <div style={{ width: 4, background: 'var(--color-accent)', borderRadius: 2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={bodyStyle}>{c.body}</p>
          {highlights.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {highlights.map((h) => (
                <div key={h.label}>
                  <strong>{h.label}</strong>
                  <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{h.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
