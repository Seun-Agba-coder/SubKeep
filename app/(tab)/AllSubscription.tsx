import {View, Text, Button, StyleSheet } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { useAppSelector } from '@/redux/hooks'
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle'
import { getSubscriptions } from '@/utils/Crud'
import { useState, useCallback} from 'react'
import { useFocusEffect } from 'expo-router'
import PressableText from '@/components/ui/PressableText'
import SubscriptionLayout from '@/components/AllSubscription/SubscriptionLayout';
import { getActiveSubscription, getInactiveSubscription } from '@/utils/Crud';
import { useAppTranslation } from '@/hooks/useAppTranslator';





const AllSubscription = () =>  {
    const db = useSQLiteContext()
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const theme = mode === 'light' ? LightTheme : DarkTheme;
    const {t} = useAppTranslation()

    const [tabToggle, setTabToogle] = useState<number>(1)
    const [activeSub, setActiveSub] = useState<any>([])
    const [inactiveSub, setInactiveSub] = useState<any>([])


    useFocusEffect(useCallback(() => {
        const userSubscription = async () => {
           
            const activeSub = await getActiveSubscription(db)
            const inactiveSub = await getInactiveSubscription(db)
            
            setActiveSub(activeSub)
            setInactiveSub(inactiveSub)
        }
        userSubscription()
    }, [db]))
   

    function switchTab(num: number) {
        console.log(num)
        setTabToogle(num)
    }
        
   
    
    return (
        <View style={[{backgroundColor: theme.background}, styles.container]}>
             <Text style={[styles.title, {color: theme.primaryText}]}>{t('AllSubscription.title')}</Text>
             <View style={styles.rowContainer}>
                <View style={[styles.individualContainer, tabToggle === 1 ? styles.activeTab : styles.inactiveTab]}>
                    <PressableText extraTextStyle={{color: tabToggle === 1 ? theme.primaryText : theme.secondaryText}} onPress={() => switchTab(1)}>{t("AllSubscription.acitveplan")}</PressableText>
                </View>
                <View style={[styles.individualContainer, tabToggle === 2 ? styles.activeTab : styles.inactiveTab]}>
                     <PressableText extraTextStyle={{color: tabToggle === 2 ? theme.primaryText : theme.secondaryText}} onPress={() => switchTab(2)}>{t("AllSubscription.inactiveplan")}</PressableText>
                </View>
             </View>

     {tabToggle === 1 ? <View>
                <SubscriptionLayout theme={theme} subscriptions={activeSub}  setActiveSub={setActiveSub} active={true}/>
             </View> : <View>
                <SubscriptionLayout theme={theme} subscriptions={inactiveSub} setInactiveSub={setInactiveSub} active={false}/>
             </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

        padding: 20, 
        flex: 1, 
    },
    rowContainer: {
        flexDirection: 'row',  
    },
    individualContainer: {
        flex: 1,
        borderBottomWidth: 2, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10, 
    }, 
    inactiveTab: {
        borderBottomColor: 'gray'
    }, 
    activeTab: {
        borderBottomColor: 'blue'
    }, 
    title : {
        fontSize: 20, 
        fontWeight: '900',
        marginBottom: 10,
    }

})

export default AllSubscription