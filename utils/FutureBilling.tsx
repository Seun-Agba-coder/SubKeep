

import dayjs from 'dayjs';

type BillingType = 'Month' | 'Year' | 'Week';
type Color = 'green' | 'gray' | 'blue' | 'orange' | 'red' | 'black' | 'yellow' | 'white' | '#FAEBD7';
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
  latestResumedAt?: string;
}

function generateBillingDates({
  firstPayment,
  billingType,
  numberOfPeriods = 30,
  interval = 1,
  freeTrialDays = 0, 
  isactive = 0,
  canceldate, 
  latestResumedAt, 
}: BillingDatesParams): BillingEntry[] {
  const result: BillingEntry[] = [];
 
  let current = !latestResumedAt ? dayjs(firstPayment) : dayjs(latestResumedAt); // use dayjs here
  
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
      color: "#FAEBD7"
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
  // /// while (first payment is not yet greater than maxDate) {
  // }

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

const findNextPaymentDate = (billingRecurringListString: string, firstpayment?:any, billingPeriod?:any, billingType?: any): string | null | dayjs.Dayjs => {
  try {
      // 1. Parse the stringified data back into a list of objects.
      const parsedList = JSON.parse(billingRecurringListString);

      // Ensure the parsed data is an array before proceeding.
      if (!Array.isArray(parsedList)) {
          console.error("Parsed data is not an array.");
          return null;
      }

      // 2. Get today's date and format it for comparison.
      const today = dayjs().startOf('day');

      // 3. Find the first date in the list that is today or in the future.
      for (const item of parsedList) {
          if (item && item.expirydate) {
              const notificationDate = dayjs(item.expirydate).startOf('day');
              // Use isSameOrAfter() for a robust comparison.
              if (notificationDate.isSameOrAfter(today, 'day')) {
                  // This is the next upcoming date. Return its formatted string.
                  return notificationDate.format('YYYY-MM-DD');
              }
          }
      }


      function addBillingPeriod(date: dayjs.Dayjs, period: string, type: string): dayjs.Dayjs {
        switch (type) {
         case 'Week':
         // Return the new date from the add method
         return date.add(7 * parseInt(period), 'day');
        
         case 'Month':
         // Return the new date from the add method
         const newDate = date.add(parseInt(period), 'month');
        // If the day changed due to month overflow, set it to the last day of the new month
        if (newDate.date() !== date.date()) {
          return newDate.endOf('month');
        }
        return newDate;
        
        case 'Year':
        // Return the new date from the add method
        return date.add(parseInt(period), 'year');
        
        default:
        throw new Error(`Invalid billing type: ${type}`);
      }
        }
        

      let nextBillingDate = dayjs(firstpayment)
      
      while (nextBillingDate.isBefore(today)) {
        // Reassign the nextBillingDate to the new date returned by the function
         nextBillingDate = addBillingPeriod(nextBillingDate, billingPeriod, billingType);
      
         console.log("next billing date: : ", nextBillingDate)
         }
      return nextBillingDate


    
      



  } catch (error) {
      console.error("Failed to parse billingrecurringlist:", error);
  }

  // 4. If the loop finishes without finding a future date, return null.
  return null;
};






export { generateBillingDates, noOfUpcomingBillsThisMonth, findNextPaymentDate}