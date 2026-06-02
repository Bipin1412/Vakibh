const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const root = process.cwd();
const saintsDir = path.join(root, 'saints');
const saintNameMap = {
  dnyaneshwar: 'संत ज्ञानेश्वर',
  tukaram: 'संत तुकाराम',
  namdev: 'संत नामदेव',
  eknath: 'संत एकनाथ',
  muktabai: 'संत मुक्ताबाई',
  janabai: 'संत जनाबाई',
  nivritti: 'संत निवृत्तीनाथ',
  sopandev: 'संत सोपानदेव',
  chokhamela: 'संत चोखामेळा',
  kanhopatra: 'संत कान्होपात्रा',
  kanho: 'संत कान्हो',
  narhari: 'संत नरहरी'
};

const styleBlock = `
  <style>
    body.saint-modern-page { margin:0; background:#e6e6e6; color:#2d2020; }
    .saint-modern-wrap{ width:min(1120px,calc(100% - 28px)); margin:0 auto; padding:0 0 30px; }
    .saint-modern-grid{ display:grid; grid-template-columns:repeat(3,1fr); border:1px solid #f08b28; border-top:0; background:#e6e6e6; }
    .saint-modern-col{ border-right:1px solid #f08b28; padding:14px 22px 20px; min-height:460px; }
    .saint-modern-col:last-child{ border-right:0; }
    .saint-modern-col h2{ text-align:center; color:#b4252f; font-size:1.75rem; line-height:1.2; margin:0 0 16px; }
    .saint-modern-links{ display:grid; grid-template-columns:repeat(2,1fr); gap:2px 22px; }
    .saint-modern-links.one{ grid-template-columns:1fr; text-align:center; }
    .saint-modern-links a{ color:#b4252f; text-decoration:none; font-size:1.05rem; font-weight:700; line-height:1.55; display:block; }
    .saint-modern-links a:hover{ text-decoration:underline; }
    .saint-modern-sub{ margin:14px 0 4px; text-align:center; color:#b4252f; font-size:1.45rem; }
    .float-btns{ position:fixed; right:18px; top:44%; display:grid; gap:10px; z-index:30; }
    .float-btns a{ width:58px; height:58px; border-radius:50%; display:grid; place-items:center; text-decoration:none; color:#fff; font-size:1.45rem; box-shadow:0 2px 8px rgba(0,0,0,.25); }
    .float-wa{ background:#39c665; }
    .float-play{ background:#f05045; }
    .dny-footmenu{ background:#69494b; color:#fff; padding:10px 0; margin-top:10px; }
    .dny-footmenu div{ width:min(1120px,calc(100% - 28px)); margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); text-align:center; font-size:1.25rem; font-weight:700; gap:8px; }
    .dny-footbar{ background:#f08b13; text-align:center; font-size:1.5rem; color:#120700; padding:8px 0 10px; }
    @media (max-width:980px){
      .saint-modern-grid{ grid-template-columns:1fr; }
      .saint-modern-col{ min-height:auto; border-right:0; border-bottom:1px solid #f08b28; }
      .saint-modern-links{ grid-template-columns:1fr; }
      .dny-footmenu div{ grid-template-columns:repeat(2,1fr); }
      .float-btns{ display:none; }
      .saint-modern-col h2{ font-size:1.5rem; }
      .saint-modern-links a{ font-size:1rem; }
    }
  </style>`;

function decodeMojibake(str) {
  if (!str) return '';
  if (!/[Ãà¤]/.test(str)) return str;
  try {
    const fixed = Buffer.from(str, 'latin1').toString('utf8');
    return fixed || str;
  } catch {
    return str;
  }
}

function fallbackTextFromHref(href) {
  try {
    const base = path.basename(href || '', '.html');
    const cleaned = decodeURIComponent(base)
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || 'पृष्ठ दुवा';
  } catch {
    return 'पृष्ठ दुवा';
  }
}

function sanitizeLinkText(text, href) {
  const decoded = decodeMojibake(text || '').trim();
  if (!decoded || /�/.test(decoded)) {
    return fallbackTextFromHref(href);
  }
  return decoded;
}

function uniqueLinks(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = `${item.href}__${item.text}`;
    if (!item.href || item.href === '#' || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

for (const dirent of fs.readdirSync(saintsDir, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const file = path.join(saintsDir, dirent.name, 'index.html');
  if (!fs.existsSync(file)) continue;

  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const saintNameRaw = $('.page-title').first().text().trim() || $('title').first().text().split('—')[0].trim() || dirent.name;
  const saintNameDecoded = decodeMojibake(saintNameRaw);
  const saintName = saintNameMap[dirent.name] || (!/�/.test(saintNameDecoded) ? saintNameDecoded : dirent.name);

  const linkBuckets = [];
  $('.sidebar-group').each((_, g) => {
    const label = decodeMojibake($(g).find('.sidebar-group-label').first().text().trim());
    const links = [];
    $(g).find('a.sidebar-link').each((__, a) => {
      const href = $(a).attr('href') || '#';
      links.push({ href, text: sanitizeLinkText($(a).text().trim(), href) });
    });
    if (links.length) linkBuckets.push({ label, links });
  });

  if (!linkBuckets.length) {
    const fallback = [];
    $('a').each((_, a) => {
      const href = $(a).attr('href') || '#';
      const text = sanitizeLinkText($(a).text().trim(), href);
      if (text && !href.startsWith('../../')) fallback.push({ href, text });
    });
    linkBuckets.push({ label: 'दुवे', links: fallback });
  }

  const allLinks = uniqueLinks(linkBuckets.flatMap((b) => b.links));
  const primary = uniqueLinks(linkBuckets.flatMap((b) => b.links)).slice(0, 12);

  const used = new Set(primary.map((l) => `${l.href}__${l.text}`));
  const leftovers = allLinks.filter((l) => !used.has(`${l.href}__${l.text}`));
  const second = leftovers.slice(0, 18);
  const used2 = new Set(second.map((l) => `${l.href}__${l.text}`));
  const third = leftovers.filter((l) => !used2.has(`${l.href}__${l.text}`)).slice(0, 14);

  const col2 = second.length ? second : allLinks.slice(0, 18);
  const col3 = third.length ? third : allLinks.slice(18, 32);

  const list = (arr, one = false) => `<div class="saint-modern-links${one ? ' one' : ''}">${arr.map((l) => `<a href="${l.href}">${l.text}</a>`).join('')}</div>`;

  const newHtml = `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${saintName}</title>
  <link rel="stylesheet" href="../../css/style.css">${styleBlock}
</head>
<body class="saint-modern-page">
  <header class="home-header">
    <div class="home-header-inner">
      <a class="home-logo" href="../../index.html" aria-label="संत साहित्य">
        <img src="../../assets/vaakibh_logo.svg" alt="संत साहित्य">
      </a>
      <nav class="home-nav" aria-label="मुख्य नेव्हिगेशन">
        <a class="active" href="../../index.html">मुखपृष्ठ</a>
        <a href="../../index.html#grantha">ग्रंथ</a>
        <a href="../../index.html#abhang">अभंगसंग्रह</a>
        <a href="../../index.html#saints">संत</a>
      </nav>
      <div class="home-actions">
        <button class="language-btn" type="button">मराठी</button>
        <button class="search-icon-btn" type="button" aria-label="शोध">⌕</button>
      </div>
    </div>
  </header>

  <main class="saint-modern-wrap">
    <section class="saint-modern-grid">
      <div class="saint-modern-col">
        <h2>${saintName} साहित्य</h2>
        ${list(primary)}
      </div>
      <div class="saint-modern-col">
        <h2>${saintName} उपलब्ध पृष्ठे</h2>
        ${list(col2)}
      </div>
      <div class="saint-modern-col">
        <h2>${saintName} प्रमुख दुवे</h2>
        ${list(col3, true)}
        <h3 class="saint-modern-sub"><a href="${allLinks[0] ? allLinks[0].href : '../../index.html'}" style="color:#b4252f;text-decoration:none;">${saintName} सर्व साहित्य</a></h3>
      </div>
    </section>
  </main>

  <footer>
    <div class="dny-footmenu">
      <div>
        <span>जाहिराती थांबा</span>
        <span>मदत व देणगी</span>
        <span>संत साहित्य बद्दल</span>
        <span>घरपोच पुस्तके व साहित्य</span>
      </div>
    </div>
    <div class="dny-footbar">Design &amp; Develop By kk Team</div>
  </footer>

  <div class="float-btns">
    <a class="float-wa" href="#">🟢</a>
    <a class="float-play" href="#">▶</a>
  </div>
</body>
</html>`;

  fs.writeFileSync(file, newHtml, 'utf8');
  console.log(`Updated ${path.relative(root, file)}`);
}
