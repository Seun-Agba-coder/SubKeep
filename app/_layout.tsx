import { store } from '@/redux/store';
// import * as NavigationBar from 'expo-navigation-bar'; // use during development
import { useAppDispatch } from '@/redux/hooks';
import { setMode } from '@/redux/AppSlice';
import { Provider as PaperProvider } from 'react-native-paper';
// App.js
import * as Notifications from 'expo-notifications';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { Slot } from 'expo-router';
import { Platform } from 'react-native';
import { useEffect, useState, useRef} from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import '../src/locales/index';
import { registerBackgroundNotificationTask, requestNotificationPermissions} from '@/utils/NotificationBackgroundTask'; 
import { handleRecurringReminderFired } from '@/utils/EnableNotification';
import { loadTheme } from '@/utils/SavedTheme';




registerBackgroundNotificationTask();


interface SubscriptionData {
  name: string;
  subscriptionId: string;
  billingStartDate: string;
  billingCycle: string;
  billingperiod: string;
}




Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});




// create database for user
const createDbIfNeeded = async (db: any) => {
  try {
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE IF NOT EXISTS userSubscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          platformname TEXT NOT NULL,
          iconurl TEXT NOT NULL,
          currency TEXT DEFAULT 'USD',
          symbol  TEXT DEFAULT '$',
          currencyname TEXT DEFAULT 'United States Dollar',
          firstpayment TEXT NOT NULL,
          billingrecurringlist TEXT ,
          price TEXT NOT NULL,
          category TEXT NOT NULL, 
          paymentmethod TEXT, 
          note TEXT,
          description TEXT, 
          billingtype TEXT NOT NULL,
          billingperiodnumber TEXT,
          billingperiodtime TEXT,
          reminderenabled TEXT DEFAULT false,
          isactive TEXT DEFAULT false,
          freetrial TEXT DEFAULT false,
          freetrialduration TEXT, 
          freetrialendday TEXT,
          isdeleted INTEGER DEFAULT 0,
          canceldate TEXT,
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now'))
        );

    CREATE TABLE IF NOT EXISTS pauseHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriptionId INTEGER NOT NULL,
    pausedAt TEXT NOT NULL,
    resumedAt TEXT,
    FOREIGN KEY(subscriptionId) REFERENCES userSubscriptions(id) ON DELETE CASCADE
  );
    `);
  } catch (error) {
    console.log(error)
    return;
  }
}


export default function RootLayout() {


  function SlotContainer() {

    const dispatch = useAppDispatch()
    const db: any = useSQLiteContext();
    const notificationListener = useRef<any>('');
   
    
  
  
    useEffect(() => {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  
      if (Platform.OS === 'ios') {
         return;
      } else if (Platform.OS === 'android') {
         Purchases.configure({apiKey: 'goog_rVQVenVofsJXeCoXjfjwYEGUHCp'});
  
  
      }
  
    }, []);
  
  
    // async function getCustomerInfo() {
    //   const customerInfo = await Purchases.getCustomerInfo();
    //   console.log(JSON.stringify(customerInfo), null, 2)
  
    // }

  
    useEffect(() => {
      const initializeTheme = async () => {
        try {
          const savedMode = await loadTheme();
          console.log("SAVED MODE: ", savedMode);
          // Use saved theme if available, otherwise default to 'light'
          dispatch(setMode({ 
            mode: (savedMode as 'light' | 'dark' | null) || 'light' 
          }));
        } catch (error) {
         
          dispatch(setMode({ mode: 'light' }));
        }
      };
      initializeTheme();
    }, [dispatch]);




    return (


      <>
     
      <Slot/>
    
      </>
    )
    
  }




  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
            <StatusBar 
              style={'dark'} 
        backgroundColor='#ffffff'/>
            <SQLiteProvider databaseName="subTrackers41.db" onInit={createDbIfNeeded}>
              <SlotContainer/>
            </SQLiteProvider>
            
            </SafeAreaView> 
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
  );
}

  
