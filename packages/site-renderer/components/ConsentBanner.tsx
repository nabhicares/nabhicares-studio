'use client';

import { useEffect, useState } from 'react';
import {
  NABHI_CONSENT_EVENT,
  readConsent,
  writeConsent,
  type NabhiConsent,
  type NabhiConsentChoice,
} from '@nabhicares/section-layouts';

export function ConsentBanner({
  hospitalName,
  privacyHref,
}: {
  hospitalName: string;
  privacyHref: string;
}) {
  const [consent, setConsent] = useState<NabhiConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    setConsent(existing);
    if (existing) {
      document.documentElement.dataset.nabhiConsent = existing.choice;
    }
    setReady(true);
    const onChange = () => setConsent(readConsent());
    window.addEventListener(NABHI_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(NABHI_CONSENT_EVENT, onChange);
  }, []);

  if (!ready || consent) return null;

  function choose(choice: NabhiConsentChoice) {
    setConsent(writeConsent(choice));
  }

  return (
    <div className="nabhi-consent" role="dialog" aria-labelledby="nabhi-consent-title" aria-live="polite">
      <div className="nabhi-consent-inner">
        <div className="nabhi-consent-copy">
          <p id="nabhi-consent-title" className="nabhi-consent-title">
            Privacy
          </p>
          <p className="nabhi-consent-body">
            Essential cookies remember this choice. Maps load only if you accept all.{' '}
            <a href={privacyHref}>Privacy notice</a>
            <span className="nabhi-consent-site"> · {hospitalName}</span>
          </p>
        </div>
        <div className="nabhi-consent-actions">
          <button type="button" className="nabhi-consent-btn nabhi-consent-btn-ghost" onClick={() => choose('essential')}>
            Essential
          </button>
          <button type="button" className="nabhi-consent-btn nabhi-consent-btn-primary" onClick={() => choose('all')}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
