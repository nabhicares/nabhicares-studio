/**
 * Section registry — single source of truth for available section types.
 * Studio uses `fields` to generate content editors; site-renderer maps
 * `key` + layout `version` → React components via componentRef.
 *
 * Option A: Template.key = section type, Template.version = layout 1–10.
 * Existing hospital Section rows keep their pinned Template version.
 */

import sanitizeHtml from 'sanitize-html';
import type { FaviconPresetId } from './favicon';

export type FieldType = 'string' | 'text' | 'string[]' | 'object[]';

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  /** object[] item shape — only content fields, never colors/spacing */
  itemFields?: { name: string; label: string; type: 'string' | 'text' }[];
};

export type SectionTypeDef = {
  key: string;
  label: string;
  description: string;
  /** Base ref without layout suffix — use componentRefFor(key, version) */
  componentRef: string;
  fields: FieldDef[];
};

/** Layout variants per section type (Template.version). */
export const LAYOUT_COUNT = 10;

export function componentRefFor(key: string, version: number): string {
  const n = String(Math.min(LAYOUT_COUNT, Math.max(1, version))).padStart(2, '0');
  return `sections/${key}/layout-${n}`;
}

export const SECTION_REGISTRY: SectionTypeDef[] = [
  {
    key: 'hero',
    label: 'Hero',
    description: 'Primary landing headline, CTAs, and image',
    componentRef: 'sections/hero',
    fields: [
      { name: 'title', label: 'Headline', type: 'string' },
      { name: 'body', label: 'Supporting text', type: 'text' },
      { name: 'ctaPrimary', label: 'Primary CTA', type: 'string' },
      { name: 'ctaSecondary', label: 'Secondary CTA', type: 'string' },
      { name: 'image', label: 'Image URL', type: 'string' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    description: 'Hospital story / mission',
    componentRef: 'sections/about',
    fields: [
      { name: 'title', label: 'Title', type: 'string' },
      { name: 'body', label: 'Body', type: 'text' },
      { name: 'image', label: 'Image URL', type: 'string' },
      {
        name: 'highlights',
        label: 'Highlights',
        type: 'object[]',
        itemFields: [
          { name: 'label', label: 'Label', type: 'string' },
          { name: 'text', label: 'Text', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'doctors',
    label: 'Doctors',
    description: 'Doctor roster',
    componentRef: 'sections/doctors',
    fields: [
      { name: 'title', label: 'Section title', type: 'string' },
      { name: 'body', label: 'Intro', type: 'text' },
      {
        name: 'doctors',
        label: 'Doctors',
        type: 'object[]',
        itemFields: [
          { name: 'name', label: 'Name', type: 'string' },
          { name: 'specialty', label: 'Specialty', type: 'string' },
          { name: 'bio', label: 'Bio', type: 'text' },
          { name: 'image', label: 'Image URL', type: 'string' },
        ],
      },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    description: 'List of clinical services',
    componentRef: 'sections/services',
    fields: [
      { name: 'title', label: 'Section title', type: 'string' },
      { name: 'body', label: 'Intro', type: 'text' },
      {
        name: 'items',
        label: 'Services',
        type: 'object[]',
        itemFields: [
          { name: 'title', label: 'Title', type: 'string' },
          { name: 'description', label: 'Description', type: 'text' },
          { name: 'icon', label: 'Icon (optional)', type: 'string' },
        ],
      },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    description: 'Image gallery',
    componentRef: 'sections/gallery',
    fields: [
      { name: 'title', label: 'Title', type: 'string' },
      { name: 'body', label: 'Intro', type: 'text' },
      {
        name: 'images',
        label: 'Images',
        type: 'object[]',
        itemFields: [
          { name: 'src', label: 'Image URL', type: 'string' },
          { name: 'caption', label: 'Caption', type: 'string' },
        ],
      },
    ],
  },
  {
    key: 'faq',
    label: 'FAQ',
    description: 'Questions and answers',
    componentRef: 'sections/faq',
    fields: [
      { name: 'title', label: 'Title', type: 'string' },
      { name: 'body', label: 'Intro', type: 'text' },
      {
        name: 'items',
        label: 'Q&A',
        type: 'object[]',
        itemFields: [
          { name: 'question', label: 'Question', type: 'string' },
          { name: 'answer', label: 'Answer', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    description: 'Patient quotes',
    componentRef: 'sections/testimonials',
    fields: [
      { name: 'title', label: 'Title', type: 'string' },
      { name: 'body', label: 'Intro', type: 'text' },
      {
        name: 'items',
        label: 'Quotes',
        type: 'object[]',
        itemFields: [
          { name: 'quote', label: 'Quote', type: 'text' },
          { name: 'author', label: 'Author', type: 'string' },
          { name: 'role', label: 'Role', type: 'string' },
          { name: 'image', label: 'Image URL', type: 'string' },
        ],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    description: 'Phone, address, hours, and map link from Maps',
    componentRef: 'sections/contact',
    fields: [
      { name: 'title', label: 'Title', type: 'string' },
      { name: 'body', label: 'Intro', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'string' },
      { name: 'email', label: 'Email', type: 'string' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'hours', label: 'Hours', type: 'text' },
      { name: 'mapUrl', label: 'Google Maps URL', type: 'string' },
      { name: 'ctaPrimary', label: 'Primary CTA', type: 'string' },
    ],
  },
];

export function getSectionType(key: string): SectionTypeDef | undefined {
  return SECTION_REGISTRY.find((s) => s.key === key);
}

/** JSON Schema shape stored on Template.schema — content fields only. */
export function schemaForSection(key: string): object {
  const def = getSectionType(key);
  if (!def) return { type: 'object', properties: {} };
  const properties: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (field.type === 'string' || field.type === 'text') {
      properties[field.name] = { type: 'string', title: field.label };
    } else if (field.type === 'string[]') {
      properties[field.name] = { type: 'array', items: { type: 'string' }, title: field.label };
    } else if (field.type === 'object[]') {
      properties[field.name] = {
        type: 'array',
        title: field.label,
        items: {
          type: 'object',
          properties: Object.fromEntries(
            (field.itemFields ?? []).map((f) => [f.name, { type: 'string', title: f.label }]),
          ),
        },
      };
    }
  }
  return { type: 'object', properties };
}

/** Example content object for a section type — used as paste template. */
export function exampleContentForSection(key: string): Record<string, unknown> {
  switch (key) {
    case 'hero':
      return {
        title: 'Care close to home',
        body: 'Compassionate, modern care for every patient.',
        ctaPrimary: 'Book appointment',
        ctaSecondary: 'Our services',
        image: 'https://example.com/hero.jpg',
      };
    case 'about':
      return {
        title: 'About us',
        body: 'We treat people, not charts.',
        image: 'https://example.com/about.jpg',
        highlights: [{ label: 'Patients', text: '10,000+ served yearly' }],
      };
    case 'doctors':
      return {
        title: 'Our doctors',
        body: 'Meet the care team.',
        doctors: [
          {
            name: 'Dr. Example',
            specialty: 'General Medicine',
            bio: 'Short bio',
            image: 'https://example.com/doctor.jpg',
          },
        ],
      };
    case 'services':
      return {
        title: 'Our services',
        body: 'What we offer.',
        items: [{ title: 'Outpatient care', description: 'Consultations', icon: '' }],
      };
    case 'gallery':
      return {
        title: 'Gallery',
        body: 'A look inside.',
        images: [{ src: 'https://example.com/photo.jpg', caption: 'Lobby' }],
      };
    case 'faq':
      return {
        title: 'Frequently asked questions',
        body: '',
        items: [{ question: 'How do I book?', answer: 'Call the front desk.' }],
      };
    case 'testimonials':
      return {
        title: 'Patient stories',
        body: '',
        items: [
          {
            quote: 'Excellent care from start to finish.',
            author: 'R. Mehta',
            role: 'Outpatient',
            image: '',
          },
        ],
      };
    case 'contact':
      return {
        title: 'Visit us',
        body: 'We are here when you need us.',
        phone: '+91 98765 43210',
        email: 'care@example-hospital.com',
        address: '123 Care Road, Your City, State 560001',
        hours: 'Mon–Sat 8:00–20:00\nEmergency 24/7',
        mapUrl: 'https://maps.google.com/?q=hospital',
        ctaPrimary: 'Get directions',
      };
    default:
      return { title: 'Section' };
  }
}

export type ContentImportResult =
  | { ok: true; content: Record<string, unknown> }
  | { ok: false; error: string };

const META_KEYS = new Set(['__anchor', '__notes']);
const DESIGN_KEYS = new Set([
  'color',
  'colors',
  'spacing',
  'font',
  'typography',
  'radius',
  'radii',
]);

export type SanitizeStringResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * Strip HTML markup from content strings; reject dangerous URL schemes.
 * Gemini sometimes wraps titles in &lt;b&gt; etc. — strip instead of blocking import.
 */
export function sanitizeContentString(
  value: string,
  fieldPath: string,
): SanitizeStringResult {
  const stripped = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  });
  const trimmed = stripped.trim();
  if (/^(?:javascript|vbscript|data\s*:\s*text\/html)/i.test(trimmed)) {
    return { ok: false, error: `"${fieldPath}" has a disallowed URL scheme` };
  }
  return { ok: true, value: stripped };
}

/**
 * Validate + normalize section content for API save / JSON import.
 * Keeps only schema fields + editor meta; sanitizes strings.
 * `strictUnknown` (default true): reject unknown keys. false: strip them.
 */
export function validateSectionContent(
  key: string,
  input: Record<string, unknown>,
  preserve?: Record<string, unknown>,
  opts?: { strictUnknown?: boolean },
): ContentImportResult {
  const strictUnknown = opts?.strictUnknown !== false;
  const def = getSectionType(key);
  if (!def) return { ok: false, error: `Unknown section type: ${key}` };

  for (const k of Object.keys(input)) {
    if (DESIGN_KEYS.has(k.toLowerCase())) {
      return { ok: false, error: `content must not include design token field: ${k}` };
    }
  }

  const content: Record<string, unknown> = {};
  const allowed = new Set(def.fields.map((f) => f.name));
  const unknown = Object.keys(input).filter((k) => !allowed.has(k) && !META_KEYS.has(k));
  if (unknown.length && strictUnknown) {
    return {
      ok: false,
      error: `Unknown fields for ${key}: ${unknown.join(', ')}. Allowed: ${[...allowed].join(', ')}`,
    };
  }

  for (const field of def.fields) {
    if (!(field.name in input)) continue;
    const val = input[field.name];
    if (field.type === 'string' || field.type === 'text') {
      if (typeof val !== 'string') {
        return { ok: false, error: `"${field.name}" must be a string` };
      }
      const clean = sanitizeContentString(val, field.name);
      if (!clean.ok) return clean;
      content[field.name] = clean.value;
    } else if (field.type === 'string[]') {
      if (!Array.isArray(val) || val.some((x) => typeof x !== 'string')) {
        return { ok: false, error: `"${field.name}" must be an array of strings` };
      }
      const out: string[] = [];
      for (let i = 0; i < val.length; i++) {
        const clean = sanitizeContentString(val[i] as string, `${field.name}[${i}]`);
        if (!clean.ok) return clean;
        out.push(clean.value);
      }
      content[field.name] = out;
    } else if (field.type === 'object[]') {
      if (!Array.isArray(val)) {
        return { ok: false, error: `"${field.name}" must be an array of objects` };
      }
      const itemKeys = new Set((field.itemFields ?? []).map((f) => f.name));
      const items: Record<string, string>[] = [];
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          return { ok: false, error: `"${field.name}[${i}]" must be an object` };
        }
        const row = item as Record<string, unknown>;
        const bad = Object.keys(row).filter((k) => !itemKeys.has(k));
        if (bad.length && strictUnknown) {
          return {
            ok: false,
            error: `"${field.name}[${i}]" has unknown keys: ${bad.join(', ')}`,
          };
        }
        const out: Record<string, string> = {};
        for (const sub of field.itemFields ?? []) {
          const v = row[sub.name];
          if (v === undefined) continue;
          if (typeof v !== 'string') {
            return { ok: false, error: `"${field.name}[${i}].${sub.name}" must be a string` };
          }
          const clean = sanitizeContentString(v, `${field.name}[${i}].${sub.name}`);
          if (!clean.ok) return clean;
          out[sub.name] = clean.value;
        }
        items.push(out);
      }
      content[field.name] = items;
    }
  }

  if (preserve) {
    for (const k of META_KEYS) {
      if (typeof preserve[k] === 'string' && preserve[k]) content[k] = preserve[k];
    }
  }
  for (const k of META_KEYS) {
    if (typeof input[k] !== 'string') continue;
    const clean = sanitizeContentString(input[k] as string, k);
    if (!clean.ok) return clean;
    content[k] = clean.value;
  }

  return { ok: true, content };
}

/**
 * Parse pasted JSON and keep only fields allowed for this section type.
 * Preserves existing meta keys (__anchor, __notes) when merging via `preserve`.
 */
export function importContentJson(
  key: string,
  raw: string,
  preserve?: Record<string, unknown>,
): ContentImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Invalid JSON — check commas and quotes' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'JSON must be an object { ... }' };
  }
  return validateSectionContent(key, parsed as Record<string, unknown>, preserve, {
    strictUnknown: true,
  });
}

export const DEFAULT_DESIGN_TOKENS = {
  colors: {
    background: '#F3F1EC',
    foreground: '#0F1C1A',
    accent: '#1F7A6C',
    muted: '#5C6B67',
    surface: '#E4E8E5',
  },
  typography: {
    displayFamily: 'Sora, system-ui, sans-serif',
    bodyFamily: 'Source Sans 3, system-ui, sans-serif',
    baseSize: '16px',
  },
  spacing: {
    sectionY: '3.5rem',
    contentMax: '1120px',
  },
  radii: {
    button: '6px',
  },
  /** Browser tab icon: hospital initial letter or a simple medical preset. */
  favicon: 'initial',
} as const;

export type DesignTokens = {
  colors: {
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    surface: string;
  };
  typography: {
    displayFamily: string;
    bodyFamily: string;
    baseSize: string;
  };
  spacing: {
    sectionY: string;
    contentMax: string;
  };
  radii: {
    button: string;
  };
  favicon: FaviconPresetId;
};

export {
  FAVICON_PRESETS,
  buildFaviconSvg,
  isFaviconPresetId,
  type FaviconPresetId,
} from './favicon';

/** Section keys included in the Maps→Gemini hospital bundle. */
export const HOSPITAL_BUNDLE_SECTION_KEYS = [
  'hero',
  'about',
  'doctors',
  'services',
  'contact',
  'faq',
  'testimonials',
] as const;

export type HospitalBundleHospital = {
  name?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type HospitalBundleImportResult =
  | {
      ok: true;
      hospital: HospitalBundleHospital;
      sections: Record<string, Record<string, unknown>>;
    }
  | { ok: false; error: string };

/**
 * Parse a whole-hospital Gemini JSON bundle.
 * Shape: { hospital: {...}, sections: { hero: {...}, ... } }
 */
export function importHospitalBundleJson(raw: string): HospitalBundleImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Invalid JSON — check commas and quotes' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'JSON must be an object { hospital, sections }' };
  }
  const root = parsed as Record<string, unknown>;
  const hospitalRaw =
    root.hospital && typeof root.hospital === 'object' && !Array.isArray(root.hospital)
      ? (root.hospital as Record<string, unknown>)
      : {};
  const sectionsRaw =
    root.sections && typeof root.sections === 'object' && !Array.isArray(root.sections)
      ? (root.sections as Record<string, unknown>)
      : null;
  if (!sectionsRaw) {
    return { ok: false, error: 'Missing "sections" object' };
  }

  const hospital: HospitalBundleHospital = {};
  for (const k of ['name', 'slug', 'seoTitle', 'seoDescription'] as const) {
    if (typeof hospitalRaw[k] === 'string' && (hospitalRaw[k] as string).trim()) {
      hospital[k] = (hospitalRaw[k] as string).trim();
    }
  }

  const sections: Record<string, Record<string, unknown>> = {};
  for (const key of Object.keys(sectionsRaw)) {
    if (!getSectionType(key)) {
      return { ok: false, error: `Unknown section key "${key}"` };
    }
    const value = sectionsRaw[key];
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, error: `sections.${key} must be an object` };
    }
    const result = validateSectionContent(key, value as Record<string, unknown>, undefined, {
      strictUnknown: true,
    });
    if (!result.ok) {
      return { ok: false, error: `sections.${key}: ${result.error}` };
    }
    sections[key] = result.content;
  }
  if (Object.keys(sections).length === 0) {
    return { ok: false, error: 'sections must include at least one section' };
  }

  return { ok: true, hospital, sections };
}

/** Prompt operators paste into Gemini (Chrome) after opening a Maps listing. */
export const GEMINI_HOSPITAL_BUNDLE_PROMPT = `You are helping build a hospital marketing website for Nabhi Studio.

I am viewing a hospital on Google Maps (or I will paste listing details below). Extract only what you can reasonably infer from the listing / my paste. Do not invent clinical claims, doctor credentials, or fake patient quotes. If unknown, use "" or [].

Return ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:

{
  "hospital": {
    "name": "string",
    "slug": "lowercase-kebab-slug",
    "seoTitle": "string",
    "seoDescription": "string under 160 chars"
  },
  "sections": {
    "hero": {
      "title": "string",
      "body": "string",
      "ctaPrimary": "string",
      "ctaSecondary": "string",
      "image": ""
    },
    "about": {
      "title": "string",
      "body": "string",
      "image": "",
      "highlights": [{ "label": "string", "text": "string" }]
    },
    "doctors": {
      "title": "string",
      "body": "string",
      "doctors": [{ "name": "string", "specialty": "string", "bio": "string", "image": "" }]
    },
    "services": {
      "title": "string",
      "body": "string",
      "items": [{ "title": "string", "description": "string", "icon": "" }]
    },
    "contact": {
      "title": "string",
      "body": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "hours": "string (use \\\\n between lines)",
      "mapUrl": "https://maps.google.com/...",
      "ctaPrimary": "Get directions"
    },
    "faq": {
      "title": "string",
      "body": "string",
      "items": [{ "question": "string", "answer": "string" }]
    },
    "testimonials": {
      "title": "string",
      "body": "string",
      "items": []
    }
  }
}

Rules (strict):
- PLAIN TEXT ONLY in every string. Never use HTML or Markdown: no <b>, <br>, <p>, <span>, <div>, &lt;, &gt;, or any other tags. Write "Emergency Care" not "<b>Emergency Care</b>".
- Prefer empty testimonials.items [] unless the listing clearly has public reviews you can paraphrase carefully.
- Leave image fields as "" (operator will add URLs in Studio).
- Include contact.phone, contact.address, contact.hours, contact.mapUrl from Maps when available.
- Return raw JSON only — no \`\`\`json fences, no commentary before or after.

Hospital / listing context:
`;

export {
  CONTENT_SCHEMA_VERSION,
  migrateSectionContent,
  type MigrationResult,
} from './migrate';
