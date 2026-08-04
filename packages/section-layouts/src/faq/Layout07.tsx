import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Accent rail FAQ */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <div key={item.question} style={{ display: 'flex', gap: '1rem', marginBottom: '1.15rem' }}>
            <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
            <div>
              <strong>{item.question}</strong>
              <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
