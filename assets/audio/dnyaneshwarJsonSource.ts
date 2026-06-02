import saintsData from "../../data/saints_data.json";

type JsonContentHeading = {
  heading: string;
  content?: string[];
};

type JsonContent = {
  url?: string;
  title?: string;
  paragraphs?: string[];
  headings?: JsonContentHeading[];
  lists?: string[][];
  tables?: string[][][];
};

type JsonSubPage = {
  label: string;
  url?: string;
  image?: string;
  content?: JsonContent;
};

type JsonSaint = {
  id: number;
  name: string;
  main_url?: string;
  sub_pages: JsonSubPage[];
  main_content?: JsonContent;
};

export type DnyaneshwarJsonChapter = {
  id: string;
  number: number;
  title: string;
  excerpt: string;
  paragraphs: string[];
  sourceUrl: string;
  image?: string;
};

export type DnyaneshwarJsonCard = {
  label: string;
  href: string;
  excerpt: string;
  image?: string;
};

const saints = saintsData as JsonSaint[];

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const dnyaneshwar = saints.find((saint) => saint.id === 2);

if (!dnyaneshwar) {
  throw new Error("Could not find sant record with id=2.");
}

export const dnyaneshwarSubPages = dnyaneshwar.sub_pages;

export const getDnyaneshwarSubPageByLabel = (label: string) =>
  dnyaneshwarSubPages.find((page) => page.label === label);

export const getDnyaneshwarSubPageByUrl = (urlPart: string) =>
  dnyaneshwarSubPages.find((page) => page.url?.includes(urlPart));

const getUrlTail = (url?: string) => {
  if (!url) return "";

  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    return pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return url.replace(/\/+$/, "").split("/").filter(Boolean).pop() ?? "";
  }
};

const inferExcerpt = (paragraphs: string[]) => {
  const candidates = paragraphs
    .map(normalizeText)
    .filter(Boolean)
    .filter(
      (text) =>
        !/^॥/.test(text) &&
        !/^इत/.test(text) &&
        !/^अर्थ/.test(text) &&
        !/^tags:/.test(text) &&
        !/^video/.test(text)
    );

  return candidates[0] ?? "";
};

const isAudioOrMediaLine = (text: string) =>
  /^https?:\/\//i.test(text) ||
  /ध्वनीमुद्रण|ऑडिओ|audio/i.test(text) ||
  /वरील\s+ऑडिओ/i.test(text);

const chapterPages = dnyaneshwarSubPages
  .filter(
    (page) =>
      page.label.startsWith("सार्थ ज्ञानेश्वरी अध्याय") &&
      (page.url ?? "").includes("dnyaneshwari")
  )
  .sort((a, b) => {
    const aMatch = a.label.match(/(\d+)/);
    const bMatch = b.label.match(/(\d+)/);
    return Number(aMatch?.[1] ?? 0) - Number(bMatch?.[1] ?? 0);
  });

export const dnyaneshwariJsonChapters: DnyaneshwarJsonChapter[] = chapterPages.map((page, index) => {
  const paragraphs = (page.content?.paragraphs ?? [])
    .map(normalizeText)
    .filter(Boolean)
    .filter((text) => !isAudioOrMediaLine(text));

  return {
    id: `adhyay-${index + 1}`,
    number: index + 1,
    title: page.label,
    excerpt: inferExcerpt(paragraphs),
    paragraphs,
    sourceUrl: page.url ?? "",
    image: page.image,
  };
});

export const getDnyaneshwariJsonChapterById = (id: string) =>
  dnyaneshwariJsonChapters.find((chapter) => chapter.id === id);

const abhangCardPages = dnyaneshwarSubPages.filter((page) =>
  [
    "अभंग १ ते २००",
    "अभंग २०१ ते २९७",
    "अभंग २९८ ते ४०४",
    "अभंग ४०५ ते ५९७",
    "अभंग ५९८ ते ९०३",
    "संत ज्ञानेश्वर सर्व अभंग",
    "ब्रह्माचा गोंडा चहूं – संत ज्ञानेश्वर महाराज अभंग ११८",
    "त्रिभंगी देहुडा ठाण – संत ज्ञानेश्वर महाराज अभंग ३५",
    "तुझी आण वाहिन गा देवराया – संत ज्ञानेश्वर महाराज अभंग १०३९",
    "भावाची मी सौरी जाले – संत ज्ञानेश्वर महाराज अभंग १०३८",
  ].includes(page.label)
);

export const dnyaneshwarAbhangCards: DnyaneshwarJsonCard[] = abhangCardPages.map((page) => {
  const paragraphs = (page.content?.paragraphs ?? []).map(normalizeText).filter(Boolean);
  const listLead = page.content?.lists?.[0]?.[0] ?? "";
  const excerpt = inferExcerpt([...paragraphs, normalizeText(listLead)]).slice(0, 180);
  const pageKey = getUrlTail(page.url) || page.label;

  return {
    label: page.label,
    href: `/sant/dnyaneshwar/abhang/${encodeURIComponent(pageKey)}`,
    excerpt,
  };
});

export const getDnyaneshwarAbhangPageByKey = (pageKey: string) =>
  dnyaneshwarSubPages.find((page) => getUrlTail(page.url) === pageKey);

const teerthaCardPages = [
  getDnyaneshwarSubPageByUrl("/tirthkshetra/newasa/"),
  getDnyaneshwarSubPageByUrl("/tirthkshetra/apegaon/"),
  getDnyaneshwarSubPageByUrl("/tirthkshetra/alandi/"),
].filter(Boolean) as JsonSubPage[];

export const dnyaneshwarTeerthaCards: DnyaneshwarJsonCard[] = teerthaCardPages.map((page) => {
  const paragraphs = (page.content?.paragraphs ?? []).map(normalizeText).filter(Boolean);
  const listLead = page.content?.lists?.[0]?.[0] ?? "";
  const excerpt = inferExcerpt([...paragraphs, normalizeText(listLead)]).slice(0, 180);

  return {
    label: page.label,
    href: `/sant/dnyaneshwar/teertha/${encodeURIComponent(getUrlTail(page.url) || page.label)}`,
    excerpt,
    image: page.image,
  };
});

export const getDnyaneshwarTeerthaPageByKey = (pageKey: string) =>
  dnyaneshwarSubPages.find((page) => getUrlTail(page.url) === pageKey);

export const dnyaneshwarFeaturedLinks = [
  { label: "ज्ञानेश्वरांचे चरित्र", href: "/sant/dnyaneshwar/charitra" },
  { label: "सार्थ ज्ञानेश्वरी", href: "/granth/dnyaneshwari" },
  { label: "अमृतानुभव", href: "/sant/dnyaneshwar/amritanubhav" },
  { label: "चांगदेव पासष्टी", href: "/sant/dnyaneshwar/changdev-pasashti" },
  { label: "सार्थ पसायदान", href: "/sant/dnyaneshwar/pasaydan" },
  { label: "सार्थ हरिपाठ", href: "/sant/dnyaneshwar/haripath" },
  { label: "ज्ञानेश्वरांचे अभंग", href: "/tag/sant-dnyaneshwar-abhang" },
  { label: "ज्ञानेश्वरांची विराणी", href: "/sant/dnyaneshwar/virani" },
  { label: "ज्ञानेश्वरांची आरती", href: "/sant/dnyaneshwar/aarti" },
  { label: "ज्ञानेश्वरांचे तीर्थक्षेत्र", href: "/sant/dnyaneshwar/teertha" },
] as const;

export const dnyaneshwarSubPageContent = {
  amritanubhav: getDnyaneshwarSubPageByLabel("अमृतानुभव"),
  virani: getDnyaneshwarSubPageByLabel("ज्ञानेश्वरांची विराणी"),
  pasaydan: getDnyaneshwarSubPageByLabel("सार्थ पसायदान"),
  haripath: getDnyaneshwarSubPageByLabel("सार्थ हरिपाठ"),
  aarti: getDnyaneshwarSubPageByLabel("ज्ञानेश्वरांची आरती"),
  teertha: getDnyaneshwarSubPageByLabel("ज्ञानेश्वरांचे तीर्थक्षेत्र"),
  changdev: getDnyaneshwarSubPageByLabel("चांगदेव पासष्टी"),
  abhangSummary: getDnyaneshwarSubPageByLabel("संत ज्ञानेश्वर सर्व अभंग"),
} as const;
