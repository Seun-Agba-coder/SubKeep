import { useSQLiteContext } from 'expo-sqlite';
import {
  parseISO,
  addMonths,
  addWeeks,
  addYears,
  isSameMonth,
  isSameYear,
} from 'date-fns';
import { connectFirestoreEmulator } from 'firebase/firestore';

type BillingPeriod = 'Month' | 'Year' | 'Week';

interface UserSubscription {
  id: number;
  name: string;
  price: number;
  firstpayment: string; // ISO string
  billingperiodtime: BillingPeriod;
  billingperiodnumber: number; // e.g. 2 = every 2 months
}

export default function useMonthlyBillTotal(db: any) {
 

  const getMonthlyTotal = async (
    targetYear: number,
    targetMonth: number
  ): Promise<string> => {

    console.log("Target Year", targetYear)
    console.log("Target Month", targetMonth)
    try {
      const subscriptions = await db.getAllAsync(
        `SELECT * FROM userSubscriptions WHERE isactive = ? AND isdeleted = ?`,
        [0, 0]
      );

      if (subscriptions.length  === 0) {
        return "0"
      }
     

      let total: number = 0;

      for (const sub of subscriptions) {
        const {
          firstpayment,
          billingperiodtime,
          billingperiodnumber,
          price,
        }: any= sub;

      

        if (!firstpayment || !price || !billingperiodtime) continue;

        let nextDate = new Date(firstpayment);
     
        const targetDate = new Date(targetYear, targetMonth - 1);
        
     

        const interval = Math.max(parseInt(billingperiodnumber), 1); // fallback to 1 if missing or invalid
        console.log("interval ::", interval)

        if (billingperiodtime === 'One Time') {
          if (
            isSameMonth(nextDate, targetDate) &&
            isSameYear(nextDate, targetDate)
          ) {
            total += Number(price);
          }
          continue;
        }

        while (nextDate <= new Date(targetYear, targetMonth - 1, 31)) {
          if (
            isSameMonth(nextDate, targetDate) &&
            isSameYear(nextDate, targetDate)
          ) {
            console.log("yes")
            
            total += Number(price);
            break; // only count once per month
          }

          switch (billingperiodtime) {
            case 'Month':
              nextDate = addMonths(nextDate, interval);
              break;
            case 'Year':
              nextDate = addYears(nextDate, interval);
              break;
            case 'Week':
              nextDate = addWeeks(nextDate, interval);
              break;
            default:
              nextDate = addMonths(nextDate, 1); // fallback
              break;
          }
        }
      }

 
      return total.toString();
    } catch (err) {
      console.error('Failed to calculate monthly bill total:', err);
      throw err;
    }
  };



  return getMonthlyTotal;
}
