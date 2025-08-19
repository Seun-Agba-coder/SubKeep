import {View, Text, StyleSheet } from 'react-native'
import { LightTheme, DarkTheme } from '@/constants/Styles/AppStyle'
import AnalyticLayout from '@/components/analytics/AnalyticLayout'
import { useAppSelector } from '@/redux/hooks'
import { useAppTranslation } from '@/hooks/useAppTranslator'
import { useState, useEffect } from 'react'
import AnalyticsPaywallOverlay from '@/components/analytics/PaywallOverlay'
import Purchases from 'react-native-purchases'
import RevenueCatUI from 'react-native-purchases-ui'
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { router } from 'expo-router'


const Analytics = () => {
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

    const mode = useAppSelector((state) => state.appmode.mode)
    const theme = mode === "light" ? LightTheme: DarkTheme
    const {t } = useAppTranslation()

      

    useEffect(() => {

        const validateCustomerSubscription = async () => {
            const customerInfo = await Purchases.getCustomerInfo();
            if(typeof customerInfo.entitlements.active['premium_access'] !== "undefined") {
                setIsSubscribed(true)
              }
              return;
          }
        
          validateCustomerSubscription()
    }, [])

    async function presentPaywall(): Promise<boolean> {
    try {
        const offerings = await Purchases.getOfferings();
        const currentOffering: any = offerings.current;
        console.log("Current Offering: ", JSON.stringify(currentOffering, null, 2))
        
        
      
        // Present paywall for current offering:
        const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();
    
        // or if you need to present a specific offering:
    
        switch (paywallResult) {
            case PAYWALL_RESULT.NOT_PRESENTED:
            case PAYWALL_RESULT.ERROR:
            case PAYWALL_RESULT.CANCELLED:
                return false;
            case PAYWALL_RESULT.PURCHASED:
                router.back()
                return true;
            case PAYWALL_RESULT.RESTORED:
                router.back()
                return true;
            default:
                return false;
        }
        
    } catch(error) {
        console.error('Paywall error:', error);
        return false;
    }
     
    
    
       }
    
    return (
        <View style={[ styles.container, {backgroundColor: theme.background} ]}>
            <Text style={[styles.title, {color: theme.primaryText}]}>{t('Analytics.title')}</Text>
            <AnalyticLayout theme={theme} mode={mode} />
            {   
        !isSubscribed && <AnalyticsPaywallOverlay onUpgradePress={presentPaywall} theme={theme} mode={mode}/>
    }
        </View>


    )



}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 50, 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})

export default Analytics    