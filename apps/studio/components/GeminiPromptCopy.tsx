'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID,
  GEMINI_HOSPITAL_BUNDLE_PROMPTS,
  getGeminiHospitalBundlePrompt,
  nextGeminiHospitalBundlePromptId,
  type GeminiHospitalBundlePromptId,
} from '@nabhicares/section-registry';

const STORAGE_KEY = 'nabhi.geminiPromptId';

function readStoredId(): GeminiHospitalBundlePromptId {
  if (typeof window === 'undefined') return DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return getGeminiHospitalBundlePrompt(raw).id;
  } catch {
    return DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID;
  }
}

function writeStoredId(id: GeminiHospitalBundlePromptId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

/** Dropdown + copy for Gemini hospital-bundle prompt variants. */
export function GeminiPromptCopy({
  buttonClassName = 'btn-ghost text-label-sm self-start',
  showRotateHint = true,
}: {
  buttonClassName?: string;
  showRotateHint?: boolean;
}) {
  const [promptId, setPromptId] = useState<GeminiHospitalBundlePromptId>(
    DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID,
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPromptId(readStoredId());
  }, []);

  const current = getGeminiHospitalBundlePrompt(promptId);

  async function copyPrompt() {
    await navigator.clipboard.writeText(current.prompt);
    setCopied(true);
    const nextId = nextGeminiHospitalBundlePromptId(promptId);
    writeStoredId(nextId);
    setPromptId(nextId);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function onSelect(id: string) {
    const def = getGeminiHospitalBundlePrompt(id);
    setPromptId(def.id);
    writeStoredId(def.id);
  }

  return (
    <div className="flex flex-col gap-xs self-stretch sm:self-start">
      <label className="font-inter text-label-sm text-outline" htmlFor="gemini-prompt-voice">
        Prompt voice
      </label>
      <select
        id="gemini-prompt-voice"
        className="field-input max-w-md"
        value={promptId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {GEMINI_HOSPITAL_BUNDLE_PROMPTS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label} — {p.description}
          </option>
        ))}
      </select>
      <button type="button" className={buttonClassName} onClick={() => void copyPrompt()}>
        {copied ? 'Prompt copied (next voice ready)' : `Copy Gemini prompt (${current.label})`}
      </button>
      {showRotateHint ? (
        <p className="font-inter text-[11px] text-outline m-0 max-w-md leading-snug">
          Same JSON schema for Studio. After copy, the next hospital defaults to a different voice so
          demos do not all sound identical.
        </p>
      ) : null}
    </div>
  );
}
