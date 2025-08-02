import * as Notifications from 'expo-notifications';
import { Subscription } from 'react-redux';
import { calculateNextBilling } from './Billiigfunctions';
import dayjs from 'dayjs';




// The same unique task name you used to define the background task
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';


function getDateWithCurrentTime(targetDateStr: string) {
    const now = dayjs();
    const targetDate = dayjs(targetDateStr)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .millisecond(now.millisecond());
  
    return targetDate;
  }
  


export type NotificationResult = {
    trialNotificationId: string | null;
    billingNotificationId: string | null;
    notificationId: string | null;
};

/**
 * Cancels a scheduled notification by ID// Needed
 */
export async function cancelNotification(id?: string | null): Promise<void> {
    if (!id) return;
    
    try {
        await Notifications.cancelScheduledNotificationAsync(id);
        console.log('Notification has been cancelled')
    } catch (error) {
        console.warn('Failed to cancel notification:', error);
    }
}


/**
 * Schedules a notification 1 day before the given date // needed
 */
export async function scheduleReminder(
    triggerDate: Date,
    title: string, 
    body: string,
    name?: string,
    subId?: string,
    billingCycle?: string,
    billingperiod?: string ,
    billingStartDate?: string,
): Promise<string | null> {
    // Create reminder date (1 day before trigger)
   

   

    const notifyDate = getDateWithCurrentTime(triggerDate.toDateString());
    console.log("notifyDate: with the proper timing", notifyDate)
    const today = dayjs().startOf('day');
    console.log("today: ", today)

   if (notifyDate.isSameOrAfter(today, 'day')) {

    try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: {
              type: 'recurring',
              name: name,
              subscriptionId: subId,
              billingCycle: billingCycle,
              billingperiod: billingperiod, 
              billingStartDate: billingStartDate,
            },
            // --- THIS IS THE KEY FIX ---
            // We link this notification directly to our background task by name.
            categoryIdentifier: BACKGROUND_NOTIFICATION_TASK,
          },
          trigger: {
            type: 'date',
            date: dayjs().add(1, 'minute').toDate()
          } as Notifications.NotificationTriggerInput,
        });
    
        console.log("THE NOTIFICATION WILL SOUND ONE MINUTES FROM NOW LEAVE THE APP");
        return id;
      } catch (error) {
        console.warn('Failed to schedule notification:', error);
        return null;
      }
}else {
    console.log("null")
    return null
}
}


export async function scheduleTrialNotification(
    trialEndOn: string, 
    subname: string, 
): Promise<string | null> {
    if (!trialEndOn) return null;
   try{
    return await scheduleReminder(
        new Date(trialEndOn),
        '⏳ Free Trial Ending Soon',
        `Your ${subname} free trial ends tomorrow.`,
        subname

    );}catch (error) {
        console.error('Failed to schedule trial notification:', error);
        return null;
    }
}



  
  export async function deleteSubscription(sub: any, db: any) {
    await cancelNotification(sub.trialnotificationid);
    await cancelNotification(sub.billingnotificationid);
  
    await db.runAsync(`DELETE FROM userSubscription WHERE id = ?`, [sub.id]);

  }


  type BillingCycle = 'Month' | 'Year'| 'Week'

  export async function handleRecurringReminderFired(
    data: {
      name: string;
      subscriptionId: string;
      billingStartDate: string;
      billingCycle: BillingCycle;
      billingperiod: string
    }, db: any
  ) { 

    console.log("Hanlde Recurring Reminder Fired")
    const lastBilling = new Date(data.billingStartDate);
    console.log("lastBilling", lastBilling)
    const nextBilling = calculateNextBilling(lastBilling,  data.billingperiod, data.billingCycle);

    try { 
        const newId = await scheduleReminder(
       getDateWithCurrentTime(nextBilling).toDate(),
        `Your ${data.name}  will soon renew`,
        `Your ${data.name} will renew tomorrow, a reminder so u do not to forget`,
        data.name,
        data.subscriptionId,
        data.billingCycle,
        data.billingperiod,
        nextBilling,
    
  
    );
  
  
    await db.runAsync(
      `UPDATE userSubscriptions SET billingnotificationid= ?, billingrecurringtime = ? WHERE id = ?`,
      [newId, nextBilling, data.subscriptionId]
    );
    return newId

    } catch(error) {
        throw error
    }
 
   
  }
  
