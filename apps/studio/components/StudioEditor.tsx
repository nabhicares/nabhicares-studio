'use client';

import { apiFetch } from '@/lib/api-client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LAYOUT_COUNT,
  SECTION_REGISTRY,
  getSectionType,
  type FieldDef,
  type SectionTypeDef,
} from '@nabhicares/section-registry';
import { DesignPanel } from './DesignPanel';
import { PublishDrawer } from './PublishDrawer';
import { DraftCanvas, ViewportToggle, type PreviewViewport } from './DraftCanvas';
import { LayoutWireframe } from './LayoutWireframe';
import { ImageField, looksLikeImageField } from './ImageField';
import { DraftPreview } from './DraftPreview';
import { HospitalSettings } from './HospitalSettings';
import { ContentJsonImport } from './ContentJsonImport';
import { SectionRowMenu } from './SectionRowMenu';
import { PublishChecklist } from './PublishChecklist';
import { AppointmentRequestsPanel } from './AppointmentRequestsPanel';
import type { DesignTokens } from '@nabhicares/section-registry';

type LayoutTemplate = { id: string; key: string; version: number };

export type Template = { id: string; key: string; version: number; schema: unknown };
export type Section = {
  id: string;
  order: number;
  enabled: boolean;
  contentSchemaVersion?: number;
  content: Record<string, unknown>;
  template: Template;
};
export type Page = {
  id: string;
  slug: string;
  sections: Section[];
};

type Tab = 'pages' | 'sections' | 'design' | 'requests' | 'publish';

function ContentForm({
  fields,
  value,
  hospitalId,
  onChange,
}: {
  fields: FieldDef[];
  value: Record<string, unknown>;
  hospitalId: string;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      {fields.map((field) => {
        if (field.type === 'string' || field.type === 'text') {
          if (field.type === 'string' && looksLikeImageField(field.name, field.label)) {
            return (
              <ImageField
                key={field.name}
                label={field.label}
                hospitalId={hospitalId}
                value={String(value[field.name] ?? '')}
                onChange={(url) => onChange({ ...value, [field.name]: url })}
              />
            );
          }
          const Tag = field.type === 'text' ? 'textarea' : 'input';
          return (
            <div className="flex flex-col gap-xs" key={field.name}>
              <label className="font-inter text-label-sm text-outline ml-1">{field.label}</label>
              <Tag
                className="field-input resize-none"
                rows={field.type === 'text' ? 4 : undefined}
                value={String(value[field.name] ?? '')}
                onChange={(e) => onChange({ ...value, [field.name]: e.target.value })}
              />
            </div>
          );
        }
        if (field.type === 'string[]') {
          const list = Array.isArray(value[field.name]) ? (value[field.name] as string[]) : [];
          return (
            <div className="flex flex-col gap-xs" key={field.name}>
              <label className="font-inter text-label-sm text-outline ml-1">
                {field.label} (one per line)
              </label>
              <textarea
                className="field-input resize-none"
                rows={4}
                value={list.join('\n')}
                onChange={(e) =>
                  onChange({
                    ...value,
                    [field.name]: e.target.value.split('\n').filter((s) => s.length > 0),
                  })
                }
              />
            </div>
          );
        }
        if (field.type === 'object[]') {
          const list = Array.isArray(value[field.name])
            ? (value[field.name] as Record<string, string>[])
            : [];
          return (
            <div key={field.name} className="flex flex-col gap-sm">
              <label className="font-inter text-label-sm text-outline">{field.label}</label>
              {list.map((item, idx) => (
                <div key={idx} className="p-sm rounded-lg border border-outline-variant space-y-sm">
                  {(field.itemFields ?? []).map((sub) =>
                    looksLikeImageField(sub.name, sub.label) ? (
                      <ImageField
                        key={sub.name}
                        label={sub.label}
                        hospitalId={hospitalId}
                        value={item[sub.name] ?? ''}
                        onChange={(url) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], [sub.name]: url };
                          onChange({ ...value, [field.name]: next });
                        }}
                      />
                    ) : (
                      <div className="flex flex-col gap-xs" key={sub.name}>
                        <label className="font-inter text-label-sm text-outline">{sub.label}</label>
                        {sub.type === 'text' ? (
                          <textarea
                            className="field-input resize-none"
                            rows={2}
                            value={item[sub.name] ?? ''}
                            onChange={(e) => {
                              const next = [...list];
                              next[idx] = { ...next[idx], [sub.name]: e.target.value };
                              onChange({ ...value, [field.name]: next });
                            }}
                          />
                        ) : (
                          <input
                            className="field-input"
                            value={item[sub.name] ?? ''}
                            onChange={(e) => {
                              const next = [...list];
                              next[idx] = { ...next[idx], [sub.name]: e.target.value };
                              onChange({ ...value, [field.name]: next });
                            }}
                          />
                        )}
                      </div>
                    ),
                  )}
                  <button
                    type="button"
                    className="btn-ghost text-error"
                    onClick={() =>
                      onChange({ ...value, [field.name]: list.filter((_, i) => i !== idx) })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  const blank: Record<string, string> = {};
                  for (const sub of field.itemFields ?? []) blank[sub.name] = '';
                  onChange({ ...value, [field.name]: [...list, blank] });
                }}
              >
                Add item
              </button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function StudioEditor({
  hospitalId,
  hospitalSlug: initialSlug,
  hospitalName: initialName,
  seoTitle = '',
  seoDescription = '',
  customDomain = '',
  isLive = false,
  migrationWarnings = [],
  pages: initialPages,
}: {
  hospitalId: string;
  hospitalSlug: string;
  hospitalName: string;
  seoTitle?: string;
  seoDescription?: string;
  customDomain?: string;
  isLive?: boolean;
  migrationWarnings?: string[];
  pages: Page[];
}) {
  const [hospitalSlug, setHospitalSlug] = useState(initialSlug);
  const [hospitalName, setHospitalName] = useState(initialName);
  const [pages, setPages] = useState(initialPages);
  const [pageSlug, setPageSlug] = useState(initialPages[0]?.slug ?? 'home');
  const [tab, setTab] = useState<Tab>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialPages[0]?.sections[0]?.id ?? null,
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pageDragIndex, setPageDragIndex] = useState<number | null>(null);
  const [inspectorPane, setInspectorPane] = useState<'content' | 'layout' | 'config'>('content');
  const [contentMode, setContentMode] = useState<'form' | 'json'>('form');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [layoutOptions, setLayoutOptions] = useState<LayoutTemplate[]>([]);
  const [addingSection, setAddingSection] = useState(false);
  const [addingPage, setAddingPage] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState('');
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameSlug, setRenameSlug] = useState('');
  const [designTokens, setDesignTokens] = useState<DesignTokens | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePage = useMemo(
    () => pages.find((p) => p.slug === pageSlug) ?? pages[0],
    [pages, pageSlug],
  );
  const sections = activePage?.sections ?? [];
  const selected = sections.find((s) => s.id === selectedSectionId) ?? sections[0];
  const def = selected
    ? (getSectionType(selected.template.key) as SectionTypeDef | undefined)
    : undefined;

  useEffect(() => {
    if (!selected?.template.key) {
      setLayoutOptions([]);
      return;
    }
    void (async () => {
      const res = await apiFetch(`/api/templates?key=${encodeURIComponent(selected.template.key)}`);
      const data = (await res.json()) as LayoutTemplate[];
      setLayoutOptions(Array.isArray(data) ? data : []);
    })();
  }, [selected?.template.key]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  function updateLocalSections(next: Section[]) {
    if (!activePage) return;
    setPages((prev) =>
      prev.map((p) => (p.id === activePage.id ? { ...p, sections: next } : p)),
    );
  }

  function scheduleContentAutosave(sectionId: string, content: Record<string, unknown>) {
    setDirty(true);
    dirtyRef.current = true;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      void (async () => {
        setSaving(true);
        const res = await apiFetch(`/api/sections/${sectionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        setSaving(false);
        if (res.ok) {
          setDirty(false);
          dirtyRef.current = false;
          setMessage('Autosaved');
        } else {
          setMessage('Autosave failed — click Save');
        }
      })();
    }, 900);
  }

  async function persistOrder(next: Section[]) {
    if (!activePage) return;
    setSaving(true);
    await apiFetch(`/api/pages/${activePage.id}/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: next.map((s) => s.id) }),
    });
    setSaving(false);
    setMessage('Order saved');
  }

  async function patchSection(id: string, patch: Record<string, unknown>) {
    setSaving(true);
    const res = await apiFetch(`/api/sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    updateLocalSections(sections.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    setSaving(false);
    setMessage('Saved');
  }

  async function addSection(type: string) {
    if (!activePage) return;
    setSaving(true);
    setAddingSection(false);
    const res = await apiFetch(`/api/pages/${activePage.id}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, layout: 1 }),
    });
    if (!res.ok) {
      setSaving(false);
      setMessage('Could not add section');
      return;
    }
    const created = (await res.json()) as Section;
    updateLocalSections([...sections, created]);
    setSelectedSectionId(created.id);
    setTab('sections');
    setInspectorPane('content');
    setSaving(false);
    setMessage(`Added ${getSectionType(type)?.label ?? type}`);
  }

  async function deleteSection(id: string) {
    if (!confirm('Delete this section?')) return;
    setSaving(true);
    const res = await apiFetch(`/api/sections/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setSaving(false);
      setMessage('Could not delete section');
      return;
    }
    const next = sections.filter((s) => s.id !== id);
    updateLocalSections(next);
    if (selectedSectionId === id) setSelectedSectionId(next[0]?.id ?? null);
    setSaving(false);
    setMessage('Section deleted');
  }

  async function duplicateSection(id: string) {
    setSaving(true);
    const res = await apiFetch(`/api/sections/${id}/duplicate`, { method: 'POST' });
    if (!res.ok) {
      setSaving(false);
      setMessage('Could not duplicate');
      return;
    }
    const created = (await res.json()) as Section;
    const idx = sections.findIndex((s) => s.id === id);
    const next = [...sections];
    next.splice(idx + 1, 0, created);
    // normalize local orders to match server shift
    updateLocalSections(next.map((s, i) => ({ ...s, order: i })));
    setSelectedSectionId(created.id);
    setTab('sections');
    setInspectorPane('content');
    setSaving(false);
    setMessage('Section duplicated');
  }

  async function addPage() {
    const slug = newPageSlug.trim();
    if (!slug) return;
    setSaving(true);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSaving(false);
      setMessage(data.error ?? 'Could not add page');
      return;
    }
    const page = data as Page;
    setPages((prev) => [...prev, { ...page, sections: page.sections ?? [] }]);
    setPageSlug(page.slug);
    setSelectedSectionId(null);
    setNewPageSlug('');
    setAddingPage(false);
    setTab('sections');
    setSaving(false);
    setMessage(`Added page ${page.slug}`);
  }

  async function renamePage(pageId: string) {
    const slug = renameSlug.trim();
    if (!slug) return;
    setSaving(true);
    const res = await apiFetch(`/api/pages/${pageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSaving(false);
      setMessage(data.error ?? 'Could not rename');
      return;
    }
    const updated = data as Page;
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, slug: updated.slug } : p)));
    if (pageSlug === pages.find((p) => p.id === pageId)?.slug) setPageSlug(updated.slug);
    setRenamingPageId(null);
    setSaving(false);
    setMessage('Page renamed');
  }

  async function deletePage(pageId: string) {
    if (!confirm('Delete this page and all its sections?')) return;
    setSaving(true);
    const res = await apiFetch(`/api/pages/${pageId}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSaving(false);
      setMessage(data.error ?? 'Could not delete page');
      return;
    }
    const remaining = pages.filter((p) => p.id !== pageId);
    setPages(remaining);
    if (!remaining.find((p) => p.slug === pageSlug)) {
      setPageSlug(remaining[0]?.slug ?? 'home');
      setSelectedSectionId(remaining[0]?.sections[0]?.id ?? null);
    }
    setSaving(false);
    setMessage('Page deleted');
  }

  function onDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...sections];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    updateLocalSections(next);
    setDragIndex(null);
    void persistOrder(next);
  }

  async function persistPageOrder(next: Page[]) {
    setSaving(true);
    await apiFetch(`/api/hospitals/${hospitalId}/pages/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: next.map((p) => p.id) }),
    });
    setSaving(false);
    setMessage('Page order saved');
  }

  function onPageDrop(targetIndex: number) {
    if (pageDragIndex === null || pageDragIndex === targetIndex) return;
    const next = [...pages];
    const [moved] = next.splice(pageDragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setPages(next);
    setPageDragIndex(null);
    void persistPageOrder(next);
  }

  const railBtn = (id: Tab, icon: string, title: string) => (
    <button
      type="button"
      title={title}
      onClick={() => {
        setShowSettings(false);
        setTab(id);
      }}
      className={`w-full aspect-square flex items-center justify-center rounded-lg transition-all ${
        tab === id && !showSettings
          ? 'bg-primary-container text-on-primary-container'
          : 'text-on-surface-variant hover:bg-surface-container'
      }`}
    >
      <span className={`material-symbols-outlined ${tab === id && !showSettings ? 'filled' : ''}`}>
        {icon}
      </span>
    </button>
  );

  return (
    <div className="bg-canvas text-on-surface font-inter overflow-hidden h-screen">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant z-50">
        <div className="flex justify-between items-center h-full px-lg">
          <div className="flex items-center gap-md min-w-0">
            <Link href="/" className="font-outfit text-[17px] font-semibold text-brand-ink shrink-0 tracking-tight">
              Nabhi Studio
            </Link>
            <div className="h-5 w-px bg-outline-variant mx-xs shrink-0" />
            <div className="flex items-center gap-sm text-outline text-label-md truncate">
              <span className="truncate text-on-surface-variant">{hospitalName}</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-brand-ink font-semibold">{activePage?.slug ?? '—'}</span>
              <span
                className={`ml-sm rounded-md px-sm py-xs font-inter text-label-sm font-medium ${
                  isLive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {isLive ? 'Live' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="hidden sm:block">
            <ViewportToggle value={previewViewport} onChange={setPreviewViewport} />
          </div>

          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="p-sm text-on-surface-variant hover:bg-surface-container rounded-lg"
              title="Draft preview"
            >
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button type="button" className="btn-primary" onClick={() => setTab('publish')}>
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100dvh-3.5rem)] mt-14 overflow-hidden min-h-0">
        {/* Icon rail */}
        <nav className="w-14 bg-surface-container-lowest border-r border-outline-variant flex flex-col items-center py-md gap-md z-40 shrink-0">
          <div className="flex flex-col gap-sm w-full px-xs">
            {railBtn('pages', 'description', 'Pages')}
            {railBtn('sections', 'layers', 'Sections')}
            {railBtn('design', 'palette', 'Design')}
            {railBtn('requests', 'event_available', 'Requests')}
            {railBtn('publish', 'cloud_upload', 'Publish')}
          </div>
          <div className="mt-auto flex flex-col gap-sm w-full px-xs">
            <button
              type="button"
              className={`w-full aspect-square flex items-center justify-center rounded-lg ${
                showSettings
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              title="Hospital settings"
              onClick={() => {
                setShowSettings(true);
                setTab('sections');
              }}
            >
              <span className={`material-symbols-outlined ${showSettings ? 'filled' : ''}`}>
                settings
              </span>
            </button>
          </div>
        </nav>

        {migrationWarnings.length > 0 ? (
          <div className="bg-primary-container/40 border-b border-brand-sage px-lg py-sm font-inter text-label-sm text-on-surface shrink-0">
            Content schema migrated on open ({migrationWarnings.length} note
            {migrationWarnings.length === 1 ? '' : 's'}). Check Config if fields look wrong.
          </div>
        ) : null}

        {/* Left panel — keep Sections visible in Style so you can switch back easily */}
        {(tab === 'pages' || tab === 'sections' || tab === 'design') && (
          <aside className="w-60 bg-surface-container-lowest border-r border-outline-variant p-md flex flex-col gap-md z-30 shrink-0">
            {tab === 'pages' ? (
              <>
                <div>
                  <h2 className="font-outfit text-h3 text-on-surface">Pages</h2>
                  <p className="font-inter text-body-sm text-outline">
                    {saving ? 'Saving…' : message || 'Hospital routes'}
                  </p>
                </div>
                <div className="flex flex-col gap-xs overflow-y-auto flex-1 min-h-0">
                  {pages.map((p, index) => (
                    <div
                      key={p.id}
                      draggable={renamingPageId !== p.id}
                      onDragStart={() => setPageDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => onPageDrop(index)}
                      className={`rounded-lg border-2 p-sm ${
                        p.slug === pageSlug
                          ? 'bg-primary-container/20 border-primary-container'
                          : 'border-transparent hover:bg-surface-container'
                      }`}
                    >
                      {renamingPageId === p.id ? (
                        <div className="flex flex-col gap-xs">
                          <input
                            className="field-input"
                            value={renameSlug}
                            autoFocus
                            onChange={(e) => setRenameSlug(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') void renamePage(p.id);
                              if (e.key === 'Escape') setRenamingPageId(null);
                            }}
                          />
                          <div className="flex gap-xs">
                            <button
                              type="button"
                              className="btn-primary flex-1 text-label-sm py-xs"
                              onClick={() => void renamePage(p.id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn-ghost flex-1"
                              onClick={() => setRenamingPageId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-outline text-[18px] cursor-grab">
                            drag_indicator
                          </span>
                          <button
                            type="button"
                            className="flex items-center gap-sm flex-1 text-left min-w-0"
                            onClick={() => {
                              setPageSlug(p.slug);
                              setSelectedSectionId(p.sections[0]?.id ?? null);
                              setTab('sections');
                            }}
                          >
                            <span className="material-symbols-outlined text-[20px]">description</span>
                            <span className="font-inter text-label-md font-semibold truncate">
                              {p.slug}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="p-0.5 text-on-surface-variant"
                            title="Rename"
                            onClick={() => {
                              setRenamingPageId(p.id);
                              setRenameSlug(p.slug);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            className="p-0.5 text-on-surface-variant"
                            title="Delete"
                            disabled={pages.length <= 1}
                            onClick={() => void deletePage(p.id)}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-sm border-t border-outline-variant shrink-0">
                  {addingPage ? (
                    <div className="flex flex-col gap-xs">
                      <input
                        className="field-input"
                        placeholder="page-slug"
                        value={newPageSlug}
                        autoFocus
                        onChange={(e) => setNewPageSlug(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void addPage();
                        }}
                      />
                      <button
                        type="button"
                        className="btn-primary w-full"
                        disabled={saving || !newPageSlug.trim()}
                        onClick={() => void addPage()}
                      >
                        Create page
                      </button>
                      <button
                        type="button"
                        className="btn-ghost w-full"
                        onClick={() => {
                          setAddingPage(false);
                          setNewPageSlug('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary w-full flex items-center justify-center gap-xs"
                      onClick={() => setAddingPage(true)}
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Add page
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-outfit text-h3 text-on-surface">Sections</h2>
                  <p className="font-inter text-body-sm text-outline">
                    {saving
                      ? 'Saving…'
                      : dirty
                        ? 'Unsaved changes…'
                        : message || 'Drag to reorder'}
                  </p>
                </div>
                <div className="flex flex-col gap-0 overflow-y-auto flex-1 min-h-0 -mx-xs">
                  {sections.map((section, index) => {
                    const label =
                      getSectionType(section.template.key)?.label ?? section.template.key;
                    const active = section.id === selected?.id;
                    return (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop(index)}
                        className={`flex items-center gap-xs px-sm py-xs rounded-md group ${
                          active
                            ? 'bg-primary-container/50 text-on-primary-container'
                            : 'hover:bg-surface-container text-on-surface'
                        } ${section.enabled ? '' : 'opacity-45'}`}
                      >
                        <span className="material-symbols-outlined text-outline text-[18px] cursor-grab shrink-0">
                          drag_indicator
                        </span>
                        <button
                          type="button"
                          className="flex-1 min-w-0 text-left py-xs border-0 bg-transparent p-0 cursor-pointer"
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            if (tab !== 'design') {
                              setTab('sections');
                              setInspectorPane('content');
                            }
                          }}
                        >
                          <span className="font-inter text-label-md font-semibold block truncate">
                            {label}
                          </span>
                          <span className="font-inter text-[11px] text-outline">
                            L{String(section.template.version).padStart(2, '0')}
                          </span>
                        </button>
                        <SectionRowMenu
                          enabled={section.enabled}
                          onToggleEnabled={() =>
                            void patchSection(section.id, { enabled: !section.enabled })
                          }
                          onDuplicate={() => void duplicateSection(section.id)}
                          onDelete={() => void deleteSection(section.id)}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="pt-sm border-t border-outline-variant shrink-0">
                  {addingSection ? (
                    <div className="flex flex-col gap-xs">
                      <p className="font-inter text-label-sm text-outline px-xs">Choose type</p>
                      {SECTION_REGISTRY.map((def) => (
                        <button
                          key={def.key}
                          type="button"
                          disabled={saving}
                          onClick={() => void addSection(def.key)}
                          className="flex items-center gap-sm p-sm rounded-lg text-left hover:bg-surface-container text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[20px] text-primary">
                            add
                          </span>
                          <span className="font-inter text-label-md font-semibold">{def.label}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        className="btn-ghost w-full mt-xs"
                        onClick={() => setAddingSection(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary w-full flex items-center justify-center gap-xs"
                      disabled={!activePage || saving}
                      onClick={() => {
                        setTab('sections');
                        setAddingSection(true);
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Add section
                    </button>
                  )}
                </div>
              </>
            )}
          </aside>
        )}

        {/* Center */}
        <main className="flex-1 bg-surface-container relative flex flex-col items-stretch justify-start overflow-hidden min-w-0 min-h-0">
          {tab === 'publish' ? (
            <div className="w-full h-full flex items-center justify-center p-lg bg-surface-dim relative">
              <div className="absolute inset-0 opacity-40 pointer-events-none p-xl">
                <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-xl p-xl space-y-lg">
                  <div className="h-12 w-2/3 bg-surface-container rounded-lg" />
                  <div className="grid grid-cols-3 gap-md">
                    <div className="h-40 bg-surface-container rounded-lg" />
                    <div className="h-40 bg-surface-container rounded-lg" />
                    <div className="h-40 bg-surface-container rounded-lg" />
                  </div>
                </div>
              </div>
              <PublishDrawer
                hospitalId={hospitalId}
                hospitalSlug={hospitalSlug}
                customDomain={customDomain}
                onClose={() => setTab('sections')}
                onOpenSettings={() => {
                  setTab('sections');
                  setShowSettings(true);
                }}
              />
            </div>
          ) : tab === 'requests' ? (
            <div className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain bg-surface">
              <AppointmentRequestsPanel hospitalId={hospitalId} />
            </div>
          ) : tab === 'design' ? (
            <div className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain">
              <div className="px-xl py-xl flex flex-col items-center gap-md w-full pb-24">
                <div className="sm:hidden">
                  <ViewportToggle value={previewViewport} onChange={setPreviewViewport} />
                </div>
                <DraftCanvas
                  hospitalId={hospitalId}
                  hospitalName={hospitalName}
                  hospitalSlug={hospitalSlug}
                  page={activePage}
                  pages={pages}
                  selectedSectionId={selected?.id}
                  viewport={previewViewport}
                  designTokens={designTokens}
                  onSelectSection={setSelectedSectionId}
                />
              </div>
            </div>
          ) : (
            <>
              <PublishChecklist
                pages={pages}
                onJump={(slug) => {
                  setPageSlug(slug);
                  setTab('sections');
                  setShowSettings(false);
                }}
              />
              <div className="sm:hidden w-full px-md pt-sm shrink-0 flex justify-center">
                <ViewportToggle value={previewViewport} onChange={setPreviewViewport} />
              </div>
              <div className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain">
                <div className="px-xl pb-24 pt-md flex justify-center items-start w-full">
                  <DraftCanvas
                    hospitalId={hospitalId}
                    hospitalName={hospitalName}
                    hospitalSlug={hospitalSlug}
                    page={activePage}
                    pages={pages}
                    selectedSectionId={selected?.id}
                    viewport={previewViewport}
                    designTokens={designTokens}
                    onSelectSection={(id) => {
                      setSelectedSectionId(id);
                      setTab('sections');
                      setInspectorPane('content');
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </main>

        {/* Right inspector — Style | Content, or Hospital settings */}
        {showSettings ? (
          <HospitalSettings
            hospitalId={hospitalId}
            hospitalName={hospitalName}
            hospitalSlug={hospitalSlug}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            customDomain={customDomain}
            onClose={() => setShowSettings(false)}
            onUpdated={(next) => {
              setHospitalName(next.name);
              setHospitalSlug(next.slug);
            }}
          />
        ) : tab === 'design' ? (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant flex flex-col z-40 shrink-0">
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-outfit text-[15px] font-semibold text-brand-ink">Design</h3>
              <p className="font-inter text-label-sm text-outline mt-xs">
                Site-wide tokens for the patient preview
              </p>
            </div>
            <DesignPanel hospitalId={hospitalId} onTokensChange={setDesignTokens} />
          </aside>
        ) : tab === 'requests' || tab === 'publish' ? null : selected ? (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant flex flex-col z-40 shrink-0">
            <div className="flex border-b border-outline-variant">
              {(
                [
                  { id: 'content' as const, label: 'Content' },
                  { id: 'layout' as const, label: 'Layout' },
                  { id: 'config' as const, label: 'Config' },
                ] as const
              ).map((pane) => (
                <button
                  key={pane.id}
                  type="button"
                  className={`flex-1 py-md font-inter text-label-md transition-colors ${
                    inspectorPane === pane.id
                      ? 'text-primary font-bold border-b-2 border-primary bg-surface-container-low'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                  onClick={() => setInspectorPane(pane.id)}
                >
                  {pane.label}
                </button>
              ))}
            </div>
            {inspectorPane === 'config' ? (
              <div className="p-lg flex flex-col gap-lg overflow-y-auto flex-1">
                <div className="flex flex-col gap-xs">
                  <label className="font-inter text-label-sm text-outline">Section ID</label>
                  <input className="field-input font-mono text-xs" value={selected.id} readOnly />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-inter text-label-sm text-outline">Type</label>
                  <input
                    className="field-input"
                    value={`${selected.template.key} · L${String(selected.template.version).padStart(2, '0')}`}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-inter text-label-sm text-outline">Content schema</label>
                  <input
                    className="field-input font-mono text-xs"
                    value={`v${selected.contentSchemaVersion ?? 0}`}
                    readOnly
                  />
                  <p className="font-inter text-label-sm text-outline">
                    Auto-migrates on open / publish when the registry shape changes
                  </p>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-inter text-label-sm text-outline">Anchor ID</label>
                  <input
                    className="field-input"
                    placeholder="e.g. our-doctors"
                    value={String(selected.content?.__anchor ?? '')}
                    onChange={(e) => {
                      const content = { ...selected.content, __anchor: e.target.value };
                      updateLocalSections(
                        sections.map((s) => (s.id === selected.id ? { ...s, content } : s)),
                      );
                      scheduleContentAutosave(selected.id, content);
                    }}
                  />
                  <p className="font-inter text-label-sm text-outline">
                    Optional deep-link target for this section
                  </p>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-inter text-label-sm text-outline">Editor notes</label>
                  <textarea
                    className="field-input resize-none"
                    rows={4}
                    placeholder="Internal notes (not published)"
                    value={String(selected.content?.__notes ?? '')}
                    onChange={(e) => {
                      const content = { ...selected.content, __notes: e.target.value };
                      updateLocalSections(
                        sections.map((s) => (s.id === selected.id ? { ...s, content } : s)),
                      );
                      scheduleContentAutosave(selected.id, content);
                    }}
                  />
                </div>
                <label className="flex items-center gap-sm text-body-sm text-on-surface-variant">
                  <input
                    type="checkbox"
                    checked={selected.enabled}
                    onChange={(e) => patchSection(selected.id, { enabled: e.target.checked })}
                  />
                  Section enabled (included in publish)
                </label>
              </div>
            ) : inspectorPane === 'layout' ? (
              <div className="p-lg flex flex-col gap-md overflow-y-auto flex-1">
                <div>
                  <h3 className="font-inter text-label-md font-semibold text-on-surface">
                    Layout variant
                  </h3>
                  <p className="font-inter text-label-sm text-outline mt-xs">
                    Layout 01 is the product design system. Other variants are experimental.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  {Array.from({ length: LAYOUT_COUNT }, (_, i) => i + 1).map((version) => {
                    const tpl = layoutOptions.find((t) => t.version === version) ?? null;
                    const active = selected.template.version === version;
                    const recommended = version === 1;
                    const key = selected.template.key;
                    const l01Only = key === 'contact' || key === 'map' || key === 'appointments';
                    const heroAlt = key === 'hero' && version === 2;
                    const blocked = l01Only && version > 1;
                    const softDeprecated = !recommended && !heroAlt && (l01Only || version > 1);
                    return (
                      <button
                        key={version}
                        type="button"
                        disabled={!tpl || saving || blocked}
                        title={
                          blocked
                            ? `${getSectionType(key)?.label ?? key} only ships Layout 01`
                            : heroAlt
                              ? 'Layout 02 · centered overlay'
                              : tpl
                                ? recommended
                                  ? 'Layout 01 · recommended'
                                  : `Layout ${String(version).padStart(2, '0')} · experimental`
                                : 'Not seeded'
                        }
                        onClick={() => {
                          if (!tpl) return;
                          void patchSection(selected.id, { templateId: tpl.id });
                        }}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-colors text-on-surface-variant disabled:opacity-40 border ${
                          active
                            ? 'border-primary bg-primary-container/40 text-primary ring-1 ring-primary'
                            : softDeprecated
                              ? 'border-outline-variant/60 bg-surface-container-low/50 opacity-70 hover:opacity-100'
                              : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        {recommended ? (
                          <span className="absolute top-1 left-1.5 z-10 font-inter text-[9px] font-bold uppercase tracking-wide text-primary bg-primary-container/80 px-1 rounded">
                            Rec
                          </span>
                        ) : null}
                        <div className="absolute inset-1.5 text-inherit">
                          <LayoutWireframe
                            sectionType={selected.template.key}
                            version={version}
                          />
                        </div>
                        <span className="absolute bottom-1 right-1.5 font-inter text-[10px] font-bold opacity-70">
                          {String(version).padStart(2, '0')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-lg flex flex-col gap-lg overflow-y-auto flex-1">
                <div className="flex flex-col gap-sm">
                  <div className="flex items-center justify-between gap-sm">
                    <h3 className="font-inter text-label-md font-semibold text-on-surface">
                      {def?.label ?? selected.template.key}
                    </h3>
                    {def ? (
                      <div className="flex rounded-lg bg-surface-container p-xs gap-xs">
                        <button
                          type="button"
                          className={`px-sm py-xs rounded text-label-sm font-semibold ${
                            contentMode === 'form'
                              ? 'bg-primary text-on-primary'
                              : 'text-on-surface-variant'
                          }`}
                          onClick={() => setContentMode('form')}
                        >
                          Form
                        </button>
                        <button
                          type="button"
                          className={`px-sm py-xs rounded text-label-sm font-semibold ${
                            contentMode === 'json'
                              ? 'bg-primary text-on-primary'
                              : 'text-on-surface-variant'
                          }`}
                          onClick={() => setContentMode('json')}
                        >
                          JSON
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {def ? (
                    contentMode === 'json' ? (
                      <ContentJsonImport
                        key={selected.id}
                        sectionKey={selected.template.key}
                        def={def}
                        current={selected.content ?? {}}
                        onApply={(content) => {
                          updateLocalSections(
                            sections.map((s) =>
                              s.id === selected.id ? { ...s, content } : s,
                            ),
                          );
                          scheduleContentAutosave(selected.id, content);
                          setContentMode('form');
                        }}
                      />
                    ) : (
                      <ContentForm
                        fields={def.fields}
                        hospitalId={hospitalId}
                        value={selected.content ?? {}}
                        onChange={(content) => {
                          updateLocalSections(
                            sections.map((s) =>
                              s.id === selected.id ? { ...s, content } : s,
                            ),
                          );
                          scheduleContentAutosave(selected.id, content);
                        }}
                      />
                    )
                  ) : (
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(selected.content, null, 2)}
                    </pre>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() => {
                    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
                    void (async () => {
                      await patchSection(selected.id, { content: selected.content });
                      setDirty(false);
                      dirtyRef.current = false;
                    })();
                  }}
                >
                  {dirty ? 'Save now' : 'Saved'}
                </button>
              </div>
            )}
          </aside>
        ) : null}
      </div>

      {showPreview ? (
        <DraftPreview
          hospitalId={hospitalId}
          hospitalName={hospitalName}
          hospitalSlug={hospitalSlug}
          initialSlug={pageSlug}
          onClose={() => setShowPreview(false)}
        />
      ) : null}
    </div>
  );
}
