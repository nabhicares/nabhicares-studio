'use client';

import { useState } from 'react';
import {
  liveSiteUrl,
  pathStyleLiveUrl,
  cdnRootDomain,
  platformDnsRecords,
  customDomainDnsRecords,
  type DnsRecordHint,
} from '@/lib/cdn';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="shrink-0 px-xs py-0.5 font-inter text-label-sm text-primary underline"
      title="Copy"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        });
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function RecordRows({ records }: { records: DnsRecordHint[] }) {
  if (!records.length) return null;
  return (
    <ul className="flex flex-col gap-sm">
      {records.map((r) => (
        <li
          key={`${r.type}-${r.name}-${r.value}`}
          className="border border-outline-variant px-sm py-sm"
        >
          <div className="flex items-start justify-between gap-xs">
            <div className="min-w-0 font-inter text-label-sm break-all">
              <span className="text-outline">{r.type}</span>
              <span className="text-outline"> · </span>
              <span className="font-semibold text-on-surface">{r.name}</span>
              <span className="text-outline"> → </span>
              <span className="text-on-surface">{r.value}</span>
            </div>
            <CopyButton text={`${r.type}\t${r.name}\t${r.value}`} />
          </div>
          {r.note ? (
            <p className="mt-xs font-inter text-label-sm text-outline">{r.note}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function DnsSetupPanel({
  hospitalSlug,
  customDomain,
}: {
  hospitalSlug: string;
  customDomain: string;
}) {
  const root = cdnRootDomain();
  const platform = platformDnsRecords();
  const custom = customDomainDnsRecords(customDomain);
  const slug = hospitalSlug.trim() || 'your-slug';

  return (
    <section className="flex flex-col gap-md border-t border-outline-variant pt-lg">
      <div>
        <h4 className="font-outfit text-[15px] font-semibold text-on-surface">DNS setup</h4>
        <p className="mt-xs font-inter text-label-sm text-outline">
          Studio does not change DNS for you. Add these at Cloudflare (not BigRock, if nameservers
          are already Cloudflare). Use <span className="font-semibold">DNS only</span> (grey cloud)
          until Vercel shows Valid. Never point records at 127.0.0.1.
        </p>
      </div>

      {root ? (
        <>
          <div className="flex flex-col gap-xs">
            <p className="font-inter text-label-sm font-semibold text-on-surface">
              How this hospital maps
            </p>
            <p className="font-inter text-label-sm text-outline break-all">
              Slug <span className="font-semibold text-on-surface">{slug}</span> →{' '}
              <a
                className="text-primary underline"
                href={liveSiteUrl(slug)}
                target="_blank"
                rel="noreferrer"
              >
                {liveSiteUrl(slug)}
              </a>
            </p>
            <p className="font-inter text-label-sm text-outline">
              The CDN reads the hostname, strips <span className="font-semibold">.{root}</span>, and
              serves that slug. One wildcard covers every hospital — no new DNS row per site.
            </p>
            <p className="font-inter text-label-sm text-outline break-all">
              Fallback path:{' '}
              <a
                className="text-primary underline"
                href={pathStyleLiveUrl(slug)}
                target="_blank"
                rel="noreferrer"
              >
                {pathStyleLiveUrl(slug)}
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-xs">
            <p className="font-inter text-label-sm font-semibold text-on-surface">
              Platform DNS (once for {root})
            </p>
            <RecordRows records={platform} />
            <p className="font-inter text-label-sm text-outline">
              Confirm the CNAME target in Vercel Domains if it differs from the default.
            </p>
          </div>
        </>
      ) : (
        <p className="font-inter text-label-sm text-outline">
          Set <code className="text-on-surface">NEXT_PUBLIC_CDN_ROOT_DOMAIN</code> (e.g.
          nabhilabs.info) on Studio and redeploy to show subdomain DNS here. Path URLs still work.
        </p>
      )}

      {customDomain.trim() ? (
        <div className="flex flex-col gap-xs">
          <p className="font-inter text-label-sm font-semibold text-on-surface">
            Custom domain DNS
          </p>
          <RecordRows records={custom} />
        </div>
      ) : (
        <p className="font-inter text-label-sm text-outline">
          Enter a custom domain above to see the CNAME that hospital must add at their registrar.
        </p>
      )}
    </section>
  );
}
