import { View, StyleSheet, Text, Image } from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";
import dayjs from "dayjs";
import { billingType2 } from '@/constants/Styles/AppStyle'; 
import { useAppTranslation } from "@/hooks/useAppTranslator";


interface SubHorizontalItemProps {
    item: any
    theme: any;
}

const SubHorizontalItem = ({ item, theme }: SubHorizontalItemProps) => {
    
    const { t} = useAppTranslation()


        const freeTrialExpired = (data: any) => {
            const today = dayjs()
            console.log(today)
    
            const expiresOn = dayjs(data.freetrialendday)
            console.log(expiresOn)
        
            if (today.isBefore(expiresOn)) {
               
                return false
            }
          
        
            return true
        }
        

    function goToDescription() {
        console.log(item)

        const strItem = JSON.stringify(item )
        router.push(
         {
            pathname: '/(stack)/Description',
            params: {
                item: strItem
            }
         }
        )
    }   

    return (
        <Pressable style={[styles.container, {backgroundColor: theme.secondaryColor}]} onPress={() => goToDescription()} android_ripple={{color:'rgba(255, 255, 255, 0.96)'}}>
            <View style={styles.rowContainer}>
                <Image source={{uri: item.iconurl}} style={styles.image}/>
                <View>
                    <Text style={[styles.title, { color: theme.tetiaryText }]}>${item.price}</Text>
                    <Text style={[styles.subtitle, {color: theme.secondaryText}]}>{t('addsub.notificationscreen.dropdown.' + item.billingperiodtime.toLowerCase())}</Text>
                   
                </View>
                {
                 !freeTrialExpired(item) ? <View style={[styles.dot, {backgroundColor: 'white'}]}></View>:  <View style={[styles.dot, {backgroundColor: billingType2[item.billingperiodtime]}]}></View>
                }
                
            </View>
            
            <Text style={{ color: theme.primaryText }}>{item.platformname}</Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[styles.lightText, { color: theme.primaryText }]}>{item.subremainingDays}</Text>
                <Text style={[styles.lightText, { color: theme.primaryText, textAlign: 'left', width: 35}]}>{t("upcomingpayment.daysremain")}</Text>
            
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.4,
        elevation: 3,
        width: 120,
        height: 120,
        padding: 15,
        borderRadius: 10, 
        marginVertical: 10, 
        marginHorizontal: 10, 
    },
    image: {
        width: 30,
        height: 30
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 10
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '300'
    },
    title: {
        fontSize: 15,
        fontWeight: '500'
    },
    lightText: {
        fontSize: 10,
        fontWeight: '100'
    },
    dot: {
        width :10,
        height: 10,
        borderRadius: 5,
    }
});

export default SubHorizontalItem