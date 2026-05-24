import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { TranslatedTexts } from "@/utils";

const SUPPORTED_LANGS = ["pt", "en"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

function getSavedLang(): SupportedLang {
  const saved = localStorage.getItem("language");
  if (saved === "pt" || saved === "en") return saved;
  return "pt";
}

const resources = {
  en: {
    translation: TranslatedTexts.EnTexts,
  },
  pt: {
    translation: TranslatedTexts.PtTexts,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLang(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  if (SUPPORTED_LANGS.includes(lng as SupportedLang)) {
    localStorage.setItem("language", lng);
  }
});

export default i18n;
