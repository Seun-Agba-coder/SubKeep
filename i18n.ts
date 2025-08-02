import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// import en from './locales/en.json';
// import fr from './locales/fr.json';

// Explicitly type the resources object
// const resources: Resource = {
//   en: { translation: en },
//   fr: { translation: fr },
// };

i18n
  .use(initReactI18next)
  .init({
    // resources,
    lng: Localization.locale.split('-')[0], // e.g., 'en', 'fr'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;