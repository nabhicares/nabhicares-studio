'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { liveSiteUrl } from '@/lib/cdn';
import {
  GEMINI_HOSPITAL_BUNDLE_PROMPT,
  exampleContentForSection,
} from '@nabhicares/section-registry';

const STEPS = [
  { id: 'maps', label: 'Maps content' },
  { id: 'site', label: 'Create site' },
  { id: 'import', label: 'Import JSON' },
  { id: 'done', label: 'Open editor' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function HospitalOnboardWizard() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>('maps');
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalSlug, setHospitalSlug] = useState('');
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState('');

  const [jsonText, setJsonText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  async function copyPrompt() {
    await navigator.clipboard.writeText(GEMINI_HOSPITAL_BUNDLE_PROMPT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function createSite(e: React.FormEvent) {
    e.preventDefault();
    setCreateBusy(true);
    setCreateError('');
    try {
      const res = await apiFetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error ?? 'Could not create hospital');
        setCreateBusy(false);
        return;
      }
      setHospitalId(data.id as string);
      setHospitalSlug(data.slug as string);
      setCreateBusy(false);
      setStep('import');
      router.refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Request failed');
      setCreateBusy(false);
    }
  }

  async function applyJson() {
    if (!hospitalId) return;
    setImportBusy(true);
    setImportError('');
    setImportStatus('Importing…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}/import-bundle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: jsonText }),
    });
    const data = await res.json();
    setImportBusy(false);
    if (!res.ok) {
      setImportError(data.error ?? 'Import failed');
      setImportStatus('');
      return;
    }
    const created = (data.createdSectionKeys as string[] | undefined)?.length
      ? ` · created ${data.createdSectionKeys.join(', ')}`
      : '';
    setImportStatus(`Imported ${(data.updatedSectionIds as string[]).length} section(s)${created}`);
    setStep('done');
    router.refresh();
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-lg">
        <h1 className="font-outfit text-h2 text-brand-ink tracking-tight">New hospital</h1>
        <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
          Maps → Gemini → create site → import JSON → polish in the editor.
        </p>
      </div>

      <nav aria-label="Onboarding steps" className="mb-lg">
        <ol className="flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-0">
          {STEPS.map((s, i) => {
            const active = s.id === step;
            const done = i < stepIndex;
            return (
              <li key={s.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-sm min-w-0">
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-outfit text-label-sm font-semibold ${
                      active
                        ? 'bg-primary text-on-primary'
                        : done
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container text-outline'
                    }`}
                  >
                    {done ? (
                      <span className="material-symbols-outlined text-[16px] filled">check</span>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`font-inter text-label-sm truncate ${
                      active ? 'text-brand-ink font-semibold' : 'text-outline'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 ? (
                  <div
                    className={`hidden sm:block flex-1 h-px mx-md ${
                      done ? 'bg-primary/35' : 'bg-outline-variant'
                    }`}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-soft p-lg">
        {step === 'maps' ? (
          <div className="flex flex-col gap-lg">
            <div>
              <h2 className="font-outfit text-h3 text-brand-ink">1. Gather content from Maps</h2>
              <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                Keep the Google Maps listing open in Chrome, then send Gemini this prompt.
              </p>
            </div>
            <ul className="flex flex-col gap-sm m-0 p-0 list-none">
              {[
                'Open the hospital listing on Google Maps (desktop Chrome).',
                'Copy the prompt below into Gemini (side panel or gemini.google.com).',
                'Paste any extra listing notes under the prompt if needed.',
                'Copy Gemini’s JSON only — no markdown fences.',
              ].map((line, i) => (
                <li key={line} className="flex gap-md items-start">
                  <span className="font-outfit text-label-sm font-bold text-primary w-5 shrink-0 pt-0.5">
                    {i + 1}
                  </span>
                  <span className="font-inter text-body-sm text-on-surface leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
            <p className="font-inter text-label-sm text-outline leading-relaxed border-l-2 border-primary/40 pl-md">
              Maps photos usually cannot be scraped. Leave image fields empty; add URLs later in
              Studio. Verify clinical claims before publish.
            </p>
            <div className="flex flex-wrap gap-sm pt-sm">
              <button type="button" className="btn-primary" onClick={() => void copyPrompt()}>
                {copied ? 'Prompt copied' : 'Copy Gemini prompt'}
              </button>
              <button type="button" className="btn-ghost px-md py-sm" onClick={() => setStep('site')}>
                I have the JSON — continue
              </button>
            </div>
          </div>
        ) : null}

        {step === 'site' ? (
          <form onSubmit={(e) => void createSite(e)} className="flex flex-col gap-lg">
            <div>
              <h2 className="font-outfit text-h3 text-brand-ink">2. Create the hospital site</h2>
              <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                Seeds home, doctors, and contact pages. You will paste Gemini JSON next.
              </p>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-inter text-label-sm text-outline uppercase tracking-wider">
                Hospital name
              </label>
              <input
                className="field-input"
                required
                autoFocus
                placeholder="e.g. Sunrise Care Hospital"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-inter text-label-sm text-outline uppercase tracking-wider">
                URL slug
              </label>
              <div className="flex items-center gap-sm">
                <span className="font-inter text-body-sm text-outline">/</span>
                <input
                  className="field-input"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="lowercase letters, numbers, and hyphens"
                  placeholder="sunrise-care"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <p className="font-inter text-body-sm text-outline break-all">
                Live site will be at {liveSiteUrl(slug || '…')}
              </p>
            </div>
            {createError ? (
              <p className="font-inter text-body-sm text-error bg-error-container/40 px-sm py-sm rounded-lg">
                {createError}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-between gap-sm pt-sm">
              <button type="button" className="btn-ghost px-md py-sm" onClick={() => setStep('maps')}>
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={createBusy || !name || !slug}>
                {createBusy ? 'Creating…' : 'Create site & continue'}
              </button>
            </div>
          </form>
        ) : null}

        {step === 'import' ? (
          <div className="flex flex-col gap-lg">
            <div>
              <h2 className="font-outfit text-h3 text-brand-ink">3. Import Gemini JSON</h2>
              <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                Pasting into{' '}
                <span className="font-semibold text-on-surface">{name || hospitalSlug}</span>. Design
                stays Nabhi; this only fills content fields.
              </p>
            </div>
            <div className="flex flex-wrap gap-xs">
              <button type="button" className="btn-ghost text-label-sm" onClick={() => void copyPrompt()}>
                {copied ? 'Prompt copied' : 'Copy Gemini prompt again'}
              </button>
              <button
                type="button"
                className="btn-ghost text-label-sm"
                onClick={() => {
                  setJsonText(EXAMPLE_BUNDLE);
                  setImportError('');
                  setImportStatus('Example loaded — edit then Apply');
                }}
              >
                Load example JSON
              </button>
            </div>
            <textarea
              className="field-input resize-none font-mono text-xs leading-relaxed min-h-[240px]"
              spellCheck={false}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setImportError('');
                setImportStatus('');
              }}
              placeholder='{ "hospital": { ... }, "sections": { "hero": { ... } } }'
            />
            {importError ? (
              <p className="font-inter text-body-sm text-error bg-error-container/40 px-sm py-sm rounded-lg">
                {importError}
              </p>
            ) : null}
            {importStatus ? (
              <p className="font-inter text-label-sm text-primary font-semibold">{importStatus}</p>
            ) : null}
            <div className="flex flex-wrap justify-between gap-sm pt-sm">
              <button
                type="button"
                className="btn-ghost px-md py-sm"
                onClick={() => setStep('done')}
              >
                Skip for now
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={importBusy || !jsonText.trim()}
                onClick={() => void applyJson()}
              >
                {importBusy ? 'Applying…' : 'Apply JSON & continue'}
              </button>
            </div>
          </div>
        ) : null}

        {step === 'done' ? (
          <div className="flex flex-col gap-lg">
            <div>
              <h2 className="font-outfit text-h3 text-brand-ink">4. Polish in the editor</h2>
              <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                {name || 'Your site'} is ready. Finish these before you publish.
              </p>
            </div>
            <ul className="flex flex-col gap-sm m-0 p-0 list-none">
              {[
                'Add real image URLs (hero, about, doctors).',
                'Verify phone, hours, address, and doctor names.',
                'Tweak headlines in the section inspector if needed.',
                'Publish when the draft looks right.',
              ].map((line) => (
                <li key={line} className="flex gap-sm items-start font-inter text-body-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                    check_circle
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <p className="font-inter text-label-sm text-outline">
              You can re-import anytime from Hospital settings (gear) → Onboard from Maps → Gemini.
            </p>
            <div className="flex flex-wrap gap-sm pt-sm">
              <Link href={`/h/${hospitalSlug}`} className="btn-primary inline-flex items-center">
                Open editor
              </Link>
              <Link href="/" className="btn-ghost px-md py-sm inline-flex items-center">
                Back to hospitals
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
