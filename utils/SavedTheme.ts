import * as SecureStore from 'expo-secure-store';

const THEME_STORAGE_KEY = '@app_theme_mode';

// Saves the theme mode (e.g., 'light' or 'dark') to secure storage.
const saveTheme = async (mode: string) => {
  try {
    // You can also add an option like `requireAuthentication: true` for extra security.
    await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
    console.log("Was able to Save Theme.")
  } catch (e) {
    console.error('Failed to save theme to storage:', e);
  }
};

// Loads the theme mode from secure storage.
const loadTheme = async () => {
  try {
    const savedMode = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
    console.log("From saved Mode : ", loadTheme)
    return savedMode;
  } catch (e) {
    
    return null;
  }
};

export {saveTheme, loadTheme}
