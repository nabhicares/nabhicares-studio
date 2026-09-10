/**
 * Gemini hospital-bundle prompts — same JSON schema, different writing voice.
 * Studio import validates one shape; variants only change tone/emphasis.
 */

const JSON_SHAPE = `{
  "hospital": {
    "name": "string",
    "slug": "lowercase-kebab-slug",
    "seoTitle": "string",
    "seoDescription": "string under 160 chars",
    "ogImage": "https optional share image",
    "ogCardStyle": "hero | brand | custom"
  },
  "whatsappMessage": "short human WhatsApp note for the hospital owner (see rules below)",
  "sections": {
    "hero": {
      "title": "string",
      "body": "string",
      "ctaPrimary": "string",
      "ctaSecondary": "string",
      "image": ""
    },
    "about": {
      "title": "string",
      "body": "string",
      "image": "",
      "highlights": [{ "label": "string", "text": "string" }]
    },
    "doctors": {
      "title": "string",
      "body": "string",
      "doctors": [{ "name": "string", "specialty": "string", "bio": "string", "image": "" }]
    },
    "services": {
      "title": "string",
      "body": "string",
      "items": [{ "title": "string", "description": "string", "icon": "" }]
    },
    "contact": {
      "title": "string",
      "body": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "hours": "string (use \\\\n between lines)",
      "mapUrl": "https://maps.google.com/...",
      "ctaPrimary": "Get directions"
    },
    "faq": {
      "title": "string",
      "body": "string",
      "items": [{ "question": "string", "answer": "string" }]
    },
    "testimonials": {
      "title": "string",
      "body": "string",
      "items": [
        {
          "quote": "patient words only",
          "author": "name or initials",
          "role": "optional e.g. Outpatient",
          "image": "",
          "rating": "1-5 as string, optional"
        }
      ]
    }
  }
}`;

const SHARED_RULES = `Rules (strict):
- PLAIN TEXT ONLY in every string. Never use HTML or Markdown: no <b>, <br>, <p>, <span>, <div>, &lt;, &gt;, or any other tags. Write "Emergency Care" not "<b>Emergency Care</b>".
- testimonials.items MUST use only these keys per item: quote, author, role, image, rating. Never use name or text. Prefer "items": [] unless you carefully paraphrase a real public review.
- Leave image fields as "" (operator will add URLs in Studio).
- Include contact.phone, contact.address, contact.hours, contact.mapUrl from Maps when available.
- Return raw JSON only — no \`\`\`json fences, no commentary before or after.

whatsappMessage rules (required when listing context is available):
- Write as a real person from Nabhi Labs texting the hospital owner/manager. Warm, specific, not a marketing blast.
- Mention how you found them (Google Maps / the area or city from the listing).
- If they have no website (or only a weak/outdated page), say so plainly and why that matters (patients search online and pick places that look clear and reachable).
- If the listing shows a rating and review count, use the real numbers only. Never invent ratings. If missing, skip numbers.
- Suggest 1-2 concrete things a simple site helps with (hours, phone, doctors, trust when comparing options).
- End with the demo link using exactly these placeholders on their own lines when possible:
  {{liveUrl}}
  and if useful a backup line with {{pathUrl}}
- You may also use {{name}} for the hospital name.
- Length: about 4 to 8 short lines. Plain punctuation only.
- Do NOT use em dashes or en dashes. Do not write "I hope this finds you well", "leverage", "elevate", "delve", "seamless", or "as an AI". No bullet lists. No hashtags.

Hospital / listing context:
`;

function buildPrompt(styleBlock: string): string {
  return `You are helping build a hospital marketing website for Nabhi Studio.

I am viewing a hospital on Google Maps (or I will paste listing details below). Extract only what you can reasonably infer from the listing / my paste. Do not invent clinical claims, doctor credentials, or fake patient quotes. If unknown, use "" or [].

${styleBlock}

Return ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:

${JSON_SHAPE}

${SHARED_RULES}`;
}

export type GeminiHospitalBundlePromptId =
  | 'standard'
  | 'trust_emergency'
  | 'local_family'
  | 'services_led'
  | 'reviews_led';

export type GeminiHospitalBundlePromptDef = {
  id: GeminiHospitalBundlePromptId;
  label: string;
  description: string;
  prompt: string;
};

const STYLE_STANDARD = `Writing style for this template (Standard):
- Balanced multi-specialty hospital demo. Clear, professional, warm but not flowery.
- Hero: one strong benefit line + short body; CTAs like "Call Now" and "Get Directions" (or Contact Us).
- About: 2-4 factual highlights from the listing (hours, area, specialties mentioned).
- Services: only departments/services you can infer from Maps text; keep items short.
- FAQ: practical patient questions (hours, location, how to reach, what to bring) based on listing facts.
- Doctors: only if Maps names clinicians; otherwise "doctors": [].
- WhatsApp: calm, helpful; mention Maps find + missing/weak website if true.`;

const STYLE_TRUST_EMERGENCY = `Writing style for this template (Trust & emergency):
- Lead with safety, access, and speed. Prefer facts that imply readiness (24 hours, emergency, ambulance, open now) ONLY if the listing shows them.
- Hero title shorter and urgent in tone (not clickbait). Primary CTA "Call Now"; secondary "Get Directions".
- About highlights: hours, emergency access, location clarity for people under stress.
- FAQ must prioritize emergency hours, phone, how to find the entrance / area, what to do on arrival — still only from listing facts.
- Services: put emergency / critical care first when listed; otherwise general clinical services.
- Doctors: only named clinicians from Maps; else [].
- WhatsApp: mention you saw them on Maps; stress that patients looking for help need a clear phone and hours page. Keep it human, not alarmist.`;

const STYLE_LOCAL_FAMILY = `Writing style for this template (Local & family):
- Warm neighbourhood hospital voice. Put the city or area from the listing into the hero title or body when known.
- Softer CTAs: "Contact Us" and "Get Directions" (Call Now only if it fits).
- About: community trust, approachable care, local landmark/address cues from Maps — no invented history.
- FAQ: parking/area, visiting, family-friendly practical questions grounded in listing info.
- Services: everyday care framing (OPD, maternity, general, etc.) only if Maps supports them.
- Doctors: only if named on Maps; else [].
- WhatsApp: friendly local tone ("saw {{name}} on Maps in [area]"); explain a simple site helps families check hours and phone before they visit.`;

const STYLE_SERVICES_LED = `Writing style for this template (Services-led):
- Lead with departments and treatments visible on the listing. Hero title or body should name 1-2 real service themes from Maps (e.g. cardiac, ortho) — never invent.
- Prefer denser services.items (up to what Maps supports); short titles + one-line descriptions.
- About can briefly frame multi-specialty or focus areas from listing text.
- Doctors: only named people on Maps with specialty if shown; else [].
- FAQ: how to book / which department / hours for services — only from known facts.
- CTAs: "Contact Us" + "Get Directions" or "Call Now" if phone exists.
- WhatsApp: mention the specialty/service angle you saw on Maps and that a clear services page helps patients choose.`;

const STYLE_REVIEWS_LED = `Writing style for this template (Reviews-led):
- Use ONLY when the listing shows a rating and/or review count. If missing, still fill the site factually but leave testimonials.items as [] and do not invent social proof.
- About body may mention the real rating and review count in plain words (e.g. "Rated 4.5 from 200+ Google reviews") — numbers must match the listing exactly.
- testimonials.items: carefully paraphrase up to 3 real public review themes if visible; each item MUST use quote, author, role, image, rating keys only. Prefer [] if unsure.
- Hero: trust-forward but not braggy; CTAs Call Now / Get Directions.
- FAQ: can include "why patients choose this hospital" only if grounded in listing themes (location, hours, specialties) — no fake awards.
- WhatsApp: include the real rating/count if present; say patients compare options online and a clear site plus strong Maps presence helps.`;

export const GEMINI_HOSPITAL_BUNDLE_PROMPTS: GeminiHospitalBundlePromptDef[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Balanced multi-specialty demo',
    prompt: buildPrompt(STYLE_STANDARD),
  },
  {
    id: 'trust_emergency',
    label: 'Trust & emergency',
    description: '24/7, Call Now, safety-first',
    prompt: buildPrompt(STYLE_TRUST_EMERGENCY),
  },
  {
    id: 'local_family',
    label: 'Local & family',
    description: 'Warm neighbourhood hospital voice',
    prompt: buildPrompt(STYLE_LOCAL_FAMILY),
  },
  {
    id: 'services_led',
    label: 'Services-led',
    description: 'Departments first from Maps',
    prompt: buildPrompt(STYLE_SERVICES_LED),
  },
  {
    id: 'reviews_led',
    label: 'Reviews-led',
    description: 'Rating/social proof when Maps has it',
    prompt: buildPrompt(STYLE_REVIEWS_LED),
  },
];

export const DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID: GeminiHospitalBundlePromptId =
  'standard';

/** Backward-compatible default prompt (Standard). */
export const GEMINI_HOSPITAL_BUNDLE_PROMPT =
  GEMINI_HOSPITAL_BUNDLE_PROMPTS.find((p) => p.id === 'standard')!.prompt;

export function getGeminiHospitalBundlePrompt(
  id?: string | null,
): GeminiHospitalBundlePromptDef {
  const found = GEMINI_HOSPITAL_BUNDLE_PROMPTS.find((p) => p.id === id);
  return found ?? GEMINI_HOSPITAL_BUNDLE_PROMPTS[0]!;
}

/** Next prompt id in catalog order (for field-ops rotation). */
export function nextGeminiHospitalBundlePromptId(
  currentId?: string | null,
): GeminiHospitalBundlePromptId {
  const list = GEMINI_HOSPITAL_BUNDLE_PROMPTS;
  const idx = list.findIndex((p) => p.id === currentId);
  const next = list[(idx >= 0 ? idx + 1 : 0) % list.length]!;
  return next.id;
}

export function listGeminiHospitalBundlePromptMeta(): {
  id: GeminiHospitalBundlePromptId;
  label: string;
  description: string;
}[] {
  return GEMINI_HOSPITAL_BUNDLE_PROMPTS.map(({ id, label, description }) => ({
    id,
    label,
    description,
  }));
}
