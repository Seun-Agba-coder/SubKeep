import { billingType } from "@/constants/Styles/AppStyle";
import { createIconSetFromFontello } from "@expo/vector-icons";
import {
  parseISO,
  addMonths,
  addWeeks,
  addYears,
  isSameMonth,
  isSameYear,
  interval,
} from 'date-fns';

import dayjs from 'dayjs';

type BillingType = 'Month' | 'Year' | 'Week';
type Color = 'green' | 'gray' | 'blue' | 'orange' | 'red' | 'black' | 'yellow' | 'white';
type EntryType = 'trial' | 'billing' | 'inactive';

interface BillingEntry {
  date: Date;
  type: EntryType;
  label: string;
  color: Color;
}

interface BillingDatesParams {
  firstPayment: Date | string;
  billingType: BillingType;
  numberOfPeriods?: number;
  interval?: number;
  freeTrialDays?: number;
  isactive: number;
  canceldate?: string;
}

function generateBillingDates({
  firstPayment,
  billingType,
  numberOfPeriods = 10,
  interval = 1,
  freeTrialDays = 0, 
  isactive = 0,
  canceldate, 
}: BillingDatesParams): BillingEntry[] {
  const result: BillingEntry[] = [];
 
  let current = dayjs(firstPayment); // use dayjs here
  
  const typeColors: Record<BillingType, Color> = {
    Month: 'green',
    Year: 'yellow', 
    Week: 'gray',
  
  };
  
  const billingColor = typeColors[billingType] || 'black';
  
  if (isactive === 1 && canceldate) {
    result.push({
      date: dayjs(canceldate).toDate(),
      type: 'inactive',
      label: 'subinactive',
      color: "red"
    });
    return result

  }

  // Handle free trial period
  if (freeTrialDays > 0) {
    const trialStart = current;
    const trialEnd = current.add(freeTrialDays, 'day');

    result.push({
      date: trialStart.toDate(),
      type: 'trial',
      label: 'Free trial ends',
      color: "white"
    });

    current = trialEnd;
  }


  // Date advancement strategies
  const advanceDate: Record<BillingType, (date: dayjs.Dayjs, periods: number) => dayjs.Dayjs> = {
    Month: (date, periods) => date.add(periods, 'month'),
    Year: (date, periods) => date.add(periods, 'year'),
    Week: (date, periods) => date.add(7 * periods, 'day'),
  };

  const advanceStrategy = advanceDate[billingType];


  if (!advanceStrategy) {
    throw new Error(`Unsupported billing type: ${billingType}`);
  }

  // Generate billing dates
  for (let i = 0; i < numberOfPeriods; i++) {
    result.push({
      date: current.toDate(),
      type: 'billing',
      label: `Billing #${i + 1}`,
      color: billingColor
    });

    current = advanceStrategy(current, interval);
  }
  
  return result;
}




async function noOfUpcomingBillsThisMonth(db: any, targetDate = new Date()) {
  try {
    const today = new Date();

    const targetMonth = targetDate.getMonth(); // 0-indexed
    const targetYear = targetDate.getFullYear();
  
    
      const subscriptions = await db.getAllAsync(
        `SELECT * FROM userSubscriptions WHERE isactive = ? AND isdeleted = ?`,
        [0, 0]
      );
  
  
  
    let count = 0;
  
    subscriptions.forEach((sub: any) => {
      const billingDates = generateBillingDates({ firstPayment: sub.firstpayment, billingType: sub.billingperiodtime, interval: parseInt(sub.billingperiodnumber), freeTrialDays: sub.freetrialduration ? parseInt(sub.freetrialduration) : 0, isactive: parseInt(sub.isactive)});
  
      billingDates.forEach((date: any) => {
    
        if (date.type !=  'trial') {
        const sameMonth = date.date.getMonth() === targetMonth;
        const sameYear = date.date.getFullYear() === targetYear;
        const notPassed = date.date >= today;
  
        if (sameMonth && sameYear && notPassed) {
          count++;
        }

        }
      
      });
    });
  
    return count;

  } catch(error: any) {
    console.error('Failed to calculate upcoming bills:', error);
    return 0;

  }

}

  






export { generateBillingDates, noOfUpcomingBillsThisMonth}