import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import { useAppSelector } from '@/redux/hooks'
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle';
import HeaderComponent from '@/components/addSub/HeaderComponent';
import { router } from 'expo-router';
import SubQuestion from '@/components/addSub/SubQuestion';
import { useLocalSearchParams } from 'expo-router';
import { useAppTranslation } from '@/hooks/useAppTranslator';






const AddSub = () => {
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const theme = mode === 'light' ? LightTheme : DarkTheme
    const {t } = useAppTranslation()
    

    const { id, to, activate }: any= useLocalSearchParams();


   
  



    return (
  
     <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       style={{flex: 1}}
       keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
       
       >
          <ScrollView
           style={[styles.container, {backgroundColor: theme.background}]}
               keyboardShouldPersistTaps="handled"
           >



    
     <View>
        <HeaderComponent icon='arrow-back' color={theme.primaryText} size={30} onPress={() => router.back()} leftText={t("addsub.leftText")} rightText={activate ? "ActivateSubscription": t("addsub.RightText")}/>
            <View>
                {to === 'update' ? <SubQuestion theme={theme} id={id} activate={activate}/>: <SubQuestion theme={theme} />}
            
            </View>
       
     </View>
     </ScrollView>
     </KeyboardAvoidingView>
    
    )
}


const styles = StyleSheet.create({
     container: {
        flex: 1,
        padding: 20, 
    

     }
})



export default AddSub