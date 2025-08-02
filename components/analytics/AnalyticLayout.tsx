import { useAppTranslation } from '@/hooks/useAppTranslator';
import useMonthlyBillTotal from '@/hooks/useMonthlyBillTotal';
import { getActiveSubscription, getCategorySummary, getMonthlyFreeTrialCount } from '@/utils/Crud';
import { noOfUpcomingBillsThisMonth } from '@/utils/FutureBilling';
import * as SecureStore from 'expo-secure-store';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from './Card';
import Category from './Category';
import Chart from './Chart';


// const total = await getTotal(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1);

// setGetMonthlyTotal(total.toFixed(2));


interface Prop {
    theme: any

}

const AnalyticLayout = ({ theme }: Prop) => {
    const db = useSQLiteContext()

    const { t } = useAppTranslation()

    const getTotal = useMonthlyBillTotal(db)
    const [montalTotal, setMonthlyTotal] = useState<string>("0")
    const [currencySymbol, setCurrencySymbol] = useState<string>("")
    const [activeSubscriptions, setActiveSubscriptions] = useState<any>([])
    const [freeTrialPerMonth, setFreeTrialPerMonth] = useState<number>(0)
    const [noOfBillingThisMonth, SetNoOfBillingThisMonth] = useState<number>(0)
    const [categoryData, setCategoryData] = useState<any>([])

    useEffect(() => {
        const getMonthlyTotal = async () => {
            const total = await getTotal(new Date().getFullYear(), new Date().getMonth() + 1);
            console.log("Total: ")


            const currencyItem = await SecureStore.getItemAsync('defaultCurrency')
            const category = await getCategorySummary(db)

            const currencyItemJson = currencyItem ? JSON.parse(currencyItem) : null;




            setCurrencySymbol(currencyItemJson?.symbol)

            setMonthlyTotal(total);
        }
        getMonthlyTotal()
    }, [])


    useEffect(() => {
        const getSubscriptionsThings = async () => {
            const subscriptions = await getActiveSubscription(db)
            const freeTrial: number = await getMonthlyFreeTrialCount(db, new Date().getFullYear(), new Date().getMonth() + 1)
            const billingNumber: number | undefined = await noOfUpcomingBillsThisMonth(db)
            const categorySummary = await getCategorySummary(db)
            console.log("Category Summary: ", categorySummary)
            setActiveSubscriptions(subscriptions)
            setFreeTrialPerMonth(freeTrial)
            SetNoOfBillingThisMonth(billingNumber ?? 0)
            setCategoryData(categorySummary)
        }
        getSubscriptionsThings()
    }, [])




    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{ color: theme.primaryText }}>{t("analytics.thismonth")}</Text>

            <View >
                <View style={styles.rowContainer}>
                    <View style={styles.cardContainer}>
                        <Card title={`${currencySymbol}${montalTotal} ${t("analytics.card.monthlyexpense")}`} num="" background={theme.primaryText} textColor="white" />
                    </View>
                    <View style={styles.cardContainer}>
                        <Card icon="menu" title={t("analytics.card.activesub")} num={activeSubscriptions.length.toString()} background={theme.primaryText} textColor="white" />
                    </View>



                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.cardContainer}>
                        <Card icon="time-outline" title={t("analytics.card.trails")} num={freeTrialPerMonth.toString()} background={theme.primaryText} textColor='white' />
                    </View>
                    <View style={styles.cardContainer}>
                        <Card icon="calendar-outline" title={t("analytics.card.upcomingbills")} num={noOfBillingThisMonth.toString()} background={theme.primaryText} textColor='white' />
                    </View>
                </View>
            </View>

            <View style={[styles.categoryContainer, { backgroundColor: theme.accentColor2 }]}>
                <Category data={categoryData} theme={theme} />

            </View>
            <View style={[styles.lineChartContainer, { backgroundColor: theme.background }]}>
                <Chart theme={theme} db={db} symbol={currencySymbol} />
            </View>
            <View style={{ height: 100 }}>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 40,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardContainer: {
        width: '50%'
    },
    categoryContainer: {
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 10,
        padding: 16,

    },
    lineChartContainer: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
    }
})

export default AnalyticLayout