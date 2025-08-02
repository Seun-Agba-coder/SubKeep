import BillingIndicator from '@/components/Index/BillingIndicator'
import CustomCalender from '@/components/Index/CustomCalender'
import SubHorizontalList from '@/components/subscriptions/SubHorizontalList'
import CustomButton from '@/components/ui/CustomButton'
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle'
import useMonthlyBillTotal from '@/hooks/useMonthlyBillTotal'
import { useAppSelector } from '@/redux/hooks'
import { calculateDaysUntilNextBilling } from '@/utils/Billiigfunctions'
import { getActiveAndInactiveSubscription } from '@/utils/Crud'
import { generateBillingDates } from '@/utils/FutureBilling'
import { router} from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable, Modal, ScrollView} from 'react-native'
import { useAppTranslation } from '@/hooks/useAppTranslator'
import i18n from '../../src/locales/index'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; 
import { useFocusEffect } from '@react-navigation/native';
import { Calendar,  CalendarList} from 'react-native-calendars';
import { useLocalSearchParams } from 'expo-router'
import dayjs from 'dayjs'

function formatDate(date: Date) {
  return dayjs(date).format('YYYY-MM-DD'); // returns "YYYY-MM-DD"
}


const Home = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDayMarkers, setSelectedDayMarkers] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");

    const [isAuthenticated, setIsAuthenticated ] = useState(false)
    const [getUserName, setGetUserName] = useState<any>("")
   
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const theme = mode === 'light' ? LightTheme : DarkTheme;
    const { t } = useAppTranslation()

    const [visibleMonth, setVisibleMonth] = useState(new Date());
    const [defualtSymbol, setDefualtSymbol] = useState<string>("")
    
    const db = useSQLiteContext()
    const getTotal = useMonthlyBillTotal(db);

    const [savedSubscription, setSavedSubscritption] = useState<any>()
    const [updatedSubscription, setUpdatedSubscription] = useState<any>([])
    const [billingMarkers, setBillingMarkers] = useState<any>([])
    const [getMontlyTotal, setGetMonthlyTotal] = useState<string>("0.00")

   const { refresh } = useLocalSearchParams();

   console.log("Refresh parameter: ", refresh)

   const userSubscription = async () => {
    console.log("Activate Screen ")
    const subscriptions = await getActiveAndInactiveSubscription(db)
   
    
   
   
    const currencyItem = await SecureStore.getItemAsync('defaultCurrency')
    const currencyItemJson = currencyItem ? JSON.parse(currencyItem) : null;

    const billingMarkers: any = {}
    subscriptions.forEach((sub: any) => {
        const dates = generateBillingDates({ firstPayment: sub.firstpayment, billingType: sub.billingperiodtime, interval: parseInt(sub.billingperiodnumber), freeTrialDays: sub.freetrialduration ? parseInt(sub.freetrialduration) : 0, isactive: parseInt(sub.isactive), canceldate: sub.canceldate });
        
   

        dates.forEach((date: any) => {
            const key = date.date.toISOString().split("T")[0]; // format: "YYYY-MM-DD"

            if (!billingMarkers[key]) billingMarkers[key] = [];
            billingMarkers[key].push({ iconurl: sub.iconurl, status: date.color });
        });


    });



 

                    // Create markedDates object for custom rendering
    const createMarkedDates = () => {
        const markedDates: any = {};
        
        Object.keys(billingMarkers).forEach(date => {
        const subs = billingMarkers[date];
        
        markedDates[date] = {
            customStyles: {
            container: {
                backgroundColor: 'transparent',
            },
            text: {
                color: '#ffffff',
            }
            },
            // Store subscription data for custom rendering
            subscriptions: subs
        };
        });
        
        return markedDates;
    };

    const customBillingMarkers: any = createMarkedDates();
    
 


    setSavedSubscritption(subscriptions)
    setBillingMarkers(customBillingMarkers)
    setDefualtSymbol(currencyItemJson?.symbol)

}


    useFocusEffect(
        useCallback(() => {
       
            userSubscription()
          

        }, [refresh])
    )

  //Runs when refresh parameter changes (for same-screen refreshes)
useEffect(() => {
   const calluserSubscripton = async () => {
    await userSubscription();
   }
  if (refresh) {
      console.log(" The refresh calls the userSubscription")
      calluserSubscripton();
  }
}, [refresh]);

    useEffect(() => {
      // this hook is used to check if a user Is logged in or not
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
        
            setGetUserName(auth.currentUser?.displayName)
            setIsAuthenticated(true);
          } else {
          
            setIsAuthenticated(false);
          }
        });
      
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);


  

    useEffect(() => {
        const currencyChecker = async () => {
            const defaultCurrency = await SecureStore.getItemAsync('defaultCurrency')
            
            if (!defaultCurrency) {
                router.push("/(stack)/CurrencyPicker")
            }
        }

    

        currencyChecker()
    }, [refresh])



    const formattedMonth = visibleMonth.toLocaleString(i18n.language, {
        month: 'long',
        year: 'numeric',
    });

    useEffect(() => {
        const getMonthlyTotal = async () => {
            const total: string = await getTotal(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1);
      

            const cleaned = total.replace(/^\s*0/, '');
            if (total === "0") {
              
                return;
            }
            setGetMonthlyTotal(cleaned);
        }
        getMonthlyTotal()

    }, [visibleMonth])
   
    useEffect(() => {
        const updateSubscription = () => {
            if (!savedSubscription) {
              
                console.log("No saved Subscription yet")
                return;
            } 
        
            const updatedSubscription = savedSubscription
            ?.filter((sub: any) => parseInt(sub.isactive) !== 1)
            .map((sub: any) => {
              const daysRemaining = calculateDaysUntilNextBilling(sub);
              return { ...sub, subremainingDays: daysRemaining };
            })
            .sort((a: any, b: any) => a.subremainingDays - b.subremainingDays);
            
            console.log("UPDATED SUBSCRIPTION: ", updatedSubscription)
            setUpdatedSubscription(updatedSubscription)
    
        }
        updateSubscription()

      
    }, [visibleMonth, savedSubscription])

    const onMonthChange = (month: any) => {
     
        setVisibleMonth(new Date(month.year, month.month - 1, 1))
      };

      const CustomDay = ({ date, marking }: any) => {
        const hasSubscriptions = marking && marking.subscriptions;
      
       
        const dayNumber = date.day;
        
        return (
          <Pressable
           style={styles.dayContainer}
           android_ripple={{color: '#FAFAFA'}}
            onPress={() => {
                if (hasSubscriptions) {
                    if (marking?.subscriptions.length > 1) {
                        setSelectedDate(formatDate(new Date(date.dateString)));
                    }
                    setSelectedDayMarkers(marking.subscriptions);
                    setModalVisible(true);
                }
            }}

            >
          
             {hasSubscriptions && (
              <View style={styles.logoContainer}>
                {marking.subscriptions.slice(0, 1).map((sub: any, index: any) => (
                  <Image
                    key={index}
                    source={{ uri: sub.iconurl }}
                    style={[
                      {
                        width: 14,
                        height: 14,
                      }, 
                    
                    ]}
                    resizeMode="contain"
                  />
                ))}

               
                    <View style={{alignItems: 'flex-start'}}>
                        <View
                      style={{
                        backgroundColor: marking.subscriptions[0].status,
                        height: 8,
                        width: 8,
                        borderRadius: 4
                      }}
                    />
                     {marking.subscriptions.length >= 2 && (

                  <Text style={{color: 'black', fontSize: 10, fontWeight: 'bold'}}>+{marking.subscriptions.length }</Text>
                  )}
                  </View>
               
              </View>
            )}
         
           
            <Text style={{color:'black', marginTop: 5, }}>{dayNumber}</Text>
           
          </Pressable>
        );
      };


   

  
  


    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} style={[styles.container, { backgroundColor: theme.background }]}>
             <View>
            {
                isAuthenticated && (
                <View style={styles.welcomeContainer}>
                <Text style={{color: theme.primaryText, fontSize: 19, fontWeight: '400'}}>{t("index.welcome")} <Text style={{color: theme.primaryText, fontSize: 19, fontWeight: '900'}}>{getUserName}</Text></Text>
                <Text style={{fontSize: 8, color: 'gray'}}> {t("index.greeting")} </Text>
            </View>)

            }
              
                
               

                <View style={styles.rowContainer}>


                    <Text style={[styles.title, { color: theme.primaryText }]}>{formattedMonth}</Text>
                    <Text style={[styles.subTitle, { color: theme.primaryText }]}>{t("index.monthlytotal")}:<Text style={[styles.title, { color: theme.primaryText }]}>{defualtSymbol}{getMontlyTotal}</Text></Text>


                </View>
                <View style={{ marginBottom: '4%' }}>
                    <View style={styles.row}>
                        <BillingIndicator status="monthly" theme={theme} children={t("index.type.monthly")} />
                        <BillingIndicator status="yearly" theme={theme} children={t("index.type.yearly")} />

                    </View>
                    <View style={styles.row}>
                        <BillingIndicator status="onetime" theme={theme} children={t("index.type.onetime")} />
                        <BillingIndicator status="inactive" theme={theme} children={t("index.type.inactive")} />

                    </View>
                    <View style={styles.row}>
                        <BillingIndicator status="freetrial" theme={theme} children={t("index.type.freetrial")} />
                    </View>


                </View>

                <View  style={{marginBottom: '5%'}}>
                    {/* <CustomCalender theme={theme} changeMonth={handleMonthChange} billingMarkers={billingMarkers} /> */}
                    <Calendar
                   current={new Date().toISOString().split('T')[0]}
                   hideArrows={false}
                   hideExtraDays={true}
                   hideDayNames={false}
                   renderHeader={() => null}
                   onMonthChange={onMonthChange}
                   enableSwipeMonths={true}
                   markingType={'multi-dot'}
                   markedDates={billingMarkers}
                   dayComponent={CustomDay}
                 
                    />
                </View>

             

                    <View style={updatedSubscription.length == 0 ? {alignItems: 'center'} : {paddingLeft: '2%'}}>
                        {updatedSubscription.length > 0 && <Text style={{ color: theme.primaryText, fontSize: 16, fontWeight: '600', paddingLeft: '2%' }}> {t("index.title")}</Text>}
                   
                        <SubHorizontalList data={updatedSubscription} theme={theme} />
                    </View> 
                


            </View>

            {modalVisible && (
                    <Modal transparent visible animationType="slide">
                      <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                            Subscriptions for {selectedDate}
                          </Text>
                          <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {selectedDayMarkers.map((sub: any, index: any) => (
                              <View style={{flexDirection: 'row', gap:2}}>
                              <Image
                                key={`${sub.iconurl}-${index}`}
                                source={{ uri: sub.iconurl }}
                                style={{ width: 40, height: 40, borderRadius: 5 }}
                                resizeMode="contain"
                              />
                              <View>
                                            <View
                                    style={{
                                      backgroundColor: sub.status,
                                      height: 8,
                                      width: 8,
                                      borderRadius: 4
                                    }}
                                  />
                              </View>
                              </View>
                            ))}
                          </ScrollView>
                          <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
                            <Text style={{ color: '#fff' }}>Close</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                  )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 5,
        paddingTop: 10,
        paddingHorizontal: '0.1%'
    },
    welcomeContainer: {
        marginVertical: '2%',
        marginLeft: "5%"
    },
    title: {
        fontWeight: '500',
        fontSize: 17
    },
    subTitle: {
        fontWeight: '300',
        fontSize: 12
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20
    },
    infoContainer: {
        marginVertical: 10,
        marginHorizontal: 20,

    },
    box: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    innerBox: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    subscriptionTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '2%'

    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginHorizontal: "3%"
    },
    dayContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      },
      logoContainer: {
        // position: 'absolute',
        // top: 2,
        // left: 10,
        flexDirection: 'row',
        gap: 2, 
        
        alignItems: 'center',
      },

      imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      },
      modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10
      },
      modalClose: {
        marginTop: 20,
        backgroundColor: '#333',
        borderRadius: 20, 
        padding: 10,
        alignItems: 'center'
      }
 

})


export default Home

