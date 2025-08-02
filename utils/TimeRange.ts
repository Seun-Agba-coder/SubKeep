import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

async function ChartDataViaRange(db: any, timeRange: string = '6 months') {

    console.log("CHART DATA VAI RANGE")
    // Get current date and the start date based on the time range
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
    const subscriptions = await db.getAllAsync(
        `SELECT * FROM userSubscriptions

     `
    );

    
   

    
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
            isactive
        } = sub;
        console.log("Is Active", isactive)


        const first = !freetrialendday ? dayjs(firstpayment) : dayjs(freetrialendday);
        console.log("First : ", first)
        const cancel = canceldate ? dayjs(canceldate) : null;

        if (billingtype === 'One Time') {
            const label = first.format('MMM YYYY');
            if (monthlyTotals.hasOwnProperty(label)) {
                monthlyTotals[label] += price;
            }
        } else if (billingtype === 'Recurring') {
            console.log("Recurring: ", billingtype)
            let billingCursor = first.clone();

            while (billingCursor.isSameOrBefore(endDate)) {
                const label = billingCursor.format('MMM YYYY');

                // Only add if this billing date falls within the desired range
                if (
                    billingCursor.isSameOrAfter(startDate) &&
                    (!cancel || billingCursor.isSameOrBefore(cancel)) &&
                    monthlyTotals.hasOwnProperty(label)
                ) {
                    monthlyTotals[label] += price;
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



export {ChartDataViaRange}