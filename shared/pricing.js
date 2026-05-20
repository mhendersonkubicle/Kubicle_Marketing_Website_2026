/*
 * Kubicle shared pricing module.
 *
 * One source of truth for prices, currencies, and volume discount tiers.
 * Edit /shared/pricing.json to update everything everywhere.
 *
 * USAGE in <head>:
 *   <script src="../shared/pricing.js" defer></script>
 *   (use "shared/pricing.js" for the root index.html)
 *
 * MARKUP CONTRACT:
 *
 * 1) Price block (one per displayed price):
 *      <div class="price-amount" data-price="single_academy">
 *        <span class="currency" data-price-symbol>$</span><span data-price-value>200</span>
 *        <span class="period" data-price-period="period_short"></span>
 *        <div class="original-price" data-price-original></div>
 *      </div>
 *
 *    - data-price keys must match the products in pricing.json.
 *    - data-price-period accepts "period_short" or "period_long" (defaults to short).
 *    - data-price-original is shown only when a volume discount applies.
 *
 * 2) Currency switcher (any number of buttons):
 *      <div class="currency-toggle">
 *        <button data-currency="USD">USD $</button>
 *        <button data-currency="EUR">EUR €</button>
 *        <button data-currency="GBP">GBP £</button>
 *      </div>
 *    The active button gets the `active` class.
 *
 * 3) Volume slider (optional, only on academy pages):
 *      <input type="range" min="0" max="9" value="0" data-volume-slider/>
 *      <span data-volume-display></span>
 *      <span data-discount-badge></span>
 *
 *    Slider index 0..N-1 maps to volume_tiers[index] in pricing.json.
 *    Pricing is MARGINAL: each tier discount applies only to the licences
 *    within that band. The displayed price is the blended per-learner rate
 *    at the upper bound of the selected band. The badge shows the effective
 *    blended discount, "Custom pricing", or is hidden.
 *    The slider's max is set programmatically from the JSON tier count;
 *    the markup max is just a fallback before JS runs.
 */
(function () {
  var STORAGE_KEY = 'kubicle_currency';

  // Inline mirror of shared/pricing.json. Used as a fallback when fetch() is
  // unavailable (e.g. file:// URLs blocked by browser CORS). Keep in sync
  // with shared/pricing.json. That file remains the canonical source.
  var INLINE_PRICING = {
    "default_currency": "USD",
    "currencies": {
      "USD": { "symbol": "$", "rate": 1.0,  "label": "USD $" },
      "EUR": { "symbol": "€", "rate": 0.88, "label": "EUR €" },
      "GBP": { "symbol": "£", "rate": 0.75, "label": "GBP £" }
    },
    "products": {
      "single_academy": {
        "USD": 175,
        "period_short": "per learner per year",
        "period_long":  "per learner per year · one academy only · volume discounts apply"
      },
      "all_access": {
        "USD": 499,
        "period_short": "per learner per year",
        "period_long":  "per learner per year · all four academies · volume discounts apply"
      },
      "individual_all_access": {
        "USD": 445,
        "period_short": "per learner per year",
        "period_long":  "per learner per year · billed annually · cancel anytime"
      },
      "individual_all_access_monthly": {
        "USD": 42,
        "period_short": "per learner per month",
        "period_long":  "per learner per month · billed monthly · cancel anytime"
      },
      "individual_free": {
        "USD": 0,
        "period_short": "forever, per learner",
        "period_long":  "forever · no credit card required"
      }
    },
    "volume_tiers": [
      [1, 20, 0],
      [21, 50, 15],
      [51, 100, 30],
      [101, 200, 45],
      [201, 500, 55],
      [501, 1000, 65],
      [1001, 2000, 75],
      [2001, 5000, 82],
      [5001, 10000, 85],
      [10001, null, -1]
    ]
  };

  function relativePathToJson() {
    var script = document.currentScript ||
      document.querySelector('script[src$="pricing.js"]');
    var src = script && script.getAttribute('src');
    return src ? src.replace(/pricing\.js(\?.*)?$/, 'pricing.json') : 'shared/pricing.json';
  }

  function format(usdAmount, currencyCode, pricing) {
    var cur = pricing.currencies[currencyCode] || pricing.currencies[pricing.default_currency] || { symbol: '$', rate: 1 };
    return { symbol: cur.symbol, value: Math.round(usdAmount * cur.rate) };
  }

  // Marginal volume pricing: discount applies only to the licences within
  // each band, not to the whole order. Returns the blended per-learner rate
  // for `count` licences. Tiers ending in -1 discount mean Custom pricing
  // and return null.
  function blendedPerLearner(tiers, count, basePrice) {
    if (!tiers || !tiers.length || count <= 0) return basePrice;
    var totalCost = 0;
    for (var i = 0; i < tiers.length; i++) {
      var tMin = tiers[i][0];
      var tMax = tiers[i][1];
      var tDisc = tiers[i][2];
      if (tDisc < 0) return null;
      if (tMax == null) tMax = count;
      var inBand = Math.max(0, Math.min(count, tMax) - tMin + 1);
      if (inBand <= 0) continue;
      totalCost += inBand * basePrice * (1 - tDisc / 100);
      if (count <= tMax) break;
    }
    return totalCost / count;
  }

  // Pick a representative licence count for a slider tier index. Uses the
  // upper bound of the band so the displayed rate reflects "what you'd pay
  // if your team filled this band".
  function representativeCount(tiers, idx) {
    var t = tiers[idx];
    if (!t) return 1;
    if (t[1] == null) return null; // open-ended -> custom
    return t[1];
  }

  function formatTierRange(tier) {
    var min = tier[0], max = tier[1];
    if (max == null) return min.toLocaleString() + '+';
    return min.toLocaleString() + '–' + max.toLocaleString();
  }

  function render(pricing, state) {
    var tiers = pricing.volume_tiers || [];
    var tier = tiers[state.sliderIdx] || [1, 1, 0];
    var discount = tier[2];
    var isCustom = discount === -1;
    var count = representativeCount(tiers, state.sliderIdx);

    document.querySelectorAll('[data-price]').forEach(function (el) {
      var key = el.getAttribute('data-price');
      var product = pricing.products[key];
      if (!product || product.USD == null) return;

      var f = format(product.USD, state.currency, pricing);
      var sym  = el.querySelector('[data-price-symbol]');
      var val  = el.querySelector('[data-price-value]');
      var per  = el.querySelector('[data-price-period]');
      var orig = el.querySelector('[data-price-original]');

      if (isCustom || count == null) {
        if (sym)  sym.style.display = 'none';
        if (val)  val.textContent = 'Custom';
        if (per)  per.style.display = 'none';
        if (orig) orig.style.display = 'none';
      } else {
        if (sym)  { sym.textContent = f.symbol; sym.style.display = ''; }
        var blended = blendedPerLearner(tiers, count, f.value);
        var displayed = (blended == null) ? f.value : Math.round(blended);
        if (val)  val.textContent = displayed;
        if (per)  {
          per.style.display = '';
          var pk = per.getAttribute('data-price-period') || 'period_short';
          per.textContent = product[pk] || product.period_short || '';
        }
        if (orig) {
          if (discount > 0 && displayed < f.value) {
            orig.textContent = f.symbol + f.value;
            orig.style.display = '';
          } else {
            orig.style.display = 'none';
          }
        }
      }
    });

    // Effective blended discount for the badge, using single_academy as
    // reference (any product yields the same percentage).
    var refUsd = pricing.products && pricing.products.single_academy && pricing.products.single_academy.USD;
    var effectivePct = null;
    if (!isCustom && count != null && refUsd) {
      var refBase = format(refUsd, state.currency, pricing).value;
      var refBlended = blendedPerLearner(tiers, count, refBase);
      if (refBlended != null && refBase > 0) {
        effectivePct = Math.round((1 - refBlended / refBase) * 100);
      }
    }

    document.querySelectorAll('[data-discount-badge]').forEach(function (b) {
      if (isCustom || count == null) {
        b.textContent = 'Custom pricing';
        b.style.visibility = 'visible';
      } else if (effectivePct && effectivePct > 0) {
        b.textContent = effectivePct + '% off (blended)';
        b.style.visibility = 'visible';
      } else {
        b.style.visibility = 'hidden';
      }
    });

    document.querySelectorAll('[data-volume-display]').forEach(function (d) {
      d.textContent = formatTierRange(tier);
    });
  }

  function syncToggleButtons(active) {
    document.querySelectorAll('[data-currency]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-currency') === active);
    });
  }

  function init(pricing) {
    var stored = null;
    try { stored = sessionStorage.getItem(STORAGE_KEY); } catch (e) {}
    var state = {
      currency: (stored && pricing.currencies[stored]) ? stored : (pricing.default_currency || 'USD'),
      sliderIdx: 0
    };

    var slider = document.querySelector('[data-volume-slider]');
    if (slider) {
      var max = (pricing.volume_tiers ? pricing.volume_tiers.length - 1 : 0);
      slider.max = max;
      slider.min = 0;
      if (slider.value === '' || isNaN(parseInt(slider.value, 10))) slider.value = 0;
      state.sliderIdx = parseInt(slider.value, 10);
      slider.addEventListener('input', function () {
        state.sliderIdx = parseInt(slider.value, 10);
        render(pricing, state);
      });
    }

    syncToggleButtons(state.currency);
    document.querySelectorAll('[data-currency]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.currency = b.getAttribute('data-currency');
        try { sessionStorage.setItem(STORAGE_KEY, state.currency); } catch (e) {}
        syncToggleButtons(state.currency);
        render(pricing, state);
      });
    });

    render(pricing, state);
  }

  function start() {
    // Try to fetch pricing.json (works on http(s)://). Fall back to the inline
    // mirror when fetch fails, typically file:// or offline scenarios.
    var done = false;
    function useInline(reason) {
      if (done) return;
      done = true;
      window.__KUBICLE_PRICING = INLINE_PRICING;
      init(INLINE_PRICING);
      if (reason) console.info('Kubicle pricing: using inline data (' + reason + ')');
    }
    try {
      fetch(relativePathToJson(), { cache: 'no-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (data) {
          if (done) return;
          done = true;
          window.__KUBICLE_PRICING = data;
          init(data);
        })
        .catch(function (e) { useInline(e.message); });
    } catch (e) {
      useInline(e.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
