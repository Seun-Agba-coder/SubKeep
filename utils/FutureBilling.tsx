

import dayjs from 'dayjs';
import { getDateRange } from '@/utils/TimeRange'

type BillingType = 'Month' | 'Year' | 'Week' | 'One Time';
type Color = 'green' | 'gray'| 'red' | 'black' | 'yellow' | 'white' | '#FAEBD7';
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
  isdeleted?: number,
  maximumDate?: Date,
  billingperiodtime?: string
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
  isdeleted,
  maximumDate,
  billingperiodtime
}: BillingDatesParams): BillingEntry[] {
  const result: BillingEntry[] = [];

  let current = !latestResumedAt ? dayjs(firstPayment) : dayjs(latestResumedAt); // use dayjs here
  const maxDate = dayjs(maximumDate);

  const typeColors: Record<BillingType, Color> = {
    Month: 'green',
    Year: 'yellow',
    Week: 'gray',
    "One Time": 'black'
  };

  const billingColor = typeColors[billingType] || 'black';

  if (isdeleted === 1) {
    return result;
  }


 
  if (isactive === 1 && canceldate) {
    result.push({
      date: dayjs(canceldate).toDate(),
      type: 'inactive',
      label: 'subinactive',
      color: "red"
    });
    return result

  }

  if (billingperiodtime === 'One Time') {
    result.push({
      date: dayjs(firstPayment).toDate(),
      type: 'billing',
      label: 'onetime',
      color: "gray"
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
    "One Time": (date, periods) => date.add(periods, 'day'),
  };

  const advanceStrategy = advanceDate[billingType];


  if (!advanceStrategy) {
    throw new Error(`Unsupported billing type: ${billingType}`);
  }


  while (current.isBefore(maxDate)) {
    result.push({
      date: current.toDate(),
      type: 'billing',
      label: `Billing #${result.length + 1}`,
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

   console.log("subscriptionlength: ", subscriptions.length)

    let count = 0;

    const {maximumDate} = getDateRange(-1, 1)

    subscriptions.forEach((sub: any) => {
      const billingDates = generateBillingDates({ firstPayment: sub.firstpayment, billingType: sub.billingperiodtime, interval: parseInt(sub.billingperiodnumber), freeTrialDays: sub.freetrialduration ? parseInt(sub.freetrialduration) : 0, isactive: parseInt(sub.isactive), maximumDate:maximumDate });
      
      console.log("From future billing, ", billingDates)
      billingDates.forEach((date: any) => {
        console.log("From future billing each date contains :", date)
        if (date.type !== 'trial') {
          const sameMonth = date.date.getMonth() === targetMonth;
          const sameYear = date.date.getFullYear() === targetYear;
          const notPassed = date.date >= today;
          console.log("Same month: ", sameMonth)
          console.log("Same year: ", sameYear)
          console.log("Not passed: ", notPassed)

          if (sameMonth && sameYear && notPassed) {
            count++;
          }

        }

      });
    });

    return count;

  } catch (error: any) {
    console.error('Failed to calculate upcoming bills:', error);
    return 0;

  }

}

const findNextPaymentDate = (firstpayment: string, billingPeriod: string, billingType: string): dayjs.Dayjs => {
  try {

    const today = dayjs()
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




    }
    return nextBillingDate


  } catch (error) {
    console.error("Failed to parse billingrecurringlist:", error);
    return dayjs()
  }


};






export { findNextPaymentDate, generateBillingDates, noOfUpcomingBillsThisMonth };
