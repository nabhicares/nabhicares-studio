'use client';

import { useMemo, useState } from 'react';
import type { Page } from './StudioEditor';

export type ChecklistItem = {
  id: string;
  label: string;
  severity: 'warn' | 'info';
  pageSlug?: string;
};

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export function buildPublishChecklist(pages: Page[]): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const allSections = pages.flatMap((p) =>
    p.sections.filter((s) => s.enabled).map((s) => ({ page: p, section: s })),
  );

  const contacts = allSections.filter(({ section }) => section.template.key === 'contact');
  const bestContact = contacts.find(({ page }) => page.slug === 'contact') ?? contacts[0];
  const phone = bestContact ? str(bestContact.section.content?.phone) : '';
  const hours = bestContact ? str(bestContact.section.content?.hours) : '';
  const address = bestContact ? str(bestContact.section.content?.address) : '';
  const mapUrl = bestContact ? str(bestContact.section.content?.mapUrl) : '';

  if (!phone) {
    items.push({
      id: 'phone',
      label: 'Add a phone number (header + contact)',
      severity: 'warn',
      pageSlug: bestContact?.page.slug ?? 'contact',
    });
  }
  if (!hours) {
    items.push({
      id: 'hours',
      label: 'Add visiting hours',
      severity: 'warn',
      pageSlug: bestContact?.page.slug ?? 'contact',
    });
  }
  if (!address && !mapUrl) {
    items.push({
      id: 'address',
      label: 'Add address or a Maps link',
      severity: 'warn',
      pageSlug: bestContact?.page.slug ?? 'contact',
    });
  }

  const heroes = allSections.filter(({ section }) => section.template.key === 'hero');
  for (const { page, section } of heroes) {
    if (!str(section.content?.image)) {
      items.push({
        id: `hero-img-${section.id}`,
        label: `Hero on “${page.slug}” has no image`,
        severity: 'info',
        pageSlug: page.slug,
      });
    }
  }

  const doctors = allSections.filter(({ section }) => section.template.key === 'doctors');
  for (const { page, section } of doctors) {
    const list = Array.isArray(section.content?.doctors)
      ? (section.content.doctors as unknown[])
      : [];
    if (list.length === 0) {
      items.push({
        id: `doctors-${section.id}`,
        label: `Doctors on “${page.slug}” is empty`,
        severity: 'info',
        pageSlug: page.slug,
      });
    }
  }

  const galleries = allSections.filter(({ section }) => section.template.key === 'gallery');
  for (const { page, section } of galleries) {
    const images = Array.isArray(section.content?.images)
      ? (section.content.images as unknown[])
      : Array.isArray(section.content?.items)
        ? (section.content.items as unknown[])
        : [];
    if (images.length === 0) {
      items.push({
        id: `gallery-${section.id}`,
        label: `Gallery on “${page.slug}” has no photos`,
        severity: 'info',
        pageSlug: page.slug,
      });
    }
  }

  return items;
}

export function PublishChecklist({
  pages,
  onJump,
}: {
  pages: Page[];
  onJump?: (pageSlug: string) => void;
}) {
  const items = useMemo(() => buildPublishChecklist(pages), [pages]);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  const warns = items.filter((i) => i.severity === 'warn').length;

  return (
    <div className="mx-lg mt-md mb-0 rounded-lg border border-outline-variant bg-surface-container-lowest p-md shrink-0">
      <div className="flex items-start justify-between gap-sm mb-sm">
        <div>
          <h3 className="font-inter text-label-md font-semibold text-on-surface">
            Before you publish
          </h3>
          <p className="font-inter text-label-sm text-outline mt-xs">
            {warns > 0
              ? `${warns} important gap${warns === 1 ? '' : 's'} after import`
              : 'Optional polish items'}
          </p>
        </div>
        <button
          type="button"
          className="text-outline hover:text-on-surface p-xs"
          title="Dismiss"
          onClick={() => setDismissed(true)}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <ul className="flex flex-col gap-xs m-0 p-0 list-none">
        {items.slice(0, 6).map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="w-full text-left flex items-center gap-sm px-sm py-xs rounded-md hover:bg-surface-container border-0 bg-transparent cursor-pointer"
              onClick={() => item.pageSlug && onJump?.(item.pageSlug)}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  item.severity === 'warn' ? 'text-primary' : 'text-outline'
                }`}
              >
                {item.severity === 'warn' ? 'priority_high' : 'info'}
              </span>
              <span className="font-inter text-label-sm text-on-surface">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
