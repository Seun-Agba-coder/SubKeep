import { ref, set } from 'firebase/database';
import { db, firestore } from '@/firebaseConfig';
import * as SecureStore from 'expo-secure-store'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { isFirstDayOfMonth } from 'date-fns';

export const saveUserToWaitlist = async (userinfo: any) => {

  
  try {
    await set(ref(db, 'waitlistGmail/' + userinfo.uid), {
      uid: userinfo.uid,
      email: userinfo.email,
      displayName: userinfo.displayName || '',
      joinedAt: new Date().toISOString(),
      feature: 'gmail_tracking'
    });
    await SecureStore.setItemAsync("gmail_tracking", "true")
   
    return true
  } catch (error) {
     throw error
  }
};

export const submitFeedbackToFirestore = async (feedbackType: string, subject: string, message: string) => {

  try {
    await addDoc(collection(firestore, 'feedback'), {
      type: feedbackType,
      subject: subject,
      message: message,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
     throw error
  }
};



