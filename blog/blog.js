/* ==========================================================================
   Blog listing: search + pagination
   Used on Blog/index.html and Blog/category/*.html.
   Renders in-place; no server, no router. Cards live in the DOM and the
   script just toggles visibility.
   ========================================================================== */
(function () {
  var GRID    = document.getElementById('postsGrid');
  var SEARCH  = document.getElementById('postSearch');
  var CLEAR   = document.getElementById('searchClear');
  var META    = document.getElementById('resultMeta');
  var PAG     = document.getElementById('pagination');
  var EMPTY   = document.getElementById('emptyState');
  if (!GRID) return;

  var PAGE_SIZE = 12;
  var cards = Array.prototype.slice.call(GRID.querySelectorAll('.post-card'));
  var page = 1;
  var query = '';

  // Build a lower-cased search index from each card's headline + excerpt.
  cards.forEach(function (c) {
    var h = c.querySelector('h2,h3');
    var p = c.querySelector('p');
    var t = ((h ? h.textContent : '') + ' ' + (p ? p.textContent : '')).toLowerCase();
    c.dataset.searchText = t.replace(/\s+/g, ' ').trim();
  });

  function isFiltering() { return query.length > 0; }

  function filtered() {
    if (!isFiltering()) return cards;
    return cards.filter(function (c) {
      return c.dataset.searchText.indexOf(query) !== -1;
    });
  }

  // The featured card spans 2 grid cells on a 3-col grid. Page 1 therefore
  // needs 2 extra cards to finish on a clean row instead of leaving an
  // orphan tile + 2 empty slots in the last row.
  function page1Size() {
    var hasFeatured = cards.length > 0 && cards[0].classList.contains('featured');
    return PAGE_SIZE + (hasFeatured ? 2 : 0);
  }

  function pageWindow(list) {
    if (isFiltering()) return list;
    var p1 = page1Size();
    if (page === 1) return list.slice(0, p1);
    var start = p1 + (page - 2) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }

  function totalPagesCount(total) {
    var p1 = page1Size();
    if (total <= p1) return 1;
    return 1 + Math.ceil((total - p1) / PAGE_SIZE);
  }

  function buildPageNumbers(total) {
    /* Smart pagination with ellipsis when many pages.
       Always show: first, last, current, current-1, current+1.
       Fill with ellipsis where appropriate. */
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var nums = new Set([1, total, page, page - 1, page + 1]);
    var sorted = Array.from(nums).filter(function (n) { return n >= 1 && n <= total; }).sort(function (a, b) { return a - b; });
    var result = [];
    for (var i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
      result.push(sorted[i]);
    }
    return result;
  }

  function renderPagination(totalPages) {
    if (!PAG) return;
    if (totalPages <= 1 || isFiltering()) { PAG.innerHTML = ''; return; }
    var html = '';
    html += '<button class="page-btn page-prev" type="button"' + (page === 1 ? ' disabled' : '') + ' aria-label="Previous page">';
    html += '<svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg></button>';
    var nums = buildPageNumbers(totalPages);
    nums.forEach(function (n) {
      if (n === '...') {
        html += '<span class="page-btn" aria-hidden="true" style="cursor:default;border-color:transparent;background:transparent;"><span class="ellipsis">…</span></span>';
      } else {
        html += '<button class="page-btn' + (n === page ? ' active' : '') + '" type="button" data-page="' + n + '"' + (n === page ? ' aria-current="page"' : '') + '>' + n + '</button>';
      }
    });
    html += '<button class="page-btn page-next" type="button"' + (page === totalPages ? ' disabled' : '') + ' aria-label="Next page">';
    html += '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></button>';
    PAG.innerHTML = html;
  }

  function updateMeta(visible, total) {
    if (!META) return;
    if (isFiltering()) {
      META.innerHTML = '<strong>' + total + '</strong> ' + (total === 1 ? 'match' : 'matches') +
        (total > 0 ? ' for &ldquo;' + escapeHtml(query) + '&rdquo;' : '');
    } else {
      META.innerHTML = '<strong>' + visible + '</strong> of ' + total + ' posts &middot; latest first';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function render() {
    var list = filtered();
    var totalItems = list.length;
    var totalPages = isFiltering()
      ? 1
      : Math.max(1, totalPagesCount(totalItems));
    if (page > totalPages) page = totalPages;

    var visible = pageWindow(list);
    cards.forEach(function (c) { c.classList.add('is-hidden'); });
    visible.forEach(function (c) { c.classList.remove('is-hidden'); });

    updateMeta(visible.length, totalItems);
    if (EMPTY) EMPTY.classList.toggle('on', totalItems === 0);
    renderPagination(totalPages);
    if (CLEAR) CLEAR.classList.toggle('on', isFiltering());
  }

  function scrollToGridTop() {
    var anchor = document.querySelector('.posts-section') || GRID;
    var top = anchor.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  if (SEARCH) {
    var debounce;
    SEARCH.addEventListener('input', function (e) {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        query = e.target.value.trim().toLowerCase();
        page = 1;
        render();
      }, 120);
    });
  }

  if (CLEAR) {
    CLEAR.addEventListener('click', function () {
      if (!SEARCH) return;
      SEARCH.value = '';
      query = '';
      page = 1;
      render();
      SEARCH.focus();
    });
  }

  if (PAG) {
    PAG.addEventListener('click', function (e) {
      var btn = e.target.closest('.page-btn');
      if (!btn || btn.disabled) return;
      if (btn.classList.contains('page-prev'))      page = Math.max(1, page - 1);
      else if (btn.classList.contains('page-next')) page = page + 1;
      else if (btn.dataset.page)                    page = parseInt(btn.dataset.page, 10);
      else return;
      render();
      scrollToGridTop();
    });
  }

  render();
})();
