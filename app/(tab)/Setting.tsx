import SettingLayout from '@/components/Settings/SettingLayout';
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle';
import { useAppSelector } from '@/redux/hooks';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Purchases from 'react-native-purchases';
// import RevenueCatUI from 'react-native-purchases-ui';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import { getStoredLanguage } from '@/src/locales';
import useSettingHook from '@/hooks/useSetting';







const Settings = () => {
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const { t, i18n } = useAppTranslation()
    const modetranslate =  t("setting.systemmode." + mode)
    console.log("mode", mode)
    const theme = mode === "light" ? LightTheme : DarkTheme
    const [userLanguage, setUserLanguage] = useState<any>(null);
    const [userDefaultCurrency, setUserDefaultCurrency] = useState<any>(null);
    const [offering, setOffering] = useState<any | null>(null);

    const { LanguageList, SystemList} = useSettingHook()


    const [snackbarVisible, setSnackVisible] = useState<boolean>(false)
    const [snackbarMessage, setSnackBarMessage] = useState({
        message: "",
        color: ""
    })






    // useEffect(() => {
    //   const fetchOfferings = async () => {
    //     try {
    //       const offerings = await Purchases.getOfferings();
    //       if (offerings.current) {
    //         setOffering(offerings.current);
    //       }
    //     } catch (e) {
    //       console.log('Error fetching offerings:', e);
    //     }
    //   };

    //   fetchOfferings();
    // }, []);


    // const handleShowPaywall = async () => {
    //     if (offering) {
    //       const result = await RevenueCatUI.presentPaywall({ offering });
    //       console.log('Paywall result:', result);
    //     }
    //   };

    useEffect(() => {

        const getuserprelang = async () => {
            const code: any = await getStoredLanguage()
          

            const languageItem: any = LanguageList.find((item: any) => item.code === code);

            
            setUserLanguage(languageItem.name)
        }
        getuserprelang()
      

    }, [t])




    useEffect(() => {
        const getUserDefaultCurrency = async () => {
          
            const defaultCurrency = await SecureStore.getItemAsync("defaultCurrency")
         
            if (defaultCurrency) {
                setUserDefaultCurrency(JSON.parse(defaultCurrency).name)
            }

              
            
        }
        getUserDefaultCurrency();
    }, [])

    return (
        <View style={[{ backgroundColor: theme.background }, styles.container]}>
            <Text style={[{ color: theme.primaryText }, styles.mainText]}>{t('setting.title')}</Text>

            <SettingLayout theme={theme} lang={userLanguage} defCurrency={userDefaultCurrency} mode={modetranslate} paywall={() => { }} snackVisible={snackbarVisible} setSnackVisible={setSnackVisible} snackMessage={snackbarMessage} setSnackMessage={setSnackBarMessage} />
                

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    mainText: {
        fontWeight: 900,
        fontSize: 20

    }
})

export default Settings