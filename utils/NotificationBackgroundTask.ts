// notificationBackgroundTasks.js
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import { handleRecurringReminderFired } from '@/utils/EnableNotification';

// --- Type Definitions ---
// Define the structure of the data expected in our recurring notifications
interface RecurringNotificationData {
  type: 'recurring' | null;
  name: string | null;
  subscriptionId: string | null;
  billingCycle: string | null;
  billingperiod: string | null;
  billingStartDate: string | null;
  [key: string]: any;
}

// Define the structure of the object passed to the TaskManager callback
interface TaskData {
  notification: Notifications.Notification;
}

// Define the task name used to register the task
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// --- This is the key fix: Define the task ONCE at the top level. ---
// This ensures the task is ready and available for registration when the app loads.
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }: { data: TaskData; error?: any }) => {

  console.log("Let Backgound Task shine")
  if (error) {
    console.error('Background notification task failed:', error);
    return;
  }
  
  const notification = data?.notification;
  if (!notification) {
    console.log('No notification data received.');
    return;
  }
  
  const notificationData: Partial<RecurringNotificationData> = notification.request.content.data;
  console.log("Notification Data: ", notificationData)
  const db: SQLite.SQLiteDatabase = SQLite.openDatabaseSync('subTrackers19.db');

  console.log("The Notification Background Task is working properly");
  
  let maxRetries = 3;
  for (let trys = 0; trys < maxRetries; trys++) { 
    if (
      notificationData?.type === 'recurring' &&
      notificationData?.subscriptionId &&
      notificationData?.billingCycle &&
      notificationData?.billingStartDate &&
      notificationData?.billingperiod &&
      notificationData?.name
    ) {
      try {
        const data: any = notification.request.content.data;
        const newNotifId = await handleRecurringReminderFired(data, db);
        
        console.log(`🔁 Rescheduled billing reminder for: ${notificationData.name} (Try: ${trys + 1})`);
        break;
      } catch (error) {
        console.error('Error in background notification task:', error);
        if (trys === maxRetries - 1) {
          console.error('Final attempt failed. Throwing error.');
          throw error;
        }
        const delay = Math.pow(2, trys) * 60000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } else {
      console.log('Received notification does not match recurring type criteria:', notificationData);
      break;
    }
  }
});


export async function registerBackgroundNotificationTask() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
  if (isRegistered) {
    console.log('Background task is already registered.');
    return;
  }

  try {
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log('✅ Background notification task registered successfully.');
  } catch (error) {
    console.error('Failed to register background task:', error);
  }
}



export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notification permissions not granted!');
    return false;
  }
  console.log('Notification permissions granted.');
  return true;
}

