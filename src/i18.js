import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import kaTranslation from "./locales/ka.json";
const storedLanguage = localStorage.getItem("language");

i18n.use(initReactI18next).init({
  lng: storedLanguage || "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: enTranslation,
    },
    ka: {
      translation: kaTranslation,
    },
  },
});

export default i18n;
