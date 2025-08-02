// AppleSignIn.js
import React from 'react';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { auth } from '@/firebaseConfig.js'; // your initialized Firebase instance
import { OAuthProvider, signInWithCredential, fetchSignInMethodsForEmail} from 'firebase/auth';


export const handleAppleSignIn = async () => {
  try {
 

    // 1. Start Apple sign-in
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { identityToken, email } = appleCredential;

    if (!identityToken) {
      Alert.alert('Apple Sign-In failed: No identity token returned');
      return;
    }

    // 2. Create Firebase credential
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
    });


    // 3. Sign in with Firebase
    const userCredential = await signInWithCredential(auth, credential);
    console.log('Firebase user:', userCredential.user);

    // 4. Navigate to Gmail permission screen (your next screen)
    // navigation.navigate('GmailPermissionScreen');

  } catch (error: any) {
    console.error('Apple Sign-In error:', error);
    Alert.alert('Apple Sign-In failed', error.message || 'Unknown error');
  }
};

export default function AppleSignIn() {
 

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: '100%', height: 44 }}
      onPress={handleAppleSignIn}
    />
  );
}
