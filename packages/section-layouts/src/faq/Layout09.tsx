import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle
} from '../styles';
import { normalizeFaq } from '../content';

/** Compact definition-style */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <dl style={{ margin: 0 }}>
          {(c.items ?? []).map((item) => (
            <div key={item.question} style={{ marginBottom: '1rem' }}>
              <dt style={{ fontWeight: 600 }}>{item.question}</dt>
              <dd style={{ ...mutedStyle, margin: '0.25rem 0 0' }}>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
