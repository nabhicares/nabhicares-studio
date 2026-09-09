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
      body: 'Download the zip, unzip it, open chrome://extensions, turn on Developer mode, then Load unpacked and pick the unzipped folder.',
    },
    {
      title: 'Get your token',
      body: 'Open CRM → Issue token. Paste the token into the extension. Studio URL should be https://studio.nabhilabs.info',
    },
    {
      title: 'Maps → Gemini → paste JSON',
      body: 'Open the hospital on Google Maps. In the extension click Copy Gemini prompt, paste it into Gemini with the listing details. Copy Gemini’s JSON (only the JSON) into the extension and Create + publish.',
    },
    {
      title: 'Polish in Studio',
      body: 'Open the site → fix copy, upload & crop photos (hero 16:9, doctors 3:4), check contact phone/address. Don’t invent doctor credentials.',
    },
    {
      title: 'SEO & share',
      body: 'In Social: set share title/description (hospital name + city), pick OG image, turn on Allow search engines when ready. Publish again after changes.',
    },
    {
      title: 'CRM status',
      body: 'Demo = live for the visit. Accept if they say yes. Decline → 30-day trash. Use the campaign QR pack for print sheets.',
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

      <p className="font-inter text-label-sm text-outline mt-md mb-0">
        Tip: if Gemini wraps JSON in code fences, paste it anyway — Studio strips them. Prefer a
        block that starts with an opening curly brace. To use a Drive zip instead, set{' '}
        <code className="text-on-surface">NEXT_PUBLIC_EXTENSION_DOWNLOAD_URL</code> on Vercel to
        your share link.
      </p>
    </section>
  );
}
