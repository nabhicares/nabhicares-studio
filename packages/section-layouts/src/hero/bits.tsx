/** Resolve CTA href: explicit content href, then site link, else # */
export function resolveHref(
  explicit: string | undefined,
  fallback: string | undefined,
): string {
  if (explicit && explicit.trim()) return explicit.trim();
  return fallback || '#';
}
