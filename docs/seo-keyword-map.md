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
| /copilot-training-for-business | Microsoft Copilot training for employees/business | Course page exists (/courses/...) but no solution page owns the commercial term; Copilot rollouts are a common trigger for corporate AI training purchases |
| /chatgpt-training-for-employees | ChatGPT training for employees/business | Same logic as Copilot; the Master ChatGPT course is the supporting asset |
| /resources/ai-literacy-assessment (or reuse assessments) | AI literacy assessment, AI skills assessment | Assessment landing pages exist; ensure one targets "AI skills assessment" explicitly as a top-of-funnel magnet feeding the organisations page |
| Blog: "AI literacy examples by role" | what is AI literacy, AI literacy examples | Definitional query feeding /specialist-programs/ai-literacy and /eu-ai-act-training |
| Blog: "AI training ROI / how to measure AI upskilling" | AI training ROI, measure AI skills | Feeds the organisations page's reporting story |

## Measurement

- Baseline: pull GSC query report filtered to "ai training", "ai literacy", "eu ai act" before
  deploying these changes; re-check impressions/position at 4 and 8 weeks.
- Watch for cannibalization in GSC: if two URLs alternate for one query, consolidate anchors
  toward the mapped primary page.
