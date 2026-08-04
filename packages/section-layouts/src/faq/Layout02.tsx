import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Centered narrow accordion */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 560, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ textAlign: 'left' }}>
          {(c.items ?? []).map((item) => (
            <div key={item.question} style={{ padding: '1rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{item.question}</h3>
              <p style={{ ...mutedStyle, margin: 0 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
