import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';


dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);




export const useTimeRange = () => {
    async function ChartDataViaRange(db: any, timeRange: string = '6 months') {

  
        const endDate = dayjs(); // now
    
        const number = timeRange.split(' ')[0]
        const unit = timeRange.split(' ')[1]
        const startDate = dayjs().subtract(Number(number), unit as dayjs.ManipulateType);
    
        console.log("Start Date: ", startDate.format('MMM YYYY'));
        console.log("End Date: ", endDate.format('MMM YYYY'));
    
        // Generate month buckets like ["Feb 2025", "Mar 2025", ...]
        const monthLabels = [];
        let cursor = startDate.startOf('month');
        while (cursor.isSameOrBefore(endDate)) {
            monthLabels.push(cursor.format('MMM YYYY'));
            cursor = cursor.add(1, 'month');
        }
    
        // Initialize result object
        const monthlyTotals: any = {};
        monthLabels.forEach(label => {
            monthlyTotals[label] = 0;
        });
        
        // Fetch relevant subscriptions from DB
        const subscriptions = await db.getAllAsync(`SELECT * FROM userSubscriptions`);
    
        
        // Iterate through each subscription
        for (const sub of subscriptions) {
            const {
                price,
                firstpayment,
                freetrialendday,
                billingtype,
                billingperiodnumber,
                billingperiodtime,
                canceldate, 
            } = sub;
    
            const pauseHistory = await db.getAllAsync(
                `SELECT pausedAt, resumedAt FROM pauseHistory WHERE subscriptionId = ? ORDER BY pausedAt ASC`,
                sub.id
            );
    
            
          
    
    
    
            const first = !freetrialendday ? dayjs(firstpayment) : dayjs(freetrialendday)
           
            const cancel = canceldate ? dayjs(canceldate) : null;
    
            if (billingtype === 'One Time') {
                const label = first.format('MMM YYYY');
                if (monthlyTotals.hasOwnProperty(label)) {
                    monthlyTotals[label] += Number(price);
                }
            } else if (billingtype === 'Recurring') {   
                let billingCursor = first.clone();
      
                while (billingCursor.isSameOrBefore(endDate)) {
                    const label = billingCursor.format('MMM YYYY');
                    
    
                    // NEW: Check if the billing cursor falls within ANY paused period
                    let isPaused = false;
                    for (const pause of pauseHistory) {
                        const pausedAt = pause.pausedAt ? dayjs(pause.pausedAt) : null;
                        const resumedAt = pause.resumedAt ? dayjs(pause.resumedAt) : null;
                        
                        if (pausedAt && (!resumedAt || billingCursor.isBetween(pausedAt, resumedAt, null, '[]'))) {
                            isPaused = true;
                            break; // Found a paused period, no need to check others
                        }
                    }
    
    
                    if (
                        billingCursor.isSameOrAfter(startDate) &&
                        (!cancel || billingCursor.isSameOrBefore(cancel)) &&
                        monthlyTotals.hasOwnProperty(label) &&
                        !isPaused
                    ) {
                        console.log("price")
                        monthlyTotals[label] += Number(price);
                    }
                    
    
                    // Move to the next billing period
                    billingCursor = billingCursor.add(billingperiodnumber, billingperiodtime.toLowerCase());
                }
                
            }
            console.log("It does not Run ")
        }
    
        console.log("MOnthy Total : :", monthlyTotals)
    
        // Convert to desired output format
        return Object.entries(monthlyTotals).map(([month, total]) => ({ [month]: total }));
    }

    return {ChartDataViaRange}

}




