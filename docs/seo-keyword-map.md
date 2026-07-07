# Kubicle SEO Keyword Map (AI training focus)

Last updated: 2026-07-06. One head term per page. Before creating any new page, check this map;
if a query family is already owned, strengthen that page instead of adding a competitor.

## Principles

1. One primary head term (query family) per URL. Supporting long-tails belong to the same page.
2. Every money page gets internal links with descriptive anchors (never "learn more" alone).
3. Blog posts are informational; each links UP to exactly one pillar/solution page with a
   keyword-relevant anchor. Avoid linking one post to several money pages with similar anchors.
4. Campaign pages under /lp/ stay noindex and never compete with the indexed pages.
5. Content style: no inline bolding for emphasis in body copy. Hyperlinks may be colored and
   bold; headings, kickers and component labels carry weight via the design system. Nothing else.

## Keyword-to-page map (AI cluster)

| Query family (head term) | Primary page | Intent | Notes |
|---|---|---|---|
| AI training for employees, employee AI training | /ai-training-for-employees | Commercial | Featured nav item; FAQ schema added |
| AI training for organisations, corporate AI training, AI training for companies, enterprise AI training | /ai-training-for-organisations | Commercial | NEW page (2026-07). Cross-linked with employees page via "two sides of one program" |
| AI academy, AI courses for business, AI learning paths | /academies/ai | Commercial | Retitled away from "AI training for business teams" to avoid competing with the two pages above |
| AI literacy training, AI literacy program | /specialist-programs/ai-literacy | Commercial | Existing page, distinct head term |
| EU AI Act training, Article 4 AI literacy, EU AI Act AI literacy requirements, AI Act compliance training | /eu-ai-act-training | Commercial/informational hybrid | NEW pillar (2026-07). Cluster hub for the EU AI Act posts |
| Microsoft Copilot training, Microsoft 365 Copilot training, Copilot training for business/employees, Copilot adoption training | /copilot-training-for-business | Commercial | NEW page (2026-07). Tool-specific solution page. Differentiator: accredited course + custom context videos, exercises and workplace tasks (Jotun-style). In nav (For Business > AI submenu), cross-linked from employees + organisations pages |
| ChatGPT training, ChatGPT training for business/employees, corporate ChatGPT training, custom GPT training | /chatgpt-training-for-business | Commercial | NEW page (2026-07). Tool-specific solution page cloned from Copilot template. Same differentiator. In the AI flyout submenu next to Copilot; cross-linked with Copilot + employees + organisations |
| Claude training, Claude AI training for business/employees, Anthropic Claude training | /claude-training-for-business | Commercial | NEW page (2026-07). Tool-specific solution page. Unique: curriculum is THREE courses (Interface & Core Features, Long Contexts & Documents, Artifacts/Projects/Skills) not one. Third item in the AI flyout submenu; fully cross-linked with Copilot + ChatGPT + employees + organisations. Cluster of 3 tool pages complete |
| EU AI Act summary, EU AI Act requirements, EU AI Act timeline | /blog/eu-ai-act-summary-requirements-timeline | Informational | Links up to /eu-ai-act-training |
| EU AI Act meaning for business, AI Act compliance countdown | /blog/countdown-to-compliance-what-the-eu-ai-act-means-for-your-business | Informational | Links up to /eu-ai-act-training |
| AI use policy | /blog/creating-an-ai-use-policy-a-comprehensive-guide-for-enterprises | Informational | Links up to /eu-ai-act-training |
| AI code of conduct | /blog/ai-code-of-conduct-in-ai-use-policies | Informational | Links up to /eu-ai-act-training |
| AI skills gap | /blog/ai-employee-training-programs | Informational | Links up to /ai-training-for-employees |
| AI adoption challenges | /blog/ai-adoption-challenges-in-companies | Informational | Links up to /ai-training-for-organisations |
| persona-based AI literacy | /blog/beyond-one-size-fits-all-a-persona-based-blueprint-for-enterprise-ai-literacy | Informational | Links up to /ai-training-for-organisations |
| AI in the workplace | /blog/artificial-intelligence-in-the-workplace | Informational | Already links to /ai-training-for-employees |

## Cannibalization guards in place

- /academies/ai retitled from "AI Training for Business Teams" to "AI Academy | AI Courses &
  Persona Learning Paths" so it no longer competes on "AI training for <audience>" terms.
- /lp/enterprise-ai-training is noindex (paid/direct only) and must stay that way; the indexed
  candidate for that intent is /ai-training-for-organisations.
- Employees vs organisations pages explicitly define their split on-page (pathways vs program)
  and cross-link, which helps Google disambiguate the two intents.
- Homepage targets the umbrella brand+category term ("AI, PM, Data & Finance training"), not
  any single academy head term.

## Gaps worth building next (recommended, not yet built)

| Proposed page | Target query family | Rationale |
|---|---|---|
| /ai-training-for-finance-teams (or industry variants under /industries/) | AI training for finance teams, AI for accountants/auditors | Industry pages exist for banking/consulting but none owns "AI training for <function>" terms; high buyer intent, low competition. The ai-skills-gap-junior-auditors post is supporting content |
| ~~/copilot-training-for-business~~ BUILT 2026-07 | Microsoft Copilot training for employees/business | DONE. Solution page now owns the commercial term; differentiated on custom context/exercises/workplace tasks. See keyword-to-page map above |
| ~~/chatgpt-training-for-employees~~ BUILT 2026-07 as /chatgpt-training-for-business | ChatGPT training for employees/business | DONE. Solution page owns the term; Master ChatGPT course is the supporting asset. See keyword-to-page map above |
| /resources/ai-literacy-assessment (or reuse assessments) | AI literacy assessment, AI skills assessment | Assessment landing pages exist; ensure one targets "AI skills assessment" explicitly as a top-of-funnel magnet feeding the organisations page |
| Blog: "AI literacy examples by role" | what is AI literacy, AI literacy examples | Definitional query feeding /specialist-programs/ai-literacy and /eu-ai-act-training |
| Blog: "AI training ROI / how to measure AI upskilling" | AI training ROI, measure AI skills | Feeds the organisations page's reporting story |

## Tool-training sub-cluster (Copilot / ChatGPT / Claude)

Three tool pages under the AI Academy hub, each on a distinct branded head term ("<Tool> training for
business"). Hub-and-spoke wiring (done 2026-07):

- HUB down: /academies/ai links to all three via the "More in the AI cluster" reel ("Tool training" cards).
- Spoke up: each tool page's "Part of the AI Academy" eyebrow links to /academies/ai (plus `isPartOf` schema).
- Siblings: /ai-training-for-employees and /ai-training-for-organisations link to all three; the three tool
  pages cross-link each other; site-wide nav (For Business > AI submenu) lists all three.
- Schema per tool page: Service + FAQPage + BreadcrumbList (Home > AI Academy > Tool).

Cannibalization notes:
- Distinct branded head terms, so no head-term overlap between the three.
- Watch: the three pages share a lot of templated body copy (differentiator, four-layers, delivery, personas,
  outcomes). Curriculum, capabilities band, trust and FAQ are tool-specific. If GSC shows the three trading
  places for a query, or thin/duplicate flags appear, differentiate the shared sections further per tool.
- /courses/ai-fundamentals mentions all three tools but targets "AI fundamentals", not the tool head terms.

Comparison hub post BUILT (2026-07): /blog/copilot-vs-chatgpt-vs-claude-for-business (head term "Copilot vs
ChatGPT vs Claude"). Tool-neutral comparison + table (logos in the header row) + FAQPage schema; links DOWN to
all three tool pages + org + employees + academy. Inbound: blog index, /blog/topic/ai-literacy, the AI Academy
cluster reel, and all three tool pages (persona cross-link). Custom header image at
blog/img/posts/copilot-vs-chatgpt-vs-claude.jpg (the 3 logos on a dark brand gradient).

Still open: link the tool pages from the AI-adoption and AI-employee-training blog posts (body anchors).

## Measurement

- Baseline: pull GSC query report filtered to "ai training", "ai literacy", "eu ai act" before
  deploying these changes; re-check impressions/position at 4 and 8 weeks.
- Watch for cannibalization in GSC: if two URLs alternate for one query, consolidate anchors
  toward the mapped primary page.
