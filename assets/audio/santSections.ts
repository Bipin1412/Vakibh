import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Feather,
  Flame,
  Library,
  Music,
  ScrollText,
} from "lucide-react";
import {
  dynamicCategoryLabels,
  dynamicTabs,
  getDynamicSantBySlug,
  type SaintDynamicData,
  type SaintDynamicItem,
} from "@/data/saintDynamicContent";
import {
  dnyaneshwarAbhangCards,
  dnyaneshwarSubPageContent,
} from "@/data/dnyaneshwarJsonSource";

export type SantSectionItem = SaintDynamicItem;

export type SantSectionCategory = {
  label: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  items: SantSectionItem[];
  redirectTo?: string;
};

const makeItem = (id: string, title: string, content: string): SantSectionItem => ({
  id,
  title,
  content,
});

const aartiItems = (sant: SaintDynamicData): SantSectionItem[] => [
  makeItem(
    `${sant.slug}-aarti-1`,
    `${sant.name} आरती`,
    `${sant.name} यांच्या स्मरणातून भक्तिभाव, नम्रता आणि अंतःकरणातील शांती जागृत होते.`
  ),
  makeItem(
    `${sant.slug}-prarthana-1`,
    `${sant.name} प्रार्थना`,
    "सद्भाव, सेवा, नामस्मरण आणि लोककल्याणाची भावना वाढवणारी प्रार्थना."
  ),
];

const jsonCardItems = (cards: typeof dnyaneshwarAbhangCards): SantSectionItem[] =>
  cards.map((card, index) =>
    makeItem(`dnyaneshwar-json-${index + 1}`, card.label, card.excerpt || card.label)
  );

const commonCategories = (sant: SaintDynamicData): SantSectionCategory[] => [
  {
    label: `${sant.name} यांचे साहित्य`,
    slug: "sahitya",
    description: "या संतांचे निवडक साहित्य, वाङ्मय आणि भक्तिमय लेखन.",
    icon: Library,
    items: [
      ...sant.abhang.slice(0, 4),
      ...sant.ovi.slice(0, 2),
      ...sant.gaatha.slice(0, 2),
    ],
  },
  {
    label: dynamicCategoryLabels.abhang,
    slug: "abhang",
    description: "अभंग, हरिपाठ आणि नामस्मरणासाठी निवडक रचना.",
    icon: Feather,
    items: sant.abhang,
  },
  {
    label: dynamicCategoryLabels.ovi,
    slug: "ovi",
    description: "ओवीरचना आणि चिंतनासाठी साधे, अर्थपूर्ण लेखन.",
    icon: ScrollText,
    items: sant.ovi,
  },
];

const specialCategories = (sant: SaintDynamicData): SantSectionCategory[] => {
  if (sant.slug === "dnyaneshwar") {
    return [
      {
        label: "सार्थ ज्ञानेश्वरी",
        slug: "sarth-dnyaneshwari",
        description: "ज्ञानेश्वरीचे सर्व अध्याय आणि अर्थपूर्ण वाचन.",
        icon: BookOpen,
        items: [],
        redirectTo: "/granth/dnyaneshwari",
      },
      {
        label: "अभंग / ओवी / हरिपाठ",
        slug: "abhang-ovi-haripath",
        description: "माऊलींचे अभंग, ओवी आणि हरिपाठ भाव.",
        icon: Music,
        items: jsonCardItems(dnyaneshwarAbhangCards),
      },
      {
        label: "आरती / पसायदान",
        slug: "pasaydan",
        description: "पसायदान, आरती आणि विश्वकल्याणाची प्रार्थना.",
        icon: Flame,
        items: [
          makeItem(
            "dnyaneshwar-pasaydan",
            "पसायदान",
            dnyaneshwarSubPageContent.pasaydan?.content?.paragraphs?.[0] ??
              "आता विश्वात्मकें देवें, येणें वाग्यज्ञें तोषावें."
          ),
          makeItem(
            "dnyaneshwar-aarti",
            "ज्ञानेश्वरांची आरती",
            dnyaneshwarSubPageContent.aarti?.content?.paragraphs?.[0] ??
              "ज्ञानेश्वरांची आरती ऑडिओ आणि विडिओ सहित."
          ),
        ],
      },
    ];
  }

  if (sant.slug === "tukaram") {
    return [
      {
        label: "तुकाराम गाथा",
        slug: "gatha",
        description: "तुकाराम महाराजांच्या गाथेतील निवडक विभाग.",
        icon: BookOpen,
        items: sant.gaatha,
        redirectTo: "/granth/tukaram-gatha",
      },
    ];
  }

  if (sant.slug === "namdev") {
    return [
      {
        label: "नामदेव गाथा",
        slug: "gatha",
        description: "नामदेव महाराजांच्या गाथेतील निवडक विभाग.",
        icon: BookOpen,
        items: sant.gaatha,
        redirectTo: "/granth/namdev-gatha",
      },
    ];
  }

  return [];
};

export const getSantSectionCategories = (slug: string): SantSectionCategory[] => {
  const sant = getDynamicSantBySlug(slug);
  if (!sant) return [];

  const categories = [...commonCategories(sant), ...specialCategories(sant)];
  const seen = new Set<string>();
  return categories.filter((category) => {
    if (seen.has(category.slug)) return false;
    seen.add(category.slug);
    return category.items.length > 0 || Boolean(category.redirectTo);
  });
};

export const getSantSectionCategory = (santSlug: string, categorySlug: string) =>
  getSantSectionCategories(santSlug).find((category) => category.slug === categorySlug) ??
  (() => {
    const sant = getDynamicSantBySlug(santSlug);
    const legacyTab = dynamicTabs.find((tab) => tab === categorySlug);
    if (!sant || !legacyTab) return undefined;

    return {
      label: dynamicCategoryLabels[legacyTab],
      slug: legacyTab,
      description: `${sant.name} यांचे ${dynamicCategoryLabels[legacyTab]}.`,
      icon: ScrollText,
      items:
        legacyTab === "vaar_abhang"
          ? Object.values(sant.vaar_abhang).flat()
          : sant[legacyTab],
    } satisfies SantSectionCategory;
  })();
