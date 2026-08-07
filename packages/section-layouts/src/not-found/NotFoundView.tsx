import type { CSSProperties } from 'react';
import type { NotFoundProps } from './types';

/** Themed 404 — used by live site and Studio draft canvas. */
export function NotFoundView({
  hospitalName,
  title,
  body,
  primaryCta,
  secondaryCta,
  homeHref,
  contactHref,
  layoutVersion = 1,
}: NotFoundProps) {
  const layout = Math.min(3, Math.max(1, Number(layoutVersion) || 1));
  const wrap: CSSProperties = {
    minHeight: '70vh',
    display: 'flex',
    alignItems: layout === 2 ? 'stretch' : 'center',
    justifyContent: 'center',
    padding: layout === 3 ? 0 : 'clamp(2rem, 6vw, 4rem) clamp(1.25rem, 4vw, 2rem)',
    background:
      layout === 3
        ? 'var(--color-bg)'
        : 'radial-gradient(120% 80% at 10% 0%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 55%), var(--color-bg)',
  };

  if (layout === 2) {
    return (
      <main className="nabhi-not-found nabhi-not-found-l02" style={wrap}>
        <div className="nabhi-not-found-split">
          <div className="nabhi-not-found-split-accent" aria-hidden>
            <span className="nabhi-not-found-code">404</span>
          </div>
          <div className="nabhi-not-found-inner">
            <p className="nabhi-not-found-kicker">{hospitalName}</p>
            <h1 className="nabhi-not-found-title">{title}</h1>
            <p className="nabhi-not-found-body">{body}</p>
            <div className="nabhi-not-found-actions">
              <a href={homeHref} className="nabhi-btn nabhi-not-found-primary">
                {primaryCta}
              </a>
              <a href={contactHref} className="nabhi-btn nabhi-not-found-secondary">
                {secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (layout === 3) {
    return (
      <main className="nabhi-not-found nabhi-not-found-l03" style={wrap}>
        <div className="nabhi-not-found-banner" aria-hidden />
        <div
          className="nabhi-not-found-inner"
          style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2rem)' }}
        >
          <p className="nabhi-not-found-kicker">{hospitalName}</p>
          <p className="nabhi-not-found-code" aria-hidden>
            404
          </p>
          <h1 className="nabhi-not-found-title">{title}</h1>
          <p className="nabhi-not-found-body">{body}</p>
          <div className="nabhi-not-found-actions">
            <a href={homeHref} className="nabhi-btn nabhi-not-found-primary">
              {primaryCta}
            </a>
            <a href={contactHref} className="nabhi-btn nabhi-not-found-secondary">
              {secondaryCta}
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="nabhi-not-found nabhi-not-found-l01" style={wrap}>
      <div className="nabhi-not-found-inner">
        <p className="nabhi-not-found-kicker">{hospitalName}</p>
        <p className="nabhi-not-found-code" aria-hidden>
          404
        </p>
        <h1 className="nabhi-not-found-title">{title}</h1>
        <p className="nabhi-not-found-body">{body}</p>
        <div className="nabhi-not-found-actions">
          <a href={homeHref} className="nabhi-btn nabhi-not-found-primary">
            {primaryCta}
          </a>
          <a href={contactHref} className="nabhi-btn nabhi-not-found-secondary">
            {secondaryCta}
          </a>
        </div>
      </div>
    </main>
  );
}
