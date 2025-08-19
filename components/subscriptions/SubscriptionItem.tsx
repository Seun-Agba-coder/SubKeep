import { billingType2 } from '@/constants/Styles/AppStyle';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import { calculateNextBilling } from '@/utils/Billiigfunctions';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Spanish
import 'dayjs/locale/fr'; // French
import 'dayjs/locale/en'; // English
import 'dayjs/locale/it'; // Italian
import 'dayjs/locale/tr'; // Turkish
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { findNextPaymentDate } from '@/utils/FutureBilling';
import InitialAvatar from '../ui/IntialAvatar';




const SubscriptionItem = ({ data, theme, active }: any) => {

    // if (data.billingperiodtime === "One Time") {
    //     return (
    //         <>
    //         </>
    //     )
    // }

    console.log(
        "Data : : ", data
    )
    const { t, i18n } = useAppTranslation()

    let showLogo = null;
    
       if (data?.platformname.toLowerCase().trim() === "subkeep") {
           showLogo = <Image source={require("../../assets/AppImages/subkeep.png")} style={[styles.image, ]} />;
       }else if (data.iconurl === 'null') {         
           showLogo = <InitialAvatar name={data.platformname} size={30}  />
           
       } else if (data?.platformname) {
        showLogo = <Image source={{ uri: data.iconurl }} style={[styles.image]} />;
    } 
    

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
  
        const formatted = `${t("AllSubscription.expireson")} ${dayjs(isoString).locale(i18n.language).format('MMMM D')}`;
        return formatted
    }

   

    
    let showThis 
    let showThisUnder
    if  (!active) {
        showThis =  <Text style={{ color: "red", fontSize: 10 }}>
        {t("common.inactive")} {dayjs(data.latestPausedAt).locale(i18n.language).format('MMMM D YYYY')}
        
    </Text>
    showThisUnder = ""
    } else {
        if (!freeTrialExpired(data)) {
            showThis = <Text style={[{ color: billingType2['freetrial'] }]} >{freeTrialExpiryDate()}</Text>
            showThisUnder = <Text style={{ fontSize: 10, color: billingType2['freetrial'] }}>{t("AllSubscription.freetrial")}</Text>
        } else if(data.billingperiodtime === 'One Time'){
             console.log(data.billingperiodtime.replace(" ", '').toLowerCase())
              showThis = '',
              showThisUnder = ''
        }
            else {
            showThis = <Text style={[{ color: billingType2[data.billingperiodtime] }]} >{`${t("AllSubscription.expireson")}, ${dayjs(findNextPaymentDate(!data.freetrialendday? data.firstpayment : data.freetrialendday, data.billingperiodnumber, data.billingperiodtime)).locale(i18n.language).format('MMMM D')}`}</Text>
             showThisUnder = ""
        }
    }

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
            { showLogo}

                <View>
                    <Text style={[{ color: theme.secondaryText }]}>{data.platformname}</Text>


                   {showThis}


                </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>

                <View >
                    <Text style={[{ color: theme.primaryText }]}>{data.symbol}{data.price}</Text>
                    <Text style={[{ color: theme.secondaryText, }]}>{  t(`addsub.notificationscreen.dropdown.${data.billingperiodtime.replace(" ", '').toLowerCase()}`)}</Text>
                </View>

                {showThisUnder}


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