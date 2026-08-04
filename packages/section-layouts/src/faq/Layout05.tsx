import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Numbered FAQ */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item, i) => (
          <div key={item.question} style={{ display: 'grid', gridTemplateColumns: '3rem 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem' }}>{item.question}</h3>
              <p style={{ ...mutedStyle, margin: 0 }}>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
