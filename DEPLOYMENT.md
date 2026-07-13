# Kubicle.com deployment guide

The site lives in two places, and a release means updating **both,
independently**:

1. **GitHub** (`mhendersonkubicle/Kubicle_Marketing_Website_2026`, branch
   `main`) is the source of truth for the code. Pushing to GitHub does
   **not** deploy anything. There is no git integration, no CI, no
   auto-build.
2. **Cloudflare Pages** (project `kubicle-marketing-site`, serving
   `kubicle.com` and `www.kubicle.com`) is the live hosting. It only
   updates when you push a build to it directly with wrangler.

Netlify is no longer used. The `netlify.toml` at the repo root is legacy
config; the `_headers` file is what Cloudflare Pages actually reads for
response headers.

This file is excluded from the built site (root `.md` files are skipped by
`build.js`), so it is safe to keep operational detail here.

---

## 1. Local pre-flight

```bash
npm install        # only if dependencies changed
npm run build      # runs build.js, produces /dist
```

**Expected output:**

```
Kubicle site build
  Files copied        : 6xx
  HTML pre-rendered   : 1xx
  Sitemap URLs        : 1xx
  Redirect rules (CF) : 4xx
  Errors              : 0
```

If `Errors` is non-zero, the script lists which files broke. Fix before
deploying; do not ship a build with errors.

### What the build does

- Mirrors the source tree into `/dist`, pre-rendering the shared nav and
  footer into every HTML page (SEO: crawlers see real links, not empty
  placeholder divs).
- Injects the site-wide head snippets (Termly, GTM, GA4, PostHog, HubSpot
  loader, form_start tracker) into every built page.
- Generates `/dist/sitemap.xml` from the rendered HTML (never hand-edit
  the sitemap; the `SITEMAP_EXCLUDE` list in `build.js` controls what is
  left out).
- Generates `functions/_middleware.js` from `_redirects` (Cloudflare Pages
  caps the native `_redirects` file at ~100 rules; the middleware applies
  all of them in code). The `functions/` folder sits next to `/dist` and
  wrangler uploads it automatically as the Functions bundle.
- Excludes internal files from `/dist`: the `docs/` folder, root-level
  `.md` files, dev tooling (`build.js`, `*.py`, `*.mjs`, `ivy_*`, logs),
  `netlify.toml`, and `package*.json`. If you add internal working files
  to the repo root, check they match a skip rule in `build.js`
  (`SKIP_DIRS`, `SKIP_FILES`, `SKIP_FILE_PATTERNS`) so they never deploy.

### Spot-check the build

```bash
npx -y http-server dist -p 8768 -c-1 --silent
```

Then open:

- `http://localhost:8768/` (homepage, nav dropdowns work)
- `http://localhost:8768/book-a-demo.html` (HubSpot scheduler renders)
- `http://localhost:8768/catalog.html` (form validates and submits)
- any page you changed in this release

---

## 2. Release

Two steps, both required, in this order:

### Step 1: push the source to GitHub

```bash
git add <changed files>
git commit -m "..."
git push origin main
```

This backs up the source and keeps history. It does **not** change the
live site.

### Step 2: deploy the build to Cloudflare Pages

```bash
node build.js
npx wrangler pages deploy dist --project-name=kubicle-marketing-site --commit-dirty=true
```

- wrangler authenticates via OAuth. If it prompts, run
  `npx wrangler login` once and retry.
- `--commit-dirty=true` suppresses the warning about untracked local
  files (the internal `docs/` folder etc. are intentionally uncommitted).
- The deploy uploads only changed files (content-hashed), so it usually
  takes seconds. The output ends with a unique preview URL like
  `https://<hash>.kubicle-marketing-site.pages.dev`; production
  (`www.kubicle.com`) is promoted from the same deployment.

---

## 3. Post-deploy verification

Run against production, not just the preview URL:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://www.kubicle.com/<changed-page>"
curl -s "https://www.kubicle.com/<changed-page>" | grep "<something new on the page>"
```

Timing caveats to know before assuming a deploy failed:

- **Production promotion can lag the preview URL by a minute or two.**
  If the preview URL shows the change and production does not, wait and
  retry before digging.
- **Brand-new URLs can serve edge-cached 404s for a few minutes** if
  anything requested them before the deploy landed. Retry with a cache
  buster (`?cb=123`) to confirm the origin is correct.
- **`robots.txt` and `sitemap.xml` are edge-cached for up to an hour**
  (see `_headers`), so changes to them appear at the edge within the
  hour even though the origin is already updated.
- HTML pages carry `max-age=0, must-revalidate` and update immediately.

---

## 4. Rollback

Cloudflare Pages keeps every deployment. To roll back:

1. Cloudflare dashboard: Workers & Pages, `kubicle-marketing-site`,
   Deployments tab, pick the last good deployment, "Rollback to this
   deployment". Instant.
2. Or redeploy a known-good build from git locally:
   `git checkout <good-sha>`, `node build.js`, then the wrangler deploy
   command from step 2.

---

## 5. Historical note

This site replaced the old Webflow site in 2025. The migration redirect
map lives in `_redirects` (400+ rules, applied via the generated
Cloudflare Pages middleware). An earlier version of this guide described
a Netlify git-integration deploy; that setup was retired and the
instructions above are the only supported release path.
