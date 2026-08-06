'use client';

import Link from 'next/link';

/** Opens the dedicated Maps → Gemini onboarding wizard. */
export function CreateHospitalButton() {
  return (
    <Link
      href="/onboard"
      className="btn-primary inline-flex items-center gap-sm shadow-soft"
    >
      <span className="material-symbols-outlined text-[18px]">add</span>
      New hospital
    </Link>
  );
}
