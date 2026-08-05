# Maps → Gemini → Studio content

Fill hospital marketing copy from a Google Maps listing without typing every field by hand.

## Flow

1. Open the hospital on **Google Maps** (desktop Chrome).
2. Open **Gemini** (side panel / app) with that page in context, or paste the listing text.
3. In Studio → hospital **settings** (gear) → **Import from Gemini** → **Copy Gemini prompt**.
4. Paste the prompt into Gemini, then paste any extra listing notes under it.
5. Copy Gemini’s JSON (no markdown fences).
6. Paste into Studio → **Apply hospital JSON**.
7. Review doctors / clinical claims → add real image URLs → **Publish**.

Design and layouts stay Nabhi. Gemini only fills content fields.

## Rules for operators

- Verify phone, hours, and doctor names before publish.
- Leave `image` fields empty (`""`) unless you have a real URL — Maps photos usually cannot be scraped.
- Prefer empty `testimonials.items` unless paraphrasing clear public reviews.
- No HTML in any string.

## Prompt

The live prompt string is `GEMINI_HOSPITAL_BUNDLE_PROMPT` in `@nabhicares/section-registry` (also the **Copy Gemini prompt** button). It asks for:

```json
{
  "hospital": {
    "name": "",
    "slug": "",
    "seoTitle": "",
    "seoDescription": ""
  },
  "sections": {
    "hero": { "title": "", "body": "", "ctaPrimary": "", "ctaSecondary": "", "image": "" },
    "about": {
      "title": "",
      "body": "",
      "image": "",
      "highlights": [{ "label": "", "text": "" }]
    },
    "doctors": {
      "title": "",
      "body": "",
      "doctors": [{ "name": "", "specialty": "", "bio": "", "image": "" }]
    },
    "services": {
      "title": "",
      "body": "",
      "items": [{ "title": "", "description": "", "icon": "" }]
    },
    "contact": {
      "title": "",
      "body": "",
      "phone": "",
      "email": "",
      "address": "",
      "hours": "",
      "mapUrl": "",
      "ctaPrimary": ""
    },
    "faq": {
      "title": "",
      "body": "",
      "items": [{ "question": "", "answer": "" }]
    },
    "testimonials": {
      "title": "",
      "body": "",
      "items": []
    }
  }
}
```

Per-section paste still works in the section inspector (**JSON** tab) via `ContentJsonImport`.

## Example (fictional)

```json
{
  "hospital": {
    "name": "Greenfield Multispecialty Hospital",
    "slug": "greenfield-multispecialty",
    "seoTitle": "Greenfield Multispecialty Hospital | Care near you",
    "seoDescription": "Outpatient clinics, diagnostics, and 24/7 emergency care in Greenfield."
  },
  "sections": {
    "hero": {
      "title": "Care close to home",
      "body": "Multispecialty teams for families across Greenfield — clear answers, calm visits.",
      "ctaPrimary": "Book appointment",
      "ctaSecondary": "Our services",
      "image": ""
    },
    "about": {
      "title": "About Greenfield",
      "body": "We focus on accessible specialty care with on-site diagnostics.",
      "image": "",
      "highlights": [
        { "label": "Emergency", "text": "24/7 trauma and urgent care" },
        { "label": "Diagnostics", "text": "Imaging and pathology on campus" }
      ]
    },
    "doctors": {
      "title": "Our doctors",
      "body": "Meet the care team listed on the hospital profile.",
      "doctors": [
        {
          "name": "Dr. Asha Nair",
          "specialty": "General Medicine",
          "bio": "Outpatient and chronic care.",
          "image": ""
        }
      ]
    },
    "services": {
      "title": "Our services",
      "body": "",
      "items": [
        { "title": "Outpatient clinics", "description": "Specialty consultations", "icon": "" },
        { "title": "Diagnostics", "description": "Lab and imaging", "icon": "" },
        { "title": "Emergency", "description": "Round-the-clock care", "icon": "" }
      ]
    },
    "contact": {
      "title": "Visit us",
      "body": "Call ahead for appointments; emergencies welcome any time.",
      "phone": "+91 98765 43210",
      "email": "care@greenfield.example",
      "address": "12 Care Avenue, Greenfield, KA 560001",
      "hours": "Mon–Sat 8:00–20:00\nEmergency 24/7",
      "mapUrl": "https://maps.google.com/?q=Greenfield+Multispecialty+Hospital",
      "ctaPrimary": "Get directions"
    },
    "faq": {
      "title": "Frequently asked questions",
      "body": "",
      "items": [
        {
          "question": "Do I need an appointment?",
          "answer": "Walk-ins are welcome; appointments reduce wait time."
        }
      ]
    },
    "testimonials": {
      "title": "Patient stories",
      "body": "",
      "items": []
    }
  }
}
```

## API

`POST /api/hospitals/:hospitalId/import-bundle` with `{ "json": "<string>" }` applies hospital SEO fields and section content by template key; creates missing sections on the home page when needed.
