import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebaseConfig.js';

const connectGmail = async () => {
    try {
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID',
        scopes: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly'],
      });
  
      await GoogleSignin.signIn(); // will ask for Gmail access
      const tokens = await GoogleSignin.getTokens();
  
      await fetch('https://your-backend.com/gmail-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: tokens.accessToken }),
      });
  
      console.log('Gmail connected');
    } catch (error) {
      console.error('Failed to connect Gmail:', error);
    }
  };
  
  