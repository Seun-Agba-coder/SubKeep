import React, { useState, useEffect } from 'react';
import { View, FlatList, Pressable, StyleSheet} from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router'
import { useAppSelector } from '@/redux/hooks';
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle';
import * as SecureStore from 'expo-secure-store';
import { useLocalSearchParams } from 'expo-router';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import UseCurrencyHook from '@/hooks/useCurrencyHook';
import ModalContainer from '@/components/ui/ModalContainer';
import { ChangeCurrenySymbolForAllSub } from '@/utils/Crud';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef } from 'react';

export interface CurrrencyListProp {
    code: string;
    symbol: string;
    name: string;
}








export default function CurrencySelectScreen() {
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const theme = mode === 'light' ? LightTheme : DarkTheme;
    const [modalVisible, setModalVisible] = useState(false)
    const currencyChange = useRef<boolean>(false)
    const {t} = useAppTranslation()

    const {CurrencyList} = UseCurrencyHook()
   
    const { to } = useLocalSearchParams()
    console.log("To: : ", to)


    const db  = useSQLiteContext();
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);

  const handleNext = async () => {
    if (selectedCurrency) {
      
    await  storeCurrencyInDevice(selectedCurrency)
     if (to === 'update') {
      router.push('/(tab)/Setting'); 
     }else {
      router.push('/(tab)/Index'); 
     }
    }
  };

  
async function storeCurrencyInDevice(selectedCurrency: CurrrencyListProp) {
    await SecureStore.setItemAsync("defaultCurrency", JSON.stringify({
        ...selectedCurrency
    }))
}


async function UpdateCurrencyInDevice(selectedCurrency: CurrrencyListProp) {

  await ChangeCurrenySymbolForAllSub(db, selectedCurrency.symbol);
  await handleNext();

}

useEffect(() => {
  const getDefualtCurrency = async () => {
    const defaultCurrency = await SecureStore.getItemAsync("defaultCurrency")
    if (defaultCurrency) {
      setSelectedCurrency(JSON.parse(defaultCurrency))
    
    }
  }
  getDefualtCurrency()
}, [])

  return (
    <View style={[styles.container, {backgroundColor: theme.background,}]}>
      <Text variant="titleLarge" style={[styles.title, { color: theme.primaryText}]}>
        {t("currencyPicker.title")}
      </Text>

      <FlatList
        data={CurrencyList}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        renderItem={({ item}: {item: CurrrencyListProp}) => {
          const isSelected = selectedCurrency?.code === item.code;
          return (
            <>
              <Pressable
                onPress={() => {
                  setSelectedCurrency(item)
                  currencyChange.current = true
                }}
                style={{
                  paddingVertical: 16,
                  backgroundColor: mode === 'dark' ? isSelected ? 'rgba(255, 255, 255, 0.09)' : 'transparent' : isSelected ? 'rgba(35, 157, 175, 0.09)' : 'transparent',
                  borderRadius: 8,
                }}
              >
                <View style={styles.rowContainer}>
                    <Text style={{ color: theme.primaryText, fontSize: 16 }}>
                        {item.code} ({item.symbol})
                      </Text>
                      <Text style={[styles.subtitle, {color: theme.primaryText}]}>
                        {item.name}
                      </Text>
                </View>
              </Pressable>
              <Divider style={{ backgroundColor: theme.primaryText }} />
            </>
          );
        }}
      />

      <Button
        mode="contained"
        onPress={()  => {
          if (!to) {
            console.log('to: : ', to)
            console.log("handel next is beeing pressed")
            handleNext()
            
          }else {
             if (currencyChange.current) {
              setModalVisible(true)
              return;
             }
             handleNext()
          }
           
        }}
        disabled={!selectedCurrency}
  
        style={{ marginTop: 20, borderRadius: 50 }}
        buttonColor={ theme.accentColor2}
        textColor={theme.primaryText}
      
      >
        {to === 'update' ? t('currencyPicker.update') : t('currencyPicker.next')}
      </Button>

      {
        modalVisible && <ModalContainer visible={modalVisible} setVisible={setModalVisible} actionText={t('currencyPicker.update')} title={t('currencypicker.subtitle')} body={t('currencypicker.changeSymbolBody')} theme={theme} actionHandler={() => {UpdateCurrencyInDevice(selectedCurrency)}}/>
      }
    </View>
  );
}



const styles = StyleSheet.create( {
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 10  
    },
    title: {
        fontSize: 18,
        fontWeight: "400", 
 
       marginBottom: 20, 
    },
    rowContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between', 
    },
    subtitle: {
        fontSize: 10,
    }

})
