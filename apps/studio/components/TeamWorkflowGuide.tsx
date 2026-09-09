'use client';

/**
 * Simple team how-to on the Studio home screen.
 * Download URL: NEXT_PUBLIC_EXTENSION_DOWNLOAD_URL, else /downloads/nabhi-gemini-paste.zip
 */
export function TeamWorkflowGuide() {
  const downloadUrl =
    (typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_EXTENSION_DOWNLOAD_URL?.trim()) ||
    '/downloads/nabhi-gemini-paste.zip';

  const steps: { title: string; body: string }[] = [
    {
      title: 'Install the Chrome extension',
      body: 'Download the zip, unzip it, open chrome://extensions, turn on Developer mode, then Load unpacked and pick the unzipped folder. Re-download after updates (v1.2+).',
    },
    {
      title: 'Get your token',
      body: 'Open CRM → Issue token. Paste the token into the extension. Studio URL should be https://studio.nabhilabs.info',
    },
    {
      title: 'Maps → Gemini → paste JSON',
      body: 'Copy Gemini prompt in the extension, paste into Gemini with Maps details (include rating/reviews if shown). Paste JSON back — it should include whatsappMessage. Create + publish clears the box so you can keep queueing.',
    },
    {
      title: 'Polish in Studio',
      body: 'After create, open Photos to pick hero/OG from candidates (or upload & crop). Fix copy, check contact phone/address. Don’t invent doctor credentials.',
    },
    {
      title: 'SEO & share on WhatsApp',
      body: 'Gemini should include a personalized whatsappMessage from the Maps listing (rating, no website, area). Review/edit it via the note icon next to chat before you send. Social tab still handles OG image.',
    },
    {
      title: 'CRM status',
      body: 'Demo = live for the visit. Accept if they say yes. Decline → 30-day trash. Use the campaign QR pack for print sheets.',
    },
    {
      title: 'Custom domain vs self-host',
      body: 'Prefer Hospital settings → Custom domain on Nabhi. If they insist on hosting themselves: Publish → Download site zip (includes SETUP.md). Never give Studio source.',
    },
  ];

  return (
    <section
      id="team-guide"
      className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg mb-lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-md mb-md">
        <div>
          <h2 className="font-outfit text-[18px] font-semibold text-brand-ink">
            How we build demo sites
          </h2>
          <p className="font-inter text-body-sm text-outline mt-xs max-w-xl">
            Simple path for the team: Chrome extension + Gemini + a quick polish in Studio.
          </p>
        </div>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-flex items-center gap-xs px-md py-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download Chrome extension
        </a>
      </div>

      <ol className="list-none m-0 p-0 flex flex-col gap-sm">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="flex gap-md items-start rounded-lg border border-outline-variant/80 px-md py-sm"
          >
            <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-outfit text-[13px] font-semibold shrink-0">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="font-inter text-body-sm font-semibold text-on-surface">
                {s.title}
              </div>
              <p className="font-inter text-label-sm text-outline mt-xs m-0">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-md rounded-lg border border-outline-variant bg-surface-container-low/50 px-md py-sm font-inter text-label-sm text-outline">
        <p className="m-0 font-semibold text-on-surface">Domains (do this once)</p>
        <p className="m-0 mt-xs">
          On Vercel <strong>nabhi-cdn</strong>, keep one Valid domain:{' '}
          <code className="text-on-surface">*.nabhilabs.info</code>. Do{' '}
          <strong>not</strong> add each hospital slug by hand. If a subdomain fails, use the
          backup path URL:{' '}
          <code className="text-on-surface">https://nabhi-cdn.vercel.app/&#123;slug&#125;/</code>
          .
        </p>
      </div>

      <p className="font-inter text-label-sm text-outline mt-md mb-0">
        Tip: if Gemini wraps JSON in code fences, paste it anyway — Studio strips them. Drive zip
        override: set{' '}
        <code className="text-on-surface">NEXT_PUBLIC_EXTENSION_DOWNLOAD_URL</code> as a Config
        (not Secret) on Vercel.
      </p>
    </section>
  );
}
