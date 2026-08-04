'use client';

/** Exact structural wireframes matching each section layout variant. */
export function LayoutWireframe({
  sectionType,
  version,
}: {
  sectionType: string;
  version: number;
}) {
  const type = sectionType;
  const v = Math.min(10, Math.max(1, version));

  return (
    <svg viewBox="0 0 48 36" className="w-full h-full" aria-hidden>
      <rect width="48" height="36" rx="2" fill="currentColor" opacity="0.06" />
      {renderSketch(type, v)}
    </svg>
  );
}

function renderSketch(type: string, v: number) {
  if (type === 'hero' && v === 1) {
    return (
      <>
          <rect x="2" y="3" width="15" height="30" rx="1.5" className="fill-current" style={{opacity:0.22}} />
          <rect x="5" y="8" width="9" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="12" width="9" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="5" y="15" width="7" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="5" y="22" width="5" height="2.8" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="11" y="22" width="4" height="2.8" rx="0.5" className="fill-current" style={{opacity:0.22}} />
          <rect x="19" y="3" width="27" height="30" rx="1.5" className="fill-current opacity-18" /><path d="M19 33 L46 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M19 3 L46 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'hero' && v === 2) {
    return (
      <>
          <rect x="2" y="2" width="44" height="32" rx="1.5" className="fill-current opacity-18" /><path d="M2 34 L46 2" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M2 2 L46 34" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="14" y="12" width="20" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="16" y="17" width="16" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="17" y="23" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.5}} />
          <rect x="25" y="23" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.28}} />
      </>
    );
  }
  if (type === 'hero' && v === 3) {
    return (
      <>
          <rect x="2" y="3" width="26" height="30" rx="1.5" className="fill-current opacity-18" /><path d="M2 33 L28 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M2 3 L28 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="30" y="3" width="16" height="30" rx="1.5" className="fill-current" style={{opacity:0.22}} />
          <rect x="33" y="10" width="10" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="33" y="15" width="10" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="33" y="24" width="5" height="2.8" rx="0.5" className="fill-current" style={{opacity:0.45}} />
      </>
    );
  }
  if (type === 'hero' && v === 4) {
    return (
      <>
          <rect x="3" y="4" width="20" height="2.4" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="9" width="26" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="3" y="13" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="10" y="13" width="5" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.22}} />
          <rect x="3" y="19" width="42" height="14" rx="1.5" className="fill-current opacity-18" /><path d="M3 33 L45 19" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 19 L45 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'hero' && v === 5) {
    return (
      <>
          <rect x="20" y="7" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="12" y="12" width="24" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="14" y="17" width="20" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="16" y="23" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="24" y="23" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.22}} />
      </>
    );
  }
  if (type === 'hero' && v === 6) {
    return (
      <>
          <rect x="2" y="3" width="18" height="20" rx="1.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="5" y="7" width="12" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="11" width="12" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="5" y="17" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="22" y="3" width="24" height="20" rx="1.5" className="fill-current opacity-18" /><path d="M22 23 L46 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M22 3 L46 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="2" y="25" width="44" height="8" rx="1.5" className="fill-current" style={{opacity:0.42}} />
      </>
    );
  }
  if (type === 'hero' && v === 7) {
    return (
      <>
          <rect x="2" y="3" width="2" height="30" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="7" y="6" width="15" height="2.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="7" y="11" width="13" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="7" y="17" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="27" y="4" width="19" height="28" rx="1.5" className="fill-current opacity-18" /><path d="M27 32 L46 4" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M27 4 L46 32" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'hero' && v === 8) {
    return (
      <>
          <rect x="3" y="5" width="8" height="1" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="3" y="8" width="18" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="12" width="16" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="25" y="3" width="21" height="20" rx="1.5" className="fill-current opacity-18" /><path d="M25 23 L46 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M25 3 L46 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="25" y="26" width="9" height="3" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="36" y="26" width="9" height="3" rx="0.5" className="fill-current" style={{opacity:0.22}} />
      </>
    );
  }
  if (type === 'hero' && v === 9) {
    return (
      <>
          <rect x="3" y="4" width="18" height="3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="26" y="4" width="18" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="26" y="8" width="14" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="26" y="13" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="2" y="20" width="44" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M2 33 L46 20" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M2 20 L46 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'hero' && v === 10) {
    return (
      <>
          <rect x="5" y="4" width="38" height="28" rx="2" className="fill-current" style={{opacity:0.1}} />
          <rect x="8" y="9" width="14" height="2.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="14" width="14" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="8" y="22" width="6" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.45}} />
          <rect x="26" y="8" width="14" height="20" rx="1.5" className="fill-current opacity-18" /><path d="M26 28 L40 8" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M26 8 L40 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'about' && v === 1) {
    return (
      <>
          <rect x="3" y="4" width="16" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="8" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="3" y="14" width="8" height="6" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="12" y="14" width="8" height="6" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="24" y="4" width="21" height="28" rx="1.5" className="fill-current opacity-18" /><path d="M24 32 L45 4" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M24 4 L45 32" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'about' && v === 2) {
    return (
      <>
          <rect x="14" y="5" width="20" height="2.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="10" width="24" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="10" y="16" width="28" height="16" rx="1.5" className="fill-current opacity-18" /><path d="M10 32 L38 16" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M10 16 L38 32" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'about' && v === 3) {
    return (
      <>
          <rect x="3" y="3" width="42" height="12" rx="1.5" className="fill-current opacity-18" /><path d="M3 15 L45 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 3 L45 15" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="3" y="18" width="20" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="22" width="24" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="3" y="27" width="13" height="6" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="18" y="27" width="13" height="6" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="33" y="27" width="12" height="6" rx="1.5" className="fill-current" style={{opacity:0.2}} />
      </>
    );
  }
  if (type === 'about' && v === 4) {
    return (
      <>
          <rect x="12" y="5" width="8" height="1" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="10" y="9" width="28" height="2.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="14" width="24" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="12" y="20" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="12" y="24" width="18" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="12" y="28" width="16" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
      </>
    );
  }
  if (type === 'about' && v === 5) {
    return (
      <>
          <rect x="2" y="3" width="28" height="30" rx="1.5" className="fill-current opacity-18" /><path d="M2 33 L30 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M2 3 L30 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="33" y="8" width="12" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="33" y="13" width="12" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="33" y="18" width="10" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.25}} />
      </>
    );
  }
  if (type === 'about' && v === 6) {
    return (
      <>
          <rect x="3" y="4" width="42" height="28" rx="2" className="fill-current" style={{opacity:0.12}} />
          <rect x="6" y="10" width="16" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="6" y="15" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="26" y="8" width="16" height="20" rx="1.5" className="fill-current opacity-18" /><path d="M26 28 L42 8" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M26 8 L42 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'about' && v === 7) {
    return (
      <>
          <rect x="3" y="4" width="2" height="28" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="5" width="20" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="10" width="22" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="8" y="16" width="17" height="7" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="27" y="16" width="17" height="7" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="8" y="25" width="17" height="7" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="27" y="25" width="17" height="7" rx="1.5" className="fill-current" style={{opacity:0.2}} />
      </>
    );
  }
  if (type === 'about' && v === 8) {
    return (
      <>
          <rect x="2" y="2" width="44" height="32" rx="1.5" className="fill-current opacity-18" /><path d="M2 34 L46 2" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M2 2 L46 34" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="22" y="20" width="23" height="12" rx="2" className="fill-current" style={{opacity:0.28}} />
          <rect x="25" y="23" width="17" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="25" y="27" width="15" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.3}} />
      </>
    );
  }
  if (type === 'about' && v === 9) {
    return (
      <>
          <rect x="3" y="4" width="18" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="9" width="18" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="26" y="3" width="19" height="16" rx="1.5" className="fill-current opacity-18" /><path d="M26 19 L45 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M26 3 L45 19" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="3" y="23" width="13" height="9" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="18" y="23" width="13" height="9" rx="1.5" className="fill-current" style={{opacity:0.2}} />
          <rect x="33" y="23" width="12" height="9" rx="1.5" className="fill-current" style={{opacity:0.2}} />
      </>
    );
  }
  if (type === 'about' && v === 10) {
    return (
      <>
          <rect x="2" y="6" width="44" height="24" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="6" y="12" width="20" height="2.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="6" y="18" width="28" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="36" y="14" width="8" height="10" rx="1.5" className="fill-current opacity-18" /><path d="M36 24 L44 14" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M36 14 L44 24" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'doctors' && v === 1) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="13" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="4" y="8" width="11" height="6" rx="1.5" className="fill-current opacity-18" /><path d="M4 14 L15 8" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M4 8 L15 14" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="5" y="15" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="7" width="13" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="19" y="8" width="11" height="6" rx="1.5" className="fill-current opacity-18" /><path d="M19 14 L30 8" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M19 8 L30 14" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="20" y="15" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="33" y="7" width="12" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="34" y="8" width="10" height="6" rx="1.5" className="fill-current opacity-18" /><path d="M34 14 L44 8" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M34 8 L44 14" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="35" y="15" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 2) {
    return (
      <>
          <rect x="14" y="3" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="7" width="24" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="3" y="14" width="13" height="18" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <circle cx="9.5" cy="20" r="4" className="fill-current" style={{opacity:0.3}} />
          <rect x="5" y="26" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="14" width="13" height="18" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <circle cx="24.5" cy="20" r="4" className="fill-current" style={{opacity:0.3}} />
          <rect x="20" y="26" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="33" y="14" width="12" height="18" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <circle cx="39" cy="20" r="4" className="fill-current" style={{opacity:0.3}} />
          <rect x="35" y="26" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 3) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <circle cx="6" cy="10" r="3" className="fill-current" style={{opacity:0.3}} />
          <rect x="11" y="8" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="11" y="11" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <circle cx="6" cy="20" r="3" className="fill-current" style={{opacity:0.3}} />
          <rect x="11" y="18" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="11" y="21" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <circle cx="6" cy="30" r="3" className="fill-current" style={{opacity:0.3}} />
          <rect x="11" y="28" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 4) {
    return (
      <>
          <rect x="3" y="5" width="16" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="10" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="24" y="4" width="21" height="8" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="26" y="7" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="24" y="14" width="21" height="8" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="26" y="17" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="24" y="24" width="21" height="8" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="26" y="27" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 5) {
    return (
      <>
          <rect x="2" y="4" width="22" height="28" rx="1.5" className="fill-current opacity-18" /><path d="M2 32 L24 4" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M2 4 L24 32" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="5" y="26" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="27" y="4" width="19" height="8" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="29" y="7" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="27" y="14" width="19" height="8" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="29" y="17" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="27" y="24" width="19" height="8" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="29" y="27" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 6) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <line x1="3" y1="8" x2="45" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="3" y="10" width="20" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="28" y="10" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <line x1="3" y1="15" x2="45" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="3" y="17" width="20" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="28" y="17" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <line x1="3" y1="22" x2="45" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="3" y="24" width="20" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="28" y="24" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <line x1="3" y1="29" x2="45" y2="29" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </>
    );
  }
  if (type === 'doctors' && v === 7) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="8" width="30" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="11" width="22" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="17" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="18" width="30" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="21" width="22" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="27" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="28" width="30" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 8) {
    return (
      <>
          <rect x="14" y="2" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <circle cx="10" cy="16" r="5" className="fill-current" style={{opacity:0.3}} />
          <rect x="6" y="23" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <circle cx="24" cy="16" r="5" className="fill-current" style={{opacity:0.3}} />
          <rect x="20" y="23" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <circle cx="38" cy="16" r="5" className="fill-current" style={{opacity:0.3}} />
          <rect x="34" y="23" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'doctors' && v === 9) {
    return (
      <>
          <rect x="2" y="4" width="44" height="28" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="8" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="14" width="12" height="4" rx="2" className="fill-current" style={{opacity:0.25}} />
          <rect x="19" y="14" width="12" height="4" rx="2" className="fill-current" style={{opacity:0.25}} />
          <rect x="33" y="14" width="10" height="4" rx="2" className="fill-current" style={{opacity:0.25}} />
          <rect x="5" y="22" width="14" height="4" rx="2" className="fill-current" style={{opacity:0.25}} />
          <rect x="21" y="22" width="12" height="4" rx="2" className="fill-current" style={{opacity:0.25}} />
      </>
    );
  }
  if (type === 'doctors' && v === 10) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="8" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="8" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="11" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="17" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="17" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="20" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="26" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="26" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 1) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="13" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <circle cx="9.5" cy="12" r="3" className="fill-current" style={{opacity:0.35}} />
          <rect x="5" y="17" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="7" width="13" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <circle cx="24.5" cy="12" r="3" className="fill-current" style={{opacity:0.35}} />
          <rect x="20" y="17" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="33" y="7" width="12" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <circle cx="39" cy="12" r="3" className="fill-current" style={{opacity:0.35}} />
          <rect x="35" y="17" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 2) {
    return (
      <>
          <rect x="14" y="3" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="9" width="28" height="6" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="13" y="11" width="22" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="17" width="28" height="6" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="13" y="19" width="22" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="25" width="28" height="6" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="13" y="27" width="22" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 3) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="20" height="12" rx="1.5" className="fill-current" style={{opacity:0.18}} />
          <rect x="6" y="11" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="25" y="7" width="20" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="28" y="11" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="21" width="20" height="12" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="6" y="25" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="25" y="21" width="20" height="12" rx="1.5" className="fill-current" style={{opacity:0.18}} />
          <rect x="28" y="25" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 4) {
    return (
      <>
          <rect x="3" y="5" width="16" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="10" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="26" y="5" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="32" y="5" width="12" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="26" y="13" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="32" y="13" width="12" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="26" y="21" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="32" y="21" width="12" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="26" y="29" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="32" y="29" width="12" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 5) {
    return (
      <>
          <rect x="2" y="4" width="24" height="28" rx="1.5" className="fill-current" style={{opacity:0.18}} />
          <rect x="5" y="10" width="18" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="15" width="18" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="29" y="4" width="17" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="31" y="7" width="13" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="29" y="14" width="17" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="31" y="17" width="13" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="29" y="24" width="17" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="31" y="27" width="13" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 6) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="13" height="11" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="5" y="10" width="9" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="13" width="9" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="18" y="7" width="13" height="11" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="20" y="10" width="9" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="33" y="7" width="12" height="11" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="35" y="10" width="8" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="21" width="13" height="11" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="5" y="24" width="9" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="21" width="13" height="11" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="20" y="24" width="9" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 7) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="8" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="11" width="24" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="17" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="18" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="21" width="24" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="27" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="28" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 8) {
    return (
      <>
          <rect x="14" y="3" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="4" y="12" width="12" height="5" rx="3" className="fill-current" style={{opacity:0.25}} />
          <rect x="18" y="12" width="12" height="5" rx="3" className="fill-current" style={{opacity:0.25}} />
          <rect x="32" y="12" width="12" height="5" rx="3" className="fill-current" style={{opacity:0.25}} />
          <rect x="10" y="22" width="12" height="5" rx="3" className="fill-current" style={{opacity:0.25}} />
          <rect x="26" y="22" width="12" height="5" rx="3" className="fill-current" style={{opacity:0.25}} />
      </>
    );
  }
  if (type === 'services' && v === 9) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="4" y="8" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="4" y="12" width="12" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="8" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="18" y="12" width="12" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="32" y="8" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="32" y="12" width="12" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="4" y="22" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="4" y="26" width="12" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="22" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="18" y="26" width="12" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'services' && v === 10) {
    return (
      <>
          <rect x="2" y="4" width="44" height="28" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="8" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="16" width="12" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="22" y="16" width="20" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <line x1="5" y1="20" x2="43" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="5" y="24" width="12" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="22" y="24" width="20" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
      </>
    );
  }
  if (type === 'gallery' && v === 1) {
    return (
      <>
          <rect x="3" y="2" width="14" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="13" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M3 19 L16 6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 6 L16 19" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="18" y="6" width="13" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M18 19 L31 6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M18 6 L31 19" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="33" y="6" width="12" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M33 19 L45 6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M33 6 L45 19" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="3" y="21" width="13" height="12" rx="1.5" className="fill-current opacity-18" /><path d="M3 33 L16 21" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 21 L16 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="18" y="21" width="13" height="12" rx="1.5" className="fill-current opacity-18" /><path d="M18 33 L31 21" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M18 21 L31 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="33" y="21" width="12" height="12" rx="1.5" className="fill-current opacity-18" /><path d="M33 33 L45 21" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M33 21 L45 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 2) {
    return (
      <>
          <rect x="14" y="2" width="20" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="28" height="28" rx="1.5" className="fill-current opacity-18" /><path d="M3 34 L31 6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 6 L31 34" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="33" y="6" width="12" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M33 19 L45 6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M33 6 L45 19" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="33" y="21" width="12" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M33 34 L45 21" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M33 21 L45 34" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 3) {
    return (
      <>
          <rect x="3" y="2" width="14" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="10" width="14" height="18" rx="1.5" className="fill-current opacity-18" /><path d="M3 28 L17 10" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 10 L17 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="19" y="10" width="14" height="18" rx="1.5" className="fill-current opacity-18" /><path d="M19 28 L33 10" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M19 10 L33 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="35" y="10" width="14" height="18" rx="1.5" className="fill-current opacity-18" /><path d="M35 28 L49 10" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M35 10 L49 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 4) {
    return (
      <>
          <rect x="3" y="4" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="9" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="3" y="14" width="14" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="19" width="14" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="24" width="14" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="24" y="4" width="10" height="14" rx="1.5" className="fill-current opacity-18" /><path d="M24 18 L34 4" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M24 4 L34 18" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="36" y="4" width="9" height="14" rx="1.5" className="fill-current opacity-18" /><path d="M36 18 L45 4" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M36 4 L45 18" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="24" y="20" width="10" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M24 33 L34 20" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M24 20 L34 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="36" y="20" width="9" height="13" rx="1.5" className="fill-current opacity-18" /><path d="M36 33 L45 20" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M36 20 L45 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 5) {
    return (
      <>
          <rect x="3" y="3" width="42" height="18" rx="1.5" className="fill-current opacity-18" /><path d="M3 21 L45 3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 3 L45 21" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="3" y="23" width="9" height="10" rx="1.5" className="fill-current opacity-18" /><path d="M3 33 L12 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 23 L12 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="14" y="23" width="9" height="10" rx="1.5" className="fill-current opacity-18" /><path d="M14 33 L23 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M14 23 L23 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="25" y="23" width="9" height="10" rx="1.5" className="fill-current opacity-18" /><path d="M25 33 L34 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M25 23 L34 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="36" y="23" width="9" height="10" rx="1.5" className="fill-current opacity-18" /><path d="M36 33 L45 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M36 23 L45 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 6) {
    return (
      <>
          <rect x="3" y="2" width="14" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="13" height="13" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="4" y="7" width="11" height="8" rx="1.5" className="fill-current opacity-18" /><path d="M4 15 L15 7" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M4 7 L15 15" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="18" y="6" width="13" height="13" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="19" y="7" width="11" height="8" rx="1.5" className="fill-current opacity-18" /><path d="M19 15 L30 7" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M19 7 L30 15" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="33" y="6" width="12" height="13" rx="1.5" className="fill-current" style={{opacity:0.08}} />
          <rect x="34" y="7" width="10" height="8" rx="1.5" className="fill-current opacity-18" /><path d="M34 15 L44 7" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M34 7 L44 15" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 7) {
    return (
      <>
          <rect x="3" y="1" width="14" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="4" width="42" height="9" rx="1.5" className="fill-current opacity-18" /><path d="M3 13 L45 4" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 4 L45 13" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="3" y="14" width="42" height="9" rx="1.5" className="fill-current opacity-18" /><path d="M3 23 L45 14" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 14 L45 23" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="3" y="24" width="42" height="9" rx="1.5" className="fill-current opacity-18" /><path d="M3 33 L45 24" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 24 L45 33" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 8) {
    return (
      <>
          <rect x="3" y="2" width="14" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="6" y="6" width="28" height="22" rx="1.5" className="fill-current opacity-18" /><path d="M6 28 L34 6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M6 6 L34 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="20" y="10" width="24" height="20" rx="1.5" className="fill-current opacity-18" /><path d="M20 30 L44 10" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M20 10 L44 30" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="4" y="14" width="18" height="16" rx="1.5" className="fill-current opacity-18" /><path d="M4 30 L22 14" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M4 14 L22 30" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'gallery' && v === 9) {
    return (
      <>
          <rect x="3" y="2" width="14" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="10" height="8" rx="1.5" className="fill-current opacity-18" /><path d="M3 15 L13 7" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 7 L13 15" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="16" y="9" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="16" y="12" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="18" width="10" height="8" rx="1.5" className="fill-current opacity-18" /><path d="M3 26 L13 18" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 18 L13 26" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="16" y="20" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="16" y="23" width="20" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="28" width="10" height="6" rx="1.5" className="fill-current opacity-18" /><path d="M3 34 L13 28" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M3 28 L13 34" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="16" y="29" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'gallery' && v === 10) {
    return (
      <>
          <rect x="2" y="4" width="44" height="28" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="10" width="18" height="16" rx="1.5" className="fill-current opacity-18" /><path d="M5 26 L23 10" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M5 10 L23 26" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <rect x="25" y="10" width="18" height="16" rx="1.5" className="fill-current opacity-18" /><path d="M25 26 L43 10" stroke="currentColor" strokeWidth="0.4" opacity="0.12" /><path d="M25 10 L43 26" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      </>
    );
  }
  if (type === 'faq' && v === 1) {
    return (
      <>
          <rect x="3" y="2" width="18" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="42" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="6" y="8" width="30" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="16" width="42" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="6" y="18" width="30" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="26" width="42" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="6" y="28" width="30" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 2) {
    return (
      <>
          <rect x="14" y="2" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="9" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="12" width="28" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <line x1="8" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="8" y="19" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="22" width="28" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <line x1="8" y1="26" x2="40" y2="26" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="8" y="29" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 3) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="20" height="13" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="9" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="13" width="16" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="25" y="6" width="20" height="13" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="27" y="9" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="27" y="13" width="16" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="21" width="20" height="13" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="24" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="25" y="21" width="20" height="13" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="27" y="24" width="16" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 4) {
    return (
      <>
          <rect x="3" y="6" width="16" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="12" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="24" y="5" width="20" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="24" y="8" width="18" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <line x1="24" y1="12" x2="45" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="24" y="15" width="20" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="24" y="18" width="18" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <line x1="24" y1="22" x2="45" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="24" y="25" width="20" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 5) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="8" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="8" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="11" width="26" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="17" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="17" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="20" width="26" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="26" width="4" height="2" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="26" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 6) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="4" y="6" width="40" height="27" rx="2" className="fill-current" style={{opacity:0.12}} />
          <rect x="8" y="10" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <line x1="8" y1="14" x2="40" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="8" y="17" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <line x1="8" y1="21" x2="40" y2="21" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="8" y="24" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 7) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="8" width="34" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="11" width="26" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="17" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="18" width="34" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="21" width="26" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="27" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="28" width="34" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 8) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="8" width="5" height="3" rx="1" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="8" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="12" width="26" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="18" width="5" height="3" rx="1" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="18" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="22" width="26" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="3" y="28" width="5" height="3" rx="1" className="fill-current" style={{opacity:0.4}} />
          <rect x="10" y="29" width="32" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'faq' && v === 9) {
    return (
      <>
          <rect x="10" y="2" width="28" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="9" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="12" width="24" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="10" y="18" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="21" width="24" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
          <rect x="10" y="27" width="28" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="30" width="24" height="1" rx="0.5" className="fill-current" style={{opacity:0.25}} />
      </>
    );
  }
  if (type === 'faq' && v === 10) {
    return (
      <>
          <rect x="2" y="3" width="44" height="30" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="6" width="16" height="1.8" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="11" width="38" height="6" rx="1.5" className="fill-current" style={{opacity:0.18}} />
          <rect x="8" y="13" width="30" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="19" width="38" height="6" rx="1.5" className="fill-current" style={{opacity:0.18}} />
          <rect x="8" y="21" width="30" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="5" y="27" width="38" height="5" rx="1.5" className="fill-current" style={{opacity:0.18}} />
          <rect x="8" y="28" width="30" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.55}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 1) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="13" height="14" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="9" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="6" cy="16" r="2" className="fill-current" style={{opacity:0.3}} />
          <rect x="10" y="15" width="5" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="18" y="6" width="13" height="14" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="20" y="9" width="9" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="21" cy="16" r="2" className="fill-current" style={{opacity:0.3}} />
          <rect x="33" y="6" width="12" height="14" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="35" y="9" width="8" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="36" cy="16" r="2" className="fill-current" style={{opacity:0.3}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 2) {
    return (
      <>
          <rect x="14" y="2" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="12" y="6" width="24" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="3" y="11" width="20" height="22" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="6" y="16" width="14" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="7" cy="26" r="2" className="fill-current" style={{opacity:0.3}} />
          <rect x="25" y="11" width="20" height="22" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="28" y="16" width="14" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="29" cy="26" r="2" className="fill-current" style={{opacity:0.3}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 3) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="6" width="2" height="8" rx="1" className="fill-current" style={{opacity:0.45}} />
          <rect x="8" y="7" width="34" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="8" y="11" width="20" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="17" width="2" height="8" rx="1" className="fill-current" style={{opacity:0.45}} />
          <rect x="8" y="18" width="34" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="8" y="22" width="20" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="28" width="2" height="6" rx="1" className="fill-current" style={{opacity:0.45}} />
          <rect x="8" y="29" width="34" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 4) {
    return (
      <>
          <rect x="3" y="6" width="16" height="2.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="12" width="16" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="24" y="4" width="21" height="9" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="26" y="7" width="17" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="24" y="15" width="21" height="9" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="26" y="18" width="17" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="24" y="26" width="21" height="7" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="26" y="28" width="17" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.35}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 5) {
    return (
      <>
          <rect x="2" y="4" width="24" height="28" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="5" y="10" width="18" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <circle cx="6" cy="24" r="2.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="11" y="23" width="10" height="1.5" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="29" y="4" width="17" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="31" y="7" width="13" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="29" y="14" width="17" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="31" y="17" width="13" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <rect x="29" y="24" width="17" height="8" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="31" y="27" width="13" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.3}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 6) {
    return (
      <>
          <rect x="14" y="2" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <circle cx="10" cy="12" r="4" className="fill-current" style={{opacity:0.3}} />
          <rect x="5" y="18" width="10" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="24" cy="12" r="4" className="fill-current" style={{opacity:0.3}} />
          <rect x="19" y="18" width="10" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.3}} />
          <circle cx="38" cy="12" r="4" className="fill-current" style={{opacity:0.3}} />
          <rect x="33" y="18" width="10" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.3}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 7) {
    return (
      <>
          <rect x="3" y="2" width="16" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="7" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="8" width="34" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="8" y="12" width="18" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="17" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="18" width="34" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="8" y="22" width="18" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="3" y="27" width="2" height="7" rx="1" className="fill-current" style={{opacity:0.5}} />
          <rect x="8" y="28" width="34" height="1.4" rx="0.5" className="fill-current" style={{opacity:0.35}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 8) {
    return (
      <>
          <rect x="14" y="4" width="20" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="10" y="14" width="28" height="2.5" rx="0.5" className="fill-current" style={{opacity:0.4}} />
          <rect x="16" y="20" width="16" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <circle cx="18" cy="28" r="1.2" className="fill-current" style={{opacity:0.35}} />
          <circle cx="24" cy="28" r="1.2" className="fill-current" style={{opacity:0.55}} />
          <circle cx="30" cy="28" r="1.2" className="fill-current" style={{opacity:0.35}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 9) {
    return (
      <>
          <rect x="8" y="2" width="32" height="2" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <rect x="8" y="8" width="32" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="8" y="11" width="20" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <line x1="8" y1="15" x2="40" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="8" y="18" width="32" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="8" y="21" width="20" height="1.1" rx="0.5" className="fill-current" style={{opacity:0.55}} />
          <line x1="8" y1="25" x2="40" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <rect x="8" y="28" width="32" height="1.3" rx="0.5" className="fill-current" style={{opacity:0.35}} />
      </>
    );
  }
  if (type === 'testimonials' && v === 10) {
    return (
      <>
          <rect x="2" y="4" width="44" height="28" rx="1.5" className="fill-current" style={{opacity:0.12}} />
          <rect x="5" y="10" width="18" height="16" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="8" y="14" width="12" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.35}} />
          <rect x="25" y="10" width="18" height="16" rx="1.5" className="fill-current" style={{opacity:0.15}} />
          <rect x="28" y="14" width="12" height="1.2" rx="0.5" className="fill-current" style={{opacity:0.35}} />
      </>
    );
  }

  return (
    <>
      <rect x="12" y="12" width="24" height="2.5" rx="0.5" className="fill-current opacity-55" />
      <rect x="14" y="17" width="20" height="1.5" rx="0.5" className="fill-current opacity-30" />
    </>
  );
}
