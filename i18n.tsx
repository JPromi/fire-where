import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from '@/locales/de.json';
import en from '@/locales/en.json';
import hr from '@/locales/hr.json';

i18n.use(initReactI18next).init({
  lng: 'de',
  fallbackLng: 'de',
  resources: {
    de: { translation: de },
    en: { translation: en },
    hr: { translation: hr },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
