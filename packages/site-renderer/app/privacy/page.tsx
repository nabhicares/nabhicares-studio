import type { CSSProperties } from 'react';
import { loadSiteData } from '@/lib/site-data';
import { extractContactSummary, hrefForPage, navPagesFromSite } from '@/lib/site-chrome';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { ConsentBanner } from '@/components/ConsentBanner';
import { normalizeSystemPages } from '@nabhicares/section-registry';

export function generateMetadata() {
  const site = loadSiteData();
  const privacy = normalizeSystemPages(site.designTokens?.systemPages).privacy;
  return {
    title: `${privacy.title} — ${site.hospitalName}`,
    description: `Privacy notice for the ${site.hospitalName} website (DPDP-aligned)`,
  };
}

const h2: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.15rem',
  marginTop: '2rem',
  marginBottom: '0.65rem',
  letterSpacing: '-0.02em',
};

/** Privacy template — copy/layout from Design → System pages. */
export default function PrivacyPage() {
  const site = loadSiteData();
  const cfg = normalizeSystemPages(site.designTokens?.systemPages).privacy;
  const layout = cfg.layoutVersion;
  const wrap: CSSProperties = {
    maxWidth: layout === 3 ? 960 : 720,
    margin: '0 auto',
    padding: '3rem 1.5rem',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-fg)',
    lineHeight: 1.65,
  };
  const pages = navPagesFromSite(site.pages);
  const contact = extractContactSummary(site.pages);
  const homeHref = hrefForPage('privacy', 'home');
  const privacyHref = hrefForPage('privacy', 'privacy');
  const contactEmail = contact.email;
  const contactPhone = contact.phone;

  const defaultIntro = `This notice explains how ${site.hospitalName} handles personal information on this public marketing website, in line with India's Digital Personal Data Protection Act, 2023 (DPDP Act) principles. This site is not a patient portal and is not intended to collect clinical health records.`;

  const defaultForms = `If you use an appointment request form, we ask for details such as your name, phone number, and optionally email, preferred time, and a short message. These are used only to respond to your request and coordinate a visit. Submitting the form is your consent to that processing. You can withdraw consent by contacting the hospital; we will stop using the request for new outreach where required, subject to legal retention needs.`;

  const defaultRights = `Subject to applicable law, you may request access to, correction of, or erasure of personal data you provided through this website, and you may withdraw consent for further processing of form submissions. To exercise these rights, contact ${site.hospitalName} using the published contact details. You may also have the right to complain to the Data Protection Board of India once operational under the DPDP Act.`;

  const intro = cfg.intro.trim() || defaultIntro;
  const formsNote = cfg.formsNote.trim() || defaultForms;
  const rightsNote = cfg.rightsNote.trim() || defaultRights;

  const body = (
    <>
      <p style={{ marginBottom: '1.5rem' }}>
        <a href={homeHref} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
          ← {site.hospitalName}
        </a>
      </p>
      {layout === 3 ? (
        <div
          style={{
            padding: '1.25rem 1.35rem',
            marginBottom: '1.5rem',
            borderRadius: 'calc(var(--radius-button) + 4px)',
            background: 'color-mix(in srgb, var(--color-accent) 12%, var(--color-bg))',
            border: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
          }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', letterSpacing: '-0.03em', margin: 0 }}>
            {cfg.title}
          </h1>
        </div>
      ) : (
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', letterSpacing: '-0.03em' }}>
          {cfg.title}
        </h1>
      )}
      <p style={{ color: 'var(--color-muted)' }}>{intro}</p>

      {layout === 2 ? (
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            marginTop: '1.5rem',
          }}
        >
          <div>
            <h2 style={{ ...h2, marginTop: 0 }}>Who is responsible</h2>
            <p>
              {site.hospitalName} is the organisation responsible for personal data collected through
              this website (for example appointment requests). Contact the hospital using the details
              published on this site
              {contactPhone ? ` (phone: ${contactPhone})` : ''}
              {contactEmail ? ` or email: ${contactEmail}` : ''} if you have privacy questions or
              requests.
            </p>
            <h2 style={h2}>Appointment and contact requests</h2>
            <p>{formsNote}</p>
          </div>
          <div>
            <h2 style={{ ...h2, marginTop: 0 }}>Your rights</h2>
            <p>{rightsNote}</p>
            <h2 style={h2}>Cookies and choices</h2>
            <p>
              We store a small preference in your browser so we can remember whether you chose Accept
              all or Essential only. Optional embeds such as Google Maps load only if you accept all.
            </p>
          </div>
        </div>
      ) : (
        <>
          <h2 style={h2}>Who is responsible</h2>
          <p>
            {site.hospitalName} is the organisation responsible for personal data collected through
            this website (for example appointment requests). Contact the hospital using the details
            published on this site
            {contactPhone ? ` (phone: ${contactPhone})` : ''}
            {contactEmail ? ` or email: ${contactEmail}` : ''} if you have privacy questions or
            requests.
          </p>

          <h2 style={h2}>Information we publish</h2>
          <p>
            Content may include staff names, photos, biographies, and patient testimonials that the
            hospital has chosen to publish. If you believe information about you appears here without
            appropriate consent, contact the hospital and request correction or removal.
          </p>

          <h2 style={h2}>Appointment and contact requests</h2>
          <p>{formsNote}</p>

          <h2 style={h2}>Cookies, local storage, and choices</h2>
          <p>
            We store a small preference in your browser (local storage) so we can remember whether you
            chose <strong>Accept all</strong> or <strong>Essential only</strong>. That preference is
            essential for respecting your choice.
          </p>
          <p>
            <strong>Essential only:</strong> site browsing, remembering your consent choice, and
            processing forms you submit.
            <br />
            <strong>Accept all:</strong> also loads optional third-party embeds such as Google Maps
            previews. Directions links that open Google Maps / Maps apps in a new tab are separate
            from embeds and are only used when you click them.
          </p>
          <p>
            We do not currently run advertising or analytics trackers on this marketing site. If that
            changes, this notice and the consent banner will be updated before those tools are turned
            on.
          </p>

          <h2 style={h2}>Fonts and delivery</h2>
          <p>
            Page fonts and icons may be loaded from Google Fonts so the site displays as designed.
            Hosting and delivery of these pages is provided through Nabhi Studio / Nabhi Labs
            infrastructure acting as a technology provider for the hospital.
          </p>

          <h2 style={h2}>Your rights</h2>
          <p>{rightsNote}</p>

          <h2 style={h2}>Children</h2>
          <p>
            Appointment forms are intended for adults arranging care. Do not submit a child&apos;s
            personal details unless you are a parent or lawful guardian doing so for that purpose.
          </p>

          <h2 style={h2}>Updates</h2>
          <p>
            We may update this notice when features change. The published version on this page is the
            current one. Last template revision: August 2026.
          </p>
        </>
      )}

      <p style={{ marginTop: '2rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
        This is a practical template for hospital marketing sites. Replace with counsel-approved
        language where your organisation requires it.
      </p>
    </>
  );

  return (
    <>
      <SiteHeader
        hospitalName={site.hospitalName}
        currentSlug="privacy"
        pages={pages}
        contact={contact}
      />
      <main
        className={`nabhi-privacy nabhi-privacy-l0${layout}`}
        style={
          layout === 2
            ? {
                ...wrap,
                borderLeft: '3px solid var(--color-accent)',
                paddingLeft: 'clamp(1.25rem, 3vw, 2rem)',
              }
            : wrap
        }
      >
        {body}
      </main>
      <SiteFooter
        hospitalName={site.hospitalName}
        currentSlug="privacy"
        pages={pages}
        contact={contact}
      />
      <ConsentBanner hospitalName={site.hospitalName} privacyHref={privacyHref} />
    </>
  );
}
