/**
 * Content schema evolution.
 *
 * Template.version = layout variant (1–10).
 * CONTENT_SCHEMA_VERSION = shape of Section.content fields for a section type.
 *
 * When you change registry fields (rename, restructure), bump CONTENT_SCHEMA_VERSION
 * and append a step in MIGRATIONS. Steps run in order from stored version → current.
 */

/** Bump when Section.content field shapes change across any section type. */
export const CONTENT_SCHEMA_VERSION = 1;

export type MigrationResult = {
  content: Record<string, unknown>;
  version: number;
  warnings: string[];
  changed: boolean;
};

type MigrationStep = {
  from: number;
  to: number;
  migrate: (key: string, content: Record<string, unknown>) => {
    content: Record<string, unknown>;
    warnings: string[];
  };
};

function ops() {
  // Lazy require breaks cycle: index re-exports this module.
  return require('./index') as typeof import('./index');
}

/**
 * v0 → v1: baseline. Strip unknown keys, keep meta, coerce types.
 * Future: e.g. doctors.credential → credentials[], hero.cta → ctaPrimary.
 */
const MIGRATIONS: MigrationStep[] = [
  {
    from: 0,
    to: 1,
    migrate(key, content) {
      const { validateSectionContent } = ops();
      const warnings: string[] = [];
      const next = { ...content };

      if (key === 'hero' && typeof next.cta === 'string' && next.ctaPrimary === undefined) {
        next.ctaPrimary = next.cta;
        delete next.cta;
        warnings.push('Renamed hero.cta → ctaPrimary');
      }
      if (key === 'doctors' && Array.isArray(next.doctors)) {
        next.doctors = (next.doctors as Record<string, unknown>[]).map((d, i) => {
          if (typeof d.credentials === 'string' && d.specialty === undefined) {
            warnings.push(`doctors[${i}]: credentials → specialty (legacy)`);
            const { credentials: _c, ...rest } = d;
            return { ...rest, specialty: d.credentials };
          }
          return d;
        });
      }

      const validated = validateSectionContent(key, next, next, { strictUnknown: false });
      if (!validated.ok) {
        warnings.push(`Validation soft-fail: ${validated.error}`);
        return { content: next, warnings };
      }

      const dropped = Object.keys(next).filter(
        (k) => !(k in validated.content) && !k.startsWith('__'),
      );
      if (dropped.length) {
        warnings.push(`Dropped unknown fields: ${dropped.join(', ')}`);
      }

      return { content: validated.content, warnings };
    },
  },
];

/**
 * Migrate section content from `fromVersion` up to CONTENT_SCHEMA_VERSION.
 * Unknown section types are returned unchanged with a warning.
 */
export function migrateSectionContent(
  key: string,
  raw: Record<string, unknown> | null | undefined,
  fromVersion: number | null | undefined,
): MigrationResult {
  const { getSectionType } = ops();
  const start = typeof fromVersion === 'number' && fromVersion >= 0 ? fromVersion : 0;
  let content: Record<string, unknown> =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? { ...raw } : {};
  const warnings: string[] = [];
  let version = start;
  let changed = start < CONTENT_SCHEMA_VERSION;

  if (!getSectionType(key)) {
    return {
      content,
      version: Math.max(start, CONTENT_SCHEMA_VERSION),
      warnings: [`Unknown section type "${key}" — content left as-is`],
      changed: false,
    };
  }

  for (const step of MIGRATIONS) {
    if (version !== step.from) continue;
    if (step.to > CONTENT_SCHEMA_VERSION) break;
    const result = step.migrate(key, content);
    content = result.content;
    warnings.push(...result.warnings);
    version = step.to;
    changed = true;
  }

  if (version < CONTENT_SCHEMA_VERSION) {
    warnings.push(
      `No migration path from v${version} → v${CONTENT_SCHEMA_VERSION}; content may be incomplete`,
    );
    version = CONTENT_SCHEMA_VERSION;
    changed = true;
  }

  return { content, version, warnings, changed };
}
