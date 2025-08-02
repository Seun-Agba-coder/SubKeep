import * as SecurStore from 'expo-secure-store';
import { calculateNextBilling } from "./Billiigfunctions";
import { cancelNotification, scheduleReminder, scheduleTrialNotification } from "./EnableNotification";
import dayjs from 'dayjs';
import saveImageToDevice from './imagesaver';

interface Prop {
  platformname: string;
  firstpayment: string;
  currency?: string;
  reminderenabled?: string; // "true" or "false" as TEXT
  iconurl?: string;
  note?: string;
  description?: string;
  billingtype: string;
  price: string;
  freetrialduration: string;
  freetrial?: string; // "true" or "false" as TEXT
  paymentmethod?: string,
  billingperiodnumber?: string;
  billingperiodtime?: string;
  category?: string;
  freetrialendday?: string;


}

interface PropUpdate {
  db: any,
  freetrialEnabled: boolean;
  reminderEnabled: boolean;
  platformname: string;
  billingperiodtime: string;
  billingperiodnumber: string;
  firstpayment: string;
  freetrialduration: string;
  freetrialendday: string



}



const updateandschedulefreetrialandenabledNot = async (data: PropUpdate, subscriptionId: string) => {
  const {
    db,
    freetrialEnabled,
    reminderEnabled,
    platformname,
    billingperiodtime,
    billingperiodnumber,
    firstpayment,
    freetrialendday,
    freetrialduration
  } = data;

  let freeid: any = 'null';
  let notificationId: any = 'null';

  // 📆 Schedule Free Trial Notification
  if (freetrialEnabled.toString() === 'true') {
    try {
      freeid = await scheduleTrialNotification(freetrialendday, platformname);
     
      console.log('freetrialnotificationid', freeid);
    } catch (error) {
      console.error('Error scheduling trial notification:', error);
    }
  }

  // 📆 Schedule Recurring Billing Reminder Notification
  if (reminderEnabled.toString() === 'true') {
    try {
      let firstpaymentDate = dayjs(firstpayment);

      // If free trial exists, push first payment forward
      if (freetrialEnabled.toString() === 'true') {
        const days = parseInt(freetrialduration);
        console.log("This is in the freetrial enabled section the free trail durationd date: ", days)
        firstpaymentDate = firstpaymentDate.add(days, 'day');
      }

      const billingDate = calculateNextBilling(
        firstpaymentDate.toDate(),
        billingperiodnumber,
        billingperiodtime
      );

      notificationId = await scheduleReminder(
        dayjs(billingDate).toDate(),
        `Your ${platformname} will soon renew`,
        `Your ${platformname} will renew tomorrow, a reminder so you do not forget`,
        platformname,
        subscriptionId,
        billingperiodtime,
        billingperiodnumber,
        freetrialEnabled.toString() === 'true'? firstpaymentDate.toISOString() :  firstpayment
      );


      if (!notificationId) {
        throw new Error('Notification Id not generated ');
        return 
      }

      console.log('notificationId', notificationId)
    } catch (error: any) {
      throw new Error('Error scheduling reminder: ' + error.message);
    }
  }

  // 💾 Update SQLite with Notification IDs
  try {
    await db.runAsync(
      `UPDATE userSubscriptions
       SET trialNotificationid = ?, billingNotificationid = ?
       WHERE id = ?`,
      [freeid, notificationId, subscriptionId]
    );
    console.log(`✅ Updated notification IDs for subscription ${subscriptionId}`);
  } catch (err) {
    console.error(`❌ Failed to update notification IDs:`, err);
  }
};

const saveSubcriptionLocally = async (db: any, data: Prop, trialend: string) => {
  try {
    const defaultCurrency: string | null = await SecurStore.getItemAsync("defaultCurrency")
    const defaultCurrencyJson = defaultCurrency ? JSON.parse(defaultCurrency) : null

    const { code, symbol, name: currencyname } = defaultCurrencyJson

    const {
      platformname,
      currency = code ?? 'USD',
      reminderenabled = false,
      price,
      iconurl = 'null',
      note = 'null',
      description = 'null',
      billingtype,
      firstpayment,
      freetrial = false,
      freetrialduration = "null",
      paymentmethod = "null",
      billingperiodnumber = "null",
      billingperiodtime = "null",
      category,
      freetrialendday = "null"
    } = data;

    const icondeviceurl = await saveImageToDevice(iconurl, platformname)

    const freetrialEnabled = freetrial
    const reminderEnabled = reminderenabled

    const result = await db.runAsync(`
    INSERT INTO userSubscriptions (
      platformname, currency, reminderenabled, iconurl, note, category,
      description, billingtype, firstpayment, freetrial, price, freetrialduration, paymentmethod, billingperiodnumber, billingperiodtime, symbol, currencyname, freetrialendday
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [platformname, currency, reminderenabled.toString(), icondeviceurl , note, category, description, billingtype, firstpayment, freetrial.toString(), price, freetrialduration, paymentmethod, billingperiodnumber, billingperiodtime, symbol, currencyname, freetrialendday]
    );
    console.log("result", result)
    const subscriptionId = result.lastInsertRowId;

    const dataPassed = {
      db,
      platformname,
      billingperiodtime,
      billingperiodnumber,
      firstpayment,
      freetrialendday,
      freetrialduration,
      freetrialEnabled: Boolean(freetrialEnabled),
      reminderEnabled: Boolean(reminderEnabled)
    }
    // console.log("dataPassed", dataPassed)

    updateandschedulefreetrialandenabledNot(dataPassed, subscriptionId)
  } catch (error) {
    console.log("Error: ", error)
  }


};

// console.error('Error scheduling reminder:', error)






const updateUserSubscription = async (db: any, id: string, updatedData: Partial<Record<string, any>>) => {



 

 

  try {
    const fields = Object.keys(updatedData);
    const values = Object.values(updatedData);

    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(String(id)); // for the WHERE clause

    await db.runAsync(
      `UPDATE userSubscriptions SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`,
      [...values, id]
    );
    updateNotificationIds(db, id, updatedData);
    const dataPassed = {
      db,
      platformname: updatedData.platformname,
      billingperiodtime: updatedData.billingperiodtime,
      billingperiodnumber: updatedData.billingperiodnumber,
      firstpayment: updatedData.firstpayment,
      freetrialendday: updatedData.trialend,
      freetrialduration: updatedData.freetrialduration,
      freetrialEnabled: Boolean(updatedData.freetrial),
      reminderEnabled: Boolean(updatedData.reminderenabled)
    }
    updateandschedulefreetrialandenabledNot(dataPassed, id)


  } catch (error) {
    console.error(`❌ Error updating subscription:`, error);

  }


};

const updateNotificationIds = async (db: any, id: string, updatedData: Partial<Record<string, any>>) => {

  // helps cancel notifcation  so that I can update them back in the updateUserSubscription function.
  const sub = await db.getAllAsync(
    `SELECT * FROM userSubscriptions WHERE id = ?`,
    [id]
  );

  const trialNotificationId = sub.trialnotificationid;
  const billingNotificationId = sub.billingnotificationid;

  if (!!trialNotificationId) {
    await cancelNotification(trialNotificationId);
  }

  if (!!billingNotificationId) {
    await cancelNotification(billingNotificationId);
  }


};



const getSubscriptions = async (db: any): Promise<any[]> => {
  /// function to get all the subscriptions available in the database.
  try {
    const results = await db.getAllAsync(`SELECT * FROM userSubscriptions ORDER BY createdAt DESC`);
    console.log("results", results)
    return results;
  } catch (error) {
    console.error('Error fetching user addictions:', error);
    return [];
  }
};


// const setInactive = async (db: any, id: string) => {
//   await db.runAsync(`UPDATE userSubscriptions SET isactive = ?, canceldate = datetime('now') WHERE id = ?`, [1, id]);
// }

const setInactive = async (db: any, id: string, data: any) => {

  console.log("Id: ", id)
  const { trialnotificationid, billingnotificationid } = data

  try {
    if (!!trialnotificationid) {
      await cancelNotification(trialnotificationid);
      console.log("done")
    }

    if (!!billingnotificationid) {
      await cancelNotification(billingnotificationid);
      console.log("done")
    }

  const now = new Date().toISOString();

  // 1. Mark subscription as inactive
  await db.runAsync(
    `UPDATE userSubscriptions 
     SET isactive = ?, canceldate = ?, trialnotificationid = NULL, notificationid = NULL
     WHERE id = ?`,
    [1, now, id]
  );

  // 2. Insert new pause record
  await db.runAsync(
    `INSERT INTO pauseHistory (subscriptionId, pausedAt) 
     VALUES (?, ?)`,
    [id, now]
  );
  console.log("Already set as  inactive")
  } catch (error) {
    console.error('Error setting subscription to inactive:', error);
  }
};




// const setActive = async (db: any, id: string) => {
//   await db.runAsync(`UPDATE userSubscriptions SET isactive = ? WHERE id = ?`, [0, id]);
// }

const setActive = async (db: any, id: string, data: PropUpdate, activate: boolean) => {

  const {firstpayment, ...ActiveData} = data

  console.log("From the setActive function: ", ActiveData)
  try {
  
    const now = new Date().toISOString();

    // 1. Set subscription to active
    await db.runAsync(
      `UPDATE userSubscriptions 
      SET isactive = ? 
      WHERE id = ?`,
      [0, id]
    );

    // 2. Update the most recent pause record where resumedAt is still NULL
    await db.runAsync(
      `UPDATE pauseHistory 
      SET resumedAt = ? 
      WHERE subscriptionId = ? 
      AND resumedAt IS NULL 
      ORDER BY pausedAt DESC 
      LIMIT 1`,
      [firstpayment, id]
    );

    updateUserSubscription(db, id, ActiveData)

  } catch (error) {
    console.error('Error setting subscription to active:', error);
  }
};




const getActiveAndInactiveSubscription = async (db: any) => {
  /// get both the Active and Inactive Subscription inorder to show it on the calender
  try {
    const results = await db.getAllAsync(
      `SELECT * FROM userSubscriptions WHERE isdeleted = ?`,
      [0]  // Changed from "false" to "true" since we want active subscriptions
    );
    console.log("Results: ", results)
    return results;
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return [];
  }
}

const getActiveSubscription = async (db: any) => {
  try {
    const results = await db.getAllAsync(`
    SELECT us.*, ph.pausedAt AS latestPausedAt, ph.resumedAt AS latestResumedAt
    FROM userSubscriptions us
    LEFT JOIN (
      SELECT *
      FROM pauseHistory
      WHERE id IN (
        SELECT MAX(id)
        FROM pauseHistory
        GROUP BY subscriptionId
      )
    ) ph ON us.id = ph.subscriptionId
    WHERE us.isactive = ? AND us.isdeleted = ?
  `, [0, 0]);

  return results;
} catch (error) {
  console.error('Error fetching user addictions:', error);
  return [];
}
};



// const getInactiveSubscription = async (db: any) => {
//   try {
//     const results = await db.getAllAsync(
//       `SELECT * FROM userSubscriptions WHERE isactive = ? and isdeleted = ?`,
//       [1, 0]
//     );
//     return results;
//   } catch (error) {
//     console.error('Error fetching user addictions:', error);
//     return [];
//   }
// }

const getInactiveSubscription = async (db: any) => {
  try {
    const results = await db.getAllAsync(`
    SELECT us.*, ph.pausedAt AS latestPausedAt, ph.resumedAt AS latestResumedAt
    FROM userSubscriptions us
    LEFT JOIN (
      SELECT *
      FROM pauseHistory
      WHERE id IN (
        SELECT MAX(id)
        FROM pauseHistory
        GROUP BY subscriptionId
      )
    ) ph ON us.id = ph.subscriptionId
    WHERE us.isactive = ? AND us.isdeleted = ?
  `, [1, 0]);




  return results;
} catch (error) {
  console.error('Error fetching user addictions:', error);
  return [];
}
};



const getMonthlyTotal = async (db: any, year: number, month: number) => {
  // Format: YYYY-MM
  const monthStr = month.toString().padStart(2, '0');
  console.log("MOthly Str", monthStr)
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`; // SQLite date is inclusive

  const results = await db.getAllAsync(
    `
          SELECT price 
          FROM userSubscriptions
          WHERE firstpayment BETWEEN ? AND ?  AND isactive = ? AND isdeleted = ?
        `,
    [startDate, endDate, 0, 0]
  );

  const total = results.reduce((sum: number, sub: any) => sum + sub.price, 0);
  return total;

}


const getMonthlyFreeTrialCount = async (db: any, year: number, month: number): Promise<number> => {
  const allTrials = await db.getAllAsync(`
    SELECT * FROM userSubscriptions 
    WHERE freetrial = 'true' AND isactive = ? AND isdeleted = ?`,
    [0, 0]
  );

  const filtered = allTrials.filter((trial: any) => {
    const endDate = new Date(trial.freetrialendday);
    return endDate.getFullYear() === year && endDate.getMonth() === month - 1; // getMonth is 0-based
  });

  return filtered.length;
};




const deleteSubscription = async (db: any, id: number, item: any) => {
  console.log('id', id)
  const { trialnotificationid, billingnotificationid } = item
  try {
    if (!!trialnotificationid) {
      await cancelNotification(trialnotificationid);
    }

    if (!!billingnotificationid) {
      await cancelNotification(billingnotificationid);
    }

    await db.runAsync(`UPDATE userSubscriptions SET isdeleted = 1, canceldate = datetime('now')  WHERE id = ?`, [id]);
    console.log(`✅ Deleted subscription with id: ${id}`);
  } catch (error) {
    console.error(`❌ Error deleting subscription:`, error);
  }
};





const getCategorySummary = async (db: any) => {
  try {
    const rows = await db.getAllAsync(
      `SELECT category, SUM(price) as total
       FROM userSubscriptions
       WHERE isactive =  ? AND isdeleted = ?
       GROUP BY category`,
       [0, 0]
    );

    const categories = rows.map((row: any) => ({
      name: row.category || 'Uncategorized',
      amount: parseFloat(row.total),
      color: getColorByCategory(row.category),
    }));
    
    return categories;
  } catch (error) {
    console.error('Error getting category summary:', error);
    return [];
  }
};




// You can customize colors by category here
const getColorByCategory = (category: string) => {
  const colorMap: { [key: string]: string } = {
    'Entertainment & Streaming': '#fbbc04',
    'Productivity & Tools': '#4285f4',
    'Shopping & Delivery': '#34a853',
    'Internet & Cloud': '#ff6d01',
    'Health & Wellness': '#9e9e9e',
    'Business & Marketing': '#9e9e9d',
    'Gaming & Virtual Goods': '#9e9e9d',
    'Privacy & Security': '#9e9e9g',
    'AI & Developer Tools': '#9e9e9c',
    'Other': '#9e9e2a',
  };

  return colorMap[category] || '#cccccc';
};


async function getSubscriptionsByPriceDesc(db: any) {
  try {
    const rows = await db.getAllAsync(
      `SELECT *
       FROM userSubscriptions
       WHERE isactive = ? AND isdeleted = ?
       ORDER BY price DESC`,
       [0, 0]
    );

  
    return rows;
  } catch(error) {
    return []
  }

}

async function getSubscriptionsByPriceAsc(db: any) {
  try {
    const rows = await db.getAllAsync(
      `SELECT *
       FROM userSubscriptions
       WHERE isactive = ? AND isdeleted = ?
       ORDER BY price ASC`,
       [0, 0]
    );
    return rows;

  } catch(error) {
    return []
  }
 
}

async function getSubscriptionsAlphabetically(db: any) {
  try {
    const rows = await db.getAllAsync(
      `SELECT *
       FROM userSubscriptions
       WHERE isactive = ? AND isdeleted = ?
       ORDER BY platformname COLLATE NOCASE ASC`,
       [0, 0]
    );
    return rows;

  } catch(error) {
    return []
  }

}




export {
  deleteSubscription,
   getActiveAndInactiveSubscription,
    getCategorySummary,
     getInactiveSubscription,getActiveSubscription, 
      getMonthlyFreeTrialCount, 
      getMonthlyTotal, 
      getSubscriptions,
       saveSubcriptionLocally,
        setActive,
         setInactive,
          updateUserSubscription, 
          getSubscriptionsByPriceDesc,
           getSubscriptionsByPriceAsc,
            getSubscriptionsAlphabetically
};


