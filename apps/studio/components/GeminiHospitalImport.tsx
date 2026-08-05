'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { exampleContentForSection } from '@nabhicares/section-registry';
import { GeminiOnboardingGuide } from './GeminiOnboardingGuide';

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

/** Paste/apply Gemini JSON — lives in Hospital settings after the site exists. */
export function GeminiHospitalImport({ hospitalId }: { hospitalId: string }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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
      <GeminiOnboardingGuide variant="import" />

      <div className="flex flex-wrap gap-xs">
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
