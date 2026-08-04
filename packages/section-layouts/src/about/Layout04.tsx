import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Narrow editorial column */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 560 }}>
        <p style={{ ...mutedStyle, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', margin: '0 0 0.5rem' }}>About</p>
        <h2 style={titleStyle}>{c.title}</h2>
        <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p>
        {c.highlights?.map((h) => (
          <p key={h.label} style={{ margin: '0 0 0.75rem' }}>
            <strong>{h.label}: </strong>
            <span style={mutedStyle}>{h.text}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
