/**
 * Generate hero Layout01–10. Run: node scripts/generate-hero.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src', 'hero');
fs.mkdirSync(dir, { recursive: true });

const header = `import type { LayoutProps } from '../types';
import {
  accentBarStyle,
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  cardStyle,
  containerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeHero } from '../content';

`;

const bodies = [
  `/** Split ~35/65 — text left, image right */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 'min(70vh, 640px)',
      }}
    >
      <div
        style={{
          flex: '1 1 320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-section-y) 1.75rem',
          background: 'color-mix(in srgb, var(--color-surface) 40%, var(--color-bg))',
          borderRight: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
        }}
      >
        <div style={{ maxWidth: 420, marginLeft: 'auto', width: '100%' }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', marginBottom: '1rem' }}>
            {c.title}
          </h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            {c.ctaPrimary ? (
              <a href="#" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div
        style={{
          flex: '1.6 1 360px',
          minHeight: 280,
          background: c.image ? undefined : placeholderGradient,
          backgroundImage: c.image ? \`url(\${c.image})\` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </section>
  );
}
`,
  `/** Full-bleed centered overlay */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        minHeight: 'min(72vh, 680px)',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        background: c.image ? undefined : placeholderGradient,
        backgroundImage: c.image
          ? \`linear-gradient(color-mix(in srgb, var(--color-fg) 45%, transparent), color-mix(in srgb, var(--color-fg) 45%, transparent)), url(\${c.image})\`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
      }}
    >
      <div style={{ ...containerStyle, textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 720 }}>
        <h1 style={{ ...titleStyle, color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>{c.title}</h1>
        <p style={{ ...bodyStyle, color: 'rgba(255,255,255,0.88)', margin: '0 auto 1.5rem', maxWidth: '36rem' }}>
          {c.body}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {c.ctaPrimary ? (
            <a href="#" style={buttonPrimaryStyle}>
              {c.ctaPrimary}
            </a>
          ) : null}
          {c.ctaSecondary ? (
            <a href="#" style={{ ...buttonGhostStyle, borderColor: 'rgba(255,255,255,0.45)', color: '#fff' }}>
              {c.ctaSecondary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
`,
  `/** Image left / text right */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap-reverse',
        minHeight: 'min(68vh, 620px)',
      }}
    >
      <div
        style={{
          flex: '1.4 1 340px',
          minHeight: 260,
          background: c.image ? undefined : placeholderGradient,
          backgroundImage: c.image ? \`url(\${c.image})\` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          flex: '1 1 320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-section-y) 1.75rem',
        }}
      >
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)' }}>{c.title}</h1>
        <p style={bodyStyle}>{c.body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {c.ctaPrimary ? (
            <a href="#" style={buttonPrimaryStyle}>
              {c.ctaPrimary}
            </a>
          ) : null}
          {c.ctaSecondary ? (
            <a href="#" style={buttonGhostStyle}>
              {c.ctaSecondary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
`,
  `/** Stacked editorial — copy then wide image band */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, marginBottom: '1.75rem' }}>
        <h1 style={{ ...titleStyle, fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '18ch' }}>{c.title}</h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ ...bodyStyle, margin: 0 }}>{c.body}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            {c.ctaPrimary ? (
              <a href="#" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ ...wideContainerStyle, ...surfaceStyle, overflow: 'hidden', height: 'clamp(200px, 32vw, 360px)' }}>
        {c.image ? (
          <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
        )}
      </div>
    </section>
  );
}
`,
  `/** Minimal centered — no image */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={{ ...sectionBaseStyle, minHeight: 'min(56vh, 520px)', display: 'grid', placeItems: 'center' }}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <div
          style={{
            width: 48,
            height: 3,
            background: 'var(--color-accent)',
            margin: '0 auto 1.25rem',
            borderRadius: 2,
          }}
        />
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)' }}>{c.title}</h1>
        <p style={{ ...bodyStyle, margin: '0 auto 1.5rem' }}>{c.body}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {c.ctaPrimary ? (
            <a href="#" style={buttonPrimaryStyle}>
              {c.ctaPrimary}
            </a>
          ) : null}
          {c.ctaSecondary ? (
            <a href="#" style={buttonGhostStyle}>
              {c.ctaSecondary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
`,
  `/** Asymmetric bento */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 320 }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto' }}>
            {c.ctaPrimary ? (
              <a href="#" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 320 }}>
          {c.image ? (
            <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
          )}
        </div>
        <div
          style={{
            background: 'var(--color-accent)',
            borderRadius: 'calc(var(--radius-button) + 4px)',
            minHeight: 120,
            display: 'grid',
            placeItems: 'center',
            padding: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--color-fg)',
          }}
        >
          Trusted care
        </div>
      </div>
    </section>
  );
}
`,
  `/** Side accent bar + split */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
        <div style={{ ...accentBarStyle, width: 6, alignSelf: 'stretch', minHeight: 200 }} />
        <div
          style={{
            flex: 1,
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ ...titleStyle, fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>{c.title}</h1>
            <p style={bodyStyle}>{c.body}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {c.ctaPrimary ? (
                <a href="#" style={buttonPrimaryStyle}>
                  {c.ctaPrimary}
                </a>
              ) : null}
              {c.ctaSecondary ? (
                <a href="#" style={buttonGhostStyle}>
                  {c.ctaSecondary}
                </a>
              ) : null}
            </div>
          </div>
          <div style={{ ...surfaceStyle, overflow: 'hidden', aspectRatio: '5 / 4', minHeight: 220 }}>
            {c.image ? (
              <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  `/** Eyebrow + image with CTA strip */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 35%, var(--color-bg))',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <div>
          <p
            style={{
              ...mutedStyle,
              margin: '0 0 0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Hospital care
          </p>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
        </div>
        <div>
          <div style={{ ...surfaceStyle, overflow: 'hidden', aspectRatio: '16 / 10', marginBottom: '1rem' }}>
            {c.image ? (
              <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {c.ctaPrimary ? (
              <a href="#" style={{ ...buttonPrimaryStyle, flex: '1 1 140px' }}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={{ ...buttonGhostStyle, flex: '1 1 140px' }}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  `/** Dense clinical — headline / body split, full-bleed image */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={{ ...sectionBaseStyle, paddingBottom: 0 }}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', margin: 0 }}>{c.title}</h1>
        <div>
          <p style={{ ...bodyStyle, marginBottom: '1.25rem' }}>{c.body}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {c.ctaPrimary ? (
              <a href="#" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: 'clamp(180px, 28vw, 320px)',
          background: c.image ? undefined : placeholderGradient,
          backgroundImage: c.image ? \`url(\${c.image})\` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </section>
  );
}
`,
  `/** Floating card on soft surface */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 50%, var(--color-bg))',
        display: 'grid',
        placeItems: 'center',
        minHeight: 'min(64vh, 600px)',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 0,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          ...cardStyle,
          padding: 0,
          overflow: 'hidden',
          maxWidth: 960,
        }}
      >
        <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.6rem, 3vw, 2.35rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {c.ctaPrimary ? (
              <a href="#" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
        <div
          style={{
            minHeight: 260,
            background: c.image ? undefined : placeholderGradient,
            backgroundImage: c.image ? \`url(\${c.image})\` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </section>
  );
}
`,
];

for (let i = 0; i < bodies.length; i++) {
  const n = String(i + 1).padStart(2, '0');
  fs.writeFileSync(path.join(dir, `Layout${n}.tsx`), header + bodies[i], 'utf8');
}

fs.writeFileSync(
  path.join(dir, 'index.ts'),
  `import { Layout01 } from './Layout01';
import { Layout02 } from './Layout02';
import { Layout03 } from './Layout03';
import { Layout04 } from './Layout04';
import { Layout05 } from './Layout05';
import { Layout06 } from './Layout06';
import { Layout07 } from './Layout07';
import { Layout08 } from './Layout08';
import { Layout09 } from './Layout09';
import { Layout10 } from './Layout10';
import type { LayoutComponent } from '../types';

export const layouts: Record<number, LayoutComponent> = {
  1: Layout01,
  2: Layout02,
  3: Layout03,
  4: Layout04,
  5: Layout05,
  6: Layout06,
  7: Layout07,
  8: Layout08,
  9: Layout09,
  10: Layout10,
};

export function getLayout(version: number): LayoutComponent | undefined {
  return layouts[version];
}
`,
  'utf8',
);

console.log('Wrote hero Layout01–10');
