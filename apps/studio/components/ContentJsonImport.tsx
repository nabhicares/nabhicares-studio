'use client';

import { useMemo, useState } from 'react';
import {
  exampleContentForSection,
  importContentJson,
  type SectionTypeDef,
} from '@nabhicares/section-registry';

export function ContentJsonImport({
  sectionKey,
  def,
  current,
  onApply,
}: {
  sectionKey: string;
  def: SectionTypeDef;
  current: Record<string, unknown>;
  onApply: (content: Record<string, unknown>) => void;
}) {
  const example = useMemo(
    () => JSON.stringify(exampleContentForSection(sectionKey), null, 2),
    [sectionKey],
  );
  const [text, setText] = useState(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(current).filter(([k]) => !k.startsWith('__')),
      ),
      null,
      2,
    ),
  );
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  function apply() {
    setError('');
    setOk('');
    const result = importContentJson(sectionKey, text, current);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onApply(result.content);
    setOk('Applied — fields filled from JSON');
  }

  function loadExample() {
    setText(example);
    setError('');
    setOk('Example loaded — edit then Apply');
  }

  function loadCurrent() {
    setText(
      JSON.stringify(
        Object.fromEntries(
          Object.entries(current).filter(([k]) => !k.startsWith('__')),
        ),
        null,
        2,
      ),
    );
    setError('');
    setOk('');
  }

  return (
    <div className="flex flex-col gap-sm">
      <p className="font-inter text-label-sm text-outline">
        Paste JSON matching the <strong>{def.label}</strong> shape. Unknown fields are rejected.
      </p>
      <div className="flex flex-wrap gap-xs">
        <button type="button" className="btn-ghost text-label-sm" onClick={loadExample}>
          Load example
        </button>
        <button type="button" className="btn-ghost text-label-sm" onClick={loadCurrent}>
          Load current
        </button>
      </div>
      <textarea
        className="field-input resize-none font-mono text-xs leading-relaxed"
        rows={14}
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
          setOk('');
        }}
        placeholder={example}
      />
      <button type="button" className="btn-primary w-full" onClick={apply}>
        Apply JSON
      </button>
      {error ? (
        <p className="font-inter text-label-sm text-error bg-error-container/40 px-sm py-sm rounded-lg">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="font-inter text-label-sm text-primary font-semibold">{ok}</p>
      ) : null}
      <details className="font-inter text-label-sm text-outline">
        <summary className="cursor-pointer">Allowed fields</summary>
        <ul className="mt-sm list-disc pl-md space-y-xs">
          {def.fields.map((f) => (
            <li key={f.name}>
              <code className="text-on-surface">{f.name}</code> — {f.type}
              {f.itemFields?.length
                ? ` ({${f.itemFields.map((s) => s.name).join(', ')}})`
                : ''}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
