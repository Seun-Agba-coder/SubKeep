import { useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native'; // Required for useFocusEffect
import { getActiveSubscription, updateNotification } from '@/utils/Crud';
import { shouldRefreshNotifications,scheduleRecurringNotificationsUpdate } from '../Extra';








export const useNotificationRefresh = (db: any) => {

  // The core logic runs every time the screen is focused.
  useFocusEffect(
    useCallback(() => {
      const refreshNotifications = async () => {
        try {
          console.log("Refreshing notification schedule...");
          const subscriptions = await getActiveSubscription(db);
          
          for (const sub of subscriptions) {
            // Check if subscription needs fresh notifications
            console.log("Billing Recurring List: ", JSON.parse(sub.billingrecurringlist))
          
            const needsRefresh = await shouldRefreshNotifications(JSON.parse(sub.billingrecurringlist));
            console.log("needRefresh: ", needsRefresh)
            
            if (!needsRefresh) {
              // Schedule fresh notifications for the subscription.
              continue
            }
            // if needsRefresh is true then 
            updateNotification(db,sub.id,sub)
          }
          
        } catch (error) {
          console.error("Error refreshing notifications:", error);
        }
      };
      
      // Call the function
      refreshNotifications();

      // This is the cleanup function for useFocusEffect.
      // It's a good practice to return a function that cleans up side effects.
      return () => {
        // Any cleanup logic goes here if needed.
      };
    }, [])
  );
};
