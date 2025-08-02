import { auth } from '@/firebaseConfig.js';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store'




async function saveUserName (name: string) {
  try {
    await SecureStore.setItemAsync('userName', name);
  } catch (error) {
    console.log(error)
  }
}

// Configure once at app startup (e.g., in App.js or auth service)
GoogleSignin.configure({
  webClientId: '1026944721971-mc9mhvfuvijgmc2j1oa1tt14vqt7jsn1.apps.googleusercontent.com',
  offlineAccess: false, 
  scopes: ['profile', 'email'],
});

const signInWithGoogleAndFirebase = async (): Promise<any> => {
  console.log("Trying to sign in ")
  try {
    
   
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // 2. Sign in with Google
    // Remove signOut() unless you specifically need to clear sessions
    const result: any = await GoogleSignin.signIn();
    console.log('Google sign-in result:', result);

    if (result) {
      saveUserName(result.data.user.givenName)
    }

    
    const idToken = result.data.idToken;



    // 4. Create Firebase credential
    const credential = GoogleAuthProvider.credential(idToken);

    // 5. Sign in to Firebase
    const userCredential = await signInWithCredential(auth, credential);

    console.log('Firebase user:', userCredential.user);
    return userCredential;

  } catch (error: any) {
    // console.error('Google sign-in error:', error);

    // // Handle specific errors
    // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //   console.log('User cancelled login');
    // } else if (error.code === statusCodes.IN_PROGRESS) {
    //   console.log('Sign-in operation already in progress');
    // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //   console.log('Play services not available');
    // } else {
    //   console.log('Other sign-in error:', error.message);

    // }
    throw error

  }
};

export default signInWithGoogleAndFirebase;


