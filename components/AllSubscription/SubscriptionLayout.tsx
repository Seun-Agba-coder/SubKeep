import  {View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import IconButton from '../ui/IconButton';
import SubscriptionList from '../subscriptions/SubscriptionList';
import { useState } from 'react';
import { getSubscriptionsAlphabetically, getSubscriptionsByPriceAsc, getSubscriptionsByPriceDesc } from '@/utils/Crud';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import { useSQLiteContext } from 'expo-sqlite';








const SubscriptionLayout  = ({theme, subscriptions, setActiveSub,setInactiveSub, active}: any) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [selected, setSelected]  = useState<number| null>(null)
    const {t} = useAppTranslation()
    const db: any = useSQLiteContext()

    const FilterOptions = [
        {text: t("AllSubscription.filterOptions.1"),onPress: async (db: any) => {return await getSubscriptionsByPriceDesc(db)}},
        {text: t("AllSubscription.filterOptions.2"),onPress: async (db: any) => { return await getSubscriptionsByPriceAsc(db)}},
        {text: t("AllSubscription.filterOptions.3"),onPress: async (db: any) => {return await getSubscriptionsAlphabetically(db)}}]
    
    
    return (
        <View>
            <View style={styles.filterLayout}>
                
                    <View style={styles.rowContainer}>
                        <Text style={[{color: theme.primaryText}]}>{t('AllSubscription.viewall')}</Text>
                        <IconButton name="filter" onPress={() => {setModalVisible(true)}} size={20}/>
                    </View>
            
            </View>
            <SubscriptionList data={subscriptions} theme={theme} active={active}/>

            {
            modalVisible && 
            <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.overlay}>
              <View style={[styles.modalContainer, {backgroundColor: theme.background}]}>
            
                {
                    FilterOptions.map((item, index) => {
                        return (
                            <Pressable key={index}
                             onPress={async () => {setSelected(index); const subscription =  await item.onPress(db); console.log("From Subscriptions layout: ", subscription); setModalVisible(false); setActiveSub(subscription) }} 
                             style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center', padding: 10}}>
                                <View style={{paddingVertical: 10}}>
                                    <Text style={[{color: theme.primaryText, fontSize: 15}]}>{item.text}</Text>
                                </View>
                                
                                        <View 
                                        style={{height: 21,
                                         width: 21,
                                          borderRadius: 10,
                                           backgroundColor: selected === index ? theme.primaryText : 'rgba(180, 24, 24, 0.3)',
                                            borderWidth: 1,
                                             borderColor: theme.primaryText }}>
                                            
                                        </View>
                                 
                            </Pressable>
                        )
                    })
                }
    
                   
               
              </View>
            </View>
        </Modal>
            
        }


        </View>

       
    )
}



const styles = StyleSheet.create({
    filterLayout :{
        justifyContent: 'flex-start',
        alignItems: 'flex-end', 
        marginVertical: 5, 
        
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }, 
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 239, 239, 0.6)',
        justifyContent: 'flex-end', 
        alignItems: 'center'
    },
    modalContainer: {
        width: '100%',
        height: '30%', 
        borderRadius: 20,
        paddingHorizontal: 10,
    }, 

})


export default SubscriptionLayout