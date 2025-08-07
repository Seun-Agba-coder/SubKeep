import { auth } from '@/firebaseConfig';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import { logOut } from '@/utils/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState, useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { handleAppleSignIn } from '../SignIn/AppleSignInButton';
import signInWithGoogleAndFirebase from '../SignIn/GoogleSignInButton';
import CustomButton from '../ui/CustomButton';
import SettingItem from './SettingItem';
import useSettingHook from '@/hooks/useSetting';
import SnackBarBottom from '../ui/SnackBar';
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import GmailTracker from './GmailTrackingCard';
import * as SecureStore  from 'expo-secure-store';
import Purchases from 'react-native-purchases';
import FeedbackModal from './FeedbackModal';
import { useFocusEffect } from 'expo-router';




const SettingLayout = ({ theme, lang, defCurrency, mode, paywall, snackVisible, setSnackVisible, snackMessage, setSnackMessage }: any) => {
    const [isAuthenticated, setIsAuthenticated ] = useState(false)
    const { t} = useAppTranslation()

    console.log('Translation test:', t('setting.title'))
    const [selectedLanguage, setSelectedLanguage] = useState<string>(lang)

    const [selectedSystemMode, setSelectedSystemMode] = useState<string>(mode)

    const [languageListVisible, setLanguageListVisible] = useState<boolean>(false)
    const [systemListVisibility, setSystemListVisibility] = useState<boolean>(false)
    const { LanguageList, SystemList} = useSettingHook()
    const [gmailTracker, setGmailTraker] = useState(false)
    const [joinedWaitlist, setJoinedWaitlist] = useState(false)
    const [feedbackVisible, setFeedbackVisible] = useState(false)
   


    useEffect(() => {
      
        setSelectedLanguage(lang)
        setSelectedSystemMode(mode)
    }, [lang, mode])

  
      useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in
      
              setIsAuthenticated(true);
            } else {
              // User is signed out
              console.log('User is not authenticated');
              setIsAuthenticated(false);
            }
          });
        
          // Cleanup subscription on unmount
          return () => unsubscribe();
        }, []);

        async function showGmailTracker() {
            const showGmailTracker = await SecureStore.getItemAsync('gmail_tracking')
            console.log("should I show gmail tracker, yes or no",  showGmailTracker)

            if (showGmailTracker) {
                setJoinedWaitlist(true)
            }
          
         
            

            if (!isAuthenticated) {
               setGmailTraker(false)
               return;
            }
     
            if (!showGmailTracker) {
                console.log("Should I show Gamil Tracker: ", showGmailTracker)
              
                setGmailTraker(true)
                return;
            }
        }
        showGmailTracker()
        

   useFocusEffect(useCallback(() => {
    showGmailTracker()
   }, []))


        
          
        


        function goToCurrencyPicker() {
            router.push({ pathname: "/(stack)/CurrencyPicker", params: { to: 'update ' } })
        }
    


    function showFeedBackModal() {
        setFeedbackVisible(true)
    }
  

   

    
    
async function presentPaywall(): Promise<boolean> {
try {
    const offerings = await Purchases.getOfferings();
  
  
    // Present paywall for current offering:
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

    // or if you need to present a specific offering:

    switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
            return false;
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
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
        <View>
            <View style={styles.buttonContainer}>
                {isAuthenticated ? <CustomButton title={t('setting.logout')} onPress={async () => {
                    try {
                        await logOut()
                        setSnackVisible(true)
                        setSnackMessage({message:  `${t('setting.success.logout')}}`, color: "#16A34A"})
                    } catch (error) {
                        console.log(error)
                        setSnackVisible(true)
                        setSnackMessage({message: `${t('setting.success.error')}}`, color: "#DC2626"})
                    }
                }} style={{ backgroundColor: theme.primaryText, borderRadius: 10, paddingVertical: 10 }} textStyle={{ color: theme.background, alignSelf: 'flex-start' }} src={"yes"} /> :
                    <CustomButton title={t('setting.login')} onPress={Platform.OS === 'android' ? 
                    async () => {
                        try {
                            await signInWithGoogleAndFirebase()
                            setSnackVisible(true)
                            setSnackMessage({message: `${t('setting.success.login')}}`, color: "#16A34A"})
                        } catch (error) {
                            console.log(error)
                            setSnackVisible(true)
                            setSnackMessage({message: `${t('setting.success.error')}}`, color: "#DC2626"})
                        }
                    }
                     : handleAppleSignIn} style={{ backgroundColor: theme.primaryText, borderRadius: 10, paddingVertical: 10 }} textStyle={{ color: theme.background, alignSelf: 'flex-start' }} src={"yes"}/>}
                     {!isAuthenticated && !joinedWaitlist && <Text style={{fontSize: 6, color: 'gray', marginVertical: 2, textAlign: 'left'}}>{t('setting.info')} </Text>}

            </View>
            <View style={{ backgroundColor: theme.secondaryColor, paddingLeft: '4%', marginBottom: 30, padding: 10, borderRadius: 15, marginTop: 20 }}>
                <Pressable style={({ pressed }) => [styles.rowContainer, pressed ? styles.pressed : styles.rowContainer]} onPress={presentPaywall}>
                    <View style={styles.rowContainer}>
                        <Ionicons name="diamond" size={24} color={theme.primaryText} />

                        <Text style={{ color: theme.primaryText }}>
                            {t('setting.upgradepremium')}
                        </Text>
                    </View>
                </Pressable>

            </View>
            <View>
                {isAuthenticated && !joinedWaitlist  && <GmailTracker theme={theme} setSnackVisible={setSnackVisible} setSnackMessage={snackMessage} /> }
            </View>


            <View>


                <View style={{ backgroundColor: theme.secondaryColor, paddingHorizontal: 10, borderRadius: 20, paddingVertical: 10 }}>
                    <SettingItem icon="globe-outline" label={t('setting.settingitem.item1')} list={LanguageList} theme={theme} selected={selectedLanguage} setSelected={setSelectedLanguage} visible={languageListVisible} setVisible={setLanguageListVisible} lang={true} />
                    <SettingItem icon="logo-usd" label={t('setting.settingitem.item2')} currency={defCurrency} theme={theme} dropdown={false} onPress={goToCurrencyPicker} />
                    <SettingItem icon="sunny" label={t('setting.settingitem.item3')} list={SystemList} theme={theme} selected={selectedSystemMode} setSelected={setSelectedSystemMode} visible={systemListVisibility} setVisible={setSystemListVisibility} systemChange={true} />
                    <SettingItem icon="chatbox-outline" label={t('setting.settingitem.item4')} theme={theme} dropdown={false} onPress={showFeedBackModal} border={false} />

                </View>

                 { joinedWaitlist && <View style={{marginVertical: 10, }}>
                    <Text style={{color: 'green', fontSize: 10, }}>
                    {t('setting.gmailfeature')}
                    </Text>

                </View>}
                {
                    feedbackVisible && <FeedbackModal isVisible={feedbackVisible} onClose={() => setFeedbackVisible(false)} theme={theme} setSnackVisible={setSnackVisible} setSnackMessage={snackMessage} />
                }
            </View>

            <SnackBarBottom visible={snackVisible} setVisible={setSnackVisible} message={snackMessage.message} color={snackMessage.color}/>


        </View>
    )
}




const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    pressed: {
        opacity: 0.5
    },
    buttonContainer: {
        justifyContent: 'flex-start',
        width: 150,
        marginTop: 20
    },

})


export default SettingLayout
