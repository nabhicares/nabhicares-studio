'use client';

import { useState } from 'react';
import { GEMINI_HOSPITAL_BUNDLE_PROMPT } from '@nabhicares/section-registry';

const STEPS_CREATE = [
  {
    n: '1',
    title: 'Open the hospital on Google Maps',
    detail: 'Desktop Chrome. Keep the listing in view (name, phone, hours, address).',
  },
  {
    n: '2',
    title: 'Copy the Gemini prompt',
    detail: 'Button below → paste into Gemini (Chrome side panel or gemini.google.com).',
  },
  {
    n: '3',
    title: 'Create this site',
    detail: 'Name + slug → Create & open editor. Keep Gemini’s JSON ready to paste.',
  },
  {
    n: '4',
    title: 'Paste JSON in Hospital settings',
    detail: 'In the editor: gear icon → Onboard from Maps → Gemini → Apply hospital JSON.',
  },
  {
    n: '5',
    title: 'Polish, then publish',
    detail: 'Add image URLs, verify phone/hours/doctors, then Publish.',
  },
] as const;

const STEPS_IMPORT = [
  {
    n: '1',
    title: 'Open the hospital on Google Maps',
    detail: 'Desktop Chrome. Keep the listing in view (name, phone, hours, address).',
  },
  {
    n: '2',
    title: 'Copy the Gemini prompt',
    detail: 'Use the button below, then paste into Gemini (side panel or gemini.google.com).',
  },
  {
    n: '3',
    title: 'Paste listing notes if needed',
    detail: 'Add anything Maps shows that Gemini might miss. Ask for JSON only — no markdown fences.',
  },
  {
    n: '4',
    title: 'Paste JSON below → Apply',
    detail: 'Fills matching sections (hero, about, doctors, services, contact, faq, testimonials).',
  },
  {
    n: '5',
    title: 'Polish, then publish',
    detail:
      'Swap empty image URLs, verify phone/hours/doctors, tweak copy in the inspector, then Publish.',
  },
] as const;

/** Shared Maps → Gemini checklist for create modal and hospital settings. */
export function GeminiOnboardingGuide({
  variant = 'import',
  defaultOpen = true,
}: {
  variant?: 'create' | 'import';
  defaultOpen?: boolean;
}) {
  const [guideOpen, setGuideOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const steps = variant === 'create' ? STEPS_CREATE : STEPS_IMPORT;

  async function copyPrompt() {
    await navigator.clipboard.writeText(GEMINI_HOSPITAL_BUNDLE_PROMPT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-md">
      <div>
        <h4 className="font-outfit text-[15px] font-semibold text-on-surface">
          Onboard from Maps → Gemini
        </h4>
        <p className="mt-xs font-inter text-label-sm text-outline">
          Your checklist while setting up a hospital. Design stays Nabhi; Gemini only fills fields.
        </p>
      </div>

      <button
        type="button"
        className="flex items-center justify-between gap-sm text-left font-inter text-label-sm font-semibold text-on-surface"
        onClick={() => setGuideOpen((o) => !o)}
        aria-expanded={guideOpen}
      >
        <span>How to onboard</span>
        <span className="material-symbols-outlined text-[18px] text-outline">
          {guideOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {guideOpen ? (
        <ol className="flex flex-col gap-sm m-0 p-0 list-none">
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex gap-sm rounded-lg bg-surface-container-low/80 px-sm py-sm"
            >
              <span className="font-outfit text-label-sm font-bold text-primary shrink-0 w-5">
                {step.n}
              </span>
              <div className="min-w-0">
                <div className="font-inter text-label-sm font-semibold text-on-surface">
                  {step.title}
                </div>
                <p className="mt-xs font-inter text-label-sm text-outline leading-snug">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      <p className="font-inter text-label-sm text-outline leading-snug rounded-lg border border-outline-variant/60 px-sm py-sm">
        Maps photos usually cannot be scraped — leave image fields empty in JSON, then add URLs in
        Studio. Always verify clinical claims before publish.
      </p>

      <button type="button" className="btn-ghost text-label-sm self-start" onClick={() => void copyPrompt()}>
        {copied ? 'Prompt copied' : 'Copy Gemini prompt'}
      </button>
    </div>
  );
}
