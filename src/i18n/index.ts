import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ko from './locales/ko';
import en from './locales/en';
import vi from './locales/vi';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ko',
    fallbackLng: 'ko',
    debug: false,
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      vi: { translation: vi },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;