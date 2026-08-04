import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Surface panel FAQ */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, ...surfaceStyle, padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <div key={item.question} style={{ padding: '1rem 0', borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
            <strong style={{ fontFamily: 'var(--font-display)' }}>{item.question}</strong>
            <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
