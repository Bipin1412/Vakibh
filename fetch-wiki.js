'use strict';
// Fetches Wikipedia (Marathi + English) and Wikisource content for all 12 saints
// Saves JSON files to data/fetched/[id]/ — then rebuild with: node build-full-site.js
// Run: node fetch-wiki.js

const https = require('https');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const FETCHED_DIR = 'd:/webakoof/saints-website/data/fetched';
const DELAY_MS = 700;

// ── Saints configuration ──────────────────────────────────────────────────────
const SAINTS = [
  {
    id: 'dnyaneshwar',
    mr_wiki: 'ज्ञानेश्वर',
    en_wiki: 'Dnyaneshwar',
    wikisource: [
      { title: 'ज्ञानेश्वरी', slug: 'ws-dnyaneshwari', label: 'ज्ञानेश्वरी (विकिस्रोत)', cat: 'dnyaneshwari' },
      { title: 'अमृतानुभव', slug: 'ws-amrutanubhav', label: 'अमृतानुभव (विकिस्रोत)', cat: 'works' },
    ],
  },
  {
    id: 'tukaram',
    mr_wiki: 'तुकाराम',
    en_wiki: 'Tukaram',
    wikisource: [
      { title: 'तुकारामाची_गाथा', slug: 'ws-tukaram-gatha', label: 'तुकाराम गाथा (विकिस्रोत)', cat: 'gatha' },
    ],
  },
  {
    id: 'namdev',
    mr_wiki: 'नामदेव',
    en_wiki: 'Namdev',
    wikisource: [],
  },
  {
    id: 'eknath',
    mr_wiki: 'एकनाथ',
    en_wiki: 'Eknath',
    wikisource: [
      { title: 'हरिपाठ_(एकनाथ)', slug: 'ws-haripath', label: 'हरिपाठ (विकिस्रोत)', cat: 'works' },
    ],
  },
  {
    id: 'nivritti',
    mr_wiki: 'निवृत्तीनाथ',
    en_wiki: 'Nivruttinath',
    wikisource: [],
  },
  {
    id: 'muktabai',
    mr_wiki: 'मुक्ताबाई',
    en_wiki: 'Muktabai',
    wikisource: [],
  },
  {
    id: 'sopandev',
    mr_wiki: 'सोपानदेव',
    en_wiki: 'Sopandev',
    wikisource: [],
  },
  {
    id: 'chokhamela',
    mr_wiki: 'चोखामेळा',
    en_wiki: 'Chokhamela',
    wikisource: [],
  },
  {
    id: 'janabai',
    mr_wiki: 'जनाबाई',
    en_wiki: 'Janabai',
    wikisource: [],
  },
  {
    id: 'kanhopatra',
    mr_wiki: 'कान्होपात्रा',
    en_wiki: 'Kanhopatra',
    wikisource: [],
  },
  {
    id: 'kanho',
    mr_wiki: 'कान्हो_पाठक',
    en_wiki: 'Kanho Pathak',
    wikisource: [],
  },
  {
    id: 'narhari',
    mr_wiki: 'नरहरी_सोनार',
    en_wiki: 'Narhari Sonar',
    wikisource: [],
  },
];

// ── HTTP helper (follows redirects) ──────────────────────────────────────────
function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'VarkariSantsWebsite/1.0 (educational; contact: malharpandey79@gmail.com)',
        'Accept': 'application/json',
      },
    };
    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://${parsed.hostname}${res.headers.location}`;
        return resolve(fetchUrl(next, redirectCount + 1));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const delay = ms => new Promise(r => setTimeout(r, ms));

// ── Wikipedia API helpers ─────────────────────────────────────────────────────

async function fetchWikiExtract(lang, title) {
  const encoded = encodeURIComponent(title);
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts&redirects=1&format=json&formatversion=2`;
  try {
    const raw = await fetchUrl(url);
    const data = JSON.parse(raw);
    const page = data.query?.pages?.[0];
    if (!page || page.missing || !page.extract) return null;
    return {
      page_title: page.title,
      html: page.extract,
      source_url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      source_name: lang === 'mr' ? 'मराठी विकिपीडिया' : 'English Wikipedia',
    };
  } catch (e) {
    console.log(`  ⚠ Wikipedia (${lang}) fetch failed for "${title}": ${e.message}`);
    return null;
  }
}

// ── Wikisource API helper ─────────────────────────────────────────────────────

async function fetchWikisourcePage(title) {
  const encoded = encodeURIComponent(title);
  // Use action=parse to get rendered HTML
  const url = `https://mr.wikisource.org/w/api.php?action=parse&page=${encoded}&prop=text&redirects=1&format=json&formatversion=2`;
  try {
    const raw = await fetchUrl(url);
    const data = JSON.parse(raw);
    if (data.error) {
      // Try alternate title with spaces as underscores or vice versa
      return null;
    }
    return {
      page_title: data.parse?.title || title,
      html: data.parse?.text || null,
      source_url: `https://mr.wikisource.org/wiki/${encoded}`,
      source_name: 'मराठी विकिस्रोत',
    };
  } catch (e) {
    console.log(`  ⚠ Wikisource fetch failed for "${title}": ${e.message}`);
    return null;
  }
}

// ── HTML cleaning ─────────────────────────────────────────────────────────────

function cleanWikipediaHtml(html, lang) {
  const $ = cheerio.load(html);

  // Remove edit section buttons
  $('.mw-editsection').remove();

  // Remove reference superscripts [1], [2], etc.
  $('sup.reference, sup.noprint').remove();

  // Remove "cite error" spans
  $('.mw-ext-cite-error').remove();

  // Remove navigation boxes (navbox)
  $('.navbox, .mbox-small, .ambox, .tmbox').remove();
  $('table.navbox, table.wikitable.noprint').remove();

  // Remove "See also", "References", "Notes", "External links" sections
  // Find h2 elements with these titles and remove them + everything after
  const stopSections = ['See also', 'References', 'Notes', 'External links',
    'Further reading', 'Bibliography', 'हे सुद्धा पहा', 'संदर्भ', 'टीपा',
    'बाह्य दुवे', 'पुढील वाचन', 'ग्रंथसूची', 'इतर दुवे'];

  $('h2').each(function() {
    const text = $(this).text().replace(/\[.*?\]/g, '').trim();
    if (stopSections.some(s => text.includes(s))) {
      let next = $(this).next();
      while (next.length) {
        const tmp = next.next();
        next.remove();
        next = tmp;
      }
      $(this).remove();
    }
  });

  // Remove infobox tables (they reference images we don't have)
  $('table.infobox, .infobox').remove();

  // Remove image elements (we don't have local copies)
  $('figure, .thumb, .thumbcaption, .mw-halign-right, .mw-halign-left').remove();
  $('img').remove();

  // Remove empty paragraphs and divs
  $('p:empty, div:empty').remove();

  // Fix links — remove all hrefs (we're a local offline site)
  $('a').each(function() {
    const href = $(this).attr('href');
    if (href && (href.startsWith('/') || href.startsWith('http'))) {
      $(this).removeAttr('href').removeAttr('title').removeAttr('class');
    }
  });

  // Get cleaned body HTML
  const body = $('body').html() || $.html();
  return body
    .replace(/\[\d+\]/g, '')           // remove [1] [2] citation markers
    .replace(/\[citation needed\]/gi, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<div>\s*<\/div>/g, '')
    .trim();
}

function cleanWikisourceHtml(html) {
  const $ = cheerio.load(html);

  // Remove header navigation, footer, page nav
  $('.ws-noexport, .noprint, .mw-editsection').remove();
  $('.navigation-not-searchable').remove();
  $('table.ws-header, table.ws-footer').remove();
  $('.mw-indicators').remove();
  $('#mw-content-text > div.mw-parser-output > table').first().remove(); // header table

  // Remove images
  $('figure, img, .thumb').remove();

  // Remove edit links
  $('.mw-editsection').remove();

  // Remove empty elements
  $('p:empty, div:empty').remove();

  // Remove hrefs
  $('a').each(function() {
    const href = $(this).attr('href');
    if (href && (href.startsWith('/') || href.startsWith('http'))) {
      $(this).removeAttr('href').removeAttr('class');
    }
  });

  return ($('#mw-content-text').html() || $('body').html() || '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<div>\s*<\/div>/g, '')
    .trim();
}

// ── Save helper ───────────────────────────────────────────────────────────────
function saveEntry(saintId, slug, entry) {
  const dir = path.join(FETCHED_DIR, saintId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(entry, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching Wikipedia & Wikisource content for 12 Varkari saints...\n');

  for (const saint of SAINTS) {
    console.log(`\n── ${saint.id} (${saint.mr_wiki}) ──`);

    // 1. Marathi Wikipedia
    process.stdout.write('  mr.wikipedia.org... ');
    await delay(DELAY_MS);
    const mrResult = await fetchWikiExtract('mr', saint.mr_wiki);
    if (mrResult && mrResult.html) {
      const cleaned = cleanWikipediaHtml(mrResult.html, 'mr');
      if (cleaned.length > 200) {
        saveEntry(saint.id, 'mr-wikipedia', {
          slug: 'mr-wikipedia',
          title: mrResult.page_title,
          label: `${mrResult.page_title} (मराठी विकिपीडिया)`,
          cat: 'bio',
          source_url: mrResult.source_url,
          source_name: mrResult.source_name,
          html: cleaned,
          lang: 'mr',
        });
        console.log(`✅ ${cleaned.length} chars`);
      } else {
        console.log(`⚠ too short (${cleaned.length})`);
      }
    } else {
      console.log('❌ not found');
    }

    // 2. English Wikipedia (always fetch as supplementary)
    process.stdout.write('  en.wikipedia.org... ');
    await delay(DELAY_MS);
    const enResult = await fetchWikiExtract('en', saint.en_wiki);
    if (enResult && enResult.html) {
      const cleaned = cleanWikipediaHtml(enResult.html, 'en');
      if (cleaned.length > 200) {
        saveEntry(saint.id, 'en-wikipedia', {
          slug: 'en-wikipedia',
          title: enResult.page_title,
          label: `${enResult.page_title} (English Wikipedia)`,
          cat: 'bio',
          source_url: enResult.source_url,
          source_name: enResult.source_name,
          html: cleaned,
          lang: 'en',
        });
        console.log(`✅ ${cleaned.length} chars`);
      } else {
        console.log(`⚠ too short (${cleaned.length})`);
      }
    } else {
      console.log('❌ not found');
    }

    // 3. Wikisource texts
    for (const ws of saint.wikisource) {
      process.stdout.write(`  wikisource (${ws.title})... `);
      await delay(DELAY_MS);
      const wsResult = await fetchWikisourcePage(ws.title);
      if (wsResult && wsResult.html) {
        const cleaned = cleanWikisourceHtml(wsResult.html);
        if (cleaned.length > 300) {
          saveEntry(saint.id, ws.slug, {
            slug: ws.slug,
            title: wsResult.page_title,
            label: ws.label,
            cat: ws.cat,
            source_url: wsResult.source_url,
            source_name: wsResult.source_name,
            html: cleaned,
            lang: 'mr',
          });
          console.log(`✅ ${cleaned.length} chars`);
        } else {
          console.log(`⚠ too short (${cleaned.length})`);
        }
      } else {
        console.log('❌ not found');
      }
    }
  }

  // 4. Fetch Varkari tradition overview (general reference page)
  console.log('\n── Varkari tradition overview (English Wikipedia) ──');
  await delay(DELAY_MS);
  const varkariEn = await fetchWikiExtract('en', 'Varkari');
  if (varkariEn && varkariEn.html) {
    const cleaned = cleanWikipediaHtml(varkariEn.html, 'en');
    if (cleaned.length > 200) {
      // Save as a shared resource — add to dnyaneshwar as it's the central figure
      saveEntry('dnyaneshwar', 'varkari-tradition', {
        slug: 'varkari-tradition',
        title: 'Varkari Tradition',
        label: 'वारकरी परंपरा (Wikipedia)',
        cat: 'bio',
        source_url: varkariEn.source_url,
        source_name: varkariEn.source_name,
        html: cleaned,
        lang: 'en',
      });
      console.log(`✅ Varkari tradition saved (${cleaned.length} chars)`);
    }
  }

  console.log('\n\nAll fetched! Files saved to: data/fetched/');
  console.log('Now run: node build-full-site.js');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
