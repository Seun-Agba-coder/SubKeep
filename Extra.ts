// import dayjs from "dayjs";
// import * as Notifications from 'expo-notifications';
// const scheduleRecurringNotifications = async ({subscriptionData }: any) => {
//     const notificationIds = [];

//     if (subscriptionData.freetrial === 'true') {
//         const notifId = await Notifications.scheduleNotificationAsync({
//             content: {
//               title: `Your subscription renews tomorrow - ${subscriptionData.name}`,
//               body: `Your subscription renews tomorrow - ${subscriptionData.symbol}${subscriptionData.price}`,
//               data: { 
//                 subscriptionId: subscriptionData.id,
//                 type: 'billing_reminder'
//               }
//             },
//             trigger: { type: 'date', date: dayjs(subscriptionData.freetrialendDate).subtract(1, 'day').toDate() }
//           });
          
//           notificationIds.push(notifId);
    
//     }
    
//     // Schedule next 12 notifications (1 year worth)
//     for (let i = 1; i <= 12; i++) {
//       const nextBillingDate = dayjs(subscriptionData.firstpayment)
//         .add(i * subscriptionData.billingperiodnumber, subscriptionData.billingperiodtime)
//         .subtract(1, 'day'); // Notify 1 day before billing
      
//       const notifId = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `Your subscription renews tomorrow - ${subscriptionData.name}`,
//           body: `Your subscription renews tomorrow - ${subscriptionData.symbol}${subscriptionData.price}`,
//           data: { 
//             subscriptionId: subscriptionData.id,
//             type: 'billing_reminder'
//           }
//         },
//         trigger: { date: nextBillingDate.toDate() }
//       });
      
//       notificationIds.push(notifId);
//     }
    
//     // Save notification IDs to database for later management
//     await saveNotificationIds(subscriptionData.id, notificationIds);
    
//     return notificationIds;
//   };



//   // In your main screen
// useFocusEffect(
//     useCallback(() => {
//       const refreshNotifications = async () => {
//         const subscriptions = await getActiveSubscriptions(db);
        
//         for (const sub of subscriptions) {
//           // Check if subscription needs fresh notifications
//           const scheduled = await Notifications.getAllScheduledNotificationsAsync();
//           const hasUpcomingNotifications = scheduled.some(notif => 
//             notif.content.data?.subscriptionId === sub.id
//           );
          
//           if (!hasUpcomingNotifications) {
//             // Cancel old notifications if any
//             if (sub.notificationIds) {
//               for (const id of sub.notificationIds) {
//                 await Notifications.cancelScheduledNotificationAsync(id);
//               }
//             }
            
//             // Schedule fresh notifications
//             await scheduleRecurringNotifications(sub);
//           }
//         }
//       };
      
//       refreshNotifications();
//     }, [])
//   );





//       // 5. SAVE NOTIFICATION IDs TO DATABASE
//       await updateSubscription(db, subscriptionId, {
//         notificationIds: JSON.stringify(notificationIds),
//         billingrecurringtime: billingRecurringTime
//       });