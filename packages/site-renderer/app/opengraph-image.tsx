import { ImageResponse } from 'next/og';
import { loadSiteData } from '@/lib/site-data';

export const alt = 'Hospital';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Auto share-card image for WhatsApp / Meta / Twitter (static export). */
export default function OpenGraphImage() {
  const site = loadSiteData();
  const title = (site.seoTitle?.trim() || site.hospitalName).slice(0, 80);
  const subtitle = (
    site.seoDescription?.trim() ||
    `${site.hospitalName} — care you can trust`
  ).slice(0, 140);
  const accent = site.designTokens?.colors?.accent || '#1F7A6C';
  const bg = site.designTokens?.colors?.background || '#F3F1EC';
  const fg = site.designTokens?.colors?.foreground || '#0F1C1A';
  const muted = site.designTokens?.colors?.muted || '#5C6B67';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: `radial-gradient(120% 90% at 0% 0%, ${accent}33 0%, transparent 55%), ${bg}`,
          color: fg,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          {site.hospitalName}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 48 ? 52 : 64,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.4,
              color: muted,
              maxWidth: 920,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 24,
            color: muted,
          }}
        >
          <span>Hospital website</span>
          <span
            style={{
              display: 'flex',
              padding: '12px 22px',
              borderRadius: 999,
              background: accent,
              color: bg,
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Visit site
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
