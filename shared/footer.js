/*
 * Kubicle shared footer.
 *
 * One source of truth for the site footer across every page.
 * Edit this file to update the footer everywhere.
 *
 * USAGE in HTML:
 *   <div id="site-footer"></div>
 *   <script src="shared/footer.js" defer></script>     (root pages)
 *   <script src="../shared/footer.js" defer></script>  (subfolder pages)
 */
(function () {
  // Resolve relative paths so subfolder pages link back up to the site root.
  // Depth-2 patterns first (academies/{slug}/, resources/{guides|assessments}/,
  // blog/topic/), then depth-1 patterns for everything else.
  var path = window.location.pathname.toLowerCase();
  var inSub = false;
  var BASE = '';
  if (/\/(academies\/(?:ai|data-literacy|project-management|finance)|resources\/(?:guides|assessments)|blog\/topic)\//.test(path)) {
    inSub = true;
    BASE = '../../';
  } else if (/\/(academies|courses|for-business|industries|individuals|vs|blog|about|resources|specialist-programs|try-free)\//.test(path)) {
    inSub = true;
    BASE = '../';
  }

  var STYLES = ''
    + 'footer.site-footer {'
    + '  background: #020F17; color: rgba(255,255,255,0.6);'
    + '  padding: 56px 0 32px;'
    + '  font-family: var(--body, "Satoshi","Helvetica Neue",Arial,sans-serif);'
    + '}'
    + 'footer.site-footer .container { max-width: 1280px; margin: 0 auto; padding: 0 48px; }'
    + 'footer.site-footer .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1.1fr 1.2fr; gap: 32px; }'
    + 'footer.site-footer h5 {'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 13px; font-weight: 600;'
    + '  text-transform: uppercase; letter-spacing: 0.1em;'
    + '  color: rgba(255,255,255,0.5);'
    + '  margin: 0 0 16px;'
    + '}'
    + 'footer.site-footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }'
    + 'footer.site-footer ul a { font-size: 14.5px; color: rgba(255,255,255,0.7); text-decoration: none; }'
    + 'footer.site-footer ul a:hover { color: #fff; }'
    + 'footer.site-footer .footer-bottom {'
    + '  display: flex; justify-content: space-between; align-items: center;'
    + '  margin-top: 48px; padding-top: 24px;'
    + '  border-top: 1px solid rgba(255,255,255,0.08);'
    + '  font-size: 12px; color: rgba(255,255,255,0.45);'
    + '  flex-wrap: wrap; gap: 16px;'
    + '}'
    + 'footer.site-footer .footer-bottom a { color: rgba(255,255,255,0.55); text-decoration: none; }'
    + 'footer.site-footer .footer-bottom a:hover { color: #fff; }'
    // ---- Newsletter signup (own row, beneath the columns, left-aligned) ----
    + 'footer.site-footer .news-row {'
    + '  display: flex; align-items: center; gap: 16px;'
    + '  margin-top: 40px;'
    + '  flex-wrap: wrap;'
    + '}'
    + 'footer.site-footer .news-label {'
    + '  font-family: var(--head, "Clash Grotesk","Helvetica Neue",Arial,sans-serif);'
    + '  font-size: 11px; font-weight: 700;'
    + '  letter-spacing: 0.16em; text-transform: uppercase;'
    + '  color: rgba(255,255,255,0.55);'
    + '  flex-shrink: 0;'
    + '}'
    + 'footer.site-footer .news-form {'
    + '  display: flex; align-items: center;'
    + '  background: rgba(255,255,255,0.04);'
    + '  border: 1px solid rgba(255,255,255,0.10);'
    + '  border-radius: 999px;'
    + '  width: 340px;'
    + '  max-width: 100%;'
    + '  transition: border-color 0.15s, background 0.15s;'
    + '}'
    + 'footer.site-footer .news-form:focus-within {'
    + '  border-color: rgba(4,150,255,0.55);'
    + '  background: rgba(255,255,255,0.06);'
    + '}'
    + 'footer.site-footer .news-form input[type="email"] {'
    + '  flex: 1; min-width: 0;'
    + '  background: transparent;'
    + '  border: 0; outline: 0;'
    + '  padding: 10px 16px;'
    + '  font-family: var(--body, "Satoshi",sans-serif); font-size: 13.5px;'
    + '  color: #fff;'
    + '}'
    + 'footer.site-footer .news-form input::placeholder {'
    + '  color: rgba(255,255,255,0.40);'
    + '}'
    + 'footer.site-footer .news-form button {'
    + '  width: 32px; height: 32px;'
    + '  margin-right: 4px;'
    + '  background: rgba(4,150,255,0.85);'
    + '  border: 0; border-radius: 50%;'
    + '  color: #fff; cursor: pointer;'
    + '  display: flex; align-items: center; justify-content: center;'
    + '  transition: background 0.15s, transform 0.15s;'
    + '  flex-shrink: 0;'
    + '}'
    + 'footer.site-footer .news-form button:hover { background: #0496FF; transform: translateX(2px); }'
    + 'footer.site-footer .news-form button:disabled { opacity: 0.5; cursor: default; transform: none; }'
    + 'footer.site-footer .news-form button svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }'
    + 'footer.site-footer .news-msg {'
    + '  font-size: 12px; line-height: 1.4;'
    + '  color: rgba(255,255,255,0.55);'
    + '}'
    + 'footer.site-footer .news-msg.ok { color: #4ADE80; }'
    + 'footer.site-footer .news-msg.err { color: #FCA5A5; }'
    + '@media (max-width: 1100px) {'
    + '  footer.site-footer .footer-grid { grid-template-columns: 1fr 1fr 1fr; gap: 32px; }'
    + '}'
    + '@media (max-width: 700px) {'
    + '  footer.site-footer .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }'
    + '  footer.site-footer .container { padding: 0 24px; }'
    + '}';

  var MARKUP = ''
    + '<footer class="site-footer">'
    + '  <div class="container">'
    + '    <div class="footer-grid">'

    // Col 1: Logo + tagline
    + '      <div>'
    + '        <a href="https://www.kubicle.com" target="_blank" rel="noopener">'
    + '          <img src="' + BASE + 'img/shared/6831119dcb82dac9dd5aea57_logo-white.svg" alt="Kubicle" style="height: 28px; margin-bottom: 16px;"/>'
    + '        </a>'
    + '        <p style="font-size: 14px; color: rgba(255,255,255,0.55); max-width: 320px; line-height: 1.5;">'
    + '          Scalable, customizable, outcomes-focused training for business teams.'
    + '          Dublin, Ireland &middot; serving teams worldwide.'
    + '        </p>'
    + '      </div>'

    // Col 2: Products + Kubicle For
    + '      <div>'
    + '        <h5>Products</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'projects.html">Projects</a></li>'
    + '          <li><a href="' + BASE + 'academies/index.html">Academies</a></li>'
    + '          <li><a href="' + BASE + 'skills-navigator.html">Skills Navigator</a></li>'
    + '          <li><a href="' + BASE + 'for-business/custom-learning-design.html">Custom Learning Design</a></li>'
    + '          <li><a href="' + BASE + 'for-business/platform.html">Platform</a></li>'
    + '          <li><a href="' + BASE + 'for-business/integrations.html">Integrations</a></li>'
    + '        </ul>'
    + '        <h5 style="margin-top: 20px;">Kubicle For</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'for-business/teams.html">Teams</a></li>'
    + '          <li><a href="' + BASE + 'for-business/enterprises.html">Enterprises</a></li>'
    + '          <li><a href="' + BASE + 'individuals/index.html">Individuals</a></li>'
    + '        </ul>'
    + '      </div>'

    // Col 3: Specialist Academies
    + '      <div>'
    + '        <h5>Specialist Academies</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'academies/data-literacy/index.html">Data Literacy</a></li>'
    + '          <li><a href="' + BASE + 'academies/ai/index.html">AI Literacy</a></li>'
    + '          <li><a href="' + BASE + 'academies/project-management/index.html">Project Management</a></li>'
    + '          <li><a href="' + BASE + 'academies/finance/index.html">Finance</a></li>'
    + '          <li><a href="' + BASE + 'specialist-programs/graduate-program.html">Early Careers</a></li>'
    + '          <li><a href="' + BASE + 'specialist-programs/graduate-program.html">Graduate Program</a></li>'
    + '        </ul>'
    + '      </div>'

    // Col 4: Industries + About
    + '      <div>'
    + '        <h5>Industries</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'industries/banking.html">Banking</a></li>'
    + '          <li><a href="' + BASE + 'industries/management-consulting.html">Management Consulting</a></li>'
    + '          <li><a href="' + BASE + 'industries/financial-services.html">Financial Services</a></li>'
    + '          <li><a href="' + BASE + 'industries/corporate-finance.html">Corporate Finance</a></li>'
    + '          <li><a href="' + BASE + 'industries/education.html">Education</a></li>'
    + '        </ul>'
    + '        <h5 style="margin-top: 20px;">About</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'about/our-story.html">Our Story</a></li>'
    + '          <li><a href="' + BASE + 'about/working-at-kubicle.html">Working at Kubicle</a></li>'
    + '          <li><a href="https://apply.workable.com/kubicle/?lng=en" target="_blank" rel="noopener">Careers</a></li>'
    + '        </ul>'
    + '      </div>'

    // Col 5: Resources + Support
    + '      <div>'
    + '        <h5>Resources</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'blog/index.html">Blog</a></li>'
    + '          <li><a href="' + BASE + 'resources/case-studies.html">Case Studies</a></li>'
    + '          <li><a href="' + BASE + 'resources/webinars.html">Webinars</a></li>'
    + '        </ul>'
    + '        <h5 style="margin-top: 20px;">Support</h5>'
    + '        <ul>'
    + '          <li><a href="https://kubicle.onset.io/roadmap" target="_blank" rel="noopener">Roadmap</a></li>'
    + '          <li><a href="https://status.kubicle.com/" target="_blank" rel="noopener">Platform Status</a></li>'
    + '          <li><a href="' + BASE + 'resources/guides/ai-use-policy.html">AI Use Policy</a></li>'
    + '          <li><a href="' + BASE + 'resources/assessments/data-literacy.html">Data Literacy Assessment</a></li>'
    + '          <li><a href="' + BASE + 'resources/assessments/ai-literacy.html">AI Literacy Assessment</a></li>'
    + '          <li><a href="' + BASE + 'resources/assessments/finance.html">Finance Skills Assessment</a></li>'
    + '          <li><a href="' + BASE + 'resources/assessments/project-management.html">Project Management Assessment</a></li>'
    + '        </ul>'
    + '      </div>'

    // Col 6: Compare + Contact
    + '      <div>'
    + '        <h5>Compare</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'vs/kubicle-vs-linkedin-learning.html">Kubicle vs LinkedIn Learning</a></li>'
    + '          <li><a href="' + BASE + 'vs/kubicle-vs-udemy.html">Kubicle vs Udemy</a></li>'
    + '          <li><a href="' + BASE + 'vs/kubicle-vs-udacity.html">Kubicle vs Udacity</a></li>'
    + '          <li><a href="' + BASE + 'vs/kubicle-vs-datacamp.html">Kubicle vs DataCamp</a></li>'
    + '          <li><a href="' + BASE + 'vs/kubicle-vs-pluralsight.html">Kubicle vs Pluralsight</a></li>'
    + '          <li><a href="' + BASE + 'vs/kubicle-vs-coursera.html">Kubicle vs Coursera</a></li>'
    + '        </ul>'
    + '        <h5 style="margin-top: 20px;">Contact</h5>'
    + '        <ul>'
    + '          <li><a href="' + BASE + 'contact.html">Contact Us</a></li>'
    + '          <li><a href="' + BASE + 'try-free/business.html">Book a Demo</a></li>'
    + '        </ul>'
    + '      </div>'

    + '    </div>'
    + '    <div class="news-row">'
    + '      <span class="news-label">Stay in the loop</span>'
    + '      <form class="news-form" id="kbcNewsForm" novalidate>'
    + '        <input type="email" name="email" placeholder="you@company.com" required aria-label="Email address"/>'
    + '        <button type="submit" aria-label="Subscribe to the Kubicle newsletter">'
    + '          <svg viewBox="0 0 24 24"><polyline points="5 12 19 12"/><polyline points="13 6 19 12 13 18"/></svg>'
    + '        </button>'
    + '      </form>'
    + '      <span class="news-msg" id="kbcNewsMsg" role="status" aria-live="polite"></span>'
    + '    </div>'
    + '    <div class="footer-bottom">'
    + '      <span>&copy; 2026 Kubicle. All Rights Reserved.</span>'
    + '      <div style="display: flex; gap: 24px; flex-wrap: wrap;">'
    + '        <a href="' + BASE + 'privacy-policy.html">Privacy Policy</a>'
    + '        <a href="' + BASE + 'terms-of-service.html">Terms of Service</a>'
    + '        <a href="' + BASE + 'cookie-policy.html">Cookie Policy</a>'
    + '        <a href="#" class="termly-display-preferences">Consent Preferences</a>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</footer>';

  // Two entry paths:
  //   1. First-render: a `<div id="site-footer"></div>` placeholder is present.
  //      Inject styles + markup, then wire the newsletter form.
  //   2. Pre-rendered (build.js): the placeholder has already been replaced
  //      with the rendered <footer> at build time, and styles are in <head>.
  //      Skip markup/styles injection and just wire the form handler.
  function inject() {
    var mount = document.getElementById('site-footer');
    if (mount) {
      var styleEl = document.createElement('style');
      styleEl.setAttribute('data-shared', 'footer');
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);
      mount.outerHTML = MARKUP;
    } else if (!document.querySelector('footer.site-footer')) {
      return;
    }
    wireNewsletterForm();
  }

  // ---- Newsletter form submission (HubSpot Forms v3 API) ----
  // Portal ID: 3294554
  // Form GUID: b772a982-bbf0-46da-8fa2-740c109e0d9a
  function wireNewsletterForm() {
    var form = document.getElementById('kbcNewsForm');
    var msg  = document.getElementById('kbcNewsMsg');
    if (!form || !msg) return;

    var endpoint = 'https://api.hsforms.com/submissions/v3/integration/submit/3294554/b772a982-bbf0-46da-8fa2-740c109e0d9a';

    function setMsg(text, kind) {
      msg.textContent = text || '';
      msg.classList.remove('ok', 'err');
      if (kind) msg.classList.add(kind);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var btn   = form.querySelector('button[type="submit"]');
      var email = (input && input.value || '').trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMsg('Please enter a valid email address.', 'err');
        return;
      }
      btn.disabled = true;
      setMsg('Subscribing...');

      var payload = {
        submittedAt: Date.now(),
        fields: [
          { objectTypeId: '0-1', name: 'email', value: email }
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title
        }
      };

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.ok ? r.json() : r.json().then(function (b) { throw b; }); })
        .then(function () {
          form.reset();
          setMsg('Thanks. You are on the list.', 'ok');
          btn.disabled = false;
        })
        .catch(function (err) {
          var detail = (err && err.errors && err.errors[0] && err.errors[0].message) || '';
          setMsg('Could not subscribe right now. ' + detail, 'err');
          btn.disabled = false;
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
