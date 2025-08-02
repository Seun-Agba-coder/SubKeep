import dayjs from 'dayjs';

type BillingType = 'Month' | 'Week' | 'Year' | 'Day';

interface SubscriptionBilling {
  firstpayment: string; // ISO date string (e.g., '2025-01-01')
  billingperiodnumber: string;    // How many units (e.g., 1 for every 1 month)
  billingperiodtime: string; // 'Month', 'Week', 'Year', 'Day', 
  freetrial: string; // 'true' or 'false'
  freetrialendday: string;
  billingrecurringtime: string;
}

interface BillingResult {
  daysUntilNextBilling: number;
  nextBillingDate: string;
  isOverdue: boolean;
  freetrial: string; 
}

/**
 * Calculates days until next subscription billing
 * @param subscription - Subscription billing details
 * @returns Object with days until next billing, next billing date, and overdue status
 */
function calculateDaysUntilNextBilling(subscription: SubscriptionBilling): number {
  const { firstpayment:firstPaymentDate, billingperiodnumber: billingPeriod, billingperiodtime: billingType, freetrial, freetrialendday, billingrecurringtime} = subscription;


  
  console.log("Free trial type: ", typeof(freetrial))
  console.log("Free trail: ", freetrial)
  // Get current date normalized to start of day
  const today = dayjs()
   
  console.log("firstPaymentDate", firstPaymentDate)
  // Parse first payment date
  const firstPayment = dayjs(firstPaymentDate);
  if (freetrial === 'true') {
     console.log("freetrialendday: ", freetrialendday)
    const freetrialending = dayjs(freetrialendday)

  /// checks if today is before the freetrial ending
  if (today.isBefore(freetrialending)) {
    const diffTime =freetrialending.startOf('day').diff(today.startOf('day'), 'day');
    // console.log("diffTime: ", diffTime)
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(daysUntil)
    return diffTime
  }
}

  // // If first payment is in the future, that's the next billing date
  // if (firstPayment.isAfter(today)) {
  //   const diffTime = firstPayment.diff(today, 'day');
  //   const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    

  //   console.log(daysUntil)
  //   return diffTime
  // }
  
  // Calculate next billing date
  
  let nextBillingDate = dayjs(firstPayment);
  
  // Keep adding billing periods until we find a future date
  while (nextBillingDate.isBefore(today)) {
    addBillingPeriod(nextBillingDate, billingPeriod, billingType);
  }
  
  // Calculate days difference
  const diffTime = nextBillingDate.diff(today, 'day');
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  

  console.log(daysUntil)
  return daysUntil
}

/**
 * Adds billing period to a date
 * @param date - Date to modify
 * @param period - Number of periods to add
 * @param type - Type of billing period
 */
function addBillingPeriod(date: dayjs.Dayjs, period: string, type: string): void {
 switch (type) {
  
     
   case 'Week':
     date.add(7 * parseInt(period), 'day');
     break;
     
   case 'Month':
     // Handle month-end dates properly
     const originalDay = date.date();
     date.add(parseInt(period), 'month');
     
     // If day changed due to month overflow (e.g., Jan 31 -> Mar 3)
     // Set to last day of intended month
     if (date.date() !== originalDay) {
       date.date(0); // Go to last day of previous month
     }
     break;
     
   case 'Year':
     date.add(parseInt(period), 'year');
     break;
     
   default:
     throw new Error(`Invalid billing type: ${type}`);
 }
}
  


function calculateNextBilling(date: any, billingPeriod: any, billingType: any) {
  let billingDate = dayjs(date); // use let, not const

  if (billingType === 'Month') {

    billingDate = billingDate.add(parseInt(billingPeriod), 'month');
  } else if (billingType === 'Week') {
    billingDate = billingDate.add(parseInt(billingPeriod) * 7, 'day');
  } else if (billingType === 'Year') {
    billingDate = billingDate.add(parseInt(billingPeriod), 'year');
  }

  const formatted = billingDate.toISOString().split('T')[0];
  console.log("nextBillingDate", formatted);
  return formatted; // return YYYY-MM-DD
}

type MonthlyTotals = { [month: string]: number };


  export const simulateMonthlySpending = (subscriptions:any): MonthlyTotals => {
    const monthlyTotals: MonthlyTotals = {};
  
    const today = dayjs();
  
    for (const sub of subscriptions) {
      const startDate = dayjs(sub.firstpayment);
      const endDate = sub.canceldate ? dayjs(sub.canceldate) : today;
  
      const current = dayjs(startDate);
  
      // Normalize both to first of month
      current.date(1);
      endDate.date(1);
  
      while (current <= endDate) {
        const key = `${current.year()}-${String(current.month() + 1).padStart(2, '0')}`;
  
        if (!monthlyTotals[key]) {
          monthlyTotals[key] = 0;
        }
  
        monthlyTotals[key] += sub.price;
  
        // Move to next month
        current.add(1, 'month');
      }
    }
  
    return monthlyTotals;
  };


  export {calculateNextBilling, calculateDaysUntilNextBilling}
  

