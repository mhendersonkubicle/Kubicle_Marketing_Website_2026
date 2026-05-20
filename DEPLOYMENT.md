# Kubicle.com Netlify deployment guide

This is the cutover playbook for moving www.kubicle.com from Webflow to this
static site. Run through it in order. Items in **bold** are blocking — don't
flip DNS until every blocking item is green.

---

## 0. What ships in this repo

| File | Purpose |
|---|---|
| `dist/` | Build output — what Netlify publishes |
| `_redirects` | The full migration redirect map (300+ rules) |
| `404.html` → `dist/404.html` | Branded 404 page; served for unmatched URLs and the hard-kill rules in `_redirects` |
| `robots.txt` | Crawl directives + sitemap pointer |
| `sitemap.xml` | **Auto-generated** by `build.js` from rendered HTML. Don't hand-edit. |
| `netlify.toml` | Build config, security headers, caching policies |
| `build.js` | Pre-renders shared nav/footer into every HTML page; generates sitemap |
| `MIGRATION-PLAN.md`, `Migration-URL-map.xlsx` | Strategy docs (kept in `~/Desktop/Kubicle-Migration-Plan/`, not in repo) |

---

## 1. Local pre-flight (before pushing)

Run on your machine before opening a PR or pushing to main:

```bash
npm install        # if dependencies changed
npm run build      # produces /dist
```

**Expected output:**
```
Kubicle site build
  Files copied        : 5xx
  HTML pre-rendered   : 1xx
  Sitemap URLs        : 1xx
  Errors              : 0
```

If `Errors` is non-zero, the build script lists which files broke. Fix before
proceeding — Netlify will fail the deploy with the same errors.

### Spot-check the rendered output

```bash
# Serve dist/ locally
npx -y http-server dist -p 8768 -c-1 --silent
```

Then open:
- `http://localhost:8768/` — homepage with working dropdowns
- `http://localhost:8768/ai-training-for-employees` — top SEO landing page
- `http://localhost:8768/academies/ai/` — cluster reel arrows scroll left/right
- `http://localhost:8768/specialist-programs/ai-literacy` — full hero, persona images, FAQ before final CTA
- `http://localhost:8768/some-page-that-does-not-exist` — should serve the branded 404 page
- `http://localhost:8768/sitemap.xml` — should load XML with current dates

---

## 2. Verify redirects against the live old site URLs

Before cutover, run a curl test against the **preview deploy** (Netlify
auto-creates one on every PR / push to a branch). This catches any 301
chains or accidental 404s in the redirect map.

```bash
# Replace with the actual preview URL Netlify generates
PREVIEW="https://deploy-preview-NNN--your-site.netlify.app"

# Sample top-20 high-traffic old URLs from MIGRATION-PLAN.md
for url in \
  /join-for-free \
  /specialist-programs/grad-program \
  /subject/excel \
  /individual \
  /ai-training-for-employees \
  /pricing \
  /individual/academies-paths \
  /talk-to-sales \
  /library \
  /free-tier-sign-up \
  /about/our-story \
  /individual/pricing \
  /learning-paths \
  /specialist-programs/ai-literacy \
  /subject/power-bi \
  /subject/financial-modeling \
  /individual/our-product \
  /case-studies-white-papers \
  /platform \
  /specialist-programs/data-literacy
do
  status=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "$PREVIEW$url")
  echo "$url -> $status"
done
```

**What you want to see:**
- Single 301 to a final URL that returns 200, OR
- A direct 200 (1:1 keep)

**Red flags:**
- 301 → 301 (chain — loses link equity per hop)
- 301 → 404 (redirect target doesn't exist)
- Anything other than 200/301/404

For the full machine-readable list of old URLs to test, see
`Migration-URL-map.xlsx` — there's a column you can copy-paste.

---

## 3. Netlify project setup

If this is a fresh Netlify site:

1. **New site from Git** → connect this repo
2. **Branch to deploy:** `main` (or your default)
3. **Build command:** `npm run build` (already in `netlify.toml`)
4. **Publish directory:** `dist` (already in `netlify.toml`)
5. **Custom domain:** add `www.kubicle.com` and `kubicle.com`
6. **Force HTTPS** → on
7. **Deploy contexts:**
   - Production: `main` branch
   - Deploy previews: every PR
   - Branch deploys: optional

### Domain config

Netlify will provision SSL via Let's Encrypt automatically. For
`kubicle.com` (apex) → `www.kubicle.com`, add an apex redirect in your DNS
or rely on Netlify's auto-redirect setting in Domain settings.

---

## 4. The cutover (Day 0)

The order matters — do it in a maintenance window.

1. **Final preview deploy passes** all curl spot-checks (§2).
2. **Backup the current Webflow site** — export the HTML / asset bundle as
   insurance. Note the current `sitemap.xml` URL list.
3. **Lower DNS TTL** on the existing kubicle.com records to 300 seconds.
   Wait the old TTL period before proceeding — usually 1 hour.
4. **Point DNS at Netlify:**
   - `www.kubicle.com` → Netlify CNAME or ALIAS record
   - `kubicle.com` apex → Netlify A record (or ALIAS on supporting providers)
5. **Verify HTTPS** provisions cleanly (Netlify auto-issues Let's Encrypt
   certs once DNS resolves — usually 5–30 minutes).
6. **Smoke-test production** by repeating the curl spot-check from §2
   against the real domain.
7. **Submit to search engines:**
   - Google Search Console → Sitemaps → submit
     `https://www.kubicle.com/sitemap.xml`
   - Google Search Console → URL inspection → request indexing for the
     top 25 URLs from `MIGRATION-PLAN.md` §2.
   - Bing Webmaster Tools → same sitemap submission.
   - **IndexNow bulk push** (Bing + Yandex):
     ```bash
     curl -X POST "https://api.indexnow.org/indexnow" \
       -H "Content-Type: application/json" \
       -d '{
         "host": "www.kubicle.com",
         "key": "<your-indexnow-key>",
         "urlList": [
           "https://www.kubicle.com/",
           "https://www.kubicle.com/ai-training-for-employees",
           "https://www.kubicle.com/academies/ai/",
           "https://www.kubicle.com/academies/data-literacy/",
           "..."
         ]
       }'
     ```

---

## 5. Post-cutover monitoring

### Day +1

- Spot-check from a clean browser (incognito) on multiple devices
- Confirm the floating "Talk to Sales" CTA appears and the nav dropdowns open
- Test the newsletter signup form (footer) — submission should hit
  the HubSpot endpoint (Portal ID 3294554, Form GUID b772a982-...)

### Day +7

- **GSC Coverage report:** ~70% of old URLs should show "Page with redirect"
  by day 7. Pages stuck on "Crawled — currently not indexed" usually have
  thin destination content or a 301 chain — investigate per-URL.
- **PostHog organic-landings:** re-run the 6-month query in `MIGRATION-PLAN.md`
  §2. Top 25 URLs should hold their volume or grow.

### Day +30

- **Full Search Console review:** "Page with redirect" should be near zero
  for the top-200 old URLs. Anything still flagged needs a manual fix.
- Compare PostHog month-over-month organic traffic. Expect a small dip in
  weeks 1–2 (normal Google reshuffling), recovery by week 4, and gains
  from week 6+ as the topical clusters consolidate authority.

### Day +90

- Re-export `Migration-URL-map.xlsx` traffic data. The four BUILD pages
  (`/ai-training-for-employees`, `/specialist-programs/ai-literacy`,
  `/specialist-programs/data-literacy`, `/industries/fmcg-manufacturing`)
  should be visibly accruing organic landings — they're real pages now,
  not stand-ins.

---

## 6. Things that can go wrong (and the fix)

| Symptom | Cause | Fix |
|---|---|---|
| Old URL returns 404 instead of 301 | Rule missing from `_redirects`, or rule order wrong (more general matched first) | Re-order `_redirects`; specific rules above wildcards. Re-deploy. |
| 301 → 301 chain | Two redirect rules both apply | Flatten: rewrite the first rule to point directly at the final destination. |
| Page exists but `/sitemap.xml` doesn't list it | Page is in `SITEMAP_EXCLUDE` list in `build.js`, or the path matches a brochure / 404 / try-free/business pattern | Remove the exclusion if the page should be indexable. |
| GSC shows duplicate canonical | Page has `<link rel="canonical">` pointing somewhere else | Audit canonical tags on each page; verify they point to `www.kubicle.com/...` |
| Hard-kill URL (`/sandbox`, `/style-guide`, etc.) still returns content | The 404 rule in `_redirects` is being intercepted by an earlier wildcard | Check rule ordering. The `/* → /:splat 301` style catch-alls should be at the bottom of their group, after specific rules. |
| Dropdowns work locally but not in production | `build.js` stripped `<script src="…shared/nav.js">` from the rendered HTML | Already fixed — the build no longer strips. If it regresses, the `<script>` tags must be preserved on pre-rendered pages. |
| `/sitemap.xml` is empty or stale | `build.js` failed to write it; check build logs | Build will fail loudly with `Errors: N` and exit 1. Re-run locally. |

---

## 7. Rollback plan

If something is on fire post-cutover and you need to revert:

1. **DNS rollback:** point `www.kubicle.com` back at the Webflow nameservers
   or A records. The low TTL from step 4.3 means this propagates in 5
   minutes.
2. The old Webflow site is still live at whatever its publishing URL was —
   you don't need to "redeploy" it; just take traffic off the new site.
3. Keep the Netlify deploy live for debugging. Don't take it down — you'll
   need it to figure out what broke.

This is why the DNS TTL drop in §4.3 matters. Without it, a botched cutover
could mean hours of bad-state traffic.

---

## 8. Where to look when things go quiet

- **Netlify deploy logs:** Build → Deploys → click a deploy → see stdout
- **Netlify Functions logs:** not applicable (no functions in this site)
- **PostHog:** Insights → run the query in `MIGRATION-PLAN.md` §2
- **Google Search Console:** Coverage + Performance reports
- **Bing Webmaster:** equivalent reports for Bing/Yandex traffic
- **Floating CTA / nav dropdowns broken:** check browser console — look for
  the consultation-modal `null.addEventListener` regression
  (`academies/*/index.html`, line ~2070)

---

## 9. Things that aren't done yet (for the next person)

These are out-of-scope improvements I'd flag if you want to push further:

- The **AI literacy spoke audience cards** still use portrait photos (the
  data-literacy spoke uses purpose-built `datapink*` photos). When an
  equivalent `aipink*` asset set exists, swap them in to reduce portrait
  density on that page.
- **Course pages** (`/courses/*-hero.webp` pages) don't yet link up to
  their parent academy. Adding a small "Part of the AI / Data Literacy
  Academy" callout on each closes the cluster loop both ways.
- **Blog posts** in the AI cluster don't link up to the AI Academy.
  Adding a related-reading card on the top 5 highest-traffic AI posts
  feeds backlink equity into the pillar.
- **Hreflang** is not configured because the site is English-only.
  When localisation arrives, every page needs hreflang annotations.
- **`sitemap-images.xml` + `sitemap-news.xml`** — could be added later
  if image search / news indexing becomes a priority.
