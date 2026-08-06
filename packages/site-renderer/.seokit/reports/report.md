# SEOKit Run Verification Audit Report (Schema v3.0.0)

*   **Timestamp**: 2026-08-06T08:37:29.049Z
*   **Engine Version**: 3.0.0
*   **Provider**: StaticProvider
*   **Framework**: Vanilla
*   **Duration**: 1500ms
*   **Pages Audited**: 1

## Score & Severity Summary

| Score | Errors | Warnings | Info |
|---|---|---|---|
| **53/100** | 0 | 0 | 104 |

## Evidence Records & Diagnostics

| Status | Rule ID | File | Message | Evidence Refs |
|---|---|---|---|---|
| ✅ PASS | `seo.metadata.exists` | Global | Page metadata tags verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.canonical.exists` | Global | Missing canonical URL link tag | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.opengraph.valid` | Global | Missing Open Graph meta tags: og:image | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.twitter.valid` | Global | All essential Twitter Cards meta tags are present. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.schema.valid` | Global | Successfully validated 1 JSON-LD blocks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.robots.valid` | Global | Missing robots.txt content | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.sitemap.valid` | Global | Missing sitemap.xml content | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.lighthouse.score` | Global | {"lighthouse":{"performance":90,"accessibility":95,"bestPractices":95,"seo":95}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.webvitals.lcp` | Global | {"webVitals":{"lcp":1.5,"cls":0.02,"inp":100}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.bundle.size` | Global | Script tags count (5) is within target limit (8). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.images.optimized` | Global | All images are properly sized, lazy-loaded, and use modern formats. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.fonts.optimized` | Global | Web fonts optimization: Consider preloading critical web fonts to avoid layout shifts. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.resources.renderblocking` | Global | Render-blocking scripts detected in head: /ashirwad-hospital/_next/static/chunks/polyfills-42372ed130431b0a.js. Use async/defer. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.compression.caching` | Global | Caching/compression recommendations: Compression (Gzip/Brotli) not enabled; Caching (Cache-Control headers) not defined | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.wcag.lang` | Global | HTML lang attribute verified: "en". | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.roles` | Global | ARIA role configurations verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `accessibility.semantic.structure` | Global | Missing semantic structural HTML elements: <header>, <main>, <footer>. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.heading.hierarchy` | Global | Heading element flow conforms to strict semantic hierarchy requirements. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.form.labels` | Global | All form controls are correctly bound to accessible text labels. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.images.alt` | Global | Image elements feature valid alternative text attributes. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.interactive` | Global | All custom interactive element ARIA and focus configurations are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.content.structure` | Global | Paragraph boundaries and structure meet layout recommendations. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.headings.questions` | Global | Answer Engine target: headings should align directly with user query terms. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.faq.schema` | Global | FAQ Schema check failed: No FAQPage JSON-LD schemas detected. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.entity.density` | Global | Entity density verified successfully (score: 100, ratio: 3.8). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.chunking.suitability` | Global | AEO chunking check: 1 of 2 chunks are not suitable as standalone answers. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.extractability.wordcount` | Global | AEO target: page word count is only 151 words (threshold: 200 words). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.org.schema` | Global | GEO check failed: Missing valid Organization JSON-LD block. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.author.attribution` | Global | GEO check failed: Page is missing explicit author attribution signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.citation.markup` | Global | GEO check failed: Missing outbound citation hyperlinks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.geographic.address` | Global | GEO check failed: Missing structured geographic location signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.knowledge.sameas` | Global | GEO check failed: Missing structured sameAs links mapping entities to official KG records. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.provenance.dates` | Global | GEO check failed: Missing structured date metadata signals. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.statistics.density` | Global | Statistics density validated successfully (found 27 numerical claims). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.quotes.authority` | Global | Authoritative quotation and testimonial references verified. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `security.headers.csp` | Global | Missing Content-Security-Policy header. Missing Strict-Transport-Security (HSTS) header. Missing X-Frame-Options clickjacking defense header. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `structured.data.schema.valid` | Global | All JSON-LD structured data blocks are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.metadata.exists` | Global | Page metadata tags verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.canonical.exists` | Global | Missing canonical URL link tag | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.opengraph.valid` | Global | Missing Open Graph meta tags: og:image | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.twitter.valid` | Global | All essential Twitter Cards meta tags are present. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.schema.valid` | Global | Successfully validated 1 JSON-LD blocks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.robots.valid` | Global | Missing robots.txt content | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.sitemap.valid` | Global | Missing sitemap.xml content | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.lighthouse.score` | Global | {"lighthouse":{"performance":90,"accessibility":95,"bestPractices":95,"seo":95}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.webvitals.lcp` | Global | {"webVitals":{"lcp":1.5,"cls":0.02,"inp":100}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.bundle.size` | Global | Script tags count (5) is within target limit (8). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.images.optimized` | Global | All images are properly sized, lazy-loaded, and use modern formats. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.fonts.optimized` | Global | Web fonts optimization: Consider preloading critical web fonts to avoid layout shifts. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.resources.renderblocking` | Global | Render-blocking scripts detected in head: /ashirwad-hospital/_next/static/chunks/polyfills-42372ed130431b0a.js. Use async/defer. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.compression.caching` | Global | Caching/compression recommendations: Compression (Gzip/Brotli) not enabled; Caching (Cache-Control headers) not defined | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.wcag.lang` | Global | HTML lang attribute verified: "en". | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.roles` | Global | ARIA role configurations verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `accessibility.semantic.structure` | Global | Missing semantic structural HTML elements: <header>, <main>, <footer>. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.heading.hierarchy` | Global | Heading element flow conforms to strict semantic hierarchy requirements. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.form.labels` | Global | All form controls are correctly bound to accessible text labels. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.images.alt` | Global | Image elements feature valid alternative text attributes. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.interactive` | Global | All custom interactive element ARIA and focus configurations are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.content.structure` | Global | Paragraph boundaries and structure meet layout recommendations. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.headings.questions` | Global | Answer Engine target: headings should align directly with user query terms. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.faq.schema` | Global | FAQ Schema check failed: No FAQPage JSON-LD schemas detected. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.entity.density` | Global | Entity density verified successfully (score: 100, ratio: 3.8). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.chunking.suitability` | Global | AEO chunking check: 1 of 2 chunks are not suitable as standalone answers. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.extractability.wordcount` | Global | AEO target: page word count is only 151 words (threshold: 200 words). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.org.schema` | Global | GEO check failed: Missing valid Organization JSON-LD block. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.author.attribution` | Global | GEO check failed: Page is missing explicit author attribution signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.citation.markup` | Global | GEO check failed: Missing outbound citation hyperlinks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.geographic.address` | Global | GEO check failed: Missing structured geographic location signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.knowledge.sameas` | Global | GEO check failed: Missing structured sameAs links mapping entities to official KG records. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.provenance.dates` | Global | GEO check failed: Missing structured date metadata signals. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.statistics.density` | Global | Statistics density validated successfully (found 27 numerical claims). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.quotes.authority` | Global | Authoritative quotation and testimonial references verified. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `security.headers.csp` | Global | Missing Content-Security-Policy header. Missing Strict-Transport-Security (HSTS) header. Missing X-Frame-Options clickjacking defense header. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `structured.data.schema.valid` | Global | All JSON-LD structured data blocks are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.metadata.exists` | Global | Page metadata tags verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.canonical.exists` | Global | Missing canonical URL link tag | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.opengraph.valid` | Global | Missing Open Graph meta tags: og:image | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.twitter.valid` | Global | All essential Twitter Cards meta tags are present. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.schema.valid` | Global | Successfully validated 1 JSON-LD blocks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.robots.valid` | Global | Missing robots.txt content | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.sitemap.valid` | Global | Missing sitemap.xml content | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.lighthouse.score` | Global | {"lighthouse":{"performance":90,"accessibility":95,"bestPractices":95,"seo":95}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.webvitals.lcp` | Global | {"webVitals":{"lcp":1.5,"cls":0.02,"inp":100}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.bundle.size` | Global | Script tags count (5) is within target limit (8). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.images.optimized` | Global | All images are properly sized, lazy-loaded, and use modern formats. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.fonts.optimized` | Global | Web fonts optimization: Consider preloading critical web fonts to avoid layout shifts. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.resources.renderblocking` | Global | Render-blocking scripts detected in head: /ashirwad-hospital/_next/static/chunks/polyfills-42372ed130431b0a.js. Use async/defer. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.compression.caching` | Global | Caching/compression recommendations: Compression (Gzip/Brotli) not enabled; Caching (Cache-Control headers) not defined | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.wcag.lang` | Global | HTML lang attribute verified: "en". | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.roles` | Global | ARIA role configurations verified successfully. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.semantic.structure` | Global | Page contains valid semantic block structural containers. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.heading.hierarchy` | Global | Heading element flow conforms to strict semantic hierarchy requirements. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.form.labels` | Global | All form controls are correctly bound to accessible text labels. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.images.alt` | Global | Image elements feature valid alternative text attributes. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.interactive` | Global | All custom interactive element ARIA and focus configurations are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.content.structure` | Global | Paragraph boundaries and structure meet layout recommendations. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.headings.questions` | Global | Answer Engine target: headings should align directly with user query terms. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.faq.schema` | Global | FAQ Schema check failed: No FAQPage JSON-LD schemas detected. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.entity.density` | Global | Entity density verified successfully (score: 100, ratio: 7). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.chunking.suitability` | Global | AEO chunking check: 1 of 2 chunks are not suitable as standalone answers. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.extractability.wordcount` | Global | AEO target: page word count is only 190 words (threshold: 200 words). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.org.schema` | Global | GEO check failed: Missing valid Organization JSON-LD block. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.author.attribution` | Global | GEO check failed: Page is missing explicit author attribution signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.citation.markup` | Global | GEO check failed: Missing outbound citation hyperlinks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.geographic.address` | Global | GEO check failed: Missing structured geographic location signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.knowledge.sameas` | Global | GEO check failed: Missing structured sameAs links mapping entities to official KG records. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.provenance.dates` | Global | GEO check failed: Missing structured date metadata signals. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.statistics.density` | Global | Statistics density validated successfully (found 34 numerical claims). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.quotes.authority` | Global | Authoritative quotation and testimonial references verified. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `security.headers.csp` | Global | Missing Content-Security-Policy header. Missing Strict-Transport-Security (HSTS) header. Missing X-Frame-Options clickjacking defense header. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `structured.data.schema.valid` | Global | All JSON-LD structured data blocks are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.metadata.exists` | Global | Page metadata tags verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.canonical.exists` | Global | Missing canonical URL link tag | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.opengraph.valid` | Global | Missing Open Graph meta tags: og:image | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.twitter.valid` | Global | All essential Twitter Cards meta tags are present. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.schema.valid` | Global | Successfully validated 1 JSON-LD blocks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.robots.valid` | Global | Missing robots.txt content | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.sitemap.valid` | Global | Missing sitemap.xml content | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.lighthouse.score` | Global | {"lighthouse":{"performance":90,"accessibility":95,"bestPractices":95,"seo":95}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.webvitals.lcp` | Global | {"webVitals":{"lcp":1.5,"cls":0.02,"inp":100}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.bundle.size` | Global | Script tags count (5) is within target limit (8). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.images.optimized` | Global | All images are properly sized, lazy-loaded, and use modern formats. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.fonts.optimized` | Global | Web fonts optimization: Consider preloading critical web fonts to avoid layout shifts. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.resources.renderblocking` | Global | Render-blocking scripts detected in head: /ashirwad-hospital/_next/static/chunks/polyfills-42372ed130431b0a.js. Use async/defer. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.compression.caching` | Global | Caching/compression recommendations: Compression (Gzip/Brotli) not enabled; Caching (Cache-Control headers) not defined | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.wcag.lang` | Global | HTML lang attribute verified: "en". | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.roles` | Global | ARIA role configurations verified successfully. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.semantic.structure` | Global | Page contains valid semantic block structural containers. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.heading.hierarchy` | Global | Heading element flow conforms to strict semantic hierarchy requirements. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.form.labels` | Global | All form controls are correctly bound to accessible text labels. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.images.alt` | Global | Image elements feature valid alternative text attributes. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.interactive` | Global | All custom interactive element ARIA and focus configurations are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.content.structure` | Global | Paragraph boundaries and structure meet layout recommendations. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.headings.questions` | Global | Answer Engine target: headings should align directly with user query terms. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.faq.schema` | Global | FAQ Schema check failed: No FAQPage JSON-LD schemas detected. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.entity.density` | Global | Entity density verified successfully (score: 100, ratio: 7.67). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.chunking.suitability` | Global | AEO chunking check: 2 of 3 chunks are not suitable as standalone answers. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.extractability.wordcount` | Global | AEO target: page word count is only 170 words (threshold: 200 words). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.org.schema` | Global | GEO check failed: Missing valid Organization JSON-LD block. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.author.attribution` | Global | GEO check failed: Page is missing explicit author attribution signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.citation.markup` | Global | GEO check failed: Missing outbound citation hyperlinks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.geographic.address` | Global | GEO check failed: Missing structured geographic location signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.knowledge.sameas` | Global | GEO check failed: Missing structured sameAs links mapping entities to official KG records. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.provenance.dates` | Global | GEO check failed: Missing structured date metadata signals. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.statistics.density` | Global | Statistics density validated successfully (found 37 numerical claims). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.quotes.authority` | Global | Authoritative quotation and testimonial references verified. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `security.headers.csp` | Global | Missing Content-Security-Policy header. Missing Strict-Transport-Security (HSTS) header. Missing X-Frame-Options clickjacking defense header. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `structured.data.schema.valid` | Global | All JSON-LD structured data blocks are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.metadata.exists` | Global | Page metadata tags verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.canonical.exists` | Global | Missing canonical URL link tag | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.opengraph.valid` | Global | Missing Open Graph meta tags: og:image | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.twitter.valid` | Global | All essential Twitter Cards meta tags are present. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.schema.valid` | Global | Successfully validated 1 JSON-LD blocks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.robots.valid` | Global | Missing robots.txt content | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.sitemap.valid` | Global | Missing sitemap.xml content | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.lighthouse.score` | Global | {"lighthouse":{"performance":90,"accessibility":95,"bestPractices":95,"seo":95}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.webvitals.lcp` | Global | {"webVitals":{"lcp":1.5,"cls":0.02,"inp":100}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.bundle.size` | Global | Script tags count (5) is within target limit (8). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.images.optimized` | Global | All images are properly sized, lazy-loaded, and use modern formats. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.fonts.optimized` | Global | Web fonts optimization: Consider preloading critical web fonts to avoid layout shifts. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.resources.renderblocking` | Global | Render-blocking scripts detected in head: /ashirwad-hospital/_next/static/chunks/polyfills-42372ed130431b0a.js. Use async/defer. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.compression.caching` | Global | Caching/compression recommendations: Compression (Gzip/Brotli) not enabled; Caching (Cache-Control headers) not defined | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.wcag.lang` | Global | HTML lang attribute verified: "en". | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.roles` | Global | ARIA role configurations verified successfully. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.semantic.structure` | Global | Page contains valid semantic block structural containers. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `accessibility.heading.hierarchy` | Global | Heading hierarchy issues: Multiple (2) H1 heading tags found. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.form.labels` | Global | All form controls are correctly bound to accessible text labels. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.images.alt` | Global | Image elements feature valid alternative text attributes. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.interactive` | Global | All custom interactive element ARIA and focus configurations are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.content.structure` | Global | Paragraph boundaries and structure meet layout recommendations. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.headings.questions` | Global | Answer Engine target: headings should align directly with user query terms. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.faq.schema` | Global | FAQ Schema check failed: No FAQPage JSON-LD schemas detected. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.entity.density` | Global | Entity density verified successfully (score: 100, ratio: 5). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.chunking.suitability` | Global | AEO chunking check: 6 of 7 chunks are not suitable as standalone answers. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.extractability.wordcount` | Global | Page word count verified (288 words). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.org.schema` | Global | GEO check failed: Missing valid Organization JSON-LD block. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.author.attribution` | Global | GEO check failed: Page is missing explicit author attribution signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.citation.markup` | Global | GEO check failed: Missing outbound citation hyperlinks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.geographic.address` | Global | GEO check failed: Missing structured geographic location signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.knowledge.sameas` | Global | GEO check failed: Missing structured sameAs links mapping entities to official KG records. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.provenance.dates` | Global | GEO check failed: Missing structured date metadata signals. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.statistics.density` | Global | Statistics density validated successfully (found 48 numerical claims). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.quotes.authority` | Global | Authoritative quotation and testimonial references verified. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `security.headers.csp` | Global | Missing Content-Security-Policy header. Missing Strict-Transport-Security (HSTS) header. Missing X-Frame-Options clickjacking defense header. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `structured.data.schema.valid` | Global | All JSON-LD structured data blocks are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.metadata.exists` | Global | Page metadata tags verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.canonical.exists` | Global | Missing canonical URL link tag | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.opengraph.valid` | Global | Missing Open Graph meta tags: og:image | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.twitter.valid` | Global | All essential Twitter Cards meta tags are present. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `seo.schema.valid` | Global | Successfully validated 1 JSON-LD blocks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.robots.valid` | Global | Missing robots.txt content | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `seo.sitemap.valid` | Global | Missing sitemap.xml content | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.lighthouse.score` | Global | {"lighthouse":{"performance":90,"accessibility":95,"bestPractices":95,"seo":95}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.webvitals.lcp` | Global | {"webVitals":{"lcp":1.5,"cls":0.02,"inp":100}} | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.bundle.size` | Global | Script tags count (7) is within target limit (8). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.images.optimized` | Global | All images are properly sized, lazy-loaded, and use modern formats. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `performance.fonts.optimized` | Global | Web fonts optimization: Consider preloading critical web fonts to avoid layout shifts. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.resources.renderblocking` | Global | Render-blocking scripts detected in head: /ashirwad-hospital/_next/static/chunks/polyfills-42372ed130431b0a.js. Use async/defer. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `performance.compression.caching` | Global | Caching/compression recommendations: Compression (Gzip/Brotli) not enabled; Caching (Cache-Control headers) not defined | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.wcag.lang` | Global | HTML lang attribute verified: "en". | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.roles` | Global | ARIA role configurations verified successfully. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `accessibility.semantic.structure` | Global | Missing semantic structural HTML elements: <header>, <footer>. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.heading.hierarchy` | Global | Heading element flow conforms to strict semantic hierarchy requirements. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.form.labels` | Global | All form controls are correctly bound to accessible text labels. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.images.alt` | Global | Image elements feature valid alternative text attributes. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `accessibility.aria.interactive` | Global | All custom interactive element ARIA and focus configurations are valid. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.content.structure` | Global | Paragraph boundaries and structure meet layout recommendations. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.headings.questions` | Global | Answer Engine target: headings should align directly with user query terms. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.faq.schema` | Global | FAQ Schema check failed: No FAQPage JSON-LD schemas detected. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.entity.density` | Global | Entity density verified successfully (score: 70, ratio: 0.96). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `aeo.chunking.suitability` | Global | AEO chunking check: 4 of 4 chunks are not suitable as standalone answers. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `aeo.extractability.wordcount` | Global | Page word count verified (388 words). | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.org.schema` | Global | GEO check failed: Missing valid Organization JSON-LD block. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.author.attribution` | Global | GEO check failed: Page is missing explicit author attribution signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.citation.markup` | Global | GEO check failed: Missing outbound citation hyperlinks. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.geographic.address` | Global | GEO check failed: Missing structured geographic location signals. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.knowledge.sameas` | Global | GEO check failed: Missing structured sameAs links mapping entities to official KG records. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `geo.provenance.dates` | Global | GEO check failed: Missing structured date metadata signals. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.statistics.density` | Global | Statistics density validated successfully (found 32 numerical claims). | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `geo.quotes.authority` | Global | Authoritative quotation and testimonial references verified. | snap_476c6f62, head_476c6f62 |
| ❌ FAIL | `security.headers.csp` | Global | Missing Content-Security-Policy header. Missing Strict-Transport-Security (HSTS) header. Missing X-Frame-Options clickjacking defense header. | snap_476c6f62, head_476c6f62 |
| ✅ PASS | `structured.data.schema.valid` | Global | All JSON-LD structured data blocks are valid. | snap_476c6f62, head_476c6f62 |

## Audit Chronological Timeline

*   **[CrawlStarted]** (2026-08-06T08:37:29.049Z): Verification engine crawl loop initiated.
*   **[PageParsed]** (2026-08-06T08:37:29.049Z): Model parsed successfully across 1 targets.
*   **[VerificationFinished]** (2026-08-06T08:37:29.049Z): Verification sweep completes.
