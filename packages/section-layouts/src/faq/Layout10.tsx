import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Minimal inverted surface band */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <div key={item.question} style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-button)', padding: '1rem 1.15rem', marginBottom: '0.65rem' }}>
            <strong>{item.question}</strong>
            <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
