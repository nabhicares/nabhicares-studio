import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Q label chips */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.items ?? []).map((item) => (
            <article key={item.question} style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'auto 1fr', alignItems: 'start' }}>
              <span style={{ background: 'var(--color-accent)', color: 'var(--color-fg)', fontWeight: 700, fontSize: '0.75rem', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-button)' }}>Q</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{item.question}</h3>
                <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
