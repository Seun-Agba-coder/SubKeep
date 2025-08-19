import dayjs from 'dayjs';

type BillingType = 'Month' | 'Week' | 'Year' | 'Day';

interface SubscriptionBilling {
  firstpayment: string; // ISO date string (e.g., '2025-01-01')
  billingperiodnumber: string;    // How many units (e.g., 1 for every 1 month)
  billingperiodtime: string; // 'Month', 'Week', 'Year', 'Day', 
  freetrial: string; // 'true' or 'false'
  freetrialendday: string;
  billingrecurringtime: string;
  latestResumedAt?: string;
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
  const { firstpayment:firstPaymentDate, billingperiodnumber: billingPeriod, billingperiodtime: billingType, freetrial, freetrialendday} = subscription;
  
  const today = dayjs();
  
  const firstPayment = dayjs(firstPaymentDate);
  const freetrialending = dayjs(freetrialendday)


   console.log("IS this true or not: : ", firstPayment.isAfter(today))
  if (freetrial === "true") {
    const freetrialending = dayjs(freetrialendday)
    if (today.isBefore(freetrialending)) {
    
    const diffTime = freetrialending.startOf('day').diff(today.startOf('day'), 'day');
    console.log("diffTime: ", diffTime)
    return diffTime
    }
  }

  // This function should return the new date object
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
  
  let nextBillingDate = !freetrialendday? dayjs(firstPayment): dayjs(freetrialendday);

   console.log("freetrialendday: ", freetrialendday)
  
   // Keep adding billing periods until we find a future date


   while (nextBillingDate.isBefore(today)) {
  // Reassign the nextBillingDate to the new date returned by the function
  console.log("next Billing Date: ", nextBillingDate)
   nextBillingDate = addBillingPeriod(nextBillingDate, billingPeriod, billingType);
   

   }
   
   // Calculate days difference
   // The 'diff' method returns a number, so no need to divide by milliseconds
   const daysUntil = nextBillingDate.diff(dayjs(today).startOf('day'), 'day');
  
   return daysUntil
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
  

