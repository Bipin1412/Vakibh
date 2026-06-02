import granthDnyaneshwari from "@/assets/grantha/dnyaneshwari.png";
import granthTukaramGaatha from "@/assets/grantha/tukaram gaatha.png";
import granthNamdevGaatha from "@/assets/grantha/namdev gaatha.png";
import granthEknaathiBhagwat from "@/assets/grantha/eknaathi bhagwat.png";
import tukaramGaathaDetailImage from "@/assets/takaram gaatha detail page.png";
import namdevGaathaDetailImage from "@/assets/namdev gaatha detail page.png";
import eknaathiBhagwatDetailImage from "@/assets/eknathi bhagvat detail page.png";

export type DnyaneshwariChapter = {
  id: string;
  number: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  detailImage: string;
};

export type TukaramGaatha = {
  id: string;
  number: number;
  title: string;
  letterGroup: string;
  excerpt: string;
  content: string;
  image: string;
  detailImage: string;
};

const chapterNames = [
  "पहिला",
  "दुसरा",
  "तिसरा",
  "चौथा",
  "पाचवा",
  "सहावा",
  "सातवा",
  "आठवा",
  "नववा",
  "दहावा",
  "अकरावा",
  "बारावा",
  "तेरावा",
  "चौदावा",
  "पंधरावा",
  "सोळावा",
  "सतरावा",
  "अठरावा",
];

export const dnyaneshwariChapters: DnyaneshwariChapter[] = chapterNames.map((name, index) => {
  const number = index + 1;
  return {
    id: `adhyay-${number}`,
    number,
    title: `सार्थ ज्ञानेश्वरी अध्याय ${name}`,
    excerpt: `अध्याय ${number} मध्ये भक्ती, कर्म, ज्ञान आणि जीवनमार्ग यांचे सोप्या भाषेत सुंदर विवेचन केले आहे.`,
    content: [
      `॥ अध्याय ${number} ॥`,
      "",
      `या अध्यायात श्रीकृष्ण अर्जुनाला कर्तव्य, श्रद्धा आणि आत्मबोध यांचा मार्ग समजावून सांगतात.`,
      `जीवनातील दुःख, मोह आणि संभ्रम यांवर मात करून स्थिर बुद्धीने कर्म करण्याचा संदेश येथे दिला आहे.`,
      `संत ज्ञानेश्वरांनी ओवीबद्ध शैलीत हा विचार मराठीत उलगडून सामान्य भक्तांपर्यंत पोहोचवला आहे.`,
      "",
      `मुख्य संदेश:`,
      `1. निःस्वार्थ भावनेने कर्म करणे`,
      `2. नामस्मरणाने मन शुद्ध करणे`,
      `3. सर्व जीवांत परमेश्वराचे दर्शन करणे`,
      `4. संतसंगतीतून आत्मिक उन्नती साधणे`,
    ].join("\n"),
    image: granthDnyaneshwari,
  };
});

export const getDnyaneshwariChapterById = (id: string) =>
  dnyaneshwariChapters.find((chapter) => chapter.id === id);

const tukaramGaathaGroups = [
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऊ",
  "ए",
  "ऐ",
  "ओ",
  "औ",
  "अं",
  "क",
  "ख, ग",
  "घ, च",
  "छ, ज",
  "झ, ट",
  "ठ, ड",
  "ढ, ण",
  "त, थ",
  "द",
  "ध, न",
  "प, फ",
  "ब, भ, म",
  "य",
  "र, ल",
  "व",
  "श, श्र",
  "स",
  "क्ष, ह, ज्ञ",
];

export const tukaramGaathas: TukaramGaatha[] = tukaramGaathaGroups.map((letterGroup, index) => {
  const number = index + 1;
  return {
    id: `gatha-${number}`,
    number,
    title: `संत तुकाराम गाथा ${number}`,
    letterGroup,
    excerpt: `तुकाराम महाराजांच्या अभंगांचा ${letterGroup} अक्षरगटातील निवडक संग्रह.`,
    content: [
      `॥ संत तुकाराम गाथा ${number} ॥`,
      "",
      `या विभागात ${letterGroup} अक्षरगटातील तुकाराम महाराजांच्या अभंगांचा अभ्यास करण्यासाठी निवडक आशय दिला आहे.`,
      "भक्ती, नामस्मरण, वैराग्य आणि विठ्ठलभक्ती हा या गाथेचा केंद्रबिंदू आहे.",
      "तुका म्हणे, भावाने नाम घेतले की मन शुद्ध होते आणि जीवनाला भक्तीचा आधार लाभतो.",
      "",
      "मुख्य भाव:",
      "1. विठ्ठलनामाचे स्मरण",
      "2. अहंकाराचा त्याग",
      "3. संतसंगतीचे महत्त्व",
      "4. भक्तीतून आत्मशांती",
    ].join("\n"),
    image: granthTukaramGaatha,
    detailImage: tukaramGaathaDetailImage,
  };
});

export const getTukaramGaathaById = (id: string) =>
  tukaramGaathas.find((gaatha) => gaatha.id === id);

export const namdevGaathas: TukaramGaatha[] = tukaramGaathaGroups.map((letterGroup, index) => {
  const number = index + 1;
  return {
    id: `gatha-${number}`,
    number,
    title: `संत नामदेव गाथा ${number}`,
    letterGroup,
    excerpt: `नामदेव महाराजांच्या अभंगांचा ${letterGroup} अक्षरगटातील निवडक संग्रह.`,
    content: [
      `॥ संत नामदेव गाथा ${number} ॥`,
      "",
      `या विभागात ${letterGroup} अक्षरगटातील संत नामदेव महाराजांच्या अभंगांचा अभ्यास करण्यासाठी निवडक आशय दिला आहे.`,
      "विठ्ठलनाम, प्रेमभक्ती, समर्पण आणि देवाशी असलेली निकटता हा या गाथेचा केंद्रबिंदू आहे.",
      "नामदेव म्हणे, नामस्मरणाने भक्ताचे मन विठ्ठलाशी जोडले जाते आणि अंतःकरण भक्तिभावाने उजळते.",
      "",
      "मुख्य भाव:",
      "1. विठ्ठलनामाची अखंड आठवण",
      "2. प्रेमभावाने देवाशी संवाद",
      "3. नम्रता आणि समर्पण",
      "4. भक्तीतून अंतःकरणाची शुद्धी",
    ].join("\n"),
    image: granthNamdevGaatha,
    detailImage: namdevGaathaDetailImage,
  };
});

export const getNamdevGaathaById = (id: string) =>
  namdevGaathas.find((gaatha) => gaatha.id === id);

const eknaathiBhagwatChapterNames = [
  "पहिला",
  "दुसरा",
  "तिसरा",
  "चौथा",
  "पाचवा",
  "सहावा",
  "सातवा",
  "आठवा",
  "नववा",
  "दहावा",
  "अकरावा",
  "बारावा",
  "तेरावा",
  "चौदावा",
  "पंधरावा",
  "सोळावा",
  "सतरावा",
  "अठरावा",
  "एकोणिसावा",
  "विसावा",
  "एकविसावा",
  "बाविसावा",
  "तेविसावा",
  "चोविसावा",
  "पंचविसावा",
  "सव्विसावा",
  "सत्ताविसावा",
  "अठ्ठाविसावा",
  "एकोणतिसावा",
  "तिसावा",
  "एकतिसावा",
];

export const eknaathiBhagwatChapters: DnyaneshwariChapter[] = eknaathiBhagwatChapterNames.map((name, index) => {
  const number = index + 1;
  return {
    id: `adhyay-${number}`,
    number,
    title: `एकनाथी भागवत अध्याय ${name}`,
    excerpt: `एकनाथी भागवताच्या अध्याय ${number} मधील भक्ती, ज्ञान, वैराग्य आणि भागवतधर्माचा निवडक सार.`,
    content: [
      `॥ एकनाथी भागवत अध्याय ${number} ॥`,
      "",
      "संत एकनाथ महाराजांनी भागवत धर्म सर्वसामान्य भक्तांना समजेल अशा ओवीबद्ध मराठीत उलगडून सांगितला.",
      `या अध्यायात भक्तीमार्ग, गुरुकृपा, नामस्मरण आणि जीवनातील सदाचार यांचा विचार अध्याय ${number} च्या संदर्भाने मांडला आहे.`,
      "विठ्ठलभक्ती, समत्व, दया आणि अंतःकरणाची शुद्धी ही या ग्रंथाची मुख्य दिशा आहे.",
      "",
      "मुख्य भाव:",
      "1. नामस्मरणाने मन स्थिर करणे",
      "2. सद्गुरूंच्या कृपेने आत्मबोध साधणे",
      "3. भक्ती, ज्ञान आणि वैराग्य यांचा समन्वय",
      "4. सर्व जीवांमध्ये परमेश्वराचे दर्शन करणे",
    ].join("\n"),
    image: granthEknaathiBhagwat,
    detailImage: eknaathiBhagwatDetailImage,
  };
});

export const getEknaathiBhagwatChapterById = (id: string) =>
  eknaathiBhagwatChapters.find((chapter) => chapter.id === id);
