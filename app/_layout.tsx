import { store } from '@/redux/store';
// import * as NavigationBar from 'expo-navigation-bar'; // use during development
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMode } from '@/redux/AppSlice';
import { Provider as PaperProvider } from 'react-native-paper';
// App.js
import * as Notifications from 'expo-notifications';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider} from 'react-redux';
import { Slot } from 'expo-router';
import { Platform, View } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import '../src/locales/index';
import { loadTheme } from '@/utils/SavedTheme';
import * as SplashScreen from 'expo-splash-screen';
import { getActiveSubscription, updateNotification } from '@/utils/Crud';
import dayjs from 'dayjs';
import { scheduleRecurringNotificationsUpdate } from '@/Extra';
import FlashMessage from "react-native-flash-message";

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

SplashScreen.preventAutoHideAsync();

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

function SlotContainer() {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const db: any = useSQLiteContext();
  const mode = useAppSelector(( selector) => selector.appmode.mode)

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
       return;
    } else if (Platform.OS === 'android') {
       Purchases.configure({apiKey: 'goog_rVQVenVofsJXeCoXjfjwYEGUHCp'});
    }
  }, []);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedMode = await loadTheme();
        console.log("SAVED MODE: ", savedMode);
        dispatch(setMode({ 
          mode: (savedMode as 'light' | 'dark' | null) || 'light' 
        }));
      } catch (error) {
        dispatch(setMode({ mode: 'light' }));
      }
    };
    initializeTheme();
  }, [dispatch]);

  useEffect(() => {
    async function prepare() {
      try {
        const activeSub = await getActiveSubscription(db)
        if (activeSub.length === 0) {
          return;
        }
        for (const sub of activeSub) {
          const billingrecurringlist = JSON.parse(sub.billingrecurringlist)
          if (!billingrecurringlist) continue;
          const listLastItem = billingrecurringlist[billingrecurringlist.length -1]
          if (dayjs().isAfter(dayjs(listLastItem.expirydate))) {
           const newScheduledNotifications =  await scheduleRecurringNotificationsUpdate(sub, listLastItem)
           await updateNotification(db, sub.id, newScheduledNotifications)
          }

        }
      
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback( async () => {
    if (appIsReady) {
      // Hide the splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Keep showing the splash screen
  }

  return (
    <View style={{ flex: 1, backgroundColor: mode === 'light' ? '#fff' : '#000' }} onLayout={onLayoutRootView}>
      <StatusBar 
              style={mode === 'light' ? 'dark' : 'light'} 
             />
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
            <FlashMessage position="bottom" />
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