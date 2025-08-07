import {View, Text, Modal, StyleSheet} from  'react-native'
import CustomButton from '../ui/CustomButton'
import { useState, useEffect } from 'react'
import PressableText from '../ui/PressableText'
import GmailModal from './GmailModal'
import {  onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; 
import { saveUserToWaitlist } from '@/Firebase/FirebaseBackend'
import { useAppTranslation } from '@/hooks/useAppTranslator';


interface ThemeProps {
    theme: any
    setSnackVisible: (visible: boolean) => void;
    setSnackMessage: (message: any) => void;
}

const GmailTracker = ({theme, setSnackVisible, setSnackMessage}: ThemeProps) => {

  
    const [modalVisibleSuccess, setModalVisibleSuccess] = useState(false)
    const [userinfo, setUser] = useState<any>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [signedUp, setSignedUp] = useState(false)
    const {t } = useAppTranslation()

   useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {

            setIsAuthenticated(true)
            setUser(user)
        } else {
         
            setIsAuthenticated(false)
        }
        });

   } ,[])
   



    async function JoinWaitlist() {
        console.log("From JOinWaitList function::: ", userinfo)
        if (!isAuthenticated) {
           
            return;
        }
        try {
            await saveUserToWaitlist(userinfo)
            setModalVisibleSuccess(true)
            setSignedUp(true)
        } catch (error) {
            console.log(error)
            setSnackVisible(true)
            setSnackMessage({message: `${t('setting.success.error')}}`, color: "#DC2626"})
        }




        return 
    }

   if (signedUp) {
    return (<>
    </>
    )
   }


    return (
        <View style={{backgroundColor: theme.secondaryColor, padding: 17, borderRadius: 15, opacity: 0.5, marginBottom: 20,}}>
            <Text style={styles.title}>{t("setting.trackingCard.title")}</Text>
            <Text style={styles.subTitle}>{t("setting.trackingCard.subTitle")}</Text>
            <View style={{alignItems: 'flex-start', marginLeft: -20,  }}>

            <CustomButton title={`${t("setting.trackingCard.joinWaitlist")}` }  onPress={JoinWaitlist} textColor={theme.primaryColor} textStyle={{alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: theme.accentColor, borderRadius: 15, }}/>
            </View>
            


           
            {modalVisibleSuccess &&
             <GmailModal modalVisible={modalVisibleSuccess} setModalVisible={setModalVisibleSuccess} title={t('setting.trackingCard.success')} subtitle="You have successfully joined the waitlist" theme={theme}/>
               
            }


        </View>
    )


  
}

const styles  = StyleSheet.create({
    title : {
        fontSize: 15,
        fontWeight: "600", 
    }, 
    subTitle: {
        fontSize: 10,
        fontWeight: '400'
    }
})


export default GmailTracker



