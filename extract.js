// Content extraction script — run once with: node extract.js
// Reads archive HTML from santsahitya.in, outputs data/saints.js and data/abhangas/*.js

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ARCHIVE = 'd:/webakoof/Vakibh/www.santsahitya.in';
const OUT = 'd:/webakoof/saints-website/data';

if (!fs.existsSync(path.join(OUT, 'abhangas'))) {
  fs.mkdirSync(path.join(OUT, 'abhangas'), { recursive: true });
}

// ── Saints configuration ───────────────────────────────────────────────────
const SAINTS = [
  {
    id: 'dnyaneshwar',
    name: 'संत ज्ञानेश्वर',
    marathi: 'ज्ञानेश्वर',
    years: '१२७५ – १२९६',
    image: '../images/dnyaneshwar.jpg',
    bio_path: 'mahati-santanchi/sant-dnyaneshwar-maharaj/index.html',
    abhanga_folder: 'dnyaneshwar',
    abhanga_pattern: 'slug',
    connections: ['nivritti', 'muktabai', 'sopandev'],
    works: [
      { title: 'ज्ञानेश्वरी', type: 'ग्रंथ', desc: 'भगवद्गीतेवरील १८ अध्यायांचे विस्तृत मराठी भाष्य' },
      { title: 'अमृतानुभव', type: 'ग्रंथ', desc: 'आत्मज्ञानाचे अनुभव सांगणारा ग्रंथ' },
      { title: 'हरिपाठ', type: 'अभंग', desc: 'हरिनामाची महती सांगणारे २८ अभंग' },
      { title: 'चांगदेव पासष्टी', type: 'पत्र', desc: 'ऋषी चांगदेव यांना लिहिलेले ६५ ओव्यांचे पत्र' },
      { title: 'अभंग गाथा', type: 'अभंग', desc: '१०७१ अभंगांचा संग्रह' },
    ],
  },
  {
    id: 'tukaram',
    name: 'संत तुकाराम',
    marathi: 'तुकाराम',
    years: '१५९८ – १६५०',
    image: '../images/tukaram.jpg',
    bio_path: 'mahati-santanchi/sant-tukaram-maharaj/index.html',
    abhanga_folder: 'tukaram',
    abhanga_pattern: 'slug',
    connections: [],
    works: [
      { title: 'अभंग गाथा', type: 'अभंग', desc: 'सुमारे ४५०० अभंगांचा विशाल संग्रह' },
      { title: 'गौळणी', type: 'अभंग', desc: 'गोपींच्या भावाने लिहिलेले अभंग' },
      { title: 'आरती', type: 'आरती', desc: 'संत तुकारामांची प्रसिद्ध आरती' },
    ],
  },
  {
    id: 'namdev',
    name: 'संत नामदेव',
    marathi: 'नामदेव',
    years: '१२७० – १३५०',
    image: '../images/namdev.jpg',
    bio_path: 'mahati-santanchi/sant-namdev/index.html',
    abhanga_folder: 'namdev',
    abhanga_pattern: 'slug',
    connections: ['janabai'],
    works: [
      { title: 'नामदेव गाथा', type: 'अभंग', desc: 'विठ्ठलभक्तीचे अभंग संग्रह' },
      { title: 'आरती', type: 'आरती', desc: 'संत नामदेवांची आरती' },
    ],
  },
  {
    id: 'eknath',
    name: 'संत एकनाथ',
    marathi: 'एकनाथ',
    years: '१५३३ – १५९९',
    image: '../images/eknath.jpg',
    bio_path: 'mahati-santanchi/sant-eknath/index.html',
    abhanga_folder: 'eknath',
    abhanga_pattern: 'slug',
    connections: [],
    works: [
      { title: 'एकनाथी भागवत', type: 'ग्रंथ', desc: 'भागवत पुराणाच्या एकादश स्कंधावरील मराठी भाष्य' },
      { title: 'भावार्थ रामायण', type: 'ग्रंथ', desc: 'रामायणाचे मराठी रूपांतर — सहा काण्डांसह' },
      { title: 'अभंग', type: 'अभंग', desc: '३४८७ अभंगांचा संग्रह' },
      { title: 'हरिपाठ', type: 'अभंग', desc: 'हरिनामाची महती' },
      { title: 'रुक्मिणी स्वयंवर', type: 'काव्य', desc: 'रुक्मिणी-कृष्ण विवाहाचे काव्य' },
    ],
  },
  {
    id: 'nivritti',
    name: 'संत निवृत्ती महाराज',
    marathi: 'निवृत्ती',
    years: '१२७३ – १२९७',
    image: '../images/nivritti.jpg',
    bio_path: 'mahati-santanchi/sant-nivruttinath/index.html',
    abhanga_folder: 'nivruttinath',
    abhanga_pattern: 'slug',
    connections: ['dnyaneshwar', 'muktabai', 'sopandev'],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: '२१८ अभंगांचा संग्रह' },
      { title: 'आरती', type: 'आरती', desc: 'संत निवृत्तीनाथांची आरती' },
    ],
  },
  {
    id: 'muktabai',
    name: 'संत मुक्ताबाई',
    marathi: 'मुक्ताबाई',
    years: '१२७९ – १२९७',
    image: '../images/muktabai.png',
    bio_path: 'mahati-santanchi/sant-muktabai/index.html',
    abhanga_folder: 'muktabai',
    abhanga_pattern: 'slug',
    connections: ['dnyaneshwar', 'nivritti', 'sopandev'],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: 'मुक्ताबाईंचे अभंग संग्रह' },
      { title: 'ताटीचे अभंग', type: 'अभंग', desc: 'ज्ञानेश्वरांना उद्देशून लिहिलेले प्रसिद्ध अभंग' },
      { title: 'आरती', type: 'आरती', desc: 'संत मुक्ताबाईंची आरती' },
    ],
  },
  {
    id: 'sopandev',
    name: 'संत सोपानदेव',
    marathi: 'सोपानदेव',
    years: '१२७७ – १२९७',
    image: '../images/sopandev.jpg',
    bio_path: 'mahati-santanchi/sopandev/index.html',
    abhanga_folder: 'sopandev',
    abhanga_pattern: 'slug',
    connections: ['dnyaneshwar', 'nivritti', 'muktabai'],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: 'सोपानदेवांचे अभंग संग्रह' },
      { title: 'आरती', type: 'आरती', desc: 'संत सोपानदेवांची आरती' },
    ],
  },
  {
    id: 'chokhamela',
    name: 'संत चोखामेळा',
    marathi: 'चोखामेळा',
    years: 'इ.स. १३०० (अंदाजे)',
    image: '../images/chokhamela.jpg',
    bio_path: 'mahati-santanchi/sant-chokhamela/index.html',
    abhanga_folder: 'chokhamela',
    abhanga_pattern: 'numbered',
    abhanga_prefix: 'sant-chokhoba-abhang-',
    connections: [],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: '३०० हून अधिक अभंगांचा संग्रह' },
    ],
  },
  {
    id: 'janabai',
    name: 'संत जनाबाई',
    marathi: 'जनाबाई',
    years: 'इ.स. १२९८ (अंदाजे)',
    image: '../images/janabai.jpg',
    bio_path: 'mahati-santanchi/sant-janabai/index.html',
    abhanga_folder: 'janabai',
    abhanga_pattern: 'numbered',
    abhanga_prefix: 'sant-janabai-abhang-',
    connections: ['namdev'],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: '४३४ अभंगांचा संग्रह' },
      { title: 'काकड आरती', type: 'आरती', desc: 'पहाटे गायली जाणारी प्रसिद्ध काकड आरती' },
      { title: 'दशावतार वर्णन', type: 'अभंग', desc: 'विष्णूच्या दहा अवतारांचे वर्णन' },
    ],
  },
  {
    id: 'kanhopatra',
    name: 'संत कान्होपात्रा',
    marathi: 'कान्होपात्रा',
    years: 'इ.स. १४०० (अंदाजे)',
    image: '../images/kanhopatra.jpg',
    bio_path: 'mahati-santanchi/sant-kanopatra/index.html',
    abhanga_folder: 'kanhopatra',
    abhanga_pattern: 'slug',
    connections: [],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: 'विठ्ठलभक्तीचे ५०हून अधिक अभंग' },
    ],
  },
  {
    id: 'kanho',
    name: 'संत कान्हो',
    marathi: 'कान्हो',
    years: 'इ.स. १५०० (अंदाजे)',
    image: '../images/kanho.jpg',
    bio_path: 'mahati-santanchi/sant-knho-pathak/index.html',
    abhanga_folder: 'kanho-pathak',
    abhanga_pattern: 'numbered',
    abhanga_prefix: 'sant-kanho-pathak-abhang-',
    connections: [],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: 'भक्तिपर अभंग संग्रह' },
      { title: 'गीतसार', type: 'ग्रंथ', desc: 'भगवद्गीतेचे मराठी सार' },
    ],
  },
  {
    id: 'narhari',
    name: 'संत नरहरी सोनार',
    marathi: 'नरहरी',
    years: 'इ.स. १३०० (अंदाजे)',
    image: '../images/placeholder.jpg',
    bio_path: 'mahati-santanchi/sant-narhari-sonar/index.html',
    abhanga_folder: 'narhari-sonar',
    abhanga_pattern: 'slug',
    connections: [],
    works: [
      { title: 'अभंग', type: 'अभंग', desc: 'भक्तिपर अभंग संग्रह' },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/g, '');
}

function extractBio(filePath) {
  const html = readFile(filePath);
  if (!html) return '';
  const $ = cheerio.load(html);
  const content = $('.entry-content');
  content.find('script, .adsbygoogle, ins, .sharedaddy, .jp-relatedposts, nav, .navigation, .post-navigation, audio, video').remove();
  let text = content.text().trim();
  // Remove ad noise and stop at comment section
  text = text.replace(/\(adsbygoogle[^)]*\)\.push\(\{\}\);?/g, '');
  text = text.replace(/window\.adsbygoogle[^\n]*/g, '');
  // Stop at comment section markers
  const stopMarkers = ['← Previous Post', 'Next Post →', 'Leave a Reply', 'thoughts on', 'राम कृष्ण हरी'];
  for (const marker of stopMarkers) {
    const idx = text.indexOf(marker);
    if (idx > 100) text = text.substring(0, idx);
  }
  return decodeEntities(text.replace(/\s+/g, ' ').trim());
}

function extractAbhangaFromPage(filePath) {
  const html = readFile(filePath);
  if (!html) return null;
  const $ = cheerio.load(html);

  const h1Raw = $('h1.entry-title').text() || $('h1').first().text();
  const title = decodeEntities(h1Raw.trim());

  const content = $('.entry-content');
  content.find('script, .adsbygoogle, ins, .sharedaddy, .jp-relatedposts, nav, .navigation, .post-navigation, audio, video, .ast-comment-time').remove();
  let text = content.text().trim();
  text = text.replace(/\(adsbygoogle[^)]*\)\.push\(\{\}\);?/g, '');
  // Stop before noise
  const stopMarkers = ['राम कृष्ण हरी', '← Previous Post', 'Next Post →', 'Leave a Reply', 'thoughts on', 'Anonymous'];
  for (const marker of stopMarkers) {
    const idx = text.indexOf(marker);
    if (idx > 10) text = text.substring(0, idx);
  }
  text = decodeEntities(text.replace(/\s+/g, ' ').trim());
  // Remove title echo at start
  if (text.startsWith(title)) text = text.substring(title.length).trim();
  if (!text || text.length < 5) return null;
  return { title, text };
}

function getNumberedAbhangas(folder, prefix) {
  const dir = path.join(ARCHIVE, folder);
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir)
    .filter(e => e.startsWith(prefix))
    .map(e => {
      const numStr = e.replace(prefix, '');
      const num = parseInt(numStr, 10);
      return { folder: e, num: isNaN(num) ? 9999 : num };
    })
    .sort((a, b) => a.num - b.num);

  const abhangas = [];
  for (const { folder: sub, num } of entries) {
    const result = extractAbhangaFromPage(path.join(dir, sub, 'index.html'));
    if (result) abhangas.push({ number: num, ...result });
  }
  return abhangas;
}

function getSlugAbhangas(folder) {
  const dir = path.join(ARCHIVE, folder);
  if (!fs.existsSync(dir)) return [];
  const SKIP = new Set(['feed', '2', '3', '4', 'firebase-messaging-sw.html', 'index.html', 'cdn-cgi']);
  const entries = fs.readdirSync(dir)
    .filter(e => !SKIP.has(e) && !e.endsWith('.html') && !e.endsWith('.js'));

  const abhangas = [];
  let num = 1;
  for (const sub of entries) {
    const filePath = path.join(dir, sub, 'index.html');
    if (!fs.existsSync(filePath)) continue;
    // Skip 403 pages
    const raw = fs.readFileSync(filePath, 'utf8');
    if (raw.includes('403 Forbidden') || raw.length < 3000) continue;
    const result = extractAbhangaFromPage(filePath);
    if (result) abhangas.push({ number: num++, ...result });
  }
  return abhangas;
}

function getGroupedAbhangas(folder) {
  // For eknath — subfolders like abhang-1-to-102 contain one index.html
  // with multiple abhangas listed. We extract all text as one block per page.
  const dir = path.join(ARCHIVE, folder);
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir)
    .filter(e => e.startsWith('abhang-'))
    .sort();

  const abhangas = [];
  let num = 1;
  for (const sub of entries) {
    const filePath = path.join(dir, sub, 'index.html');
    const html = readFile(filePath);
    if (!html) continue;
    const $ = cheerio.load(html);
    const content = $('.entry-content');
    content.find('script, .adsbygoogle, ins, .sharedaddy, audio, video, nav').remove();
    let text = content.text().trim();
    text = text.replace(/\(adsbygoogle[^)]*\)\.push\(\{\}\);?/g, '');
    const stopMarkers = ['← Previous Post', 'Next Post →', 'Leave a Reply', 'thoughts on'];
    for (const marker of stopMarkers) {
      const idx = text.indexOf(marker);
      if (idx > 10) text = text.substring(0, idx);
    }
    text = decodeEntities(text.replace(/\s+/g, ' ').trim());
    if (text.length > 20) {
      abhangas.push({ number: num++, title: sub.replace(/-/g, ' '), text });
    }
  }
  return abhangas;
}

// ── Main extraction ────────────────────────────────────────────────────────

const saintsData = [];

for (const saint of SAINTS) {
  process.stdout.write(`Extracting ${saint.name}...`);

  // Biography
  const bioPath = path.join(ARCHIVE, saint.bio_path);
  const bio = extractBio(bioPath);

  // Abhangas
  let abhangas = [];
  if (saint.abhanga_pattern === 'numbered') {
    abhangas = getNumberedAbhangas(saint.abhanga_folder, saint.abhanga_prefix);
  } else if (saint.abhanga_pattern === 'slug') {
    abhangas = getSlugAbhangas(saint.abhanga_folder);
  } else if (saint.abhanga_pattern === 'grouped') {
    abhangas = getGroupedAbhangas(saint.abhanga_folder);
  }

  // Write abhanga file per saint
  const abhangaOut = path.join(OUT, 'abhangas', `${saint.id}.js`);
  fs.writeFileSync(abhangaOut,
    `const ABHANGAS_${saint.id.toUpperCase()} = ${JSON.stringify(abhangas, null, 2)};\n`
  );

  saintsData.push({
    id: saint.id,
    name: saint.name,
    marathi: saint.marathi,
    years: saint.years,
    image: saint.image,
    bio,
    works: saint.works,
    connections: saint.connections,
    abhangaCount: abhangas.length,
  });

  console.log(` ${abhangas.length} abhangas`);
}

// Write main saints.js
const saintsOut = path.join(OUT, 'saints.js');
fs.writeFileSync(saintsOut,
  `const SAINTS_DATA = ${JSON.stringify(saintsData, null, 2)};\n`
);

console.log('\nDone! Files written to:', OUT);
