import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store'

// Import translation files
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import tr from './tr.json';

const LANGUAGES = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  it: {translation: it},
  tr: {translation: tr}
};

const LANG_CODES = Object.keys(LANGUAGES);

// Get device language using Expo Localization
export const getDeviceLanguage = () => {
  const locale = Localization.locale; // e.g., "en-US"
  const languageCode = locale.split('-')[0]; // Extract "en" from "en-US"
  
  // Check if we support this language
  return LANG_CODES.includes(languageCode) ? languageCode : 'en';
};





// Get additional locale info
export const getLocaleInfo = () => ({
  locale: Localization.locale,
  locales: Localization.locales,
  timezone: Localization.timezone,
  isRTL: Localization.isRTL,
  region: Localization.region,
});

// Get stored language preference
export const getStoredLanguage = async () => {
  try {
    const storedLang = await SecureStore.getItemAsync('user_language');
    return storedLang || getDeviceLanguage();
  } catch (error) {
    console.warn('Error loading stored language:', error);
    return getDeviceLanguage();
  }
};

// Initialize i18n
const initI18n = async () => {
  const language = await getStoredLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: LANGUAGES,
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

// Change language function
export const changeLanguage = async ({languageCode}) => {
  try {
    await SecureStore.setItemAsync('user_language', languageCode);
    i18n.changeLanguage(languageCode);
  } catch (error) {
    console.warn('Error saving language:', error);
  }
};

// Get available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: "italian"},
  { code: 'tr', name: 'Turkish'}
];

// Get device's preferred languages
export const getDeviceLanguages = () => {
  return Localization.locales.map(locale => ({
    languageCode: locale.languageCode,
    languageTag: locale.languageTag,
    regionCode: locale.regionCode,
  }));
};

initI18n();

export default i18n;
export { i18n };