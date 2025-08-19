import { View, StyleSheet, Text, Image } from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";
import dayjs from "dayjs";
import { billingType2 } from '@/constants/Styles/AppStyle'; 
import { useAppTranslation } from "@/hooks/useAppTranslator";
import InitialAvatar from "../ui/IntialAvatar";

interface SubHorizontalItemProps {
    item: any
    theme: any;
}

const SubHorizontalItem = ({ item, theme }: SubHorizontalItemProps) => {
    if (item.billingperiodtime === "One Time") {
        return (
            <>
            </>
        )
    }
    
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

    let showLogo = null;
    
    if (item?.platformname.toLowerCase().trim() === "subkeep") {
        showLogo = <Image source={require("../../assets/AppImages/subkeep.png")} style={[styles.image, ]} />;
    }  else if (item?.iconurl === "null") {         
        showLogo = (
         <InitialAvatar name={item.platformname} size={30}  />
        );
    }
 else if (item?.platformname) {
        showLogo = <Image source={{ uri: item.iconurl }} style={[styles.image]} />;
    }
 
 

    return (
        <Pressable style={[styles.container, {backgroundColor: theme.secondaryColor}]} onPress={() => goToDescription()} android_ripple={{color:'rgba(255, 255, 255, 0.96)'}}>
            <View style={styles.rowContainer}>
                {showLogo}
                <View>
                    <Text style={[styles.title, { color: theme.tetiaryText }]}>{item.symbol}{item.price}</Text>
                    <Text style={[styles.subtitle, {color: theme.secondaryText}]}>{t('addsub.notificationscreen.dropdown.' + item.billingperiodtime.toLowerCase())}</Text>
                   
                </View>
                {
                 !freeTrialExpired(item) ? <View style={[styles.dot, {backgroundColor: '#FAEBD7'}]}></View>:  <View style={[styles.dot, {backgroundColor: billingType2[item.billingperiodtime]}]}></View>
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
        height: 30, 
        borderRadius: 15,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: "4%"
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