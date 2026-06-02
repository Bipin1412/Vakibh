// Generates index.html and saints/*.html from data/saints.js
// Run: node build-pages.js

const fs = require('fs');
const path = require('path');

// Load saints data
const saintsJs = fs.readFileSync('d:/webakoof/saints-website/data/saints.js', 'utf8');
const saints = JSON.parse(saintsJs.replace(/^const SAINTS_DATA = /, '').replace(/;\s*$/, ''));

const SAINTS_DIR = 'd:/webakoof/saints-website/saints';
const ROOT_DIR = 'd:/webakoof/saints-website';

// Build ID → name lookup for connections
const idToName = {};
saints.forEach(s => { idToName[s.id] = s.name; });

// ── Homepage ───────────────────────────────────────────────────────────────

function cardHtml(s) {
  const imgSrc = s.image.replace('../', '');
  const imgEl = fs.existsSync(path.join(ROOT_DIR, imgSrc))
    ? `<img class="saint-card-img" src="${imgSrc}" alt="${s.name}" loading="lazy">`
    : `<div class="saint-card-img placeholder">🙏</div>`;

  return `
  <a class="saint-card" href="saints/${s.id}.html">
    ${imgEl}
    <div class="saint-card-body">
      <div class="saint-card-name">${s.name}</div>
      <div class="saint-card-years">${s.years}</div>
      <div class="saint-card-count">${s.abhangaCount} अभंग उपलब्ध</div>
    </div>
  </a>`.trim();
}

function navLinks(prefix = '') {
  return saints.map(s =>
    `<a href="${prefix}saints/${s.id}.html">${s.marathi}</a>`
  ).join('\n    ');
}

const homePage = `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>वारकरी संत ज्ञानकोश</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="home-header">
  <div class="home-header-inner">
    <a class="home-logo" href="index.html" aria-label="वारकरी संत साहित्य">
      <img src="assets/vaakibh_logo.svg" alt="वारकरी">
    </a>
    <nav class="home-nav" aria-label="मुख्य नेव्हिगेशन">
      <a class="active" href="index.html">मुखपृष्ठ</a>
      <a href="index.html#grantha">ग्रंथ</a>
      <a href="index.html#abhang">अभंगसंग्रह</a>
      <a href="index.html#saints">संत</a>
    </nav>
    <div class="home-actions">
      <button class="language-btn" type="button">मराठी</button>
      <button class="search-icon-btn" type="button" aria-label="शोध">⌕</button>
    </div>
  </div>
</header>

<section class="home-hero">
  <h1>वारकरी संत ज्ञानकोश</h1>
  <p>महाराष्ट्राच्या भक्तिपरंपरेतील १२ महान संतांची माहिती, साहित्य आणि अभंग</p>
</section>

<main class="saints-section">
  <h2>संतांची यादी</h2>
  <div class="saints-grid">
    ${saints.map(cardHtml).join('\n    ')}
  </div>
</main>

</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), homePage);
console.log('Built: index.html');

// ── Saint Page Template ─────────────────────────────────────────────────────

function saintPage(s) {
  const imgSrc = s.image;
  const imgEl = fs.existsSync(path.join(ROOT_DIR, imgSrc.replace('../', '')))
    ? `<img class="saint-hero-img" src="${imgSrc}" alt="${s.name}">`
    : `<div class="saint-hero-img placeholder">🙏</div>`;

  const worksHtml = s.works.length
    ? `<ul class="works-list">
      ${s.works.map(w => `
        <li class="work-item">
          <span class="work-badge">${w.type}</span>
          <div class="work-info">
            <strong>${w.title}</strong>
            <span>${w.desc}</span>
          </div>
        </li>`).join('')}
    </ul>`
    : '<p class="no-content">माहिती उपलब्ध नाही.</p>';

  const connectionsHtml = s.connections.length
    ? `<div class="connections-grid">
      ${s.connections.map(id => `<a class="connection-link" href="${id}.html">${idToName[id] || id}</a>`).join('\n      ')}
    </div>`
    : '<p class="no-content">कोणताही संबंध नाही.</p>';

  const abhangaVarName = `ABHANGAS_${s.id.toUpperCase()}`;

  const bioText = s.bio
    ? s.bio.replace(/\n+/g, '\n').split('\n').map(p => p.trim()).filter(Boolean)
        .map(p => `<p class="bio-text">${p}</p>`).join('\n      ')
    : '<p class="bio-text no-content">माहिती उपलब्ध नाही.</p>';

  return `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${s.name} — वारकरी संत ज्ञानकोश</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body data-abhanga-var="${abhangaVarName}">

<header class="home-header">
  <div class="home-header-inner">
    <a class="home-logo" href="../index.html" aria-label="वारकरी संत साहित्य">
      <img src="../assets/vaakibh_logo.svg" alt="वारकरी">
    </a>
    <nav class="home-nav" aria-label="मुख्य नेव्हिगेशन">
      <a class="active" href="../index.html">मुखपृष्ठ</a>
      <a href="../index.html#grantha">ग्रंथ</a>
      <a href="../index.html#abhang">अभंगसंग्रह</a>
      <a href="../index.html#saints">संत</a>
    </nav>
    <div class="home-actions">
      <button class="language-btn" type="button">मराठी</button>
      <button class="search-icon-btn" type="button" aria-label="शोध">⌕</button>
    </div>
  </div>
</header>

<main class="saint-page">

  <a class="back-link" href="../index.html">← सर्व संत</a>

  <!-- Hero -->
  <section class="saint-hero">
    ${imgEl}
    <div class="saint-hero-info">
      <h1>${s.name}</h1>
      <p class="saint-years">${s.years}</p>
      <span class="saint-badge">वारकरी संत</span>
    </div>
  </section>

  <!-- Biography -->
  <section class="section-block">
    <h2>माहिती</h2>
    ${bioText}
  </section>

  <!-- Works -->
  <section class="section-block">
    <h2>साहित्य</h2>
    ${worksHtml}
  </section>

  <!-- Connections -->
  ${s.connections.length ? `
  <section class="section-block">
    <h2>संबंधित संत</h2>
    ${connectionsHtml}
  </section>` : ''}

  <!-- Abhanga Reader -->
  <section class="section-block">
    <h2>अभंग वाचा <span style="font-size:0.8rem;color:var(--text-muted);font-weight:400">(${s.abhangaCount} उपलब्ध)</span></h2>
    ${s.abhangaCount > 0 ? `
    <div class="abhanga-controls">
      <input type="search" id="abhanga-search" class="abhanga-search" placeholder="अभंग शोधा…">
      <span class="abhanga-count-label" id="abhanga-count"></span>
    </div>
    <div class="abhanga-list" id="abhanga-list"></div>
    <nav class="pagination" id="pagination"></nav>
    ` : '<div class="no-content">या संताचे अभंग या संग्रहात उपलब्ध नाहीत.</div>'}
  </section>

</main>

<script src="../data/saints.js"></script>
<script src="../data/abhangas/${s.id}.js"></script>
<script src="../js/main.js"></script>

</body>
</html>`;
}

// ── Generate all saint pages ────────────────────────────────────────────────

saints.forEach(s => {
  const html = saintPage(s);
  const outPath = path.join(SAINTS_DIR, `${s.id}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`Built: saints/${s.id}.html`);
});

console.log('\nAll pages built successfully!');
