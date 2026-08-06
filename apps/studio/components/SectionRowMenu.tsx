'use client';

import { useEffect, useRef, useState } from 'react';

/** Overflow actions for a section row (duplicate / delete / visibility). */
export function SectionRowMenu({
  enabled,
  onToggleEnabled,
  onDuplicate,
  onDelete,
}: {
  enabled: boolean;
  onToggleEnabled: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="p-xs rounded-md text-outline hover:bg-surface-container hover:text-on-surface"
        title="Section actions"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span className="material-symbols-outlined text-[18px]">more_vert</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full mt-xs z-50 min-w-[160px] rounded-lg border border-outline-variant bg-surface-container-lowest shadow-soft py-xs"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center gap-sm px-md py-sm font-inter text-label-sm text-on-surface hover:bg-surface-container text-left"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onToggleEnabled();
            }}
          >
            <span className="material-symbols-outlined text-[18px]">
              {enabled ? 'visibility_off' : 'visibility'}
            </span>
            {enabled ? 'Hide section' : 'Show section'}
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center gap-sm px-md py-sm font-inter text-label-sm text-on-surface hover:bg-surface-container text-left"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDuplicate();
            }}
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            Duplicate
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center gap-sm px-md py-sm font-inter text-label-sm text-error hover:bg-error-container/40 text-left"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
