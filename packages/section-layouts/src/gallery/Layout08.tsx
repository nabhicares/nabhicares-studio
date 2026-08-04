import type { LayoutProps } from '../types';
import {
  bodyStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeGallery } from '../content';

/** Overlapping collage */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const imgs = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ position: 'relative', height: 320, maxWidth: 700, margin: '0 auto' }}>
          {imgs.slice(0, 3).map((img, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...surfaceStyle,
              overflow: 'hidden',
              width: i === 0 ? '58%' : '42%',
              height: i === 0 ? '70%' : '55%',
              left: i === 0 ? '0%' : i === 1 ? '48%' : '28%',
              top: i === 0 ? '0%' : i === 1 ? '8%' : '42%',
              zIndex: i + 1,
            }}>
              {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
