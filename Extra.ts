import dayjs from "dayjs";
import { scheduleReminder, scheduleTrialNotification } from "./utils/EnableNotification";



export const scheduleRecurringNotifications = async (subscriptionData: any, firsttime: boolean) => {
    const notificationIds = [];

    if (subscriptionData.freetrialEnabled === true && firsttime === true) {

        const freeid = await scheduleTrialNotification(subscriptionData.freetrialendday, subscriptionData.platformname)
        console.log(freeid, ": : free id")
        notificationIds.push({ expirydate: "", notificationIds: freeid })


    }

    // Schedule next 12 notifications (1 year worth)
    for (let i = 1; i <= 6; i++) {
        const nextBillingDate = dayjs(!subscriptionData.freetrialendday ? subscriptionData.firstpayment : subscriptionData.freetrialendday)
            .add(i * subscriptionData.billingperiodnumber, subscriptionData.billingperiodtime)
            // .subtract(1, 'day');

            

        const notificationId = await scheduleReminder(
            dayjs(nextBillingDate).toDate(),
            `Your ${subscriptionData.platformname} will soon renew`,
            `Your ${subscriptionData.platformname} will renew tomorrow, a reminder so you do not forget`,
            subscriptionData.platformname,
            subscriptionData.id,
            subscriptionData.billingperiodtime,
            subscriptionData.billingperiodnumber,
            !subscriptionData.freetrialendday ? subscriptionData.firstpayment : subscriptionData.freetrialendday
        );


        notificationIds.push({ expirydate: nextBillingDate, notificationIds: notificationId });
    }



    return notificationIds;
};



export const scheduleRecurringNotificationsUpdate = async (subscriptionData: any, billingRecurringLastItem: any) => {
    const notificationIds = [];


    for (let i = 1; i <= 6; i++) {
        const nextBillingDate = dayjs(billingRecurringLastItem)
            .add(i * subscriptionData.billingperiodnumber, subscriptionData.billingperiodtime)
            .subtract(1, 'day');

        const notificationId = await scheduleReminder(
            dayjs(nextBillingDate).toDate(),
            `Your ${subscriptionData.platformname.trim()} will soon renew`,
            `Your ${subscriptionData.platformname.trim()} will renew tomorrow, a reminder so you do not forget`,
            subscriptionData.platformname,
            subscriptionData.id,
            subscriptionData.billingperiodtime,
            subscriptionData.billingperiodnumber,
            !subscriptionData.freetrialendday ? subscriptionData.firstpayment : subscriptionData.freetrialendday
        );


        notificationIds.push({ expirydate: nextBillingDate, notificationIds: notificationId });
    }



    return notificationIds;
};





export const shouldRefreshNotifications = async (billingList: any) => {
    console.log("should Refresh NOtification", shouldRefreshNotifications)
    const LastNot = billingList[billingList.length - 1]
    console.log("Last NOt", LastNot)

    const lastgottennotification = dayjs(LastNot.billingrecurringtime)

    console.log("last notification : ", lastgottennotification)
    const today = dayjs()

    if (today.isBefore(lastgottennotification)) {
        return false
    }
    return true



}



