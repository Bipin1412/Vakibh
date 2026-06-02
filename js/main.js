// Abhanga reader — loaded on individual saint pages
// Expects ABHANGAS_[ID] to be defined by the per-saint data script

(function () {
  const PER_PAGE = 20;
  let allAbhangas = [];
  let filtered = [];
  let currentPage = 1;

  function init() {
    // Find which saint's data is loaded (variable is ABHANGAS_<ID>)
    const varName = document.body.dataset.abhangaVar;
    if (!varName || !window[varName]) return;
    allAbhangas = window[varName];
    filtered = allAbhangas;
    render();
    setupSearch();
  }

  function render() {
    const list = document.getElementById('abhanga-list');
    const pagination = document.getElementById('pagination');
    const countLabel = document.getElementById('abhanga-count');
    if (!list) return;

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PER_PAGE;
    const slice = filtered.slice(start, start + PER_PAGE);

    if (countLabel) {
      countLabel.textContent = `${filtered.length} अभंग उपलब्ध`;
    }

    if (slice.length === 0) {
      list.innerHTML = '<div class="no-content">या शोधासाठी कोणताही अभंग आढळला नाही.</div>';
    } else {
      list.innerHTML = slice.map(a => `
        <div class="abhanga-item">
          <div class="abhanga-number">अभंग ${a.number}</div>
          <div class="abhanga-title">${escHtml(a.title)}</div>
          <div class="abhanga-text">${escHtml(a.text)}</div>
        </div>
      `).join('');
    }

    renderPagination(pagination, totalPages);
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderPagination(container, totalPages) {
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    const parts = [];
    parts.push(`<button class="page-btn" onclick="gotoPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>◀ मागे</button>`);

    // Show page numbers (max 7 visible)
    const range = pageRange(currentPage, totalPages);
    for (const p of range) {
      if (p === '…') {
        parts.push('<span class="page-info">…</span>');
      } else {
        parts.push(`<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="gotoPage(${p})">${p}</button>`);
      }
    }

    parts.push(`<button class="page-btn" onclick="gotoPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>पुढे ▶</button>`);
    parts.push(`<span class="page-info">${currentPage} / ${totalPages}</span>`);
    container.innerHTML = parts.join('');
  }

  function pageRange(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    if (cur > 3) pages.push('…');
    for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p);
    if (cur < total - 2) pages.push('…');
    pages.push(total);
    return pages;
  }

  function setupSearch() {
    const input = document.getElementById('abhanga-search');
    if (!input) return;
    input.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      filtered = q
        ? allAbhangas.filter(a => a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q))
        : allAbhangas;
      currentPage = 1;
      render();
    });
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.gotoPage = function (p) {
    const total = Math.ceil(filtered.length / PER_PAGE);
    if (p < 1 || p > total) return;
    currentPage = p;
    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
