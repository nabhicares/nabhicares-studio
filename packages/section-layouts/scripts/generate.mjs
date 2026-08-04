/**
 * One-shot generator for section layout components.
 * Run: node packages/section-layouts/scripts/generate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');

function write(rel, contents) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents.replace(/\r?\n/g, '\n'), 'utf8');
}

write('package.json', `{
  "name": "@nabhicares/section-layouts",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "peerDependencies": { "react": "^18.3.1", "react-dom": "^18.3.1" },
  "devDependencies": { "@types/react": "^18.3.3", "typescript": "^5.5.0" }
}
`);

write('src/types.ts', `export type AboutHighlight = { label: string; text: string };

export type AboutContent = {
  title: string;
  body: string;
  image?: string;
  highlights?: AboutHighlight[];
};

export type DoctorItem = {
  name: string;
  specialty: string;
  bio?: string;
  image?: string;
};

export type DoctorsContent = {
  title: string;
  body?: string;
  doctors?: DoctorItem[];
};

export type ServiceItem = {
  title: string;
  description?: string;
  icon?: string;
};

export type ServicesContent = {
  title: string;
  body?: string;
  items?: ServiceItem[] | string[];
};

export type GalleryImage = {
  src: string;
  caption?: string;
};

export type GalleryContent = {
  title: string;
  body?: string;
  images?: GalleryImage[];
  /** Studio may store URLs as string[] under items */
  items?: string[] | GalleryImage[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  title: string;
  body?: string;
  items?: FaqItem[];
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
  image?: string;
};

export type TestimonialsContent = {
  title: string;
  body?: string;
  items?: TestimonialItem[];
};

export type SectionContent =
  | AboutContent
  | DoctorsContent
  | ServicesContent
  | GalleryContent
  | FaqContent
  | TestimonialsContent;

export type LayoutProps = { content: Record<string, unknown> };

export type LayoutComponent = (props: LayoutProps) => JSX.Element;
`);

write('src/styles.ts', `import type { CSSProperties } from 'react';

export const sectionBaseStyle: CSSProperties = {
  background: 'var(--color-bg)',
  color: 'var(--color-fg)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-base)',
  padding: 'var(--space-section-y) 1.5rem',
  boxSizing: 'border-box',
  width: '100%',
};

export const containerStyle: CSSProperties = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  width: '100%',
};

export const wideContainerStyle: CSSProperties = {
  maxWidth: 'min(1100px, var(--content-max, 1100px))',
  margin: '0 auto',
  width: '100%',
};

export const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  margin: '0 0 0.75rem',
  color: 'var(--color-fg)',
  lineHeight: 1.2,
};

export const bodyStyle: CSSProperties = {
  margin: '0 0 1.25rem',
  color: 'var(--color-muted)',
  lineHeight: 1.65,
  maxWidth: '42rem',
};

export const buttonPrimaryStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-accent)',
  color: 'var(--color-fg)',
  border: 'none',
  borderRadius: 'var(--radius-button)',
  padding: '0.7rem 1.25rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
};

export const buttonGhostStyle: CSSProperties = {
  ...buttonPrimaryStyle,
  background: 'transparent',
  border: '1px solid color-mix(in srgb, var(--color-fg) 18%, transparent)',
};

export const surfaceStyle: CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'calc(var(--radius-button) + 4px)',
};

export const cardStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))',
  borderRadius: 'calc(var(--radius-button) + 2px)',
  border: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
  padding: '1.25rem',
};

export const mutedStyle: CSSProperties = {
  color: 'var(--color-muted)',
};

export const accentBarStyle: CSSProperties = {
  width: '3px',
  background: 'var(--color-accent)',
  borderRadius: '2px',
  flexShrink: 0,
};

export const placeholderGradient =
  'linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 80%, var(--color-accent)), color-mix(in srgb, var(--color-muted) 35%, var(--color-bg)))';
`);

write('src/content.ts', `import type {
  AboutContent,
  DoctorsContent,
  FaqContent,
  GalleryContent,
  GalleryImage,
  ServiceItem,
  ServicesContent,
  TestimonialsContent,
} from './types';

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function normalizeAbout(raw: Record<string, unknown>): AboutContent {
  const highlights = arr<Record<string, unknown>>(raw.highlights)
    .map((h) => ({ label: str(h.label, 'Highlight'), text: str(h.text) }))
    .filter((h) => h.text);
  return {
    title: str(raw.title, 'About us'),
    body: str(raw.body, 'We provide compassionate, modern care for every patient.'),
    image: str(raw.image) || undefined,
    highlights: highlights.length ? highlights : undefined,
  };
}

export function normalizeDoctors(raw: Record<string, unknown>): DoctorsContent {
  const doctors = arr<Record<string, unknown>>(raw.doctors).map((d) => ({
    name: str(d.name, 'Doctor'),
    specialty: str(d.specialty, 'General medicine'),
    bio: str(d.bio) || undefined,
    image: str(d.image) || undefined,
  }));
  return {
    title: str(raw.title, 'Our doctors'),
    body: str(raw.body) || undefined,
    doctors: doctors.length
      ? doctors
      : [
          { name: 'Dr. Asha Patel', specialty: 'Internal medicine' },
          { name: 'Dr. James Okonkwo', specialty: 'Cardiology' },
          { name: 'Dr. Mei Chen', specialty: 'Pediatrics' },
        ],
  };
}

export function normalizeServices(raw: Record<string, unknown>): ServicesContent {
  const rawItems = arr<unknown>(raw.items);
  const items: ServiceItem[] = rawItems.map((item) => {
    if (typeof item === 'string') return { title: item };
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      title: str(o.title, 'Service'),
      description: str(o.description) || undefined,
      icon: str(o.icon) || undefined,
    };
  });
  return {
    title: str(raw.title, 'Our services'),
    body: str(raw.body) || undefined,
    items: items.length
      ? items
      : [
          { title: 'Emergency care', description: '24/7 trauma and urgent care.' },
          { title: 'Diagnostics', description: 'Imaging and lab services.' },
          { title: 'Outpatient clinics', description: 'Specialist consultations.' },
        ],
  };
}

export function normalizeGallery(raw: Record<string, unknown>): GalleryContent {
  const fromImages = arr<Record<string, unknown>>(raw.images).map((img) => ({
    src: str(img.src),
    caption: str(img.caption) || undefined,
  }));
  const fromItems = arr<unknown>(raw.items).map((item): GalleryImage => {
    if (typeof item === 'string') return { src: item };
    const o = (item ?? {}) as Record<string, unknown>;
    return { src: str(o.src), caption: str(o.caption) || undefined };
  });
  const images = (fromImages.length ? fromImages : fromItems).filter((i) => i.src);
  return {
    title: str(raw.title, 'Gallery'),
    body: str(raw.body) || undefined,
    images: images.length
      ? images
      : [{ src: '' }, { src: '' }, { src: '' }, { src: '' }],
  };
}

export function normalizeFaq(raw: Record<string, unknown>): FaqContent {
  const items = arr<Record<string, unknown>>(raw.items).map((i) => ({
    question: str(i.question, 'Question'),
    answer: str(i.answer, 'Answer coming soon.'),
  }));
  return {
    title: str(raw.title, 'Frequently asked questions'),
    body: str(raw.body) || undefined,
    items: items.length
      ? items
      : [
          { question: 'Do I need an appointment?', answer: 'Walk-ins are welcome; appointments reduce wait time.' },
          { question: 'What insurance do you accept?', answer: 'We work with most major plans — call to confirm yours.' },
          { question: 'Where can I park?', answer: 'Visitor parking is available in Lot B next to the main entrance.' },
        ],
  };
}

export function normalizeTestimonials(raw: Record<string, unknown>): TestimonialsContent {
  const items = arr<Record<string, unknown>>(raw.items).map((i) => ({
    quote: str(i.quote, 'Excellent care from start to finish.'),
    author: str(i.author, 'Patient'),
    role: str(i.role) || undefined,
    image: str(i.image) || undefined,
  }));
  return {
    title: str(raw.title, 'Patient stories'),
    body: str(raw.body) || undefined,
    items: items.length
      ? items
      : [
          { quote: 'The team made a stressful visit feel calm and clear.', author: 'R. Mehta', role: 'Outpatient' },
          { quote: 'Doctors explained every step and followed up after discharge.', author: 'S. Alvarez', role: 'Surgery' },
          { quote: 'Clean facilities and kind staff — we felt looked after.', author: 'K. Singh', role: 'Maternity' },
        ],
  };
}
`);

const sharedImports = `import type { CSSProperties } from 'react';
import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';`;

function mediaBox(srcExpr, extra = '') {
  return `{${srcExpr} ? (
        <img src={${srcExpr}} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block'${extra} }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}`;
}

// ---- ABOUT layouts ----
const aboutLayouts = {
  '01': `${sharedImports}
import { normalizeAbout } from '../content';

/** Split: text left, image right */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'center' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={bodyStyle}>{c.body}</p>
          {c.highlights?.length ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              {c.highlights.map((h) => (
                <li key={h.label} style={{ ...cardStyle, padding: '0.85rem 1rem' }}>
                  <strong style={{ display: 'block', marginBottom: 4 }}>{h.label}</strong>
                  <span style={mutedStyle}>{h.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 280, aspectRatio: '4 / 3' }}>
          ${mediaBox('c.image')}
        </div>
      </div>
    </section>
  );
}
`,
  '02': `${sharedImports}
import { normalizeAbout } from '../content';

/** Centered stack with optional image below */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <h2 style={{ ...titleStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.title}</h2>
        <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p>
        <div style={{ ...surfaceStyle, overflow: 'hidden', maxWidth: 640, margin: '0 auto', minHeight: 220 }}>
          ${mediaBox('c.image')}
        </div>
      </div>
    </section>
  );
}
`,
  '03': `${sharedImports}
import { normalizeAbout } from '../content';

/** Image first, then text + highlight cards */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights?.length
    ? c.highlights
    : [
        { label: 'Mission', text: 'Patient-first care every day.' },
        { label: 'Team', text: 'Specialists across key disciplines.' },
        { label: 'Facility', text: 'Modern diagnostics on site.' },
      ];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 200, marginBottom: '1.75rem' }}>
          ${mediaBox('c.image')}
        </div>
        <h2 style={titleStyle}>{c.title}</h2>
        <p style={bodyStyle}>{c.body}</p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {highlights.map((h) => (
            <div key={h.label} style={cardStyle}>
              <div style={{ width: 28, height: 4, background: 'var(--color-accent)', marginBottom: 10, borderRadius: 2 }} />
              <strong>{h.label}</strong>
              <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '04': `${sharedImports}
import { normalizeAbout } from '../content';

/** Narrow editorial column */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 560 }}>
        <p style={{ ...mutedStyle, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', margin: '0 0 0.5rem' }}>About</p>
        <h2 style={titleStyle}>{c.title}</h2>
        <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p>
        {c.highlights?.map((h) => (
          <p key={h.label} style={{ margin: '0 0 0.75rem' }}>
            <strong>{h.label}: </strong>
            <span style={mutedStyle}>{h.text}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
`,
  '05': `${sharedImports}
import { normalizeAbout } from '../content';

/** Asymmetric: large image left, sticky-feel text right */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '1.5rem', gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start' }}>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 320 }}>
          ${mediaBox('c.image')}
        </div>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p>
        </div>
      </div>
    </section>
  );
}
`,
  '06': `${sharedImports}
import { normalizeAbout } from '../content';

/** Surface panel with inset content */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, ...surfaceStyle, padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', alignItems: 'center' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p>
        </div>
        <div style={{ borderRadius: 'calc(var(--radius-button) + 2px)', overflow: 'hidden', minHeight: 220, background: 'var(--color-bg)' }}>
          ${mediaBox('c.image')}
        </div>
      </div>
    </section>
  );
}
`,
  '07': `${sharedImports}
import { normalizeAbout } from '../content';

/** Accent bar + two-column highlights */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1.25rem' }}>
        <div style={{ width: 4, background: 'var(--color-accent)', borderRadius: 2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={bodyStyle}>{c.body}</p>
          {highlights.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {highlights.map((h) => (
                <div key={h.label}>
                  <strong>{h.label}</strong>
                  <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{h.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
`,
  '08': `${sharedImports}
import { normalizeAbout } from '../content';

/** Overlapping visual: image strip + floating text card */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={{ ...sectionBaseStyle, paddingBottom: 'calc(var(--space-section-y) + 2rem)' }}>
      <div style={{ ...wideContainerStyle, position: 'relative' }}>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 240, maxHeight: 320 }}>
          ${mediaBox('c.image')}
        </div>
        <div style={{ ...cardStyle, maxWidth: 480, margin: '-3rem 1.5rem 0 auto', position: 'relative', boxShadow: '0 12px 40px color-mix(in srgb, var(--color-fg) 12%, transparent)' }}>
          <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>{c.title}</h2>
          <p style={{ ...bodyStyle, marginBottom: 0, maxWidth: 'none' }}>{c.body}</p>
        </div>
      </div>
    </section>
  );
}
`,
  '09': `${sharedImports}
import { normalizeAbout } from '../content';

/** Horizontal highlight strip under title */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  const highlights = c.highlights?.length
    ? c.highlights
    : [
        { label: 'Years', text: 'Trusted care' },
        { label: 'Staff', text: 'Dedicated team' },
        { label: 'Patients', text: 'Community first' },
      ];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={titleStyle}>{c.title}</h2>
            <p style={{ ...bodyStyle, marginBottom: 0 }}>{c.body}</p>
          </div>
          <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 160 }}>
            ${mediaBox('c.image')}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)', paddingTop: '1.25rem' }}>
          {highlights.map((h) => (
            <div key={h.label} style={{ flex: '1 1 140px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{h.label}</div>
              <div style={mutedStyle}>{h.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '10': `${sharedImports}
import { normalizeAbout } from '../content';

/** Minimal: title + body only, full-bleed surface band */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={{ ...containerStyle, display: 'grid', gap: '1rem' }}>
        <h2 style={{ ...titleStyle, marginBottom: 0 }}>{c.title}</h2>
        <p style={{ ...bodyStyle, marginBottom: 0, maxWidth: '36rem' }}>{c.body}</p>
        {c.image ? (
          <div style={{ marginTop: '0.5rem', borderRadius: 'var(--radius-button)', overflow: 'hidden', maxWidth: 420, maxHeight: 200 }}>
            <img src={c.image} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
`,
};

// ---- DOCTORS ----
const doctorsLayouts = {
  '01': `${sharedImports}
import { normalizeDoctors } from '../content';

/** 3-column card grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {(c.doctors ?? []).map((d) => (
            <article key={d.name} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 160, background: placeholderGradient }}>
                {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{d.name}</h3>
                <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem' }}>{d.specialty}</p>
                {d.bio ? <p style={{ ...mutedStyle, margin: '0.6rem 0 0', fontSize: '0.85rem' }}>{d.bio}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '02': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Centered intro + horizontal scroll-friendly row */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
      </div>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: 8 }}>
        {(c.doctors ?? []).map((d) => (
          <article key={d.name} style={{ ...cardStyle, minWidth: 220, flex: '0 0 auto', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 0.75rem', background: placeholderGradient, overflow: 'hidden' }}>
              {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <h3 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{d.name}</h3>
            <p style={{ ...mutedStyle, margin: 0 }}>{d.specialty}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
  '03': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Stacked list rows */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(c.doctors ?? []).map((d) => (
            <li key={d.name} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, background: placeholderGradient, overflow: 'hidden' }}>
                {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <div>
                <strong style={{ fontFamily: 'var(--font-display)' }}>{d.name}</strong>
                <div style={mutedStyle}>{d.specialty}</div>
                {d.bio ? <p style={{ ...mutedStyle, margin: '0.35rem 0 0', fontSize: '0.9rem' }}>{d.bio}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
`,
  '04': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Split: title left, roster right */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.name}</span>
              <span style={{ ...mutedStyle, fontSize: '0.9rem' }}>{d.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '05': `${sharedImports}
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
`,
  '06': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Dense 2-column name/specialty table feel */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem 2rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', padding: '0.75rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)' }}>
              <span style={{ fontWeight: 600 }}>{d.name}</span>
              <span style={mutedStyle}>{d.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '07': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Accent rail list */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.name}</div>
                <div style={mutedStyle}>{d.specialty}</div>
                {d.bio ? <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{d.bio}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '08': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Circular portrait mosaic */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.75rem' }}>
          {(c.doctors ?? []).map((d) => (
            <figure key={d.name} style={{ margin: 0, width: 140 }}>
              <div style={{ width: 110, height: 110, borderRadius: '50%', margin: '0 auto 0.75rem', background: placeholderGradient, overflow: 'hidden', border: '3px solid color-mix(in srgb, var(--color-accent) 50%, transparent)' }}>
                {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <figcaption>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{d.name}</div>
                <div style={{ ...mutedStyle, fontSize: '0.8rem' }}>{d.specialty}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '09': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Surface band with inline chips */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {(c.doctors ?? []).map((d) => (
            <div key={d.name} style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-button)', padding: '0.65rem 1rem' }}>
              <strong>{d.name}</strong>
              <span style={{ ...mutedStyle, marginLeft: 8 }}>{d.specialty}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '10': `${sharedImports}
import { normalizeDoctors } from '../content';

/** Minimal numbered roster */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', counterReset: 'doc' }}>
          {(c.doctors ?? []).map((d) => (
            <li key={d.name} style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr', gap: '0.75rem', padding: '0.85rem 0', borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)', counterIncrement: 'doc' }}>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontWeight: 700 }}>
                {String((c.doctors ?? []).indexOf(d) + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>{d.name}</div>
                <div style={mutedStyle}>{d.specialty}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
`,
};

// ---- SERVICES ----
const servicesLayouts = {
  '01': `${sharedImports}
import { normalizeServices } from '../content';

/** Icon/title cards grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {(c.items as { title: string; description?: string; icon?: string }[]).map((item) => (
            <article key={item.title} style={cardStyle}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent)', marginBottom: 12, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700 }}>
                {item.icon ? item.icon.slice(0, 1) : item.title.slice(0, 1)}
              </div>
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0 }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '02': `${sharedImports}
import { normalizeServices } from '../content';

/** Centered title + simple stacked list */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left', maxWidth: 480, marginInline: 'auto' }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <li key={item.title} style={{ padding: '0.85rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <strong>{item.title}</strong>
              {item.description ? <p style={{ ...mutedStyle, margin: '0.3rem 0 0' }}>{item.description}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
`,
  '03': `${sharedImports}
import { normalizeServices } from '../content';

/** Two-column alternating rows */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {(c.items as { title: string; description?: string }[]).map((item, i) => (
            <article key={item.title} style={{ ...cardStyle, background: i % 2 === 0 ? 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))' : 'var(--color-surface)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0 }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '04': `${sharedImports}
import { normalizeServices } from '../content';

/** Split headline / service list */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <li key={item.title} style={{ marginBottom: '1rem' }}>
              <strong>{item.title}</strong>
              {item.description ? <div style={mutedStyle}>{item.description}</div> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
`,
  '05': `${sharedImports}
import { normalizeServices } from '../content';

/** Large first service + compact rest */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = c.items as { title: string; description?: string }[];
  const [lead, ...rest] = items;
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {lead ? (
            <article style={{ ...surfaceStyle, padding: '1.75rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>{lead.title}</h3>
              {lead.description ? <p style={{ ...mutedStyle, margin: 0 }}>{lead.description}</p> : null}
            </article>
          ) : null}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {rest.map((item) => (
              <div key={item.title} style={cardStyle}>
                <strong>{item.title}</strong>
                {item.description ? <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{item.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  '06': `${sharedImports}
import { normalizeServices } from '../content';

/** Bordered outline cards */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <article key={item.title} style={{ border: '1px solid color-mix(in srgb, var(--color-fg) 14%, transparent)', borderRadius: 'var(--radius-button)', padding: '1.25rem' }}>
              <div style={{ height: 3, width: 32, background: 'var(--color-accent)', marginBottom: 12 }} />
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem' }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '07': `${sharedImports}
import { normalizeServices } from '../content';

/** Accent rail vertical list */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items as { title: string; description?: string }[]).map((item) => (
          <div key={item.title} style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
            <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
            <div>
              <strong style={{ fontFamily: 'var(--font-display)' }}>{item.title}</strong>
              {item.description ? <p style={{ ...mutedStyle, margin: '0.3rem 0 0' }}>{item.description}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  '08': `${sharedImports}
import { normalizeServices } from '../content';

/** Pill / chip cloud of service titles */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
          {(c.items as { title: string }[]).map((item) => (
            <span key={item.title} style={{ ...surfaceStyle, padding: '0.65rem 1.1rem', display: 'inline-block', fontWeight: 600 }}>
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '09': `${sharedImports}
import { normalizeServices } from '../content';

/** Numbered process-style row */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = c.items as { title: string; description?: string }[];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {items.map((item, i) => (
            <article key={item.title}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>{item.title}</h3>
              {item.description ? <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem' }}>{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '10': `${sharedImports}
import { normalizeServices } from '../content';

/** Compact definition list on surface */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeServices(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <dl style={{ margin: 0 }}>
          {(c.items as { title: string; description?: string }[]).map((item) => (
            <div key={item.title} style={{ marginBottom: '1rem' }}>
              <dt style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{item.title}</dt>
              {item.description ? <dd style={{ ...mutedStyle, margin: '0.25rem 0 0' }}>{item.description}</dd> : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
`,
};

// ---- GALLERY ----
const galleryLayouts = {
  '01': `${sharedImports}
import { normalizeGallery } from '../content';

/** Uniform 3-col grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {(c.images ?? []).map((img, i) => (
            <figure key={i} style={{ margin: 0, ...surfaceStyle, overflow: 'hidden', aspectRatio: '1' }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
              {img.caption ? <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }}>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '02': `${sharedImports}
import { normalizeGallery } from '../content';

/** Centered title + wide masonry-ish uneven rows */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
      </div>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '0.75rem', gridTemplateColumns: '2fr 1fr', gridAutoRows: '140px' }}>
        {(c.images ?? []).slice(0, 4).map((img, i) => (
          <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', gridRow: i === 0 ? 'span 2' : 'span 1', minHeight: 120 }}>
            {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  '03': `${sharedImports}
import { normalizeGallery } from '../content';

/** Horizontal strip */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
          {(c.images ?? []).map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', flex: '0 0 240px', height: 160 }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '04': `${sharedImports}
import { normalizeGallery } from '../content';

/** Split: captions list + image stack */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-muted)' }}>
            {(c.images ?? []).map((img, i) => (
              <li key={i}>{img.caption || ('Image ' + (i + 1))}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: '1fr 1fr' }}>
          {(c.images ?? []).slice(0, 4).map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', aspectRatio: '1' }}>
              {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '05': `${sharedImports}
import { normalizeGallery } from '../content';

/** Hero image + thumbnail row */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const [hero, ...rest] = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 260, marginBottom: '0.75rem' }}>
          {hero?.src ? <img src={hero.src} alt={hero.caption ?? ''} style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} /> : <div style={{ height: 280, background: placeholderGradient }} />}
        </div>
        <div style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
          {rest.map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', height: 90 }}>
              {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '06': `${sharedImports}
import { normalizeGallery } from '../content';

/** Framed bordered tiles */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {(c.images ?? []).map((img, i) => (
            <figure key={i} style={{ margin: 0, border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)', borderRadius: 'var(--radius-button)', overflow: 'hidden', padding: 8 }}>
              <div style={{ aspectRatio: '4/3', background: placeholderGradient, overflow: 'hidden', borderRadius: 'calc(var(--radius-button) - 2px)' }}>
                {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              {img.caption ? <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.25rem 0', fontSize: '0.85rem' }}>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '07': `${sharedImports}
import { normalizeGallery } from '../content';

/** Vertical stacked full-width images */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 720 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.images ?? []).slice(0, 3).map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 180 }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }} /> : <div style={{ height: 180, background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '08': `${sharedImports}
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
`,
  '09': `${sharedImports}
import { normalizeGallery } from '../content';

/** Caption-forward list with thumb */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(c.images ?? []).map((img, i) => (
            <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)' }}>
              <div style={{ width: 72, height: 72, ...surfaceStyle, overflow: 'hidden', flexShrink: 0 }}>
                {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
              </div>
              <span>{img.caption || ('Photo ' + (i + 1))}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
`,
  '10': `${sharedImports}
import { normalizeGallery } from '../content';

/** Minimal 2-up pairs on surface */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          {(c.images ?? []).map((img, i) => (
            <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-button)', overflow: 'hidden', aspectRatio: '16/10' }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
};

// ---- FAQ ----
const faqLayouts = {
  '01': `${sharedImports}
import { normalizeFaq } from '../content';

/** Classic stacked Q/A */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {(c.items ?? []).map((item) => (
            <details key={item.question} style={{ ...cardStyle }} open>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-display)', listStyle: 'none' }}>{item.question}</summary>
              <p style={{ ...mutedStyle, margin: '0.65rem 0 0' }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '02': `${sharedImports}
import { normalizeFaq } from '../content';

/** Centered narrow accordion */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 560, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ textAlign: 'left' }}>
          {(c.items ?? []).map((item) => (
            <div key={item.question} style={{ padding: '1rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{item.question}</h3>
              <p style={{ ...mutedStyle, margin: 0 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '03': `${sharedImports}
import { normalizeFaq } from '../content';

/** Two-column FAQ grid */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {(c.items ?? []).map((item) => (
            <article key={item.question} style={cardStyle}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{item.question}</h3>
              <p style={{ ...mutedStyle, margin: 0 }}>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '04': `${sharedImports}
import { normalizeFaq } from '../content';

/** Split intro + list */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <div>
          {(c.items ?? []).map((item) => (
            <div key={item.question} style={{ marginBottom: '1.25rem' }}>
              <strong>{item.question}</strong>
              <p style={{ ...mutedStyle, margin: '0.35rem 0 0' }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '05': `${sharedImports}
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
`,
  '06': `${sharedImports}
import { normalizeFaq } from '../content';

/** Surface panel FAQ */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeFaq(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, ...surfaceStyle, padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <div key={item.question} style={{ padding: '1rem 0', borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
            <strong style={{ fontFamily: 'var(--font-display)' }}>{item.question}</strong>
            <p style={{ ...mutedStyle, margin: '0.4rem 0 0' }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  '07': `${sharedImports}
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
`,
  '08': `${sharedImports}
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
`,
  '09': `${sharedImports}
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
`,
  '10': `${sharedImports}
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
`,
};

// ---- TESTIMONIALS ----
const testimonialsLayouts = {
  '01': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Quote cards grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author + item.quote.slice(0, 12)} style={{ ...cardStyle, margin: 0 }}>
              <p style={{ margin: '0 0 1rem', fontStyle: 'italic', lineHeight: 1.55 }}>&ldquo;{item.quote}&rdquo;</p>
              <footer style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: placeholderGradient, overflow: 'hidden', flexShrink: 0 }}>
                  {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.author}</div>
                  {item.role ? <div style={{ ...mutedStyle, fontSize: '0.85rem' }}>{item.role}</div> : null}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '02': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Balanced centered card grid (Stitch-inspired) */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, textAlign: 'center' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', textAlign: 'left' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author + item.quote.slice(0, 8)} style={{ ...surfaceStyle, margin: 0, padding: '1.5rem' }}>
              <p style={{ margin: '0 0 1.25rem', lineHeight: 1.6 }}>&ldquo;{item.quote}&rdquo;</p>
              <cite style={{ fontStyle: 'normal', fontWeight: 600 }}>{item.author}</cite>
              {item.role ? <div style={{ ...mutedStyle, fontSize: '0.85rem', marginTop: 2 }}>{item.role}</div> : null}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '03': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Single-column stacked quotes */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <blockquote key={item.author} style={{ margin: '0 0 1.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--color-accent)' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>&ldquo;{item.quote}&rdquo;</p>
            <footer style={mutedStyle}>— {item.author}{item.role ? (', ' + item.role) : ''}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
`,
  '04': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Split: title left, quotes right */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author} style={{ ...cardStyle, margin: 0 }}>
              <p style={{ margin: '0 0 0.65rem' }}>&ldquo;{item.quote}&rdquo;</p>
              <strong>{item.author}</strong>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '05': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Featured lead quote + smaller supporting */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const [lead, ...rest] = c.items ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {lead ? (
            <blockquote style={{ ...surfaceStyle, margin: 0, padding: '2rem' }}>
              <p style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontFamily: 'var(--font-display)', lineHeight: 1.4 }}>&ldquo;{lead.quote}&rdquo;</p>
              <strong>{lead.author}</strong>
              {lead.role ? <div style={mutedStyle}>{lead.role}</div> : null}
            </blockquote>
          ) : null}
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {rest.map((item) => (
              <blockquote key={item.author} style={{ ...cardStyle, margin: 0 }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>&ldquo;{item.quote}&rdquo;</p>
                <strong style={{ fontSize: '0.9rem' }}>{item.author}</strong>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  '06': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Avatar row testimonials */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {(c.items ?? []).map((item) => (
            <figure key={item.author} style={{ margin: 0, flex: '1 1 200px', maxWidth: 280, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 0.75rem', background: placeholderGradient, overflow: 'hidden' }}>
                {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <blockquote style={{ margin: '0 0 0.5rem', fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption style={{ fontWeight: 600 }}>{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  '07': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Accent rail quotes */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {(c.items ?? []).map((item) => (
          <div key={item.author} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 3, background: 'var(--color-accent)', borderRadius: 2 }} />
            <blockquote style={{ margin: 0 }}>
              <p style={{ margin: '0 0 0.4rem' }}>{item.quote}</p>
              <footer style={mutedStyle}>{item.author}{item.role ? (' · ' + item.role) : ''}</footer>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  '08': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Large pull-quote carousel feel (static first 3) */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const item = (c.items ?? [])[0];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', maxWidth: 720 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
        {item ? (
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: 1.35, margin: '0 0 1.25rem' }}>
              &ldquo;{item.quote}&rdquo;
            </p>
            <cite style={{ fontStyle: 'normal', fontWeight: 600 }}>{item.author}</cite>
            {item.role ? <div style={mutedStyle}>{item.role}</div> : null}
          </blockquote>
        ) : null}
        {(c.items ?? []).length > 1 ? (
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            {(c.items ?? []).map((_, i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-fg) 20%, transparent)' }} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
`,
  '09': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Dense quote list */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 640 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(c.items ?? []).map((item) => (
            <li key={item.author} style={{ padding: '0.85rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)' }}>
              <div style={{ fontStyle: 'italic' }}>&ldquo;{item.quote}&rdquo;</div>
              <div style={{ ...mutedStyle, marginTop: 4, fontSize: '0.9rem' }}>{item.author}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
`,
  '10': `${sharedImports}
import { normalizeTestimonials } from '../content';

/** Surface band with inline quotes */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(c.items ?? []).map((item) => (
            <blockquote key={item.author} style={{ margin: 0, background: 'var(--color-bg)', borderRadius: 'var(--radius-button)', padding: '1.15rem' }}>
              <p style={{ margin: '0 0 0.65rem' }}>&ldquo;{item.quote}&rdquo;</p>
              <strong>{item.author}</strong>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function writeSection(name, layouts) {
  const dir = `src/${name}`;
  for (let i = 1; i <= 10; i++) {
    const key = pad(i);
    const body = layouts[key];
    if (!body) throw new Error(`Missing ${name} layout ${key}`);
    write(`${dir}/Layout${key}.tsx`, body.trimStart());
  }
  const imports = Array.from({ length: 10 }, (_, i) => {
    const k = pad(i + 1);
    return `import { Layout${k} } from './Layout${k}';`;
  }).join('\n');
  const mapEntries = Array.from({ length: 10 }, (_, i) => {
    const k = pad(i + 1);
    return `  ${i + 1}: Layout${k},`;
  }).join('\n');
  write(
    `${dir}/index.ts`,
    `${imports}
import type { LayoutComponent } from '../types';

export const layouts: Record<number, LayoutComponent> = {
${mapEntries}
};

export function getLayout(version: number): LayoutComponent | undefined {
  return layouts[version];
}
`,
  );
}

writeSection('about', aboutLayouts);
writeSection('doctors', doctorsLayouts);
writeSection('services', servicesLayouts);
writeSection('gallery', galleryLayouts);
writeSection('faq', faqLayouts);
writeSection('testimonials', testimonialsLayouts);

write(
  'src/registry.tsx',
  `import type { LayoutComponent } from './types';
import { layouts as about } from './about';
import { layouts as doctors } from './doctors';
import { layouts as services } from './services';
import { layouts as gallery } from './gallery';
import { layouts as faq } from './faq';
import { layouts as testimonials } from './testimonials';

const REGISTRY: Record<string, Record<number, LayoutComponent>> = {
  about,
  doctors,
  services,
  gallery,
  faq,
  testimonials,
};

function Fallback({ content }: { content: Record<string, unknown> }) {
  const title = typeof content.title === 'string' ? content.title : 'Section';
  return (
    <section style={{ padding: 'var(--space-section-y) 1.5rem', color: 'var(--color-fg)', background: 'var(--color-bg)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
    </section>
  );
}

/** Resolve section type + layout version (1–10) to a React component. */
export function resolveLayout(type: string, version: number): LayoutComponent {
  const map = REGISTRY[type];
  if (!map) return Fallback;
  return map[version] ?? map[1] ?? Fallback;
}

export const SECTION_LAYOUT_TYPES = Object.keys(REGISTRY);
`,
);

write(
  'src/index.ts',
  `export { resolveLayout, SECTION_LAYOUT_TYPES } from './registry';
export type {
  AboutContent,
  DoctorsContent,
  ServicesContent,
  GalleryContent,
  FaqContent,
  TestimonialsContent,
  LayoutProps,
  LayoutComponent,
  SectionContent,
} from './types';
export {
  sectionBaseStyle,
  buttonPrimaryStyle,
  buttonGhostStyle,
  containerStyle,
  titleStyle,
  bodyStyle,
} from './styles';
`,
);

console.log('Generated @nabhicares/section-layouts');
