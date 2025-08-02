import { billingType2 } from '@/constants/Styles/AppStyle';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import { calculateNextBilling } from '@/utils/Billiigfunctions';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';




const SubscriptionItem = ({ data, theme, active }: any) => {


    const { t, i18n } = useAppTranslation()

    const freeTrialExpired = (data: any) => {
        const today = dayjs()
      

        const expiresOn = dayjs(data.freetrialendday)


        if (today.isBefore(expiresOn)) {

            return false
        }


        return true
    }


    const freeTrialExpiryDate = () => {
        const isoString = dayjs(data.freetrialendday)
        const formatted = `${t("AllSubscription.expireson")} ${dayjs(isoString).locale(i18n.language).format('MMMM D')}`;
        return formatted
    }

    const normalExpiryDate = () => {
        const isoString = calculateNextBilling(!data.freetrialendday ? data.firstpayment : data.freetrialendday, data.billingperiodnumber, data.billingperiodtime)
        // Add 1 day to get the next day
    const nextDay = dayjs(isoString).add(1, 'day');
        const formatted = `${t("AllSubscription.expireson")} ${dayjs(nextDay).locale(i18n.language).format('MMMM D')}`;
        return formatted
    }

    const isFreeTrialActive = !!freeTrialExpiryDate()

    return (
        <Pressable style={[styles.container, { backgroundColor: theme.secondaryColor }]} onPress={() => {
            if (!active) {
                router.push(
                    {
                        pathname: '../AddSub',
                        params: { id: data.id, to: 'update', activate: 'true' }
                    }
    ) 
        }
        return;
    }}>

            <View style={styles.rowContainer}>
                <Image source={{ "uri": data.iconurl }} style={styles.image} />

                <View>
                    <Text style={[{ color: theme.secondaryText }]}>{data.platformname}</Text>


                    {
                       active  ? freeTrialExpired(data)? 
                            <Text style={[{ color: billingType2['freetrial'] }]} >{freeTrialExpiryDate()}</Text> :
                            <Text style={[{ color: billingType2[data.billingperiodtime] }]} >{data.billingrecurringtime ? `Expires on the, ${dayjs(data.billingrecurringtime).locale(i18n.language).format('MMMM D')}` : normalExpiryDate()}</Text> : null
                    }  {
                        !active && <Text style={{ color: "red", fontSize: 10 }}>
                            Made inactive on {dayjs(data.latestPausedAt).locale(i18n.language).format('MMMM D YYYY')}
                        </Text>
                    }


                </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>

                <View >
                    <Text style={[{ color: theme.primaryText }]}>{data.symbol}{data.price}</Text>
                    <Text style={[{ color: theme.secondaryText, }]}>{data.billingperiodtime}</Text>
                </View>

                {(!freeTrialExpired(data) && active) &&
                    <Text style={{ fontSize: 10, color: billingType2['freetrial'] }}>{t("AllSubscription.freetrial")}</Text>
                }


            </View>


        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: "3%",
        marginVertical: 10,

    },

    rowContainer: {
        flexDirection: 'row',
        gap: 10

    },
    image: {
        height: 30,
        width: 30,
        borderRadius: 15
    }
})



export default SubscriptionItem