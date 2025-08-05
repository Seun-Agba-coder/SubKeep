import * as SecureStore from 'expo-secure-store';


// Saves the theme mode (e.g., 'light' or 'dark') to secure storage.
const saveTheme = async (mode: string) => {

  try {
    // You can also add an option like `requireAuthentication: true` for extra security.
    await SecureStore.setItemAsync('themeMode', mode);
    console.log("Was able to Save Theme.")
  } catch (e) {
    console.error('Failed to save theme to storage:', e);
  }
};

// Loads the theme mode from secure storage.
const loadTheme = async () => {
  try {
    const savedMode = await SecureStore.getItemAsync("themeMode");
    console.log("From saved Mode : ", loadTheme)
    return savedMode;
  } catch (e) {
    
    return null;
  }
};

export {saveTheme, loadTheme}
