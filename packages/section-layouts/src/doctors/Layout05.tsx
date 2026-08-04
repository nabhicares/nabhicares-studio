import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** Featured first doctor large + others compact */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  const [lead, ...rest] = c.doctors ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {lead ? (
            <article style={{ ...surfaceStyle, padding: '1.5rem', gridColumn: 'span 1' }}>
              <div style={{ height: 200, borderRadius: 'var(--radius-button)', overflow: 'hidden', marginBottom: '1rem', background: placeholderGradient }}>
                {lead.image ? <img src={lead.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <h3 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-display)' }}>{lead.name}</h3>
              <p style={{ ...mutedStyle, margin: 0 }}>{lead.specialty}</p>
              {lead.bio ? <p style={{ marginTop: '0.75rem' }}>{lead.bio}</p> : null}
            </article>
          ) : null}
          <div style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}>
            {rest.map((d) => (
              <div key={d.name} style={cardStyle}>
                <strong>{d.name}</strong>
                <div style={mutedStyle}>{d.specialty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
