// Comprehensive site builder — generates all pages from archive
// Run: node build-full-site.js

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ARCHIVE = 'd:/webakoof/Vakibh/www.santsahitya.in';
const OUT = 'd:/webakoof/saints-website';
const SAINTS_DIR = path.join(OUT, 'saints');

// ── Category labels ──────────────────────────────────────────────────────────
const CAT = {
  bio:        { label: 'माहिती', order: 0 },
  wiki_mr:    { label: 'विकिपीडिया (मराठी)', order: 1 },
  wiki_en:    { label: 'Wikipedia (English)', order: 2 },
  works:      { label: 'साहित्य', order: 3 },
  dnyaneshwari: { label: 'ज्ञानेश्वरी', order: 4 },
  abhangas:   { label: 'अभंग', order: 5 },
  gatha:      { label: 'अभंग गाथा', order: 6 },
  ramayan:    { label: 'भावार्थ रामायण', order: 7 },
  bhagvat:    { label: 'एकनाथी भागवत', order: 8 },
  other_works:{ label: 'इतर रचना', order: 9 },
  arti:       { label: 'आरती', order: 10 },
  teerth:     { label: 'तीर्थक्षेत्र', order: 11 },
  granth:     { label: 'ग्रंथ', order: 12 },
};

// ── Saints configuration ─────────────────────────────────────────────────────
const SAINTS = [
  {
    id: 'dnyaneshwar', name: 'संत ज्ञानेश्वर', marathi: 'ज्ञानेश्वर', years: '१२७५–१२९६',
    image: '../images/dnyaneshwar.jpg',
    connections: ['nivritti','muktabai','sopandev'],
    works: [
      {title:'ज्ञानेश्वरी',type:'ग्रंथ',desc:'भगवद्गीतेवरील मराठी भाष्य, १८ अध्याय'},
      {title:'अमृतानुभव',type:'ग्रंथ',desc:'आत्मज्ञानाचे अनुभव, १० प्रकरणे'},
      {title:'हरिपाठ',type:'अभंग',desc:'हरिनामाची महती सांगणारे २८ अभंग'},
      {title:'चांगदेव पासष्टी',type:'पत्र',desc:'ऋषी चांगदेव यांना लिहिलेले ६५ ओव्यांचे पत्र'},
      {title:'अभंग गाथा',type:'अभंग',desc:'१०७१ अभंगांचा संग्रह'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-dnyaneshwar-maharaj', cat:'bio',          slug:'charitra',  title:'जीवनचरित्र' },
      { mode:'children',folder:'dnyaneshwar',                              cat:'works',         title:'साहित्य' },
      { mode:'children',folder:'dnyaneshwari-in-marathi',                  cat:'dnyaneshwari',  title:'ज्ञानेश्वरी अध्याय' },
      { mode:'self',   folder:'arti/dnyaneshwari-aarti',                   cat:'arti',          slug:'arti',      title:'आरती' },
    ],
  },
  {
    id: 'tukaram', name: 'संत तुकाराम', marathi: 'तुकाराम', years: '१५९८–१६५०',
    image: '../images/tukaram.jpg',
    connections: [],
    works: [
      {title:'अभंग गाथा',type:'अभंग',desc:'सुमारे ४५०० अभंगांचा संग्रह'},
      {title:'गौळणी',type:'अभंग',desc:'गोपींच्या भावाने रचलेले अभंग'},
      {title:'आरती',type:'आरती',desc:'संत तुकारामांची प्रसिद्ध आरती'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-tukaram-maharaj',  cat:'bio',     slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'tukaram',                               cat:'gatha',   title:'अभंग गाथा', catFn: tukramCat },
      { mode:'self',   folder:'arti/tukaram-arati',                     cat:'arti',    slug:'arti',     title:'आरती' },
    ],
  },
  {
    id: 'namdev', name: 'संत नामदेव', marathi: 'नामदेव', years: '१२७०–१३५०',
    image: '../images/namdev.jpg',
    connections: ['janabai'],
    works: [
      {title:'नामदेव गाथा',type:'अभंग',desc:'विठ्ठलभक्तीचे अभंग'},
      {title:'आरती',type:'आरती',desc:'संत नामदेवांची आरती'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-namdev',  cat:'bio',      slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'namdev',                       cat:'abhangas',  title:'अभंग व साहित्य' },
    ],
  },
  {
    id: 'eknath', name: 'संत एकनाथ', marathi: 'एकनाथ', years: '१५३३–१५९९',
    image: '../images/eknath.jpg',
    connections: [],
    works: [
      {title:'एकनाथी भागवत',type:'ग्रंथ',desc:'भागवत पुराण एकादश स्कंधावरील भाष्य'},
      {title:'भावार्थ रामायण',type:'ग्रंथ',desc:'रामायणाचे सहा काण्डांसह मराठी रूपांतर'},
      {title:'अभंग',type:'अभंग',desc:'३४८७ अभंगांचा संग्रह'},
      {title:'रुक्मिणी स्वयंवर',type:'काव्य',desc:'रुक्मिणी-कृष्ण विवाहाचे काव्य'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-eknath', cat:'bio',        slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'eknath',                      cat:'abhangas',    title:'साहित्य', catFn: eknathCat },
      { mode:'self',   folder:'arti/sant-eknath-arti',        cat:'arti',        slug:'arti',     title:'आरती' },
    ],
  },
  {
    id: 'nivritti', name: 'संत निवृत्ती महाराज', marathi: 'निवृत्ती', years: '१२७३–१२९७',
    image: '../images/nivritti.jpg',
    connections: ['dnyaneshwar','muktabai','sopandev'],
    works: [
      {title:'अभंग',type:'अभंग',desc:'२१८ अभंगांचा संग्रह'},
      {title:'आरती',type:'आरती',desc:'संत निवृत्तीनाथांची आरती'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-nivruttinath', cat:'bio',       slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'nivruttinath',                      cat:'abhangas',   title:'अभंग' },
    ],
  },
  {
    id: 'muktabai', name: 'संत मुक्ताबाई', marathi: 'मुक्ताबाई', years: '१२७९–१२९७',
    image: '../images/muktabai.png',
    connections: ['dnyaneshwar','nivritti','sopandev'],
    works: [
      {title:'अभंग',type:'अभंग',desc:'मुक्ताबाईंचे अभंग संग्रह'},
      {title:'ताटीचे अभंग',type:'अभंग',desc:'ज्ञानेश्वरांना उद्देशून लिहिलेले प्रसिद्ध अभंग'},
      {title:'आरती',type:'आरती',desc:'संत मुक्ताबाईंची आरती'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-muktabai', cat:'bio',       slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'muktabai',                      cat:'abhangas',   title:'अभंग' },
      { mode:'self',   folder:'arti/muktabai-aarti',            cat:'arti',       slug:'arti',     title:'आरती' },
    ],
  },
  {
    id: 'sopandev', name: 'संत सोपानदेव', marathi: 'सोपानदेव', years: '१२७७–१२९७',
    image: '../images/sopandev.jpg',
    connections: ['dnyaneshwar','nivritti','muktabai'],
    works: [
      {title:'अभंग',type:'अभंग',desc:'सोपानदेवांचे अभंग संग्रह'},
      {title:'आरती',type:'आरती',desc:'संत सोपानदेवांची आरती'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sopandev',           cat:'bio',      slug:'charitra',  title:'जीवनचरित्र' },
      { mode:'children',folder:'sopandev',                            cat:'abhangas', title:'अभंग' },
      { mode:'children',folder:'sant-sopandev',                       cat:'abhangas', title:'अभंग (इतर)' },
      { mode:'self',   folder:'tirthkshetra/sant-sopan-samadhi',     cat:'teerth',   slug:'samadhi',   title:'समाधी स्थान' },
    ],
  },
  {
    id: 'chokhamela', name: 'संत चोखामेळा', marathi: 'चोखामेळा', years: 'इ.स. १३०० (अंदाजे)',
    image: '../images/chokhamela.jpg',
    connections: [],
    works: [
      {title:'अभंग',type:'अभंग',desc:'३०० हून अधिक अभंगांचा संग्रह'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-chokhamela', cat:'bio',       slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'chokhamela',                      cat:'abhangas',   title:'अभंग' },
      { mode:'children',folder:'chokhoba',                         cat:'abhangas',   title:'अभंग (इतर)' },
    ],
  },
  {
    id: 'janabai', name: 'संत जनाबाई', marathi: 'जनाबाई', years: 'इ.स. १२९८ (अंदाजे)',
    image: '../images/janabai.jpg',
    connections: ['namdev'],
    works: [
      {title:'अभंग',type:'अभंग',desc:'४३४ अभंगांचा संग्रह'},
      {title:'काकड आरती',type:'आरती',desc:'पहाटे गायली जाणारी प्रसिद्ध काकड आरती'},
      {title:'दशावतार वर्णन',type:'अभंग',desc:'विष्णूच्या दहा अवतारांचे वर्णन'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-janabai', cat:'bio',      slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'janabai',                      cat:'abhangas', title:'अभंग' },
    ],
  },
  {
    id: 'kanhopatra', name: 'संत कान्होपात्रा', marathi: 'कान्होपात्रा', years: 'इ.स. १४०० (अंदाजे)',
    image: '../images/kanhopatra.jpg',
    connections: [],
    works: [
      {title:'अभंग',type:'अभंग',desc:'विठ्ठलभक्तीचे ५०हून अधिक अभंग'},
    ],
    sources: [
      { mode:'children',folder:'kanhopatra',                          cat:'abhangas', title:'अभंग' },
      { mode:'self',   folder:'tirthkshetra/kanhopatra-mandir',       cat:'teerth',   slug:'mandir',   title:'मंदिर' },
    ],
  },
  {
    id: 'kanho', name: 'संत कान्हो', marathi: 'कान्हो', years: 'इ.स. १५०० (अंदाजे)',
    image: '../images/kanho.jpg',
    connections: [],
    works: [
      {title:'अभंग',type:'अभंग',desc:'भक्तिपर अभंग संग्रह'},
      {title:'गीतसार',type:'ग्रंथ',desc:'भगवद्गीतेचे मराठी सार'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-knho-pathak',  cat:'bio',      slug:'charitra',  title:'जीवनचरित्र' },
      { mode:'children',folder:'kanho-pathak',                       cat:'abhangas', title:'अभंग (कान्हो पाठक)' },
      { mode:'children',folder:'kanhoba',                            cat:'abhangas', title:'अभंग (कान्होबा)' },
      { mode:'self',   folder:'grantha/kanho-pathak-gitasar',        cat:'granth',   slug:'gitasar',   title:'गीतसार' },
    ],
  },
  {
    id: 'narhari', name: 'संत नरहरी सोनार', marathi: 'नरहरी', years: 'इ.स. १३०० (अंदाजे)',
    image: '../images/placeholder.jpg',
    connections: [],
    works: [
      {title:'अभंग',type:'अभंग',desc:'भक्तिपर अभंग संग्रह'},
    ],
    sources: [
      { mode:'self',   folder:'mahati-santanchi/sant-narhari-sonar', cat:'bio',      slug:'charitra', title:'जीवनचरित्र' },
      { mode:'children',folder:'narhari-sonar',                      cat:'abhangas', title:'अभंग' },
    ],
  },
];

// ── Category functions for eknath & tukaram ─────────────────────────────────
function eknathCat(slug) {
  if (/^abhang-\d/.test(slug)) return 'abhangas';
  if (/^bha[vw]arth-ramayan|^ramayan/.test(slug)) return 'ramayan';
  if (/^adhyay|^aknathi|^eknathi/.test(slug)) return 'bhagvat';
  return 'other_works';
}

function tukramCat(slug) {
  if (/gatha/.test(slug)) return 'gatha';
  return 'abhangas';
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function readFile(fp) {
  try { return fs.readFileSync(fp, 'utf8'); } catch { return null; }
}

function isReal(fp) {
  if (!fs.existsSync(fp)) return false;
  const s = fs.statSync(fp);
  if (s.size < 5000) return false;
  const html = readFile(fp);
  return html && !html.includes('403 Forbidden');
}

function slugToTitle(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b(\w)/g, c => c.toUpperCase())
    .replace(/\bAdhyay\b/, 'अध्याय')
    .replace(/\bAbhang\b/, 'अभंग')
    .replace(/\bGatha\b/, 'गाथा');
}

function decodeEnt(str) {
  return str
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#8211;/g,'–').replace(/&#8212;/g,'—')
    .replace(/&#8216;/g,'‘').replace(/&#8217;/g,'’').replace(/&#8220;/g,'“')
    .replace(/&#8221;/g,'”').replace(/&nbsp;/g,' ').replace(/&larr;/g,'←')
    .replace(/&rarr;/g,'→').replace(/&#\d+;/g,'').replace(/&[a-z]+;/g,'');
}

function extractContent(fp) {
  const html = readFile(fp);
  if (!html || html.includes('403 Forbidden')) return null;
  const $ = cheerio.load(html);

  // Title
  let title = $('h1.entry-title').text() || $('h1').first().text() || $('title').text();
  title = decodeEnt(title.replace(/\s+/g,' ').trim());
  // strip " – sant sahitya" suffix
  title = title.replace(/\s*[-–—]\s*sant sahitya.*$/i,'').replace(/\s*[-–—]\s*संत साहित्य.*$/,'').trim();

  // Remove noise elements
  $('script,style,ins,.adsbygoogle,.sharedaddy,.jp-relatedposts,.comments-area,.comment-respond,audio,video,.post-navigation,.navigation,.nav-links,.ast-breadcrumbs,.ast-comment-time,#comments,.entry-meta,.entry-footer').remove();

  // Get content div
  let $content = $('.entry-content');
  if (!$content.length) $content = $('article');
  if (!$content.length) $content = $('main');
  if (!$content.length) return null;

  // Strip internal santsahitya.in links (keep text)
  $content.find('a[href*="santsahitya.in"], a[href^="/"], a[href^="http"]').each(function(){
    $(this).replaceWith($(this).html() || $(this).text());
  });

  // Get HTML
  let contentHtml = $content.html() || '';

  // Remove remaining ads text
  contentHtml = contentHtml.replace(/\(adsbygoogle\s*=\s*window\.adsbygoogle[^)]*\)\.push\([^)]*\);?/g,'');
  contentHtml = contentHtml.replace(/window\.adsbygoogle[^\n]*/g,'');

  // Stop before comment/navigation sections
  const stopPatterns = [
    '← Previous Post', '← मागील', 'Next Post →', 'पुढील →',
    'Leave a Reply', 'thoughts on &', 'thought on &',
    'राम कृष्ण हरी', 'Anonymous',
  ];
  for (const p of stopPatterns) {
    const idx = contentHtml.indexOf(p);
    if (idx > 200) contentHtml = contentHtml.substring(0, idx);
  }

  // Clean up empty tags
  contentHtml = contentHtml.replace(/<p>\s*<\/p>/g,'').replace(/<div>\s*<\/div>/g,'');

  const textLen = contentHtml.replace(/<[^>]+>/g,'').trim().length;
  if (textLen < 30) return null;

  return { title, html: contentHtml };
}

// ── HTML templates ────────────────────────────────────────────────────────────
function saintIdToSlug(id) { return id; }

function sidebarHtml(saint, pages, currentSlug, prefix) {
  const grouped = {};
  for (const p of pages) {
    const c = p.cat;
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(p);
  }

  const cats = Object.keys(grouped).sort((a,b) => (CAT[a]?.order||99) - (CAT[b]?.order||99));
  let html = `
    <div class="saint-sidebar" id="saint-sidebar">
      <div class="sidebar-saint-name">
        <a href="${prefix}saints/${saint.id}/index.html">${saint.name}</a>
      </div>`;

  for (const cat of cats) {
    const catInfo = CAT[cat] || { label: cat };
    html += `\n      <div class="sidebar-group">
        <span class="sidebar-group-label">${catInfo.label}</span>`;
    for (const p of grouped[cat]) {
      const active = p.slug === currentSlug ? ' active' : '';
      html += `\n        <a class="sidebar-link${active}" href="${p.slug}.html">${p.title}</a>`;
    }
    html += `\n      </div>`;
  }

  html += `\n    </div>`;
  return html;
}

function pageHtml({ saint, pages, currentSlug, title, badge, body, prefix = '../' }) {
  const idToName = {};
  SAINTS.forEach(s => { idToName[s.id] = s.name; });

  const imgSrc = saint.image;
  return `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} — ${saint.name} — वारकरी संत ज्ञानकोश</title>
  <link rel="stylesheet" href="${prefix}css/style.css">
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <a class="site-title" href="${prefix}index.html">वारकरी संत ज्ञानकोश<small>Varkari Sant Dnyankosh</small></a>
    <a class="header-home-link" href="${prefix}index.html">← सर्व संत</a>
    <span class="header-saint-name">/ ${saint.name}</span>
  </div>
</header>

<div class="saint-shell">
  ${sidebarHtml(saint, pages, currentSlug, prefix)}

  <main class="saint-content">
    <div class="page-header">
      <h1 class="page-title">${title}</h1>
      ${badge ? `<span class="page-badge">${badge}</span>` : ''}
    </div>
    ${body}
  </main>
</div>

<footer class="site-footer">
  <p>वारकरी संत ज्ञानकोश — मराठी भक्तिसाहित्याचे जतन</p>
  <p>साहित्यस्रोत: <a href="https://www.santsahitya.in" target="_blank">santsahitya.in</a></p>
</footer>

<button class="sidebar-toggle" id="sidebar-toggle">☰</button>
<script src="${prefix}js/nav.js"></script>
</body>
</html>`;
}

function indexPageHtml({ saint, pages, prefix = '../' }) {
  const idToName = {};
  SAINTS.forEach(s => { idToName[s.id] = s.name; });

  const imgFile = saint.image.replace('../','');
  const imgEl = fs.existsSync(path.join(OUT, imgFile))
    ? `<img class="overview-img" src="${saint.image}" alt="${saint.name}">`
    : `<div class="overview-img ph">🙏</div>`;

  // Group pages by category
  const grouped = {};
  for (const p of pages) {
    const c = p.cat;
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(p);
  }
  const cats = Object.keys(grouped).sort((a,b) => (CAT[a]?.order||99) - (CAT[b]?.order||99));

  const tocHtml = cats.map(cat => {
    const catInfo = CAT[cat] || { label: cat };
    const links = grouped[cat].map(p =>
      `<a class="toc-link" href="${p.slug}.html"><span class="toc-link-arrow">→</span> ${p.title}</a>`
    ).join('\n          ');
    return `
        <div class="toc-group">
          <div class="toc-group-title">${catInfo.label}</div>
          <div class="toc-links">${links}</div>
        </div>`;
  }).join('');

  const worksHtml = saint.works.map(w => `
        <li class="work-item">
          <span class="work-badge">${w.type}</span>
          <div class="work-info">
            <strong>${w.title}</strong>
            <span>${w.desc}</span>
          </div>
        </li>`).join('');

  const connectionsHtml = saint.connections.length
    ? saint.connections.map(id =>
        `<a class="toc-link" href="../${id}/index.html"><span class="toc-link-arrow">→</span> ${idToName[id] || id}</a>`
      ).join('\n        ')
    : '';

  const body = `
    <div class="saint-overview-hero">
      ${imgEl}
      <div>
        <p class="saint-years">${saint.years}</p>
        <p style="margin-top:.6rem;font-size:.95rem;color:var(--muted)">${pages.length} पृष्ठे उपलब्ध</p>
        ${saint.connections.length ? `<div style="margin-top:1rem">
          <div style="font-size:.82rem;font-weight:700;color:var(--muted);margin-bottom:.4rem">संबंधित संत</div>
          <div style="display:flex;flex-wrap:wrap;gap:.4rem">${connectionsHtml}</div>
        </div>` : ''}
      </div>
    </div>

    <section class="section-block">
      <h2>प्रमुख साहित्य</h2>
      <ul class="works-list">${worksHtml}</ul>
    </section>

    <section class="section-block">
      <h2>उपलब्ध पृष्ठे</h2>
      ${tocHtml}
    </section>`;

  return pageHtml({
    saint, pages, currentSlug: 'index', title: saint.name,
    badge: 'वारकरी संत', body, prefix,
  });
}

// ── Scan helper ───────────────────────────────────────────────────────────────
const SKIP_NAMES = new Set(['feed','2','3','4','cdn-cgi','firebase-messaging-sw.html','index.html','index.html.1','index.html.2']);

function scanChildren(folder) {
  const dir = path.join(ARCHIVE, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(e => !SKIP_NAMES.has(e) && !e.endsWith('.js') && !e.endsWith('.html') && !e.endsWith('.json'))
    .filter(e => {
      if (/audio|mp3|podcast/i.test(e)) return false;
      const fp = path.join(dir, e, 'index.html');
      return isReal(fp);
    });
}

const FETCHED_DIR = path.join(OUT, 'data/fetched');

function loadFetchedPages(saintId) {
  const dir = path.join(FETCHED_DIR, saintId);
  if (!fs.existsSync(dir)) return [];
  const pages = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!data.html || data.html.length < 100) continue;
      // Map to category
      const cat = data.lang === 'mr' && data.cat === 'bio' ? 'wiki_mr'
                : data.lang === 'en' && data.cat === 'bio' ? 'wiki_en'
                : (data.cat || 'bio');
      pages.push({
        slug: data.slug,
        title: data.label || data.title,
        cat,
        fetched: true,
        html: data.html,
        source_url: data.source_url,
        source_name: data.source_name,
      });
    } catch { /* skip bad json */ }
  }
  return pages;
}

// ── Main build ────────────────────────────────────────────────────────────────
for (const saint of SAINTS) {
  const saintDir = path.join(SAINTS_DIR, saint.id);
  if (!fs.existsSync(saintDir)) fs.mkdirSync(saintDir, { recursive: true });

  process.stdout.write(`\nBuilding ${saint.name}...`);

  // Collect all pages for this saint
  const pages = [];

  // A. Archive-sourced pages
  for (const src of saint.sources) {
    if (src.mode === 'self') {
      const fp = path.join(ARCHIVE, src.folder, 'index.html');
      if (!isReal(fp)) continue;
      pages.push({ slug: src.slug, title: src.title, cat: src.cat, sourcePath: fp });

    } else if (src.mode === 'children') {
      const children = scanChildren(src.folder);
      for (const child of children) {
        const fp = path.join(ARCHIVE, src.folder, child, 'index.html');
        const cat = src.catFn ? src.catFn(child) : src.cat;
        const slug = `${src.folder.replace(/\//g,'-')}-${child}`.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
        pages.push({ slug, title: slugToTitle(child), cat, sourcePath: fp });
      }
    }
  }

  // B. Wikipedia/Wikisource fetched pages
  const fetched = loadFetchedPages(saint.id);
  pages.push(...fetched);

  process.stdout.write(` ${pages.length} pages (${fetched.length} wiki)`);

  // Generate each content page
  for (const p of pages) {
    let body;

    if (p.fetched) {
      // Use pre-fetched HTML directly
      const sourceCredit = p.source_url
        ? `<p class="source-credit" style="margin-top:2rem;padding-top:.8rem;border-top:1px solid var(--border);font-size:.82rem;color:var(--muted)">
            स्रोत: <a href="${p.source_url}" target="_blank" rel="noopener">${p.source_name}</a>
            — <span>CC-BY-SA परवाना अंतर्गत उपलब्ध</span>
          </p>`
        : '';
      body = `<div class="archive-content wiki-content">${p.html}${sourceCredit}</div>`;
    } else {
      const content = extractContent(p.sourcePath);
      if (!content) continue;
      p.title = content.title || p.title; // update title from extracted H1
      body = `<div class="archive-content">${content.html}</div>`;
    }

    const html = pageHtml({
      saint, pages, currentSlug: p.slug,
      title: p.title, badge: CAT[p.cat]?.label,
      body, prefix: '../../',
    });
    fs.writeFileSync(path.join(saintDir, `${p.slug}.html`), html);
  }

  // Generate saint index page
  const indexHtml = indexPageHtml({ saint, pages, prefix: '../../' });
  fs.writeFileSync(path.join(saintDir, 'index.html'), indexHtml);

  process.stdout.write(' ✓');
}

// ── Homepage ──────────────────────────────────────────────────────────────────
console.log('\n\nBuilding homepage...');

const homepageCards = SAINTS.map(s => {
  const imgFile = s.image.replace('../','');
  const imgEl = fs.existsSync(path.join(OUT, imgFile))
    ? `<img class="saint-card-img" src="${imgFile}" alt="${s.name}" loading="lazy">`
    : `<div class="saint-card-img ph">🙏</div>`;

  // Count pages built
  const saintDir = path.join(SAINTS_DIR, s.id);
  const pageCount = fs.existsSync(saintDir)
    ? fs.readdirSync(saintDir).filter(f => f.endsWith('.html') && f !== 'index.html').length
    : 0;

  return `
    <a class="saint-card" href="saints/${s.id}/index.html">
      ${imgEl}
      <div class="saint-card-body">
        <div class="saint-card-name">${s.name}</div>
        <div class="saint-card-years">${s.years}</div>
        <div class="saint-card-meta">${pageCount} पृष्ठे उपलब्ध</div>
      </div>
    </a>`;
}).join('');

const homepage = `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>वारकरी संत ज्ञानकोश</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a class="site-title" href="index.html">वारकरी संत ज्ञानकोश<small>Varkari Sant Dnyankosh</small></a>
  </div>
</header>

<section class="home-hero">
  <h1>वारकरी संत ज्ञानकोश</h1>
  <p>महाराष्ट्राच्या भक्तिपरंपरेतील १२ महान संतांची संपूर्ण माहिती, साहित्य आणि अभंग</p>
</section>

<main class="saints-section">
  <h2>संतांची यादी</h2>
  <div class="saints-grid">
    ${homepageCards}
  </div>
</main>

<footer class="site-footer">
  <p>वारकरी संत ज्ञानकोश — मराठी भक्तिसाहित्याचे जतन</p>
  <p>साहित्यस्रोत: <a href="https://www.santsahitya.in" target="_blank">santsahitya.in</a></p>
</footer>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), homepage);
console.log('Built: index.html');
console.log('\nSite build complete!');
