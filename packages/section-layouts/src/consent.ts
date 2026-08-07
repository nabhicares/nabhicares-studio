export const NABHI_CONSENT_KEY = 'nabhi_consent_v1';
export const NABHI_CONSENT_EVENT = 'nabhi-consent-change';

export type NabhiConsentChoice = 'all' | 'essential';

export type NabhiConsent = {
  choice: NabhiConsentChoice;
  at: string;
};

export function readConsent(): NabhiConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(NABHI_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NabhiConsent;
    if (parsed?.choice !== 'all' && parsed?.choice !== 'essential') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: NabhiConsentChoice): NabhiConsent {
  const next: NabhiConsent = { choice, at: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(NABHI_CONSENT_KEY, JSON.stringify(next));
    document.documentElement.dataset.nabhiConsent = choice;
    window.dispatchEvent(new CustomEvent(NABHI_CONSENT_EVENT, { detail: next }));
  }
  return next;
}

/** Optional third-party embeds (Google Maps) require "Accept all". */
export function allowsOptionalEmbeds(consent: NabhiConsent | null): boolean {
  return consent?.choice === 'all';
}
