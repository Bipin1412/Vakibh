import alandiBg from "@/assets/alandi.webp";
import pandharpurBg from "@/assets/pandharpur.webp";
import vaariBg from "@/assets/vaari.webp";

export type HomeBanner = {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaTo: string;
  image: string;
};

export const homeBanners: HomeBanner[] = [
  {
    id: "banner-1",
    title: "संत साहित्याचा",
    highlight: "अनमोल ठेवा",
    subtitle: "महाराष्ट्रातील संतांच्या अभंगांचा डिजिटल संग्रह",
    ctaLabel: "सर्व अभंग पहा",
    ctaTo: "/abhangs",
    image: pandharpurBg,
  },
  {
    id: "banner-2",
    title: "भक्ती आणि भावार्थ",
    highlight: "वर्तमान संग्रह",
    subtitle: "उत्तम अभंग, संत परंपरा आणि विभागांचे सुविचारित संकलन",
    ctaLabel: "विभाग पहा",
    ctaTo: "/categories",
    image: alandiBg,
  },
  {
    id: "banner-3",
    title: "नवीन अभंग",
    highlight: "दररोज नव्या ओवी",
    subtitle: "नवीन अभंग, संत परिचय आणि अभंगवाणीचे नवे स्वर",
    ctaLabel: "नवीन अभंग",
    ctaTo: "/abhangs",
    image: vaariBg,
  },
];
