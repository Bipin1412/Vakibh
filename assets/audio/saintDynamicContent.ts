import devotionalAudio from "@/assets/vaakibh_audio.mp3";
import { saints } from "@/data/mockData";
import { getSantBySlug, santContent, type SantContentItem } from "@/data/santContent";

export type VaarDayKey =
  | "somvaar"
  | "mangalvaar"
  | "budhvaar"
  | "guruvaar"
  | "shukravaar"
  | "shanivaar"
  | "ravivaar";

export type SaintDynamicItem = SantContentItem & { audioUrl?: string };

export type SaintDynamicData = {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
  birthYear?: string;
  region?: string;
  sampradaya?: string;
  abhang: SaintDynamicItem[];
  ovi: SaintDynamicItem[];
  gaatha: SaintDynamicItem[];
  vaar_abhang: Record<VaarDayKey, SaintDynamicItem[]>;
};

export const vaarDays: VaarDayKey[] = [
  "somvaar",
  "mangalvaar",
  "budhvaar",
  "guruvaar",
  "shukravaar",
  "shanivaar",
  "ravivaar",
];

const makeItem = (id: string, title: string, content: string, audioUrl?: string): SaintDynamicItem => ({
  id,
  title,
  content,
  audioUrl,
});

const makeVaarItems = (slug: string, saintName: string): Record<VaarDayKey, SaintDynamicItem[]> => ({
  somvaar: [
    makeItem(`${slug}-somvaar-1`, "सोमवार अभंग", `${saintName} यांच्या नामस्मरणातून आठवड्याची शांत आणि भक्तिमय सुरुवात.`),
  ],
  mangalvaar: [
    makeItem(`${slug}-mangalvaar-1`, "मंगळवार अभंग", `${saintName} यांच्या वाणीतून धैर्य, श्रद्धा आणि साधनेचा संदेश.`),
  ],
  budhvaar: [
    makeItem(`${slug}-budhvaar-1`, "बुधवार अभंग", `${saintName} यांच्या विचारांतून विवेक, ज्ञान आणि संतुलित आचरण.`),
  ],
  guruvaar: [
    makeItem(`${slug}-guruvaar-1`, "गुरुवार अभंग", `${saintName} यांच्या भक्तीतून गुरुसेवा आणि कृपेचे महत्त्व.`),
  ],
  shukravaar: [
    makeItem(`${slug}-shukravaar-1`, "शुक्रवार अभंग", `${saintName} यांच्या रचनांतून प्रेम, करुणा आणि सौम्य भक्तिभाव.`),
  ],
  shanivaar: [
    makeItem(`${slug}-shanivaar-1`, "शनिवार अभंग", `${saintName} यांच्या शिकवणीतून संयम, सेवा आणि अंतर्मुख साधना.`),
  ],
  ravivaar: [
    makeItem(`${slug}-ravivaar-1`, "रविवार अभंग", `${saintName} यांच्या स्मरणातून कीर्तन, आनंद आणि सामूहिक भक्ती.`),
  ],
});

const santBioByName: Record<string, string> = {
  "संत ज्ञानेश्वर": [
    "संत ज्ञानेश्वर महाराज हे मराठी संत परंपरेतील अत्यंत तेजस्वी आणि करुणामय संत मानले जातात. त्यांनी ज्ञानेश्वरीच्या माध्यमातून भगवद्गीतेतील अध्यात्म सामान्य लोकांच्या भाषेत आणले आणि भक्ती, ज्ञान, वैराग्य यांचा सुंदर समन्वय घडवला.",
    "अल्पायुष्यातही त्यांनी मराठी भाषेला आणि वारकरी परंपरेला अमूल्य दिशा दिली. त्यांच्या ओवीरचनेत आत्मज्ञानाची गूढता असली तरी भाषेत सहजता, माधुर्य आणि लोकजीवनाशी जोडलेली आत्मीयता दिसते.",
    "पसायदानातील विश्वकल्याणाची भावना त्यांच्या विचारांचे सार सांगते. सर्व जीवांमध्ये सद्भाव, दया, विवेक आणि ईश्वरभक्ती जागी व्हावी हा त्यांचा संदेश आजही भक्तांना प्रेरणा देतो.",
  ].join("\n\n"),
  "संत तुकाराम": [
    "संत तुकाराम महाराज हे वारकरी संप्रदायातील महान अभंगकार संत होते. त्यांनी विठ्ठलभक्ती, नामस्मरण, साधेपणा आणि सत्यनिष्ठ जीवनाचा संदेश थेट लोकभाषेतून दिला.",
    "त्यांचे अभंग भक्ताच्या अंतःकरणाशी संवाद साधतात. संसारातील दुःख, माणसाचा अहंकार, संतसंग, वैराग्य आणि देवावरील अखंड विश्वास या सर्व विषयांवर त्यांनी अत्यंत सहजपणे मार्गदर्शन केले.",
    "तुकाराम महाराजांची वाणी आजही कीर्तन, भजन आणि दैनंदिन नामस्मरणात जिवंत आहे. त्यांच्या रचनांत भक्तीबरोबर सामाजिक जागृती आणि अंतर्मुखतेचा प्रकाश दिसतो.",
  ].join("\n\n"),
  "संत नामदेव": [
    "संत नामदेव महाराज हे विठ्ठलनामात पूर्णपणे विलीन झालेले भक्तकवी होते. त्यांच्या भक्तीत बालसुलभ प्रेम, देवाशी जवळीक आणि नामस्मरणावरील अखंड श्रद्धा दिसते.",
    "नामदेवांनी विठ्ठलभक्ती महाराष्ट्राबाहेरही पोहोचवली. त्यांच्या अभंगांत भक्त आणि देव यांच्यातील प्रेमळ संवाद, समर्पण आणि साध्या मनाची शक्ती स्पष्ट जाणवते.",
    "वारकरी परंपरेत नामदेव महाराजांचे स्थान अत्यंत आदराचे आहे. त्यांचा संदेश भक्ताला सांगतो की देव दूर नसून प्रेम, नाम आणि सत्यनिष्ठ आचरणातच अनुभवता येतो.",
  ].join("\n\n"),
  "संत एकनाथ": [
    "संत एकनाथ महाराज हे भक्ती, ज्ञान आणि सामाजिक समतेचा संदेश देणारे संतकवी होते. त्यांनी अध्यात्म लोकाभिमुख केले आणि भक्तीचा मार्ग सर्वांसाठी खुला आहे हे आपल्या जीवनातून दाखवले.",
    "एकनाथी भागवत, भारुडे आणि अभंग यांच्या माध्यमातून त्यांनी भक्तीबरोबर समाजप्रबोधन केले. त्यांच्या लेखनात करुणा, विवेक, समता आणि दैनंदिन जीवनातील धर्माची स्पष्ट जाणीव दिसते.",
    "संत एकनाथांचा संदेश भक्ताला सांगतो की खरी साधना केवळ पूजा नसून विनय, सेवा, क्षमा आणि सर्वांशी समानतेने वागण्यात आहे.",
  ].join("\n\n"),
};

const makeSantBio = (saintName: string, fallbackDescription: string) =>
  santBioByName[saintName] ??
  [
    `${saintName} हे मराठी संत परंपरेतील प्रेरणादायी संत म्हणून ओळखले जातात. त्यांच्या स्मरणातून भक्ती, सेवा, नामस्मरण आणि साध्या जीवनाचे महत्त्व भक्तांपर्यंत पोहोचते.`,
    "त्यांच्या जीवनकथेतून श्रद्धा, संयम आणि लोककल्याणाची भावना दिसते. संत परंपरेत प्रत्येक संताने समाजाला भक्तीचा मार्ग दाखवताना माणुसकी, समता आणि अंतर्मुख साधनेचा संदेश दिला.",
    `${fallbackDescription} त्यांच्या विचारांचा केंद्रबिंदू भक्ताला देवाशी जोडणे, मन शुद्ध करणे आणि जीवनात सदाचार जागवणे हा आहे.`,
  ].join("\n\n");

const abhangThemes = [
  {
    title: "नामस्मरण महिमा",
    content: "देवाच्या नामात मन स्थिर झाले की चिंता हलकी होते आणि भक्तीचा मार्ग स्पष्ट दिसू लागतो.",
  },
  {
    title: "विठ्ठल भक्ती",
    content: "विठ्ठलाच्या चरणी प्रेम, नम्रता आणि समर्पण ठेवले की साध्या जीवनालाही पावित्र्य लाभते.",
  },
  {
    title: "संत संगती",
    content: "संतांच्या संगतीत मनाला विवेक मिळतो, अहंकार निवळतो आणि भक्तीची ओढ वाढते.",
  },
  {
    title: "सेवा आणि सदाचार",
    content: "सेवा, दया आणि सत्यनिष्ठ आचरण हीच भक्तीची खरी ओळख आहे.",
  },
  {
    title: "वैराग्य विचार",
    content: "क्षणभंगुर जगात आसक्ती कमी करून अंतर्मनात ईश्वराचे स्मरण जागे ठेवावे.",
  },
  {
    title: "करुणा भाव",
    content: "भक्ताच्या अंतःकरणात करुणा जागली की प्रत्येक जीवात परमेश्वराचे दर्शन घडते.",
  },
  {
    title: "गुरु कृपा",
    content: "गुरुकृपेने अज्ञानाचा अंधार दूर होतो आणि साधनेला योग्य दिशा मिळते.",
  },
  {
    title: "भक्तीचा आनंद",
    content: "नाम, कीर्तन आणि साध्या श्रद्धेतून भक्ताला अंतःशांती आणि आनंदाचा अनुभव येतो.",
  },
];

const makeAbhangItems = (slug: string, saintName: string, audioUrl?: string): SaintDynamicItem[] =>
  abhangThemes.map((theme, index) =>
    makeItem(
      `${slug}-abhang-${index + 1}`,
      `${saintName} - ${theme.title}`,
      [
        theme.content,
        `${saintName} यांच्या भक्तिपरंपरेत हा भाव साधकाला नामस्मरण, सेवा आणि अंतर्मुखतेकडे नेतो.`,
        "मन शांत करून देवाचे स्मरण करणे, संतवचन ऐकणे आणि सदाचाराने जगणे हा या अभंगाचा मुख्य संदेश आहे.",
      ].join("\n"),
      index === 0 ? audioUrl : undefined
    )
  );

const mergeAbhangItems = (
  slug: string,
  saintName: string,
  currentItems: SaintDynamicItem[],
  audioUrl?: string
) => {
  const generatedItems = makeAbhangItems(slug, saintName, audioUrl);
  const existingIds = new Set(currentItems.map((item) => item.id));

  return [
    ...currentItems,
    ...generatedItems.filter((item) => !existingIds.has(item.id)),
  ];
};

export const saintsDynamicJsonSample: { saints: SaintDynamicData[] } = {
  saints: [
    {
      id: "tukaram",
      name: "संत तुकाराम",
      slug: "tukaram",
      image: getSantBySlug("tukaram")?.image ?? "",
      birthYear: "1608",
      region: "देहू, महाराष्ट्र",
      sampradaya: "वारकरी संप्रदाय",
      bio: [
        "संत तुकाराम महाराज हे वारकरी संप्रदायातील महान अभंगकार संत होते. त्यांनी नामस्मरण, साधेपणा, नैतिकता आणि विठ्ठलभक्तीचा अखंड संदेश आपल्या अभंगांतून दिला.",
        "त्यांची वाणी लोकभाषेतून बोलते, म्हणून ती भक्तांच्या दैनंदिन जीवनाशी सहज जोडली जाते. त्यांच्या रचनांत भक्तीबरोबरच सामाजिक जागृती आणि अंतर्मुखतेचा सुंदर समन्वय दिसतो.",
      ].join("\n\n"),
      abhang: [
        makeItem("tukaram-abhang-1", "विठ्ठल नाम स्मरण", "विठ्ठलाच्या नामस्मरणाने अंतःकरण निर्मळ होते.", devotionalAudio),
        makeItem("tukaram-abhang-2", "भक्तीचा मार्ग", "निष्काम भक्ती हाच खरा जीवनमार्ग आहे."),
        makeItem("tukaram-abhang-3", "संत संगती", "संतसंगाने मनाला स्थैर्य आणि प्रकाश मिळतो."),
      ],
      ovi: [
        makeItem("tukaram-ovi-1", "सदाचार ओवी", "सदाचार, कर्तव्य आणि साध्या जीवनाचे महत्त्व सांगणारी ओवी."),
        makeItem("tukaram-ovi-2", "वैराग्य ओवी", "वैराग्य, अंतर्मुखता आणि ईश्वरनिष्ठ जीवनाची दिशा देणारी ओवी."),
      ],
      gaatha: [
        makeItem("tukaram-gaatha-1", "तुकाराम गाथा - निवडक भाग", "तुकाराम महाराजांच्या गाथेतील निवडक भक्तिमय संदेश."),
        makeItem("tukaram-gaatha-2", "नाममहिमा प्रकरण", "नामस्मरण आणि हरिनामाच्या शक्तीवर आधारित रचना."),
      ],
      vaar_abhang: makeVaarItems("tukaram", "संत तुकाराम"),
    },
    {
      id: "dnyaneshwar",
      name: "संत ज्ञानेश्वर",
      slug: "dnyaneshwar",
      image: getSantBySlug("dnyaneshwar")?.image ?? "",
      birthYear: "1275",
      region: "आळंदी, महाराष्ट्र",
      sampradaya: "नाथ व वारकरी परंपरा",
      bio: [
        "संत ज्ञानेश्वर महाराजांनी ज्ञानेश्वरी आणि पसायदानाद्वारे मराठी भाषेत अध्यात्माचे अमूल्य दालन उघडले. ज्ञान, भक्ती आणि विश्वकल्याण हा त्यांच्या विचारांचा केंद्रबिंदू होता.",
        "त्यांनी अवघ्या तरुण वयात भगवद्गीतेचा गूढ अर्थ लोकभाषेत मांडला. त्यांच्या ओवीरचनेत करुणा, अद्वैतदृष्टी आणि सर्वसमावेशक भक्ती यांचा तेजस्वी अनुभव येतो.",
      ].join("\n\n"),
      abhang: [
        makeItem("dnyaneshwar-abhang-1", "रूप पाहता लोचनी", "विठ्ठलरूप दर्शनातील आनंदाचा अभंग."),
        makeItem("dnyaneshwar-abhang-2", "ज्ञान-भक्ती संदेश", "ज्ञान आणि प्रेमभक्तीचा समन्वय."),
      ],
      ovi: [
        makeItem("dnyaneshwar-ovi-1", "ज्ञान ओवी", "आत्मज्ञान, विवेक आणि साधनेची दिशा देणारी ओवी."),
        makeItem("dnyaneshwar-ovi-2", "भक्ती ओवी", "भक्ती आणि ज्ञान यांचा एकात्म अनुभव."),
      ],
      gaatha: [
        makeItem("dnyaneshwar-gaatha-1", "ज्ञानेश्वरी - अध्याय निवड", "भगवद्गीतेवरील ज्ञानेश्वरीतील मुख्य विचारांची निवड."),
        makeItem("dnyaneshwar-gaatha-2", "पसायदान अर्थ", "पसायदानातील विश्वकल्याणाच्या भावनेचा सार."),
      ],
      vaar_abhang: makeVaarItems("dnyaneshwar", "संत ज्ञानेश्वर"),
    },
  ],
};

const mapLegacyToDynamic = (slug: string): SaintDynamicData | undefined => {
  const legacy = getSantBySlug(slug);
  if (!legacy) return undefined;

  return {
    id: legacy.slug,
    name: legacy.sant,
    slug: legacy.slug,
    image: legacy.image,
    bio: legacy.intro,
    abhang: mergeAbhangItems(legacy.slug, legacy.sant, legacy.categories.abhang),
    ovi: legacy.categories.ovi,
    gaatha: legacy.categories.gaatha,
    vaar_abhang: vaarDays.reduce((acc, day, index) => {
      acc[day] = legacy.categories.abhang.filter((_, itemIndex) => itemIndex % vaarDays.length === index);
      return acc;
    }, {} as Record<VaarDayKey, SaintDynamicItem[]>),
  };
};

const mapMockSaintToDynamic = (saint: (typeof saints)[number]): SaintDynamicData => ({
  id: saint.id,
  name: saint.name,
  slug: saint.slug,
  image: saint.image,
  bio: makeSantBio(saint.name, saint.fullDescription),
  birthYear: saint.period !== "कालमर्यादा उपलब्ध नाही" ? saint.period.split("-")[0]?.trim() : undefined,
  region: "महाराष्ट्र",
  sampradaya: "वारकरी परंपरा",
  abhang: makeAbhangItems(saint.slug, saint.name),
  ovi: [
    makeItem(`${saint.slug}-ovi-1`, `${saint.name} ओवी`, `${saint.name} यांच्या जीवनदृष्टीची ओवी.`),
  ],
  gaatha: [
    makeItem(`${saint.slug}-gaatha-1`, `${saint.name} गाथा`, `${saint.name} यांच्या चरित्र आणि भक्तीपरंपरेचा संक्षिप्त परिचय.`),
  ],
  vaar_abhang: makeVaarItems(saint.slug, saint.name),
});

const dynamicIndex = new Map<string, SaintDynamicData>();

saints.forEach((saint) => {
  dynamicIndex.set(saint.slug, mapMockSaintToDynamic(saint));
});

santContent.forEach((legacy) => {
  const mapped = mapLegacyToDynamic(legacy.slug);
  if (mapped) dynamicIndex.set(legacy.slug, mapped);
});

saintsDynamicJsonSample.saints.forEach((saint) => {
  dynamicIndex.set(saint.slug, {
    ...saint,
    abhang: mergeAbhangItems(
      `${saint.slug}-extra`,
      saint.name,
      saint.abhang,
      saint.slug === "tukaram" ? devotionalAudio : undefined
    ),
  });
});

export const getDynamicSantBySlug = (slug: string) => dynamicIndex.get(slug);

export const getDynamicSantSlugByName = (name: string) => {
  for (const saint of dynamicIndex.values()) {
    if (saint.name === name) return saint.slug;
  }
  return undefined;
};

export const dynamicCategoryLabels: Record<"abhang" | "ovi" | "gaatha" | "vaar_abhang", string> = {
  abhang: "अभंग",
  ovi: "ओवी",
  gaatha: "गाथा",
  vaar_abhang: "वाराचे अभंग",
};

export const vaarDayLabels: Record<VaarDayKey, string> = {
  somvaar: "सोमवार",
  mangalvaar: "मंगळवार",
  budhvaar: "बुधवार",
  guruvaar: "गुरुवार",
  shukravaar: "शुक्रवार",
  shanivaar: "शनिवार",
  ravivaar: "रविवार",
};

export const dynamicTabs: Array<"abhang" | "ovi" | "gaatha" | "vaar_abhang"> = [
  "abhang",
  "ovi",
  "gaatha",
  "vaar_abhang",
];
