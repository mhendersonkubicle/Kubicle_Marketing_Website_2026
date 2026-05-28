/*
 * Kubicle shared nav.
 *
 * One source of truth for the marketing nav across every page.
 * Edit this file to update the nav everywhere.
 *
 * USAGE in HTML:
 *   <div id="site-nav"></div>
 *   <script src="shared/nav.js" defer></script>     (root pages)
 *   <script src="../shared/nav.js" defer></script>  (subfolder pages)
 *
 * Auto-detects whether it's running in a subfolder (academies/ai/academies/data-literacy/Finance/PM)
 * so internal links (logo home, Try for Free chooser) resolve correctly.
 */
(function () {
  // ---- Path resolution -----------------------------------------------------
  // Resolve path depth so BASE points to the site root from any subfolder.
  // The site uses a flat first-level structure for most clusters, with two
  // exceptions that nest one level deeper:
  //   academies/{ai|data-literacy|project-management|finance}/...
  //   resources/{guides|assessments}/...
  //   blog/topic/...
  var path = window.location.pathname.toLowerCase();
  var inSub = false;
  var BASE = '';
  // Depth-2 patterns first (most specific)
  if (/\/(academies\/(?:ai|data-literacy|project-management|finance)|resources\/(?:guides|assessments)|blog\/topic)\//.test(path)) {
    inSub = true;
    BASE = '../../';
  } else if (/\/(academies|courses|for-business|industries|individuals|vs|blog|about|resources|specialist-programs|try-free)\//.test(path)) {
    inSub = true;
    BASE = '../';
  }
  var HOME  = BASE + 'index.html';
  var TRY_FREE = BASE + 'try-free/index.html';
  var TRY_FREE_BUSINESS = BASE + 'try-free/business.html';
  var CATALOG = BASE + 'catalog.html';
  // Skip the floating Talk-to-Sales button on the demo request form itself.
  var SUPPRESS_FLOAT_CTA = /\/try-free-business\.html?$/i.test(path);

  // ---- Icons (shared across Library, For Business, Resources) -------------
  var ICONS = {
    book:        '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5z"/><path d="M19 18v3H6a2 2 0 0 1-2-2"/>',
    shield:      '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>',
    lock:        '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    compass:     '<circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6 6-2z"/>',
    gavel:       '<path d="M14 4l6 6-3 3-6-6 3-3z"/><path d="M11 7L4 14l3 3 7-7"/><path d="M3 21h12"/>',
    sigma:       '<path d="M6 4h12l-7 8 7 8H6"/>',
    target:      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
    presentation:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20l5-4 5 4"/><path d="M12 16v4"/>',
    eye:         '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    chartBar:    '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M2 20h20"/>',
    chartArea:   '<path d="M3 17l5-6 4 3 5-7 4 4"/><path d="M3 21h18"/>',
    grid:        '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    database:    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    code:        '<path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M14 4l-4 16"/>',
    workflow:    '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 6h3a3 3 0 0 1 3 3"/>',
    plug:        '<path d="M9 2v4"/><path d="M15 2v4"/><path d="M6 6h12v4a6 6 0 0 1-12 0V6z"/><path d="M12 16v6"/>',
    sparkle:     '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/><path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>',
    cpu:         '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    brain:       '<path d="M12 4a3 3 0 0 0-3 3v1a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3v1a3 3 0 0 0 3 3"/><path d="M12 4a3 3 0 0 1 3 3v1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3v1a3 3 0 0 1-3 3"/><path d="M12 4v15"/>',
    clipboard:   '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6M9 19h4"/>',
    refresh:     '<path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/>',
    coins:       '<circle cx="9" cy="9" r="6"/><path d="M19.5 12a6 6 0 0 1-5 5.9"/><path d="M21 15a6 6 0 0 1-5 5.9"/>',
    ledger:      '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M9 3v18"/><path d="M13 12h4M13 16h4"/>',
    bot:         '<rect x="5" y="8" width="14" height="11" rx="3"/><circle cx="9.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M12 4v4M9 4h6"/>',
    wand:        '<path d="M3 21l12-12"/><path d="M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>',
    appWindow:   '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><circle cx="6" cy="7" r="0.6" fill="currentColor" stroke="none"/><circle cx="8" cy="7" r="0.6" fill="currentColor" stroke="none"/>',
    layers:      '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
    server:      '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><circle cx="7" cy="7" r="0.7" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="0.7" fill="currentColor" stroke="none"/>',
    slides:      '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 9h18"/><path d="M9 21h6"/>',
    docText:     '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/>',
    mail:        '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    plus:        '<path d="M12 5v14M5 12h14"/>',
    users:       '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 16a4.5 4.5 0 0 1 7 2.5"/>',
    building:    '<path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 8h2m-2 4h2m-2 4h2m4-8h2m-2 4h2m-2 4h2"/><path d="M3 21h18"/>',
    landmark:    '<path d="M3 21h18"/><path d="M3 11h18"/><path d="M5 6l7-3 7 3"/><path d="M6 11v8m4-8v8m4-8v8m4-8v8"/>',
    mortarboard: '<path d="M2 8l10-4 10 4-10 4-10-4z"/><path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v5"/>',
    play:        '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l5-2.5z" fill="currentColor" stroke="none"/>',
    helpCircle:  '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 3v1"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/>',
    briefcase:   '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
    edit:        '<path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/>',
    map:         '<path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>'
  };
  function ico(name) {
    return '<svg viewBox="0 0 24 24">' + (ICONS[name] || ICONS.book) + '</svg>';
  }

  // ---- Styles --------------------------------------------------------------
  // Self-contained: includes the academy color vars so the dropdowns render
  // correctly even on pages that don't define them globally.
  var STYLES = ''
    /* Tokens defined on every nav-related element so they cascade to mobile drawer (which is a sibling of .nav) */
    + '.nav, .mobile-drawer, .mobile-backdrop, .nav-hamburger {'
    + '  --nav-prussian: #0B1B2B;'
    + '  --nav-alice: #F4F6F8;'
    + '  --nav-steel: #8C9BAA;'
    + '  --nav-blue: #0496FF;'
    + '  --nav-academy-ai:      #00C4CC;'
    + '  --nav-academy-data:    #E91E63;'
    + '  --nav-academy-pm:      #F97316;'
    + '  --nav-academy-finance: #10B981;'
    + '}'
    + '.nav {'
    + '  position: sticky; top: 0; z-index: 100;'
    + '  background: rgba(5,36,56,0.92);'
    + '  backdrop-filter: blur(12px) saturate(140%);'
    + '  -webkit-backdrop-filter: blur(12px) saturate(140%);'
    + '  border-bottom: 1px solid rgba(255,255,255,0.08);'
    + '  font-family: var(--body, "Satoshi","Helvetica Neue",Arial,sans-serif);'
    + '}'
    + '.nav-inner { max-width: 1280px; margin: 0 auto; padding: 18px 48px; display: flex; align-items: center; gap: 40px; }'
    + '.nav-logo { display: inline-flex; align-items: center; flex-shrink: 0; }'
    + '.nav-logo img { height: 30px; display: block; }'
    + '.nav-logo .logo-mark { display: none; }'
    + '.nav-links { display: flex; gap: 6px; flex: 1; align-items: center; }'
    + '.nav-link {'
    + '  font-size: 15.5px; font-weight: 500;'
    + '  color: rgba(255,255,255,0.85);'
    + '  padding: 12px 16px; border-radius: 10px;'
    + '  background: transparent; border: 0; cursor: pointer;'
    + '  font-family: inherit;'
    + '  transition: color 0.15s, background 0.15s;'
    + '  display: inline-flex; align-items: center; gap: 6px;'
    + '  white-space: nowrap;'
    + '}'
    + '.nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }'
    + '.nav-link[aria-expanded="true"] { color: #fff; background: rgba(255,255,255,0.08); }'
    + '.nav-link .caret { width: 10px; height: 10px; display: inline-block; transition: transform 0.2s; opacity: 0.7; }'
    + '.nav-link[aria-expanded="true"] .caret { transform: rotate(180deg); }'
    + '.nav-utility { display: flex; gap: 10px; align-items: center; margin-left: auto; }'
    + '.btn-nav-secondary {'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  background: transparent; color: #fff;'
    + '  border: 1.5px solid #fff;'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 15px; font-weight: 600; letter-spacing: -0.005em;'
    + '  height: 44px; padding: 0 20px; border-radius: 14px;'
    + '  transition: background 0.15s, color 0.15s, transform 0.15s;'
    + '  text-decoration: none;'
    + '}'
    + '.btn-nav-secondary:hover { background: #fff; color: var(--nav-prussian); transform: translateY(-1px); }'
    + '.btn-nav-primary {'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  background: var(--nav-blue); color: #fff;'
    + '  border: 1.5px solid var(--nav-blue);'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 15px; font-weight: 600; letter-spacing: -0.005em;'
    + '  height: 44px; padding: 0 20px; border-radius: 14px;'
    + '  transition: background 0.15s, transform 0.15s;'
    + '  text-decoration: none;'
    + '}'
    + '.btn-nav-primary:hover { background: #0387e6; transform: translateY(-1px); }'
    + '.btn-nav-primary .btn-icon { width: 18px; height: 18px; display: none; }'
    + '.nav-link-wrap { position: relative; }'
    + '.nav-dropdown {'
    + '  position: absolute; left: 50%; top: calc(100% + 6px);'
    + '  transform: translateX(-50%) translateY(-4px);'
    + '  background: #fff; border-radius: 16px;'
    + '  box-shadow: 0 24px 80px -20px rgba(11,27,43,0.40), 0 8px 24px -8px rgba(11,27,43,0.18);'
    + '  border: 1px solid var(--nav-alice);'
    + '  padding: 28px; min-width: 780px;'
    + '  opacity: 0; visibility: hidden; pointer-events: none;'
    + '  transition: opacity 0.18s ease, transform 0.18s ease;'
    + '  z-index: 110;'
    + '}'
    + '.nav-dropdown.open { opacity: 1; visibility: visible; pointer-events: auto; transform: translateX(-50%) translateY(0); }'
    + '.nav-dropdown.dd-narrow { min-width: 280px; }'
    + '.nav-dropdown.dd-library { min-width: 320px; padding: 0; overflow: visible; }'
    + '.dd-lib-main { padding: 14px; display: flex; flex-direction: column; gap: 2px; }'
    + '.dd-acad-row {'
    + '  position: relative; display: flex; align-items: center; gap: 12px;'
    + '  padding: 12px 12px 12px 14px; border-radius: 10px; cursor: pointer;'
    + '  font-family: inherit; color: var(--nav-prussian);'
    + '  transition: background 0.15s ease; text-decoration: none;'
    + '}'
    + '.dd-acad-row::before { content: ""; position: absolute; left: 4px; top: 14px; bottom: 14px; width: 3px; border-radius: 2px; background: var(--c); opacity: 0; transition: opacity 0.15s; }'
    + '.dd-acad-row.active::before, .dd-acad-row:hover::before { opacity: 1; }'
    + '.dd-acad-row.active, .dd-acad-row:hover { background: color-mix(in oklab, var(--c) 8%, #fff); }'
    + '.dd-acad-row .dd-acad-ico {'
    + '  width: 36px; height: 36px; border-radius: 9px;'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  flex-shrink: 0;'
    + '  background: color-mix(in oklab, var(--c) 14%, #fff);'
    + '  color: var(--c);'
    + '  transition: background 0.15s, color 0.15s;'
    + '}'
    + '.dd-acad-row.active .dd-acad-ico, .dd-acad-row:hover .dd-acad-ico { background: var(--c); color: #fff; }'
    + '.dd-acad-row .dd-acad-ico svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }'
    + '.dd-acad-row .dd-acad-meta { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }'
    + '.dd-acad-row .dd-acad-num { font-family: var(--head, "Clash Grotesk",sans-serif); font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--c); }'
    + '.dd-acad-row .dd-acad-name { font-family: var(--head, "Clash Grotesk",sans-serif); font-size: 15px; font-weight: 600; color: var(--nav-prussian); letter-spacing: -0.005em; }'
    + '.dd-acad-row .dd-acad-count { font-family: inherit; font-size: 11.5px; color: var(--nav-steel); font-weight: 500; }'
    + '.dd-acad-row .dd-acad-chev { width: 14px; height: 14px; color: var(--nav-steel); transition: transform 0.15s, color 0.15s; flex-shrink: 0; }'
    + '.dd-acad-row:hover .dd-acad-chev, .dd-acad-row.active .dd-acad-chev { color: var(--c); transform: translateX(3px); }'
    + '.dd-acad-row .dd-acad-chev svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }'
    + '.dd-acad-row.ai      { --c: var(--nav-academy-ai); }'
    + '.dd-acad-row.data    { --c: var(--nav-academy-data); }'
    + '.dd-acad-row.pm      { --c: var(--nav-academy-pm); }'
    + '.dd-acad-row.finance { --c: var(--nav-academy-finance); }'
    + '.dd-acad-row.other   { --c: var(--nav-prussian); }'
    + '.dd-submenu-head.no-link { cursor: default; }'
    + '.dd-submenu-head.no-link:hover { background: transparent; border-bottom-color: var(--nav-alice); }'
    + '.dd-submenu {'
    + '  position: absolute; top: 0; left: calc(100% + 6px);'
    + '  min-width: 320px; max-width: 360px;'
    + '  background: #fff; border-radius: 16px;'
    + '  box-shadow: 0 24px 80px -20px rgba(11,27,43,0.40), 0 8px 24px -8px rgba(11,27,43,0.18);'
    + '  border: 1px solid var(--nav-alice); padding: 14px;'
    + '  opacity: 0; visibility: hidden; pointer-events: none;'
    + '  transform: translateX(-6px);'
    + '  transition: opacity 0.16s ease, transform 0.16s ease;'
    + '  z-index: 120;'
    + '}'
    + '.dd-submenu.open { opacity: 1; visibility: visible; pointer-events: auto; transform: translateX(0); }'
    + '.dd-submenu-head {'
    + '  display: block; padding: 8px 10px 12px; margin: -4px -4px 8px;'
    + '  border-radius: 10px;'
    + '  border-bottom: 1px solid var(--nav-alice);'
    + '  text-decoration: none;'
    + '  transition: background 0.15s;'
    + '}'
    + '.dd-submenu-head:hover { background: color-mix(in oklab, var(--c) 8%, #fff); border-bottom-color: transparent; }'
    + '.dd-submenu-title { display: block; font-family: var(--head, "Clash Grotesk",sans-serif); font-size: 15px; font-weight: 700; letter-spacing: -0.005em; color: var(--nav-prussian); }'
    + '.dd-submenu-cta { display: inline-flex; align-items: center; gap: 4px; margin-top: 3px; font-family: var(--head, "Clash Grotesk",sans-serif); font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c); }'
    + '.dd-submenu-head:hover .dd-submenu-cta { transform: translateX(2px); }'
    + '.dd-submenu-cta { transition: transform 0.15s; }'
    + '.dd-submenu-cta svg { width: 10px; height: 10px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }'
    + '.dd-submenu-list { display: flex; flex-direction: column; gap: 1px; }'
    + '.dd-link {'
    + '  display: flex; align-items: center; gap: 10px;'
    + '  padding: 8px; border-radius: 8px;'
    + '  transition: background 0.12s, color 0.12s, transform 0.12s;'
    + '  font-size: 13.5px; color: var(--nav-prussian);'
    + '  font-family: inherit; font-weight: 500; line-height: 1.25;'
    + '  text-decoration: none;'
    + '}'
    + '.dd-link:hover { background: color-mix(in oklab, var(--c, var(--nav-blue)) 10%, #fff); color: var(--c, var(--nav-blue)); transform: translateX(2px); }'
    + '.dd-link .dd-ico {'
    + '  width: 24px; height: 24px; border-radius: 6px;'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  flex-shrink: 0;'
    + '  background: color-mix(in oklab, var(--c, var(--nav-academy-data)) 14%, #fff);'
    + '  color: var(--c, var(--nav-academy-data));'
    + '  transition: background 0.15s, color 0.15s;'
    + '}'
    + '.dd-link .dd-ico svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }'
    + '.dd-link:hover .dd-ico { background: var(--c, var(--nav-academy-data)); color: #fff; }'
    + '.dd-narrow .dd-simple { --c: var(--nav-prussian); }'
    + '.dd-narrow .dd-link { font-size: 13.5px; padding: 8px 10px; }'
    + '.dd-narrow .dd-link .dd-ico { width: 26px; height: 26px; border-radius: 7px; }'
    + '.dd-narrow .dd-link .dd-ico svg { width: 15px; height: 15px; }'
    + '.dd-submenu.ai      { --c: var(--nav-academy-ai); }'
    + '.dd-submenu.data    { --c: var(--nav-academy-data); }'
    + '.dd-submenu.pm      { --c: var(--nav-academy-pm); }'
    + '.dd-submenu.finance { --c: var(--nav-academy-finance); }'
    + '.dd-submenu.other   { --c: var(--nav-prussian); }'
    + '.dd-foot { padding: 16px 22px; border-top: 1px solid var(--nav-alice); display: flex; justify-content: flex-end; align-items: center; }'
    + '.dd-foot a { font-family: var(--head, "Clash Grotesk",sans-serif); font-size: 13px; font-weight: 600; color: var(--nav-blue); text-decoration: none; letter-spacing: -0.005em; }'
    + '.dd-foot a:hover { text-decoration: underline; }'
    + '.dd-simple { display: flex; flex-direction: column; gap: 2px; min-width: 0; }'
    + '.dd-simple .dd-link { font-size: 14.5px; }'
    + '.dd-business-cta {'
    + '  display: flex; align-items: center; justify-content: flex-end; gap: 4px;'
    + '  margin: 14px -28px -28px;'
    + '  padding: 16px 22px;'
    + '  background: transparent; color: var(--nav-blue);'
    + '  border-top: 1px solid var(--nav-alice);'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 13px; font-weight: 600; letter-spacing: -0.005em;'
    + '  text-decoration: none;'
    + '  border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;'
    + '  transition: background 0.15s;'
    + '}'
    + '.dd-business-cta:hover { background: var(--nav-alice); text-decoration: underline; }'
    + '.dd-business-cta .arr { display: inline-block; transition: transform 0.15s; }'
    + '.dd-business-cta:hover .arr { transform: translateX(3px); }'
    + '.dd-col-label { font-family: var(--head, "Clash Grotesk",sans-serif); font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--nav-steel); }'
    + '@media (max-width: 1100px) {'
    + '  .nav-inner { padding: 14px 16px; gap: 10px; }'
    + '  .nav-links { display: none !important; }'
    + '  .nav-dropdown { display: none; }'
    + '  .nav-hamburger { display: inline-flex !important; }'
    /* Swap wordmark for brand mark — mobile traffic is heavy and a compact
       mark frees up horizontal space for the Try for Free + Log In CTAs. */
    + '  .nav-logo .logo-wordmark { display: none; }'
    + '  .nav-logo .logo-mark { display: block; height: 32px; width: auto; }'
    /* Try for Free stays visible as the primary mobile conversion CTA */
    + '  .nav-utility { gap: 8px; }'
    + '  .btn-nav-secondary { height: 40px; padding: 0 14px; font-size: 13.5px; border-radius: 12px; border-width: 1.5px; }'
    /* Log In collapses to an icon-only square button, same white-on-blue style */
    + '  .btn-nav-primary { width: 40px; height: 40px; padding: 0; border-radius: 12px; }'
    + '  .btn-nav-primary .btn-label { display: none; }'
    + '  .btn-nav-primary .btn-icon { display: block; }'
    + '  .nav-hamburger { width: 36px; height: 36px; }'
    + '  .nav-hamburger svg { width: 22px; height: 22px; }'
    + '}'
    /* Very small phones: tighten further so all three CTAs fit at 360px */
    + '@media (max-width: 400px) {'
    + '  .nav-inner { padding: 12px 12px; gap: 6px; }'
    + '  .btn-nav-secondary { padding: 0 12px; font-size: 13px; }'
    + '}'
    /* ---- MOBILE HAMBURGER + DRAWER ---- */
    + '.nav-hamburger {'
    + '  display: none;'
    + '  align-items: center; justify-content: center;'
    + '  width: 40px; height: 40px; padding: 0;'
    + '  background: transparent; border: 0; cursor: pointer;'
    + '  color: #fff;'
    + '}'
    + '.nav-hamburger svg { width: 24px; height: 24px; }'
    + '.nav-hamburger .h-line {'
    + '  fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round;'
    + '  transition: transform 0.25s, opacity 0.2s;'
    + '  transform-origin: center;'
    + '}'
    + '.nav-hamburger[aria-expanded="true"] .h-line.t { transform: translateY(6px) rotate(45deg); }'
    + '.nav-hamburger[aria-expanded="true"] .h-line.m { opacity: 0; }'
    + '.nav-hamburger[aria-expanded="true"] .h-line.b { transform: translateY(-6px) rotate(-45deg); }'

    /* Drawer must sit above the sticky .nav (z-index 100) so the drawer's own
       close (X) button is the one the user sees, not the morphed hamburger
       beneath it (this was the source of the right-edge "cut off" X). */
    + '.mobile-backdrop {'
    + '  position: fixed; inset: 0; z-index: 109;'
    + '  background: rgba(5,36,56,0.55);'
    + '  backdrop-filter: blur(2px);'
    + '  opacity: 0; pointer-events: none;'
    + '  transition: opacity 0.2s;'
    + '}'
    + '.mobile-backdrop.open { opacity: 1; pointer-events: auto; }'

    + '.mobile-drawer {'
    + '  position: fixed; top: 0; right: 0; bottom: 0;'
    + '  width: 100%; max-width: 420px;'
    + '  z-index: 110;'
    + '  background: #fff; color: var(--nav-prussian);'
    + '  display: flex; flex-direction: column;'
    + '  transform: translateX(100%);'
    + '  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);'
    + '  box-shadow: -20px 0 60px -10px rgba(0,0,0,0.4);'
    + '  font-family: var(--body, "Satoshi","Helvetica Neue",Arial,sans-serif);'
    + '}'
    + '.mobile-drawer.open { transform: translateX(0); }'

    + '.mobile-head {'
    + '  display: flex; align-items: center; justify-content: space-between;'
    + '  padding: 16px 18px;'
    + '  padding-top: max(16px, env(safe-area-inset-top));'
    + '  padding-right: max(18px, env(safe-area-inset-right));'
    + '  padding-left: max(18px, env(safe-area-inset-left));'
    + '  border-bottom: 1px solid var(--nav-alice);'
    + '  flex-shrink: 0;'
    + '  gap: 12px;'
    + '}'
    + '.mobile-head img { height: 26px; }'
    + '.mobile-close {'
    + '  width: 44px; height: 44px; border-radius: 12px;'
    + '  background: var(--nav-alice); border: 0; cursor: pointer;'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  color: var(--nav-prussian);'
    + '  flex-shrink: 0;'
    + '}'
    + '.mobile-close svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }'
    + '.mobile-close:hover { background: #e5ebf0; }'

    + '.mobile-body {'
    + '  flex: 1; overflow-y: auto;'
    + '  padding: 12px 14px;'
    + '  -webkit-overflow-scrolling: touch;'
    + '}'

    + '.m-link {'
    + '  display: flex; align-items: center; justify-content: space-between;'
    + '  width: 100%;'
    + '  padding: 14px 12px;'
    + '  background: transparent; border: 0;'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 17px; font-weight: 600; letter-spacing: -0.01em;'
    + '  color: var(--nav-prussian);'
    + '  text-decoration: none;'
    + '  text-align: left;'
    + '  cursor: pointer;'
    + '  border-radius: 10px;'
    + '  transition: background 0.15s;'
    + '}'
    + '.m-link:hover { background: var(--nav-alice); }'
    + '.m-link .m-caret {'
    + '  width: 20px; height: 20px;'
    + '  transition: transform 0.22s;'
    + '  color: var(--nav-steel);'
    + '}'
    + '.m-link .m-caret svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }'
    + '.m-section[data-open="true"] .m-link .m-caret { transform: rotate(90deg); color: var(--nav-blue); }'

    + '.m-panel {'
    + '  max-height: 0; overflow: hidden;'
    + '  transition: max-height 0.3s ease;'
    + '  padding: 0 4px;'
    + '}'
    + '.m-section[data-open="true"] .m-panel { max-height: 1200px; }'
    + '.m-panel-inner { padding: 4px 0 12px; display: flex; flex-direction: column; gap: 2px; }'

    + '.m-group-label {'
    + '  font-family: var(--head, "Clash Grotesk",sans-serif);'
    + '  font-size: 10.5px; font-weight: 700;'
    + '  letter-spacing: 0.14em; text-transform: uppercase;'
    + '  color: var(--nav-steel);'
    + '  padding: 14px 16px 6px;'
    + '}'
    + '.m-sublink {'
    + '  display: flex; align-items: center; gap: 12px;'
    + '  padding: 10px 16px;'
    + '  font-family: var(--body, "Satoshi",sans-serif);'
    + '  font-size: 14.5px; font-weight: 500;'
    + '  color: var(--nav-prussian);'
    + '  text-decoration: none;'
    + '  border-radius: 8px;'
    + '  transition: background 0.12s, color 0.12s;'
    + '}'
    + '.m-sublink:hover {'
    + '  background: color-mix(in oklab, var(--c, var(--nav-blue)) 8%, #fff);'
    + '  color: var(--c, var(--nav-blue));'
    + '}'
    + '.m-sublink .m-ico {'
    + '  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  background: color-mix(in oklab, var(--c, var(--nav-prussian)) 12%, #fff);'
    + '  color: var(--c, var(--nav-prussian));'
    + '}'
    + '.m-sublink .m-ico svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }'
    + '.m-acad-row {'
    + '  display: flex; align-items: center; gap: 12px;'
    + '  padding: 10px 16px;'
    + '  text-decoration: none;'
    + '  border-radius: 8px;'
    + '  font-family: var(--head, "Clash Grotesk",sans-serif);'
    + '  font-size: 15px; font-weight: 600; color: var(--nav-prussian);'
    + '  letter-spacing: -0.005em;'
    + '  border-left: 3px solid var(--c);'
    + '  background: color-mix(in oklab, var(--c) 5%, #fff);'
    + '  margin: 4px 0 2px;'
    + '}'
    + '.m-acad-row:hover { background: color-mix(in oklab, var(--c) 12%, #fff); }'
    + '.m-acad-row .m-ico {'
    + '  background: var(--c); color: #fff;'
    + '}'
    + '.m-acad-row.ai      { --c: var(--nav-academy-ai); }'
    + '.m-acad-row.data    { --c: var(--nav-academy-data); }'
    + '.m-acad-row.pm      { --c: var(--nav-academy-pm); }'
    + '.m-acad-row.finance { --c: var(--nav-academy-finance); }'
    + '.m-acad-row.other   { --c: var(--nav-prussian); }'
    + '.m-acad-row.no-link { cursor: default; }'
    + '.m-acad-row.no-link:hover { background: color-mix(in oklab, var(--c) 5%, #fff); }'

    + '.mobile-foot {'
    + '  border-top: 1px solid var(--nav-alice);'
    + '  padding: 16px 18px 22px;'
    + '  display: flex; flex-direction: column; gap: 10px;'
    + '  flex-shrink: 0;'
    + '  background: #fff;'
    + '}'
    + '.mobile-foot .btn-mob {'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  height: 48px; padding: 0 22px;'
    + '  border-radius: 14px;'
    + '  font-family: var(--head, "Clash Grotesk",sans-serif);'
    + '  font-size: 15px; font-weight: 600;'
    + '  text-decoration: none;'
    + '  letter-spacing: -0.005em;'
    + '  transition: background 0.15s, transform 0.15s;'
    + '}'
    + '.mobile-foot .btn-mob.outline {'
    + '  background: transparent; color: var(--nav-prussian);'
    + '  border: 1.5px solid var(--nav-prussian);'
    + '}'
    + '.mobile-foot .btn-mob.outline:hover { background: var(--nav-prussian); color: #fff; }'
    + '.mobile-foot .btn-mob.primary {'
    + '  background: var(--nav-blue); color: #fff;'
    + '}'
    + '.mobile-foot .btn-mob.primary:hover { background: #0387e6; }';

  // ---- Markup --------------------------------------------------------------
  var MARKUP = ''
    + '<nav class="nav">'
    + '  <div class="nav-inner">'
    + '    <a class="nav-logo" href="' + HOME + '" aria-label="Kubicle home">'
    + '      <img class="logo-wordmark" src="' + BASE + 'img/shared/6831119dcb82dac9dd5aea57_logo-white.svg" alt="Kubicle"/>'
    + '      <img class="logo-mark" src="' + BASE + 'img/shared/6929dc95a88edc17d8e3a3e4_LOGO-FILES-LOGO-MARK-WHITE-RGB-1.png" alt="" aria-hidden="true"/>'
    + '    </a>'
    + '    <div class="nav-links">'

    + '      <div class="nav-link-wrap">'
    + '        <button class="nav-link" data-dropdown="library" aria-expanded="false">Academies'
    + '          <svg class="caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4l3 3 3-3"/></svg>'
    + '        </button>'
    + '        <div class="nav-dropdown dd-library" id="dd-library" role="menu">'
    + '          <div class="dd-lib-main" id="ddLibMain"></div>'
    + '          <div class="dd-foot">'
    + '            <a href="' + CATALOG + '">Request a catalog &rarr;</a>'
    + '          </div>'
    + '        </div>'
    + '      </div>'

    + '      <div class="nav-link-wrap">'
    + '        <button class="nav-link" data-dropdown="business" aria-expanded="false">For Business'
    + '          <svg class="caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4l3 3 3-3"/></svg>'
    + '        </button>'
    + '        <div class="nav-dropdown dd-narrow" id="dd-business" role="menu">'
    + '          <div class="dd-simple">'
    + '            <div class="dd-col-label" style="border:0; margin:0; padding: 0 8px 6px;">Training</div>'
    + '            <a class="dd-link" href="' + BASE + 'for-business/teams.html"><span class="dd-ico">' + ico('users') + '</span>For Teams</a>'
    + '            <a class="dd-link" href="' + BASE + 'for-business/enterprises.html"><span class="dd-ico">' + ico('building') + '</span>For Enterprises</a>'
    + '            <div class="dd-col-label" style="border-top: 1px solid var(--nav-alice); margin-top: 10px; padding: 12px 8px 6px;">Capabilities</div>'
    + '            <a class="dd-link" href="' + BASE + 'for-business/custom-learning-design.html"><span class="dd-ico">' + ico('wand') + '</span>Custom Learning Design</a>'
    + '            <a class="dd-link" href="' + BASE + 'for-business/integrations.html"><span class="dd-ico">' + ico('plug') + '</span>Integrations</a>'
    + '            <a class="dd-link" href="' + BASE + 'for-business/platform.html"><span class="dd-ico">' + ico('layers') + '</span>Our Platform</a>'
    + '            <div class="dd-col-label" style="border-top: 1px solid var(--nav-alice); margin-top: 10px; padding: 12px 8px 6px;">Industries</div>'
    + '            <a class="dd-link" href="' + BASE + 'industries/banking.html"><span class="dd-ico">' + ico('landmark') + '</span>Banking</a>'
    + '            <a class="dd-link" href="' + BASE + 'industries/management-consulting.html"><span class="dd-ico">' + ico('briefcase') + '</span>Management Consulting</a>'
    + '            <a class="dd-link" href="' + BASE + 'industries/financial-services.html"><span class="dd-ico">' + ico('coins') + '</span>Financial Services</a>'
    + '            <a class="dd-link" href="' + BASE + 'industries/corporate-finance.html"><span class="dd-ico">' + ico('ledger') + '</span>Corporate Finance</a>'
    + '            <a class="dd-link" href="' + BASE + 'industries/education.html"><span class="dd-ico">' + ico('mortarboard') + '</span>Education</a>'
    + '          </div>'
    + '          <a class="dd-business-cta" href="' + CATALOG + '">Request a catalog <span class="arr">&rarr;</span></a>'
    + '        </div>'
    + '      </div>'

    + '      <a class="nav-link" href="' + BASE + 'individuals/index.html">For Individuals</a>'

    + '      <a class="nav-link" href="' + BASE + 'pricing.html">Pricing</a>'

    + '      <div class="nav-link-wrap">'
    + '        <button class="nav-link" data-dropdown="resources" aria-expanded="false">Resources'
    + '          <svg class="caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4l3 3 3-3"/></svg>'
    + '        </button>'
    + '        <div class="nav-dropdown dd-narrow" id="dd-resources" role="menu">'
    + '          <div class="dd-simple">'
    + '            <div class="dd-col-label" style="border:0; margin:0; padding: 0 8px 6px;">Resources</div>'
    + '            <a class="dd-link" href="' + BASE + 'blog/index.html"><span class="dd-ico">' + ico('edit') + '</span>Blog</a>'
    + '            <a class="dd-link" href="' + BASE + 'resources/case-studies.html"><span class="dd-ico">' + ico('docText') + '</span>Case Studies</a>'
    + '            <a class="dd-link" href="' + BASE + 'resources/webinars.html"><span class="dd-ico">' + ico('play') + '</span>Webinars</a>'
    + '            <a class="dd-link" href="' + BASE + 'resources/assessments/index.html"><span class="dd-ico">' + ico('target') + '</span>Assessments</a>'
    + '            <a class="dd-link" href="https://support.kubicle.com/"><span class="dd-ico">' + ico('helpCircle') + '</span>Support</a>'
    + '            <a class="dd-link" href="https://kubicle.onset.io/roadmap"><span class="dd-ico">' + ico('map') + '</span>Roadmap</a>'
    + '            <div class="dd-col-label" style="border-top: 1px solid var(--nav-alice); margin-top: 10px; padding: 12px 8px 6px;">About Us</div>'
    + '            <a class="dd-link" href="' + BASE + 'about/our-story.html"><span class="dd-ico">' + ico('book') + '</span>Our Story</a>'
    + '            <a class="dd-link" href="' + BASE + 'about/working-at-kubicle.html"><span class="dd-ico">' + ico('users') + '</span>Working at Kubicle</a>'
    + '            <a class="dd-link" href="https://apply.workable.com/kubicle/?lng=en"><span class="dd-ico">' + ico('briefcase') + '</span>Careers</a>'
    + '          </div>'
    + '        </div>'
    + '      </div>'

    + '    </div>'
    + '    <div class="nav-utility">'
    + '      <a class="btn-nav-secondary" href="' + TRY_FREE + '">Try for Free</a>'
    + '      <a class="btn-nav-primary" href="https://app.kubicle.com/sign-in" aria-label="Log In">'
    + '        <span class="btn-label">Log In</span>'
    + '        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>'
    + '          <polyline points="10 17 15 12 10 7"/>'
    + '          <line x1="15" y1="12" x2="3" y2="12"/>'
    + '        </svg>'
    + '      </a>'
    + '      <button class="nav-hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false">'
    + '        <svg viewBox="0 0 24 24"><line class="h-line t" x1="4" y1="6"  x2="20" y2="6"/><line class="h-line m" x1="4" y1="12" x2="20" y2="12"/><line class="h-line b" x1="4" y1="18" x2="20" y2="18"/></svg>'
    + '      </button>'
    + '    </div>'
    + '  </div>'
    + '</nav>'
    + '<div class="mobile-backdrop" id="mobileBackdrop"></div>'
    + '<aside class="mobile-drawer" id="mobileDrawer" aria-hidden="true">'
    + '  <div class="mobile-head">'
    + '    <a href="' + HOME + '" aria-label="Kubicle home">'
    + '      <img src="' + BASE + 'img/shared/6831119dcb82dac9dd5aea57_logo-white.svg" alt="Kubicle" style="filter: invert(1) brightness(0.15);"/>'
    + '    </a>'
    + '    <button class="mobile-close" id="mobileClose" aria-label="Close menu">'
    + '      <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
    + '    </button>'
    + '  </div>'
    + '  <div class="mobile-body" id="mobileBody"></div>'
    + '  <div class="mobile-foot">'
    + '    <a class="btn-mob primary" href="https://app.kubicle.com/sign-in">Log In</a>'
    + '    <a class="btn-mob outline" href="' + TRY_FREE + '">Try for Free</a>'
    + '  </div>'
    + '</aside>';

  // ---- Floating Talk-to-Sales CTA (shown on scroll, every content page) ----
  var FLOAT_CTA_STYLES = ''
    + '.shared-float-cta {'
    + '  position: fixed;'
    + '  bottom: 24px; right: 24px;'
    + '  z-index: 90;'
    + '  display: inline-flex; align-items: center; justify-content: center;'
    + '  gap: 8px;'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 15px; font-weight: 600; letter-spacing: -0.005em;'
    + '  height: 48px; padding: 0 22px;'
    + '  background: var(--nav-blue, #0496FF); color: #fff;'
    + '  border-radius: 999px;'
    + '  text-decoration: none;'
    + '  box-shadow: 0 18px 40px -10px rgba(4,150,255,0.55), 0 6px 14px -4px rgba(11,27,43,0.25);'
    + '  opacity: 0; pointer-events: none;'
    + '  transform: translateY(20px);'
    + '  transition: opacity 0.28s, transform 0.28s, background 0.15s;'
    + '}'
    + '.shared-float-cta.on { opacity: 1; pointer-events: auto; transform: translateY(0); }'
    + '.shared-float-cta:hover { background: #0387e6; }'
    + '.shared-float-cta .arr { transition: transform 0.15s; display: inline-block; }'
    + '.shared-float-cta:hover .arr { transform: translateX(3px); }'
    + '@media (max-width: 640px) {'
    + '  .shared-float-cta { bottom: 16px; right: 16px; height: 44px; padding: 0 18px; font-size: 14px; }'
    + '}';

  var FLOAT_CTA_MARKUP = ''
    + '<a class="shared-float-cta" id="shared-float-cta" href="' + TRY_FREE_BUSINESS + '" aria-label="Talk to Sales">'
    + '  Talk to Sales <span class="arr">&rarr;</span>'
    + '</a>';

  function injectFloatCta() {
    if (SUPPRESS_FLOAT_CTA) return;
    // Don't double-inject if a page already wired one in manually
    if (document.getElementById('shared-float-cta')) return;
    // Legacy in-page floating CTAs: skip so they remain the source of truth on
    // pages that haven't been migrated yet.
    if (document.querySelector('.float-cta, #float-cta')) return;

    var styleEl = document.createElement('style');
    styleEl.setAttribute('data-shared', 'float-cta');
    styleEl.textContent = FLOAT_CTA_STYLES;
    document.head.appendChild(styleEl);

    var wrap = document.createElement('div');
    wrap.innerHTML = FLOAT_CTA_MARKUP;
    var btn = wrap.firstElementChild;
    document.body.appendChild(btn);

    // Reveal once the user scrolls past 400px (i.e. past the hero on most pages)
    var revealed = false;
    function check() {
      if (revealed) return;
      if (window.scrollY > 400) {
        btn.classList.add('on');
        revealed = true;
        window.removeEventListener('scroll', check);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  // ---- Inject --------------------------------------------------------------
  // Two entry paths:
  //   1. First-render: a `<div id="site-nav"></div>` placeholder is present.
  //      Inject styles + markup, then wire handlers.
  //   2. Pre-rendered (build.js): the placeholder has already been replaced
  //      with the rendered <nav> in the HTML at build time, and the styles
  //      are already in <head>. Skip markup/styles injection and just wire
  //      the runtime event handlers (dropdown click/hover, mobile drawer,
  //      float CTA) onto the existing DOM.
  function inject() {
    var mount = document.getElementById('site-nav');
    if (mount) {
      var styleEl = document.createElement('style');
      styleEl.setAttribute('data-shared', 'nav');
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);

      mount.outerHTML = MARKUP;
    } else if (!document.querySelector('.nav')) {
      // Neither placeholder nor pre-rendered nav present; nothing to do.
      return;
    }

    initDropdowns();
    populateLibrary();
    initMobileMenu();
    injectFloatCta();
    initTryFreeFunnelTracking();
  }

  // ---- Try for Free funnel tracking ---------------------------------------
  // One delegated click listener catches every Try for Free / free-tier CTA
  // on every page (~150 buttons site-wide) and pushes a single dataLayer event
  // GTM can fan out to GA4, PostHog, etc. Captures derived location context
  // (nav, hero, pricing card, float CTA, etc.) automatically from the DOM
  // ancestry, so any new CTAs are tracked the moment they're added.
  function initTryFreeFunnelTracking() {
    if (window.__kbcFunnelTracking) return;   // idempotent
    window.__kbcFunnelTracking = true;

    // URL patterns that count as "Try for Free" entry-points.
    var TRY_FREE_RE = /\/(try-free\/?|free-tier-sign-up|join-for-free)(?:[/?#]|$)/;

    // Ancestor classes that map to a friendly location label. First match wins.
    var LOCATION_RULES = [
      ['.nav, .nav-utility',                'nav'              ],
      ['.shared-float-cta, #float-cta',     'float_cta'        ],
      ['.cta-strip',                        'cta_strip'        ],
      ['.hero, .hero-cta-row',              'hero'             ],
      ['.acad-price-card, .price-card, ' +
       '.all-access-card, .free-tier-card', 'pricing_card'     ],
      ['.impact-card, .impact-grid',        'impact_tile'      ],
      ['.compare-section, .compare-table',  'comparison_table' ],
      ['.faq-grid, .faq-section',           'faq_section'      ],
      ['.indiv-priceblock, .aa-priceblock', 'individual_price' ],
      ['.subjects-scroller, .acad-grid',    'subject_grid'     ],
      ['footer.site-footer',                'footer'           ]
    ];

    function deriveLocation(a) {
      // Explicit override always wins
      var explicit = a.getAttribute('data-cta-location');
      if (explicit) return explicit;
      for (var i = 0; i < LOCATION_RULES.length; i++) {
        if (a.closest(LOCATION_RULES[i][0])) return LOCATION_RULES[i][1];
      }
      return 'page';
    }

    function destinationLabel(href) {
      // Normalise the destination so reports group cleanly
      if (/free-tier-sign-up/.test(href)) return 'free_tier_signup_quiz';
      if (/try-free\/business/.test(href)) return 'try_free_business';
      if (/try-free/.test(href))           return 'try_free_landing';
      if (/join-for-free/.test(href))      return 'legacy_join_for_free';
      return 'unknown';
    }

    document.addEventListener('click', function (e) {
      // Find the nearest <a> the click landed on (covers clicks on inner
      // <span>s like the arrow glyph). Match against the resolved .href
      // (absolute URL) so relative links like "try-free/index.html" match too.
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (!TRY_FREE_RE.test(a.href || '')) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event:         'try_free_cta_click',
        cta_text:      (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        link_url:      a.href,
        link_dest:     destinationLabel(a.href),
        link_location: deriveLocation(a),
        source_page:   window.location.pathname
      });
    }, { capture: true });
  }

  // ---- Dropdown behavior ---------------------------------------------------
  function initDropdowns() {
    var triggers = document.querySelectorAll('.nav-link[data-dropdown]');
    if (!triggers.length) return;
    var openOne = null;

    function close(trigger) {
      if (!trigger) return;
      var id = trigger.getAttribute('data-dropdown');
      var dd = document.getElementById('dd-' + id);
      trigger.setAttribute('aria-expanded', 'false');
      if (dd) dd.classList.remove('open');
    }
    function open(trigger) {
      if (openOne && openOne !== trigger) close(openOne);
      var id = trigger.getAttribute('data-dropdown');
      var dd = document.getElementById('dd-' + id);
      trigger.setAttribute('aria-expanded', 'true');
      if (dd) dd.classList.add('open');
      openOne = trigger;
    }

    triggers.forEach(function (t) {
      var wrap = t.closest('.nav-link-wrap');
      var dd = document.getElementById('dd-' + t.getAttribute('data-dropdown'));
      var hideTimer;
      function show() { clearTimeout(hideTimer); open(t); }
      function scheduleHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { close(t); if (openOne === t) openOne = null; }, 180);
      }
      wrap.addEventListener('mouseenter', show);
      wrap.addEventListener('mouseleave', scheduleHide);
      if (dd) {
        dd.addEventListener('mouseenter', show);
        dd.addEventListener('mouseleave', scheduleHide);
      }
      t.addEventListener('click', function (e) {
        e.preventDefault();
        if (t.getAttribute('aria-expanded') === 'true') { close(t); openOne = null; }
        else { open(t); }
      });
    });

    document.addEventListener('click', function (e) {
      if (!openOne) return;
      if (!e.target.closest('.nav-link-wrap')) {
        close(openOne); openOne = null;
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openOne) { close(openOne); openOne = null; }
    });
  }

  // ---- Mobile menu --------------------------------------------------------
  function initMobileMenu() {
    var body = document.getElementById('mobileBody');
    var drawer = document.getElementById('mobileDrawer');
    var backdrop = document.getElementById('mobileBackdrop');
    var hamburger = document.getElementById('navHamburger');
    var closeBtn = document.getElementById('mobileClose');
    if (!body || !drawer || !backdrop || !hamburger) return;

    // Build mobile menu content
    var html = '';

    // Library accordion
    html += '<div class="m-section" data-open="false">';
    html +=   '<button class="m-link" type="button" data-acc="library">Academies';
    html +=     '<span class="m-caret"><svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4"/></svg></span>';
    html +=   '</button>';
    html +=   '<div class="m-panel"><div class="m-panel-inner">';
    html +=     '<a class="m-acad-row data" href="' + BASE + 'academies/data-literacy/index.html"><span class="m-ico">' + ico('chartArea') + '</span>Data Literacy</a>';
    html +=     '<a class="m-acad-row ai" href="' + BASE + 'academies/ai/index.html"><span class="m-ico">' + ico('sparkle') + '</span>AI Literacy</a>';
    html +=     '<a class="m-acad-row pm" href="' + BASE + 'academies/project-management/index.html"><span class="m-ico">' + ico('clipboard') + '</span>Project Management</a>';
    html +=     '<a class="m-acad-row finance" href="' + BASE + 'academies/finance/index.html"><span class="m-ico">' + ico('ledger') + '</span>Finance</a>';
    html +=     '<span class="m-acad-row other no-link" role="presentation"><span class="m-ico">' + ico('plus') + '</span>Other Subjects</span>';
    html +=     '<a class="m-sublink" href="' + CATALOG + '" style="margin-top: 6px; font-weight: 600; color: var(--nav-blue);">Request a catalog &rarr;</a>';
    html +=   '</div></div>';
    html += '</div>';

    // For Business accordion
    html += '<div class="m-section" data-open="false">';
    html +=   '<button class="m-link" type="button" data-acc="business">For Business';
    html +=     '<span class="m-caret"><svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4"/></svg></span>';
    html +=   '</button>';
    html +=   '<div class="m-panel"><div class="m-panel-inner">';
    html +=     '<div class="m-group-label">Training</div>';
    html +=     '<a class="m-sublink" href="' + BASE + 'for-business/teams.html"><span class="m-ico">' + ico('users') + '</span>For Teams</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'for-business/enterprises.html"><span class="m-ico">' + ico('building') + '</span>For Enterprises</a>';
    html +=     '<div class="m-group-label">Capabilities</div>';
    html +=     '<a class="m-sublink" href="' + BASE + 'for-business/custom-learning-design.html"><span class="m-ico">' + ico('wand') + '</span>Custom Learning Design</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'for-business/integrations.html"><span class="m-ico">' + ico('plug') + '</span>Integrations</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'for-business/platform.html"><span class="m-ico">' + ico('layers') + '</span>Our Platform</a>';
    html +=     '<div class="m-group-label">Industries</div>';
    html +=     '<a class="m-sublink" href="' + BASE + 'industries/banking.html"><span class="m-ico">' + ico('landmark') + '</span>Banking</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'industries/management-consulting.html"><span class="m-ico">' + ico('briefcase') + '</span>Management Consulting</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'industries/financial-services.html"><span class="m-ico">' + ico('coins') + '</span>Financial Services</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'industries/corporate-finance.html"><span class="m-ico">' + ico('ledger') + '</span>Corporate Finance</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'industries/education.html"><span class="m-ico">' + ico('mortarboard') + '</span>Education</a>';
    html +=     '<a class="m-sublink" href="' + CATALOG + '" style="margin-top: 6px; font-weight: 600; color: var(--nav-blue);">Request a catalog &rarr;</a>';
    html +=   '</div></div>';
    html += '</div>';

    // For Individuals (direct link)
    html += '<a class="m-link" href="' + BASE + 'individuals/index.html">For Individuals</a>';

    // Pricing (direct link)
    html += '<a class="m-link" href="' + BASE + 'pricing.html">Pricing</a>';

    // Resources accordion
    html += '<div class="m-section" data-open="false">';
    html +=   '<button class="m-link" type="button" data-acc="resources">Resources';
    html +=     '<span class="m-caret"><svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4"/></svg></span>';
    html +=   '</button>';
    html +=   '<div class="m-panel"><div class="m-panel-inner">';
    html +=     '<div class="m-group-label">Resources</div>';
    html +=     '<a class="m-sublink" href="' + BASE + 'blog/index.html"><span class="m-ico">' + ico('edit') + '</span>Blog</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'resources/case-studies.html"><span class="m-ico">' + ico('docText') + '</span>Case Studies</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'resources/webinars.html"><span class="m-ico">' + ico('play') + '</span>Webinars</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'resources/assessments/index.html"><span class="m-ico">' + ico('target') + '</span>Assessments</a>';
    html +=     '<a class="m-sublink" href="https://support.kubicle.com/"><span class="m-ico">' + ico('helpCircle') + '</span>Support</a>';
    html +=     '<a class="m-sublink" href="https://kubicle.onset.io/roadmap"><span class="m-ico">' + ico('map') + '</span>Roadmap</a>';
    html +=     '<div class="m-group-label">About Us</div>';
    html +=     '<a class="m-sublink" href="' + BASE + 'about/our-story.html"><span class="m-ico">' + ico('book') + '</span>Our Story</a>';
    html +=     '<a class="m-sublink" href="' + BASE + 'about/working-at-kubicle.html"><span class="m-ico">' + ico('users') + '</span>Working at Kubicle</a>';
    html +=     '<a class="m-sublink" href="https://apply.workable.com/kubicle/?lng=en"><span class="m-ico">' + ico('briefcase') + '</span>Careers</a>';
    html +=   '</div></div>';
    html += '</div>';

    body.innerHTML = html;

    // Open/close behavior
    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // Accordion behavior
    body.querySelectorAll('button[data-acc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var section = btn.closest('.m-section');
        var isOpen = section.getAttribute('data-open') === 'true';
        section.setAttribute('data-open', isOpen ? 'false' : 'true');
      });
    });

    // Close drawer when any link inside it is clicked (so navigation feels right)
    body.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        // small delay so the click registers before the drawer slides away
        setTimeout(closeDrawer, 50);
      });
    });

    // Auto-close drawer on resize back to desktop
    var mq = window.matchMedia('(min-width: 1101px)');
    function handleMq(e) {
      if (e.matches && drawer.classList.contains('open')) closeDrawer();
    }
    if (mq.addEventListener) mq.addEventListener('change', handleMq);
    else if (mq.addListener) mq.addListener(handleMq);
  }

  // ---- Library dropdown population ----------------------------------------
  function populateLibrary() {
    var main = document.getElementById('ddLibMain');
    if (!main) return;

    // Items: [name, icon, href]. Local Subject Pages are the canonical destination
    // for every subject we've published a page for. Cross-listed subjects (e.g.
    // Excel, Data Presentation Skills) intentionally appear under more than one
    // academy; the same href is reused so the user lands on a single page.
    var LIB = BASE + 'catalog.html';
    var SP  = BASE + 'courses/'; // local subject pages folder

    var ACADEMIES = [
      {
        key: 'data', cls: 'data', num: 'Academy 01', name: 'Data Literacy',
        headIcon: 'chartArea',
        ctaLabel: 'View Academy', ctaHref: BASE + 'academies/data-literacy/index.html',
        items: [
          ['Data Literacy', 'book', SP + 'data-literacy.html'],
          ['Statistical Analysis', 'sigma', SP + 'statistical-analysis.html'],
          ['Visualization Fundamentals', 'chartArea', SP + 'visualization-fundamentals.html'],
          ['Excel', 'grid', SP + 'excel.html'],
          ['Power BI', 'chartBar', SP + 'power-bi.html'],
          ['Tableau', 'chartBar', SP + 'tableau.html'],
          ['SQL', 'database', SP + 'sql.html'],
          ['Python Fundamentals', 'code', SP + 'python-fundamentals.html'],
          ['Alteryx', 'workflow', SP + 'alteryx.html'],
          ['Data Presentation Skills', 'presentation', SP + 'data-presentation-skills.html'],
          ['Data Strategy & Governance', 'compass', SP + 'data-strategy-governance.html'],
          ['Data Ethics & Risk', 'shield', SP + 'data-ethics-risk.html'],
          ['Data Security', 'lock', SP + 'data-security.html'],
          ['Data Regulation', 'gavel', SP + 'data-regulation.html'],
          ['Strategic Analysis', 'eye', SP + 'strategic-analysis.html'],
          ['APIs', 'plug', SP + 'apis.html']
        ]
      },
      {
        key: 'ai', cls: 'ai', num: 'Academy 02', name: 'AI',
        headIcon: 'sparkle',
        ctaLabel: 'View Academy', ctaHref: BASE + 'academies/ai/index.html',
        items: [
          ['AI Fundamentals', 'sparkle', SP + 'ai-fundamentals.html'],
          ['Machine Learning in Python', 'brain', SP + 'machine-learning-python.html'],
          ['Python Fundamentals', 'code', SP + 'python-fundamentals.html'],
          ['Alteryx Intelligence Suite', 'cpu', SP + 'alteryx-intelligence-suite.html'],
          ['RPA Fundamentals', 'bot', SP + 'rpa-fundamentals.html'],
          ['RPA with Power Automate', 'workflow', SP + 'rpa-power-automate.html'],
          ['RPA with UiPath', 'bot', SP + 'rpa-uipath.html'],
          ['Power Apps', 'appWindow', SP + 'power-apps.html'],
          ['Data Ethics & Risk', 'shield', SP + 'data-ethics-risk.html'],
          ['Data Regulation', 'gavel', SP + 'data-regulation.html']
        ]
      },
      {
        key: 'pm', cls: 'pm', num: 'Academy 03', name: 'Project Management',
        headIcon: 'clipboard',
        ctaLabel: 'View Academy', ctaHref: BASE + 'academies/project-management/index.html',
        items: [
          ['Project Management Fundamentals', 'clipboard', SP + 'project-management-fundamentals.html'],
          ['Adaptive Project Management', 'refresh', SP + 'adaptive-project-management.html'],
          ['Business Analysis', 'target', SP + 'business-analysis.html'],
          ['Strategic Analysis', 'eye', SP + 'strategic-analysis.html'],
          ['Data Presentation Skills', 'presentation', SP + 'data-presentation-skills.html'],
          ['PowerPoint', 'slides', SP + 'powerpoint.html'],
          ['Word', 'docText', SP + 'word.html'],
          ['Outlook', 'mail', SP + 'outlook.html'],
          ['Microsoft Teams', 'users', SP + 'microsoft-teams.html'],
          ['SharePoint', 'layers', SP + 'sharepoint.html'],
          ['Excel', 'grid', SP + 'excel.html']
        ]
      },
      {
        key: 'finance', cls: 'finance', num: 'Academy 04', name: 'Finance',
        headIcon: 'ledger',
        ctaLabel: 'View Academy', ctaHref: BASE + 'academies/finance/index.html',
        items: [
          ['Finance Fundamentals', 'coins', SP + 'finance-fundamentals.html'],
          ['Financial Modeling', 'ledger', SP + 'financial-modeling.html'],
          ['Excel', 'grid', SP + 'excel.html'],
          ['Power BI', 'chartBar', SP + 'power-bi.html'],
          ['Tableau', 'chartBar', SP + 'tableau.html'],
          ['SQL', 'database', SP + 'sql.html'],
          ['Statistical Analysis', 'sigma', SP + 'statistical-analysis.html'],
          ['Visualization Fundamentals', 'chartArea', SP + 'visualization-fundamentals.html'],
          ['Data Presentation Skills', 'presentation', SP + 'data-presentation-skills.html'],
          ['PowerPoint', 'slides', SP + 'powerpoint.html'],
          ['Word', 'docText', SP + 'word.html']
        ]
      },
      {
        key: 'other', cls: 'other', num: 'Plus', name: 'Other Subjects',
        headIcon: 'plus',
        ctaLabel: 'Full library', ctaHref: LIB,
        items: [
          ['App Development Fundamentals', 'layers', SP + 'app-development-fundamentals.html'],
          ['Technology Fundamentals', 'server', SP + 'technology-fundamentals.html'],
          ['SharePoint', 'layers', SP + 'sharepoint.html'],
          ['Microsoft Teams', 'users', SP + 'microsoft-teams.html'],
          ['Outlook', 'mail', SP + 'outlook.html'],
          ['Word', 'docText', SP + 'word.html'],
          ['PowerPoint', 'slides', SP + 'powerpoint.html']
        ]
      }
    ];

    var html = '';
    ACADEMIES.forEach(function (a) {
      var isOther = a.cls === 'other';
      if (isOther) {
        html += '<div class="dd-acad-row ' + a.cls + ' no-link" data-acad="' + a.key + '" role="presentation">';
      } else {
        html += '<a class="dd-acad-row ' + a.cls + '" data-acad="' + a.key + '" href="' + a.ctaHref + '">';
      }
      html +=   '<span class="dd-acad-ico">' + ico(a.headIcon) + '</span>';
      html +=   '<span class="dd-acad-meta">';
      html +=     '<span class="dd-acad-num">' + a.num + '</span>';
      html +=     '<span class="dd-acad-name">' + a.name + '</span>';
      html +=     '<span class="dd-acad-count">' + a.items.length + ' subject' + (a.items.length === 1 ? '' : 's') + '</span>';
      html +=   '</span>';
      html +=   '<span class="dd-acad-chev"><svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4"/></svg></span>';
      html += isOther ? '</div>' : '</a>';
      html += '<div class="dd-submenu ' + a.cls + '" data-submenu="' + a.key + '">';
      if (isOther) {
        html += '<div class="dd-submenu-head no-link">';
        html +=   '<span class="dd-submenu-title">' + a.name + '</span>';
        html += '</div>';
      } else {
        html += '<a class="dd-submenu-head" href="' + a.ctaHref + '">';
        html +=   '<span class="dd-submenu-title">' + a.name + ' Academy</span>';
        html +=   '<span class="dd-submenu-cta">' + a.ctaLabel + ' <svg viewBox="0 0 12 12"><path d="M3 6h6M6.5 3l3 3-3 3"/></svg></span>';
        html += '</a>';
      }
      html +=   '<div class="dd-submenu-list">';
      a.items.forEach(function (it) {
        var href = it[2] || '#';
        html += '<a class="dd-link" href="' + href + '"><span class="dd-ico">' + ico(it[1]) + '</span>' + it[0] + '</a>';
      });
      html +=   '</div>';
      html += '</div>';
    });
    main.innerHTML = html;

    var rows = main.querySelectorAll('.dd-acad-row');
    var subs = main.querySelectorAll('.dd-submenu');
    var openSub = null;
    var hideTimer = null;

    function clearOpen() {
      if (openSub) {
        openSub.classList.remove('open');
        var prevRow = main.querySelector('.dd-acad-row[data-acad="' + openSub.getAttribute('data-submenu') + '"]');
        if (prevRow) prevRow.classList.remove('active');
        openSub = null;
      }
    }
    function showSub(key) {
      clearTimeout(hideTimer);
      if (openSub && openSub.getAttribute('data-submenu') !== key) clearOpen();
      var sub = main.querySelector('.dd-submenu[data-submenu="' + key + '"]');
      var row = main.querySelector('.dd-acad-row[data-acad="' + key + '"]');
      if (!sub || !row) return;
      sub.style.top = row.offsetTop + 'px';
      sub.classList.add('open');
      row.classList.add('active');
      openSub = sub;
    }
    function scheduleHide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(clearOpen, 140);
    }

    rows.forEach(function (row) {
      var key = row.getAttribute('data-acad');
      row.addEventListener('mouseenter', function () { showSub(key); });
      row.addEventListener('mouseleave', scheduleHide);
    });
    subs.forEach(function (sub) {
      sub.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
      sub.addEventListener('mouseleave', scheduleHide);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
