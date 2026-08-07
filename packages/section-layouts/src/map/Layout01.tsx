import type { LayoutProps } from '../types';
import {
  bodyStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeMap } from '../content';
import { toMapEmbedSrc } from '../icons';
import { ConsentAwareMap } from '../ConsentAwareMap';

/** Standalone map embed */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeMap(content);
  const embedSrc = toMapEmbedSrc(c.mapUrl, c.address);

  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '1.25rem' }}>
        <div>
          <p style={kickerStyle}>Location</p>
          <h2 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}>{c.title}</h2>
          {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
          {c.address ? <p style={{ ...mutedStyle, marginTop: '0.5rem' }}>{c.address}</p> : null}
        </div>
        {embedSrc ? (
          <div
            style={{
              borderRadius: 'calc(var(--radius-button) + 4px)',
              overflow: 'hidden',
              border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
              minHeight: 320,
              background: 'color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))',
            }}
          >
            <ConsentAwareMap embedSrc={embedSrc} title={c.title || 'Map'} minHeight={360} />
          </div>
        ) : (
          <p style={mutedStyle}>Add a Google Maps URL or address to show the map.</p>
        )}
      </div>
    </section>
  );
}
