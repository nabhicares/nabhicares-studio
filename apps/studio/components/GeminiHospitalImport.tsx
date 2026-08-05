'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import {
  GEMINI_HOSPITAL_BUNDLE_PROMPT,
  exampleContentForSection,
} from '@nabhicares/section-registry';

const EXAMPLE_BUNDLE = JSON.stringify(
  {
    hospital: {
      name: 'Example Care Hospital',
      slug: 'example-care-hospital',
      seoTitle: 'Example Care Hospital | Trusted local care',
      seoDescription: 'Multispecialty hospital offering outpatient, diagnostics, and emergency care.',
    },
    sections: {
      hero: exampleContentForSection('hero'),
      about: exampleContentForSection('about'),
      doctors: exampleContentForSection('doctors'),
      services: exampleContentForSection('services'),
      contact: exampleContentForSection('contact'),
      faq: exampleContentForSection('faq'),
      testimonials: { title: 'Patient stories', body: '', items: [] },
    },
  },
  null,
  2,
);

const STEPS = [
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
    title: 'Paste JSON here → Apply',
    detail: 'Fills matching sections (hero, about, doctors, services, contact, faq, testimonials).',
  },
  {
    n: '5',
    title: 'Polish, then publish',
    detail:
      'Swap empty image URLs, verify phone/hours/doctors, tweak copy in the inspector, then Publish.',
  },
] as const;

export function GeminiHospitalImport({ hospitalId }: { hospitalId: string }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);

  async function copyPrompt() {
    await navigator.clipboard.writeText(GEMINI_HOSPITAL_BUNDLE_PROMPT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function apply() {
    setBusy(true);
    setError('');
    setStatus('Importing…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}/import-bundle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: text }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? 'Import failed');
      setStatus('');
      return;
    }
    const created = (data.createdSectionKeys as string[] | undefined)?.length
      ? ` · created ${data.createdSectionKeys.join(', ')}`
      : '';
    setStatus(`Imported ${(data.updatedSectionIds as string[]).length} section(s)${created}`);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-md border-t border-outline-variant pt-lg">
      <div>
        <h4 className="font-outfit text-[15px] font-semibold text-on-surface">
          Onboard from Maps → Gemini
        </h4>
        <p className="mt-xs font-inter text-label-sm text-outline">
          Your hospital content checklist. Design stays Nabhi; Gemini only fills fields.
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
          {STEPS.map((step) => (
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

      <div className="flex flex-wrap gap-xs">
        <button type="button" className="btn-ghost text-label-sm" onClick={() => void copyPrompt()}>
          {copied ? 'Prompt copied' : 'Copy Gemini prompt'}
        </button>
        <button
          type="button"
          className="btn-ghost text-label-sm"
          onClick={() => {
            setText(EXAMPLE_BUNDLE);
            setError('');
            setStatus('Example loaded — edit then Apply');
          }}
        >
          Load example JSON
        </button>
      </div>
      <textarea
        className="field-input resize-none font-mono text-xs leading-relaxed min-h-[200px]"
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
          setStatus('');
        }}
        placeholder='Paste Gemini JSON: { "hospital": { ... }, "sections": { ... } }'
      />
      <button
        type="button"
        className="btn-primary w-full"
        disabled={busy || !text.trim()}
        onClick={() => void apply()}
      >
        Apply hospital JSON
      </button>
      {error ? (
        <p className="font-inter text-label-sm text-error bg-error-container/40 px-sm py-sm rounded-lg">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="font-inter text-label-sm text-primary font-semibold">{status}</p>
      ) : null}
    </section>
  );
}
