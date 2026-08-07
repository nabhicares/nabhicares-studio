import { createElement } from 'react';
import type { LayoutComponent } from './types';
import { layouts as hero } from './hero';
import { layouts as about } from './about';
import { layouts as doctors } from './doctors';
import { layouts as services } from './services';
import { layouts as gallery } from './gallery';
import { layouts as faq } from './faq';
import { layouts as testimonials } from './testimonials';
import { layouts as contact } from './contact';
import { layouts as map } from './map';
import { layouts as appointments } from './appointments';

const REGISTRY: Record<string, Record<number, LayoutComponent>> = {
  hero,
  about,
  doctors,
  services,
  gallery,
  faq,
  testimonials,
  contact,
  map,
  appointments,
};

function Fallback({ content }: { content: Record<string, unknown> }) {
  const title = typeof content.title === 'string' ? content.title : 'Section';
  return createElement(
    'section',
    {
      style: {
        padding: 'var(--space-section-y) 1.5rem',
        color: 'var(--color-fg)',
        background: 'var(--color-bg)',
      },
    },
    createElement('h2', { style: { fontFamily: 'var(--font-display)' } }, title),
  );
}

/** Resolve section type + layout version (1–10) to a React component. */
export function resolveLayout(type: string, version: number): LayoutComponent {
  const map = REGISTRY[type];
  if (!map) return Fallback;
  return map[version] ?? map[1] ?? Fallback;
}

export const SECTION_LAYOUT_TYPES = Object.keys(REGISTRY);
