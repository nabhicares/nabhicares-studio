'use client';

import Link from 'next/link';

/** Opens the dedicated Maps → Gemini onboarding wizard. */
export function CreateHospitalButton() {
  return (
    <Link
      href="/onboard"
      className="bg-primary-container text-on-primary-container flex items-center gap-sm px-lg py-md rounded-lg font-inter text-label-md font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-soft"
    >
      <span className="material-symbols-outlined text-[18px]">add</span>
      Create Hospital
    </Link>
  );
}
