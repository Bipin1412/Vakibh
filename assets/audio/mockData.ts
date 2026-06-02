import santDnyaneshwar from "@/assets/sant/sant dnyaneshwar.png";
import santNivrutti from "@/assets/sant/sant nirutti maharaj.png";
import santTukaram from "@/assets/sant/sant tukaram.png";
import santNamdev from "@/assets/sant/sant namdev.png";
import santEknath from "@/assets/sant/sant eknaath.png";
import santMuktai from "@/assets/sant/sant muktabai.png";
import santSopandev from "@/assets/sant/संत सोपान काका महाराज.png";
import santChokhoba from "@/assets/sant/संत चोखामेळा महाराज.png";
import santJanabai from "@/assets/sant/संत जनाबाई महाराज.png";
import santKanhopatra from "@/assets/sant/sant tukaram.png";
import santNarhari from "@/assets/sant/संत नरहरी सोनार महाराज.png";
import santTukavipra from "@/assets/sant/sant tukaram.png";
import santKanho from "@/assets/sant/sant kanho.png";
import santNaaga from "@/assets/sant/sant tukaram.png";
import santGulabrao from "@/assets/sant/sant tukaram.png";
import santUnknown24 from "@/assets/sant/sant tukaram.png";

export interface Saint {
  id: string;
  name: string;
  slug: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  period: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
}

export interface Abhang {
  id: string;
  title: string;
  slug: string;
  content: string;
  saintId: string;
  saintName: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
}


const placeholderSaintImage = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
const santImages: Record<string, string> = {
  "संत ज्ञानेश्वर": santDnyaneshwar,
  "संत तुकाराम": santTukaram,
  "संत नामदेव": santNamdev,
  "संत एकनाथ": santEknath,
  "संत मुक्ताबाई": santMuktai,
  "संत सोपानदेव": santSopandev,
  "संत चोखामेळा": santChokhoba,
  "संत जनाबाई": santJanabai,
  "संत कान्होपात्रा": santKanhopatra,
  "संत नरहरी": santNarhari,
  "संत निवृत्ती महाराज": santNivrutti,
  "संत तुकाविप्र": santTukavipra,
  "संत कान्हो": santKanho,
  "संत नागा": santNaaga,
  "संत गुलाबराव": santGulabrao,
  "संत २४": santUnknown24,
};

type SaintSeed = {
  name: string;
  image?: string;
  shortDescription?: string;
  fullDescription?: string;
  period?: string;
};

const saintSeed: SaintSeed[] = [
  {
    name: "संत ज्ञानेश्वर",
    image: santDnyaneshwar,
    shortDescription: "भक्ती आणि ज्ञानपरंपरेतील महान संत.",
    fullDescription: "संत ज्ञानेश्वर यांनी मराठी भक्तीसाहित्याला तेजस्वी दिशा दिली.",
    period: "1275 - 1296",
  },
  {
    name: "संत तुकाराम",
    image: santTukaram,
    shortDescription: "विठ्ठलभक्तीचे ओजस्वी अभंगकार.",
    fullDescription: "संत तुकारामांचे अभंग भक्तीचा शुद्ध भाव प्रकट करतात.",
    period: "1608 - 1650",
  },
  {
    name: "संत नामदेव",
    image: santNamdev,
    shortDescription: "नामस्मरण व भक्तीचा अखंड प्रवाह.",
    fullDescription: "संत नामदेवांनी वारकरी परंपरेला समृद्ध केले.",
    period: "1270 - 1350",
  },
  {
    name: "संत एकनाथ",
    image: santEknath,
    shortDescription: "समाजप्रबोधन करणारे संतकवी.",
    fullDescription: "संत एकनाथांनी भक्ती आणि सामाजिक समतेचा संदेश दिला.",
    period: "1533 - 1599",
  },
];

const generatedSaints: SaintSeed[] = [
  { name: "संत निवृत्ती महाराज" },
  { name: "संत मुक्ताबाई" },
  { name: "संत सोपानदेव" },
  { name: "संत चोखामेळा" },
  { name: "संत जनाबाई" },
  { name: "संत कान्होपात्रा" },
  { name: "संत कान्हो" },
  { name: "संत नागा" },
  { name: "संत नरहरी" },
  { name: "संत तुकाविप्र" },
  { name: "संत गुलाबराव" },
  { name: "संत २४" },
];

const allSaints = [...saintSeed, ...generatedSaints];

const saintIdByName: Record<string, string> = {
  "संत तुकाराम": "1",
  "संत ज्ञानेश्वर": "2",
  "संत नामदेव": "3",
  "संत एकनाथ": "4",
};

export const saints: Saint[] = allSaints.map((saint, index) => {
  const id = saintIdByName[saint.name] ?? String(index + 1);
  return {
    id,
    name: saint.name,
    slug: id,
    image: saint.image ?? santImages[saint.name] ?? placeholderSaintImage,
    shortDescription: saint.shortDescription ?? "मराठी संत परंपरेतील प्रेरणादायी संत.",
    fullDescription: saint.fullDescription ?? "भक्ती, सेवा आणि नामस्मरणाचा संदेश देणारे संत.",
    period: saint.period ?? "कालमर्यादा उपलब्ध नाही",
  };
});

export const categories: Category[] = [
  {
    id: "1",
    name: "भक्ती",
    slug: "bhakti",
    description: "भगवंताच्या भक्तीवरील अभंग",
    icon: "🙏",
    count: 45,
  },
  {
    id: "2",
    name: "वैराग्य",
    slug: "vairagya",
    description: "वैराग्य आणि विरक्तीवरील अभंग",
    icon: "🕊️",
    count: 28,
  },
  {
    id: "3",
    name: "गाथा",
    slug: "gatha",
    description: "संतांच्या गाथांमधील अभंग",
    icon: "📖",
    count: 62,
  },
  {
    id: "4",
    name: "ज्ञान",
    slug: "dnyan",
    description: "आत्मज्ञान आणि तत्त्वज्ञानावरील अभंग",
    icon: "✨",
    count: 35,
  },
  {
    id: "5",
    name: "अभंगवाणी",
    slug: "abhangvani",
    description: "विविध विषयांवरील अभंग",
    icon: "🎵",
    count: 50,
  },
  {
    id: "6",
    name: "ओवी",
    slug: "ovi",
    description: "ओवी छंदातील रचना",
    icon: "📝",
    count: 40,
  },
];

const abhangsSeed: Abhang[] = [
  {
    id: "1",
    title: "वृक्षवल्ली आम्हां सोयरे वनचरे",
    slug: "vrukshavalli-amha-soyari",
    content: `वृक्ष वल्ली आम्हां सोयरीं वनचरें ।
पक्षी ही सुस्वरें आळविती ॥१॥

येणें सुखें रुचे एकांताचा वास ।
नाहीं गुण दोष अंगा येत ॥२॥

आकाश मंडप पृथ्वी आसन ।
रमे तेथे मन क्रीडा करी ॥३॥

कंथाकमंडलु देहउपचारा ।
जाणविती वारा अवसर ॥४॥

हरिकथा भोजन परवडी विस्तार ।
करोनि प्रकार सेवू रुची ॥५॥

तुका म्हणे होय मनासी संवाद ।
आपुलाचि वाद आपणांसी ॥६॥`,
    saintId: "1",
    saintName: "संत तुकाराम",
    categoryId: "1",
    categoryName: "भक्ती",
    tags: ["निसर्ग", "भक्ती", "विठ्ठल"],
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "पंढरीचे भूत",
    slug: "pandhariche-bhoot",
    content: `पंढरीचे भूत लागले माथा ।
विसरली आता देवधर्म ॥

सदा विठोबाचे नाम मुखी गाता ।
विसरली चिंता संसाराची ॥`,
    saintId: "1",
    saintName: "संत तुकाराम",
    categoryId: "1",
    categoryName: "भक्ती",
    tags: ["पंढरी", "विठ्ठल"],
    featured: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "पसायदान",
    slug: "pasaydan",
    content: `आतां विश्वात्मके देवे ।
येणे वाग्यज्ञे तोषावे ।
तोषोनि मज द्यावे ।
पसायदान हे ॥१॥

जे खळांची व्यंकटी सांडो ।
तया सत्कर्मी रती वाढो ।
भूतां परस्परें पडो ।
मैत्र जीवांचे ॥२॥

दुरितांचे तिमिर जावो ।
विश्व स्वधर्म सूर्ये पाहो ।
जो जे वांछील तो ते लाहो ।
प्राणिजात ॥३॥

वर्षत सकळ मंगळी ।
ईश्वरनिष्ठांची मांदियाळी ।
अनवरत भूमंडळी ।
भेटतु भूतां ॥४॥

चला कल्पतरूंचे आरव ।
चेतना चिंतामणींचे गांव ।
बोलते जे अर्णव ।
पीयूषांचे ॥५॥

चंद्रमे जे अलांछन ।
मार्तंड जे तापहीन ।
ते सर्वांही सदा सज्जन ।
सोयरे होतु ॥६॥

किंबहुना सर्व सुखी ।
पूर्ण होऊनि तिन्ही लोकी ।
भजिजो आदिपुरुखी ।
अखंडित ॥७॥

आणि ग्रंथोपजीविये ।
विशेषीं लोकीं इये ।
दृष्टादृष्ट विजयें ।
होआवे जी ॥८॥

येथ म्हणे श्रीविश्वेश्वरावो ।
हा होईल दान पसावो ।
येणे वरे ज्ञानदेवो ।
सुखिया झाला ॥९॥`,
    saintId: "2",
    saintName: "संत ज्ञानेश्वर",
    categoryId: "4",
    categoryName: "ज्ञान",
    tags: ["पसायदान", "विश्वकल्याण"],
    featured: true,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    title: "ज्ञानदेवे रचिला पाया",
    slug: "dnyandev-rachila-paya",
    content: `संतकृपा झाली । इमारत फळा आली ॥

ज्ञानदेवे रचिला पाया । उभारिले देवालय ॥

नामा तयाचा किंकर । तेणे केला हा विस्तार ॥

जनार्दन एकनाथ । खांब दिला भागवत ॥

तुका झालासे कळस । भजन करा सावकाश ॥

बहेणी फडकते ध्वजा । निरुपण आले ओजा ॥`,
    saintId: "1",
    saintName: "संत तुकाराम",
    categoryId: "3",
    categoryName: "गाथा",
    tags: ["परंपरा", "संत"],
    featured: false,
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    title: "देव माझा विठ्ठल",
    slug: "dev-majha-vitthal",
    content: `देव माझा विठू सावळा
माळ त्याची माझिया गळा

विठू राहे पंढरपुरी
वेणु गुंफे हे मुरारी
भीमेच्या काठी डुले भक्तिचा मळा

साजिरे रूप सुंदर
कटि झळके पीतांबर
कंठात तुळशीचे हार, कस्तुरी-टिळा

भजनात विठू डोलतो
कीर्तनी विठू नाचतो
शून्य जाई भक्तांचा पाहूनी लळा`,
    saintId: "1",
    saintName: "संत तुकाराम",
    categoryId: "1",
    categoryName: "भक्ती",
    tags: ["विठ्ठल", "पंढरपूर"],
    featured: false,
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    title: "रूप पाहता लोचनीं",
    slug: "roop-pahata-lochani",
    content: `रूप पाहतां लोचनीं । सुख जालें वो साजणी ॥१॥

तो हा विठ्ठल बरवा । तो हा माधव बरवा ॥२॥

बहुतां सुकृतांची जोडी । म्हणुनि विठ्ठलीं आवडी ॥३॥

सर्व सुखाचे आगर । बाप रखुमादेवीवर ॥४॥`,
    saintId: "2",
    saintName: "संत ज्ञानेश्वर",
    categoryId: "1",
    categoryName: "भक्ती",
    tags: ["विठ्ठल", "भक्ती"],
    featured: true,
    createdAt: "2024-03-01",
  },
];

const placeholderAbhangs: Abhang[] = saints
  .filter((saint) => !abhangsSeed.some((abhang) => abhang.saintId === saint.id))
  .map((saint) => ({
    id: `placeholder-${saint.id}`,
    title: `${saint.name} यांचा अभंग`,
    slug: `placeholder-abhang-${saint.id}`,
    content: `भक्ती, श्रद्धा आणि नामस्मरणाचा भाव.

या अभंगात संतांनी जीवनातील सच्चाई आणि करुणा मांडली आहे.`,
    saintId: saint.id,
    saintName: saint.name,
    categoryId: "1",
    categoryName: "भक्ती",
    tags: ["placeholder"],
    featured: false,
    createdAt: "2026-03-25",
  }));

export const abhangs: Abhang[] = [...abhangsSeed, ...placeholderAbhangs];
