/*
 * Kubicle static site build.
 *
 * Mirrors the source tree (project root) into ./dist, copying every file
 * unchanged EXCEPT .html files containing the nav or footer placeholder
 * divs. Those get pre-rendered: each placeholder is replaced with the
 * markup the shared scripts would inject at runtime, and the script tags
 * for shared/nav.js and shared/footer.js are stripped.
 *
 * Why: crawlers see the rendered nav and footer in the initial HTML,
 * which exposes ~30 internal links per page for SEO instead of an empty
 * placeholder div.
 *
 * Source stays clean: nav.js, footer.js, and the placeholder divs in the
 * HTML are never touched. Edit them as usual, then run `npm run build`.
 */

const fs   = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT   = __dirname;
const DIST   = path.join(ROOT, 'dist');
const NAV_JS_PATH    = path.join(ROOT, 'shared', 'nav.js');
const FOOTER_JS_PATH = path.join(ROOT, 'shared', 'footer.js');

const SKIP_DIRS = new Set(['node_modules', '.netlify', '.claude', '.git', 'dist']);
// Files at the project root we never want bundled into /dist. dist.zip is the
// deploy artifact this script's output ends up in; if it isn't skipped, each
// build copies the previous zip into the new dist and the next zip is double
// the size (and recursive). Add other root-only artifacts here if needed.
const SKIP_FILES = new Set(['dist.zip']);

// Google Tag Manager container. Injected into every built HTML page (head +
// noscript fallback) so the source files stay clean and every page picks it
// up automatically. Conversion / event tags live in GTM, not in this code.
const GTM_ID = 'GTM-THB35WL9';
const GTM_HEAD =
  '<!-- Google Tag Manager -->\n' +
  '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':' +
  'new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],' +
  'j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=' +
  '\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);' +
  '})(window,document,\'script\',\'dataLayer\',\'' + GTM_ID + '\');</script>\n' +
  '<!-- End Google Tag Manager -->';
const GTM_BODY =
  '<!-- Google Tag Manager (noscript) -->\n' +
  '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=' + GTM_ID + '"\n' +
  'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n' +
  '<!-- End Google Tag Manager (noscript) -->';

// Termly consent banner + resource blocker. Injected at the very top of <head>
// on every built HTML page so it loads before GTM and can auto-block tracking
// cookies until the visitor consents. Banner UI and per-cookie rules are
// managed in the Termly dashboard, not in this code.
const TERMLY_UUID = '72490d97-475a-4129-99fc-1dfdcda54c2a';
const TERMLY_HEAD =
  '<!-- Termly Consent Banner -->\n' +
  '<script type="text/javascript" src="https://app.termly.io/resource-blocker/' +
  TERMLY_UUID + '?autoBlock=on"></script>\n' +
  '<!-- End Termly Consent Banner -->';

// Google Analytics 4 (gtag.js). Injected into <head>. Termly's autoBlock gates
// the loader script until consent is given.
const GA4_ID = 'G-20SHQ1KR0M';
const GA4_HEAD =
  '<!-- Google tag (gtag.js) -->\n' +
  '<script async src="https://www.googletagmanager.com/gtag/js?id=' + GA4_ID + '"></script>\n' +
  '<script>\n' +
  '  window.dataLayer = window.dataLayer || [];\n' +
  '  function gtag(){dataLayer.push(arguments);}\n' +
  '  gtag(\'js\', new Date());\n' +
  '  gtag(\'config\', \'' + GA4_ID + '\');\n' +
  '</script>\n' +
  '<!-- End Google tag -->';

// PostHog product analytics. Injected into <head>. Termly's autoBlock gates
// the loader (eu.i.posthog.com) until consent is given.
const POSTHOG_KEY = 'phc_fdHLM8sSLaVudcB9VyggvGeRCvdTxwMDPAZ4UrVEluY';
const POSTHOG_HEAD =
  '<!-- PostHog -->\n' +
  '<script>\n' +
  '    !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init ss us bi os hs es ns capture Bi calculateEventProperties cs register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty ps vs createPersonProfile gs Zr ys opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing ds debug O fs getPageViewId captureTraceFeedback captureTraceMetric Yr".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);\n' +
  '    posthog.init(\'' + POSTHOG_KEY + '\', {\n' +
  '        api_host: \'https://eu.i.posthog.com\',\n' +
  '        defaults: \'2025-11-30\',\n' +
  '        person_profiles: \'identified_only\',\n' +
  '    })\n' +
  '</script>\n' +
  '<!-- End PostHog -->';

// HubSpot tracking code. Per HubSpot's instructions, this goes just before
// </body>. Termly's autoBlock gates the loader (js.hs-scripts.com) until
// consent is given. Portal ID 3294554 matches the newsletter form in
// shared/footer.js.
const HUBSPOT_PORTAL_ID = '3294554';
const HUBSPOT_BODY_END =
  '<!-- Start of HubSpot Embed Code -->\n' +
  '<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/' +
  HUBSPOT_PORTAL_ID + '.js"></script>\n' +
  '<!-- End of HubSpot Embed Code -->';

// Google Search Console site-verification meta tags. Only the verified
// property URL (the homepage) strictly needs these, but injecting site-wide is
// harmless, keeps verification resilient to future property changes, and
// matches the pattern used by the other site-wide head injections above.
// Add additional tokens to the array when registering new GSC properties.
const GSC_VERIFICATION_TOKENS = [
  'GlN5gEgb3ABj9pNnKV71E3ddnRpq5MGEm50eK6gICSc',
  'XxcvKyIb8j3Wux4jP9SZekCjY5-800y5xDydFv1cLSc',
  'MY-qCs0BIdP3HQ5v4-HFzUtC_uN3GSCQJJYYkruzj2M'
];
const GSC_HEAD = GSC_VERIFICATION_TOKENS
  .map(t => '<meta name="google-site-verification" content="' + t + '"/>')
  .join('\n');

// Read the shared scripts once. Re-eval them in a fresh JSDOM window per page.
const NAV_JS    = fs.readFileSync(NAV_JS_PATH,    'utf8');
const FOOTER_JS = fs.readFileSync(FOOTER_JS_PATH, 'utf8');

// Sentinel comments wrap each placeholder before parsing so we can find
// what replaced it (the shared scripts use mount.outerHTML = MARKUP, so the
// placeholder element is gone after rendering — we can't query for it).
const SENTINEL = {
  nav:    { start: '__KUBICLE_NAV_START__',    end: '__KUBICLE_NAV_END__' },
  footer: { start: '__KUBICLE_FOOTER_START__', end: '__KUBICLE_FOOTER_END__' }
};

// Empty placeholder shapes we recognise. Tolerant of attribute order and
// whitespace inside the empty div.
const NAV_PLACEHOLDER_RE    = /<div\s+id=["']site-nav["']\s*>\s*<\/div>/i;
const FOOTER_PLACEHOLDER_RE = /<div\s+id=["']site-footer["']\s*>\s*<\/div>/i;

// Note: we intentionally keep the <script src="...shared/nav.js"> and
// shared/footer.js tags in the rendered output. Pre-rendering captures the
// static markup (good for SEO), but the nav has runtime interactivity
// (dropdown click/hover, mobile drawer, float CTA) and the footer has a
// newsletter form submit handler. The shared scripts detect the
// pre-rendered markup via inject() and wire handlers without re-injecting
// HTML. Stripping the tags here would leave the dropdowns dead in /dist.


// ---------------------------------------------------------------------------
// File-tree walk + copy
// ---------------------------------------------------------------------------

function walk(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    // SKIP_FILES check is only meaningful at the project root (base === '')
    // so files in sub-trees with the same name aren't accidentally excluded.
    if (base === '' && SKIP_FILES.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    const rel = base ? path.join(base, entry.name) : entry.name;
    if (entry.isDirectory()) {
      out.push(...walk(abs, rel));
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}


// ---------------------------------------------------------------------------
// URL derivation
// ---------------------------------------------------------------------------

// foo/bar/index.html → /foo/bar/
// foo/bar.html       → /foo/bar
// index.html         → /
// foo/bar.svg        → /foo/bar.svg (unused, but symmetric)
function relPathToWebPath(rel) {
  let p = rel.split(path.sep).join('/');
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (p === 'index.html')   p = '';
  else if (p.endsWith('.html'))  p = p.slice(0, -'.html'.length);
  return '/' + p;
}


// ---------------------------------------------------------------------------
// Redirects → Cloudflare Pages Function
// ---------------------------------------------------------------------------
// Cloudflare Pages caps the native `_redirects` file at 100 rules per project
// on most account tiers (their docs claim 2,100; in practice rules past ~100
// are silently dropped). We have ~334 rules and they all matter for SEO. So
// build.js parses _redirects and emits a Pages Function middleware that
// applies the rules in code. No rule limit, identical semantics. The
// `_redirects` file itself stays in dist/ for Netlify parity (Netlify has no
// such cap and still reads it).

const REDIRECTS_PATH = path.join(ROOT, '_redirects');

// Parse a Netlify-format _redirects file into {source, target, status} rules.
// Skips comment lines (#) and blank lines. Tolerates any whitespace between
// fields. Status defaults to 301 if omitted.
function parseRedirects(text) {
  const rules = [];
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    const source = parts[0];
    const target = parts[1];
    const status = parts[2] ? parseInt(parts[2], 10) : 301;
    if (!source.startsWith('/')) continue;
    rules.push({ source, target, status });
  }
  return rules;
}

// Generate the middleware source. The matching loop is inlined so the
// function is self-contained — no imports needed at runtime.
function generateRedirectsFunction(rules) {
  // Pre-classify each rule into an exact match or a /prefix/* wildcard with
  // optional :splat substitution in the target. This keeps the runtime hot
  // path tiny: a single startsWith / equality check per rule.
  const compiled = rules.map(r => {
    const isWildcard = r.source.endsWith('/*');
    return {
      prefix: isWildcard ? r.source.slice(0, -1) : null, // "/foo/*" -> "/foo/"
      exact:  isWildcard ? null : r.source,
      target: r.target,
      hasSplat: r.target.includes(':splat'),
      status: r.status
    };
  });

  // Emit as a JS array literal. Order of rules is preserved (first match wins,
  // matching Netlify semantics).
  const rulesLiteral = JSON.stringify(compiled, null, 2);

  return `// AUTO-GENERATED by build.js from /_redirects. Do not edit by hand.
// Regenerated on every \`npm run build\`. ${rules.length} rules.

const RULES = ${rulesLiteral};

function findMatch(pathname) {
  for (let i = 0; i < RULES.length; i++) {
    const r = RULES[i];
    if (r.exact !== null) {
      if (pathname === r.exact) {
        return { target: r.target, status: r.status };
      }
    } else if (pathname.startsWith(r.prefix)) {
      const splat = pathname.slice(r.prefix.length);
      const target = r.hasSplat ? r.target.replace(/:splat/g, splat) : r.target;
      return { target, status: r.status };
    }
  }
  return null;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const match = findMatch(url.pathname);
  if (!match) {
    return context.next();
  }

  // 404 / 410: serve the styled 404 page via ASSETS binding so users get the
  // designed error page, but with the intended status code. Crawlers see 404,
  // which is the whole point of these rules.
  if (match.status === 404 || match.status === 410) {
    try {
      const asset = await context.env.ASSETS.fetch(new URL('/404.html', url.origin));
      return new Response(asset.body, {
        status: match.status,
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    } catch (e) {
      return new Response('Not Found', { status: match.status });
    }
  }

  // Redirect statuses (301/302/303/307/308). Target may be a path (resolved
  // against current origin) or an absolute URL.
  const destination = match.target.startsWith('http')
    ? match.target
    : new URL(match.target, url.origin).href;
  return Response.redirect(destination, match.status);
}
`;
}

function buildRedirectsFunction() {
  if (!fs.existsSync(REDIRECTS_PATH)) return { wrote: false, count: 0 };
  const text = fs.readFileSync(REDIRECTS_PATH, 'utf8');
  const rules = parseRedirects(text);
  if (rules.length === 0) return { wrote: false, count: 0 };
  const code = generateRedirectsFunction(rules);
  // Cloudflare Pages Functions live in <project-root>/functions/, adjacent to
  // (not inside) the deployed output directory. Wrangler picks up the folder
  // automatically when it sits next to the dist/ being deployed.
  const outDir = path.join(ROOT, 'functions');
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, '_middleware.js'), code);
  return { wrote: true, count: rules.length };
}


// ---------------------------------------------------------------------------
// GTM injection
// ---------------------------------------------------------------------------

// Insert the GTM <head> snippet immediately after <head ...> and the
// <noscript> fallback immediately after <body ...>. Idempotent: skips if the
// container ID is already present in the source.
function injectGtm(html) {
  if (html.indexOf(GTM_ID) !== -1) return html;
  let out = html;
  out = out.replace(/<head(\s[^>]*)?>/i, function (m) { return m + '\n' + GTM_HEAD; });
  out = out.replace(/<body(\s[^>]*)?>/i, function (m) { return m + '\n' + GTM_BODY; });
  return out;
}

// Insert the Termly resource-blocker script immediately after <head ...>.
// Termly must load before GTM so autoBlock can gate tracking scripts until
// consent is given; running this AFTER injectGtm puts Termly above the GTM
// snippet in the final HTML. Idempotent: skips if the UUID is already present.
function injectTermly(html) {
  if (html.indexOf(TERMLY_UUID) !== -1) return html;
  return html.replace(/<head(\s[^>]*)?>/i, function (m) { return m + '\n' + TERMLY_HEAD; });
}

// Insert the GA4 gtag.js snippet immediately after <head ...>. Idempotent.
function injectGa4(html) {
  if (html.indexOf(GA4_ID) !== -1) return html;
  return html.replace(/<head(\s[^>]*)?>/i, function (m) { return m + '\n' + GA4_HEAD; });
}

// Insert the PostHog snippet immediately after <head ...>. Idempotent.
function injectPosthog(html) {
  if (html.indexOf(POSTHOG_KEY) !== -1) return html;
  return html.replace(/<head(\s[^>]*)?>/i, function (m) { return m + '\n' + POSTHOG_HEAD; });
}

// Insert the HubSpot loader immediately before </body>. Idempotent.
function injectHubspot(html) {
  if (html.indexOf('hs-script-loader') !== -1) return html;
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, HUBSPOT_BODY_END + '\n</body>');
  }
  // No </body>? Append at the end. (No source file should hit this.)
  return html + '\n' + HUBSPOT_BODY_END;
}

// Insert the Google Search Console verification meta tags into <head>.
// Idempotent: skipped if the first token is already present in the source.
function injectGsc(html) {
  if (html.indexOf(GSC_VERIFICATION_TOKENS[0]) !== -1) return html;
  return html.replace(/<head(\s[^>]*)?>/i, function (m) { return m + '\n' + GSC_HEAD; });
}


// ---------------------------------------------------------------------------
// Per-page pre-render
// ---------------------------------------------------------------------------

// Walk DOM siblings between two comment nodes (exclusive) and concatenate
// their serialised markup. Returns '' if either marker is missing.
function collectBetweenSentinels(doc, startText, endText) {
  // Comment nodes are NodeType 8. Find them by walking the tree.
  const walker = doc.createTreeWalker(doc, 0x80 /* NodeFilter.SHOW_COMMENT */);
  let startNode = null;
  let endNode   = null;
  let n;
  while ((n = walker.nextNode())) {
    if (n.data === startText) startNode = n;
    else if (n.data === endText) { endNode = n; break; }
  }
  if (!startNode || !endNode) return '';
  if (startNode.parentNode !== endNode.parentNode) return '';

  const parts = [];
  let cur = startNode.nextSibling;
  while (cur && cur !== endNode) {
    if (cur.nodeType === 1 /* ELEMENT_NODE */) {
      parts.push(cur.outerHTML);
    } else if (cur.nodeType === 3 /* TEXT_NODE */) {
      // Skip whitespace-only text between elements; preserve real text.
      if (cur.data && cur.data.trim()) parts.push(cur.data);
    } else if (cur.nodeType === 8 /* COMMENT_NODE */) {
      parts.push('<!--' + cur.data + '-->');
    }
    cur = cur.nextSibling;
  }
  return parts.join('\n');
}

function prerenderHtml(source, relPath) {
  const hasNav    = NAV_PLACEHOLDER_RE.test(source);
  const hasFooter = FOOTER_PLACEHOLDER_RE.test(source);
  if (!hasNav && !hasFooter) return { html: source, prerendered: false };

  // Wrap each placeholder with sentinel comments so we can capture what
  // replaced it after the shared scripts run.
  let wrapped = source;
  if (hasNav) {
    wrapped = wrapped.replace(NAV_PLACEHOLDER_RE, m =>
      `<!--${SENTINEL.nav.start}-->${m}<!--${SENTINEL.nav.end}-->`
    );
  }
  if (hasFooter) {
    wrapped = wrapped.replace(FOOTER_PLACEHOLDER_RE, m =>
      `<!--${SENTINEL.footer.start}-->${m}<!--${SENTINEL.footer.end}-->`
    );
  }

  const webPath = relPathToWebPath(relPath);
  const url = 'https://www.kubicle.com' + webPath;

  // Quiet jsdom's console — we have our own per-file error handling.
  const virtualConsole = new VirtualConsole();
  // Surface real script errors (only) so we don't silently swallow them.
  let scriptError = null;
  virtualConsole.on('jsdomError', err => { scriptError = err; });

  const dom = new JSDOM(wrapped, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole
  });
  const { window } = dom;

  // JSDOM 25 doesn't ship window.matchMedia. nav.js uses it to wire a resize
  // listener inside initMobileMenu (the listener never fires during build).
  // Provide a no-op stub matching the MediaQueryList shape.
  window.eval(
    'if (!window.matchMedia) {\n' +
    '  window.matchMedia = function(q) {\n' +
    '    return { matches: false, media: q, onchange: null,\n' +
    '      addEventListener: function(){}, removeEventListener: function(){},\n' +
    '      addListener: function(){}, removeListener: function(){},\n' +
    '      dispatchEvent: function(){ return false; } };\n' +
    '  };\n' +
    '}'
  );

  try {
    window.eval(NAV_JS);
    window.eval(FOOTER_JS);
    // Dispatch DOMContentLoaded in case either script defers via it. (At
    // this point readyState is 'complete' so they have already run inject()
    // synchronously, but dispatch for completeness.)
    window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
  } finally {
    // Nothing to do — we'll read from the document next.
  }

  if (scriptError) {
    // Propagate so the per-file handler can log + continue.
    dom.window.close();
    throw scriptError;
  }

  const doc = window.document;

  // Capture the rendered markup that replaced each placeholder.
  const renderedNav    = hasNav    ? collectBetweenSentinels(doc, SENTINEL.nav.start,    SENTINEL.nav.end)    : '';
  const renderedFooter = hasFooter ? collectBetweenSentinels(doc, SENTINEL.footer.start, SENTINEL.footer.end) : '';

  // Capture shared <style> elements injected into <head>. Without these the
  // rendered nav/footer would have no styling.
  const sharedStyles = [];
  const styleEls = doc.querySelectorAll('style[data-shared]');
  styleEls.forEach(el => {
    const tag = el.getAttribute('data-shared');
    if ((tag === 'nav' && hasNav) || (tag === 'footer' && hasFooter)) {
      sharedStyles.push(el.outerHTML);
    }
  });

  dom.window.close();

  // -- String-level splicing on the ORIGINAL source ----------------------
  let out = source;

  if (hasNav)    out = out.replace(NAV_PLACEHOLDER_RE,    renderedNav);
  if (hasFooter) out = out.replace(FOOTER_PLACEHOLDER_RE, renderedFooter);

  // Inject shared styles immediately before </head>. (CSS for the rendered
  // nav/footer; without these the prerendered markup would be unstyled.)
  if (sharedStyles.length) {
    const styleBlock = sharedStyles.join('\n');
    if (/<\/head>/i.test(out)) {
      out = out.replace(/<\/head>/i, styleBlock + '\n</head>');
    } else {
      // No </head>? Prepend to body. (No source file should hit this.)
      out = styleBlock + '\n' + out;
    }
  }

  return { html: out, prerendered: true };
}


// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Fresh dist on each build.
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  ensureDir(DIST);

  const files = walk(ROOT);
  let copied = 0;
  let prerendered = 0;
  const errors = [];

  for (const rel of files) {
    const src = path.join(ROOT, rel);
    const dst = path.join(DIST, rel);
    ensureDir(path.dirname(dst));

    const isHtml = rel.toLowerCase().endsWith('.html');
    if (!isHtml) {
      fs.copyFileSync(src, dst);
      copied++;
      continue;
    }

    try {
      const source = fs.readFileSync(src, 'utf8');
      const { html, prerendered: didRender } = prerenderHtml(source, rel);
      // Each <head> injector prepends right after <head>, so the LAST one to
      // run sits topmost. Order matters: Termly must end up first so its
      // autoBlock can gate everything beneath it.
      //   final <head> order: Termly -> PostHog -> GA4 -> GTM -> (rest)
      let out = injectGtm(html);
      out = injectGa4(out);
      out = injectPosthog(out);
      out = injectTermly(out);
      // Google Search Console meta tag; placement within <head> doesn't matter
      // for verification, but goes last so it sits near the top.
      out = injectGsc(out);
      // HubSpot loads at the bottom of <body> per HubSpot's instructions.
      out = injectHubspot(out);
      fs.writeFileSync(dst, out);
      if (didRender) prerendered++;
      else copied++;
    } catch (err) {
      // Fall back to copying the source through so the page still ships;
      // log the error so it's visible in build output.
      errors.push({ file: rel, message: (err && err.message) || String(err) });
      try {
        fs.copyFileSync(src, dst);
      } catch (copyErr) {
        // If even the copy fails, drop the file and log a second error.
        errors.push({ file: rel, message: 'fallback copy failed: ' + ((copyErr && copyErr.message) || String(copyErr)) });
      }
    }
  }

  // Generate sitemap.xml from the rendered HTML in /dist. Keeping this here
  // (rather than as a separate file) means the sitemap can never drift from
  // what actually ships.
  const sitemapStats = generateSitemap();

  // Generate the Cloudflare Pages Function that handles all _redirects rules
  // (sidestepping Pages' 100-rule cap on the native _redirects file).
  const redirectsStats = buildRedirectsFunction();

  console.log('Kubicle site build');
  console.log('  Files copied        : ' + copied);
  console.log('  HTML pre-rendered   : ' + prerendered);
  console.log('  Sitemap URLs        : ' + sitemapStats.count);
  console.log('  Redirect rules (CF) : ' + redirectsStats.count);
  console.log('  Errors              : ' + errors.length);
  if (errors.length) {
    console.log('');
    console.log('Errors:');
    for (const e of errors) console.log('  - ' + e.file + ': ' + e.message);
  }
  console.log('');
  console.log('Output: ' + DIST);

  // Exit non-zero on error so Netlify build fails loudly.
  if (errors.length) process.exit(1);
}


// ---------------------------------------------------------------------------
// Sitemap generation
// ---------------------------------------------------------------------------

const SITE_ORIGIN = 'https://www.kubicle.com';

// URL patterns to exclude from sitemap (still shipped, just not indexed).
// Brochure pages are gated lead assets, /try-free/business is a form,
// 404 is the error page. Add patterns here when adding pages that should
// not be discoverable via search.
const SITEMAP_EXCLUDE = [
  /^\/404$/,
  /\/brochure$/,
  /^\/try-free\/business$/
];

// Priority + change frequency derived from URL pattern. Most-trafficked /
// commercially-important pages get higher priority; long-tail blog posts
// get lower.
function sitemapMeta(urlPath) {
  // Highest-priority commercial / hub pages
  if (urlPath === '/') return { priority: '1.0',  changefreq: 'weekly'  };
  if (urlPath === '/pricing') return { priority: '0.95', changefreq: 'monthly' };
  if (urlPath === '/ai-training-for-employees') return { priority: '0.95', changefreq: 'monthly' };
  if (urlPath === '/try-free/') return { priority: '0.9', changefreq: 'monthly' };
  if (urlPath === '/contact') return { priority: '0.7', changefreq: 'yearly'  };
  if (urlPath === '/catalog') return { priority: '0.85', changefreq: 'monthly' };
  if (urlPath === '/projects') return { priority: '0.8',  changefreq: 'monthly' };

  // Section index pages
  if (/^\/(academies|courses|for-business|industries|individuals|resources|specialist-programs|vs|blog)\/?$/.test(urlPath)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }

  // Academy pillars
  if (/^\/academies\/[^/]+\/?$/.test(urlPath)) return { priority: '0.9', changefreq: 'monthly' };

  // Specialist programs (built BUILD targets — high commercial intent)
  if (/^\/specialist-programs\/(ai-literacy|data-literacy|graduate-program)$/.test(urlPath)) {
    return { priority: '0.9', changefreq: 'monthly' };
  }

  // Industries + For Business sub-pages
  if (/^\/(industries|for-business)\/[^/]+$/.test(urlPath)) return { priority: '0.85', changefreq: 'monthly' };

  // Subject (course) pages
  if (/^\/courses\/[^/]+$/.test(urlPath)) return { priority: '0.75', changefreq: 'monthly' };

  // Versus comparison pages
  if (/^\/vs\/[^/]+$/.test(urlPath)) return { priority: '0.75', changefreq: 'monthly' };

  // Blog topic hubs
  if (/^\/blog\/topic\/[^/]+$/.test(urlPath)) return { priority: '0.6', changefreq: 'monthly' };

  // Individual blog posts
  if (/^\/blog\/[^/]+$/.test(urlPath)) return { priority: '0.55', changefreq: 'yearly' };

  // Resources sub-pages
  if (/^\/resources\/[^/]+/.test(urlPath)) return { priority: '0.7', changefreq: 'monthly' };

  // About + legal
  if (/^\/about\//.test(urlPath)) return { priority: '0.5', changefreq: 'yearly' };
  if (/^\/(privacy-policy|terms-of-service|cookie-policy)$/.test(urlPath)) {
    return { priority: '0.3', changefreq: 'yearly' };
  }

  // Default
  return { priority: '0.5', changefreq: 'monthly' };
}

// Walk dist/ for HTML files, convert each to a public URL path, filter
// out excluded paths, and emit sitemap.xml.
function generateSitemap() {
  function walkHtml(dir, base = '') {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      const rel = base ? base + '/' + entry.name : entry.name;
      if (entry.isDirectory()) out.push(...walkHtml(abs, rel));
      else if (entry.isFile() && rel.toLowerCase().endsWith('.html')) out.push(rel);
    }
    return out;
  }

  const htmlFiles = walkHtml(DIST);

  // Convert HTML file paths in dist/ to their served public URL paths.
  // foo/bar/index.html -> /foo/bar/  (keep trailing slash for index pages)
  // foo/bar.html       -> /foo/bar
  // index.html         -> /
  function htmlToPublicPath(relPath) {
    const norm = relPath.split(path.sep).join('/');
    if (norm === 'index.html') return '/';
    if (norm.endsWith('/index.html')) return '/' + norm.slice(0, -('index.html'.length));
    return '/' + norm.slice(0, -('.html'.length));
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const urls = htmlFiles
    .map(htmlToPublicPath)
    .filter(p => !SITEMAP_EXCLUDE.some(re => re.test(p)))
    .sort();

  const xmlParts = [];
  xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const p of urls) {
    const meta = sitemapMeta(p);
    xmlParts.push('  <url>');
    xmlParts.push('    <loc>' + SITE_ORIGIN + p + '</loc>');
    xmlParts.push('    <lastmod>' + today + '</lastmod>');
    xmlParts.push('    <changefreq>' + meta.changefreq + '</changefreq>');
    xmlParts.push('    <priority>' + meta.priority + '</priority>');
    xmlParts.push('  </url>');
  }
  xmlParts.push('</urlset>');
  xmlParts.push('');

  const xml = xmlParts.join('\n');
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  // Also write to project root so the in-repo sitemap.xml stays in sync
  // (useful for IDE preview, manual inspection, and version-controlled diffs).
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);

  return { count: urls.length };
}


main();
