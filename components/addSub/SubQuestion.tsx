import useServiceHook from '@/customHooks/GetLogoOnline';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../ui/CustomButton';
import InputText from '../ui/InputText';
import DatePicker from '../ui/PickDate';
import CategoryDropdown from './CategoryDropDown';
import * as SecureStore from 'expo-secure-store'
import { useAppSelector } from '@/redux/hooks';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import 'dayjs/locale/es'; // Spanish
import 'dayjs/locale/fr'; // French
import 'dayjs/locale/en'; // English
import 'dayjs/locale/it'; // Italian
import 'dayjs/locale/tr'; // Turkish
import i18n from '../../src/locales/index'
import SnackBarBottom from '../ui/SnackBar';




const SubQuestion = ({ theme, id, activate }: { theme: any, id?: string, activate?: string }) => {
    const db = useSQLiteContext();

    const [snackBarVisible, setSnackBarVisible]  = useState<boolean>(false)
     const [snackbarMessage, setSnackBarMessage] = useState({
       message: "", 
       color: ""
     })

    const {t} = useAppTranslation()

    const [serviceName, setServiceName] = useState<string>('')
    const { logoImage, FindLogo,  setLogoHandler } = useServiceHook()
    const [symbol, setSymbol] = useState<string>("")
    /// this useRef is to check if out date has been selected.
    const dateSelected = useRef<boolean>(false)

    const [price, setPrice] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    // intializes the dayjs with the current language.
    dayjs.locale(i18n.language);
   
    const [date, setDate] = useState<Date>(dayjs().toDate());

    const validDate = useRef<boolean>(false)

    const [description, setDescription] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    const [note, setNote] = useState<string>("")
    const editing = useRef<boolean>(false)


    const [ContinueStyle, setContinueStyle] = useState<any>({
        backgroundColor: theme.tetiaryColor,
        color: "black"
    })


    function serviceNameHandler(text: string) {
        setServiceName(text)
    }

    async function findLogoHandler() {
        if (!serviceName) {
            return
        }
        try {
            console.log('presseddddddd')
            await FindLogo(serviceName)
            console.log("logo Image: ", logoImage)
        } catch (error) {
            return ;
            // setSnackBarVisible(true)
            // setSnackBarMessage({message: "Something went wrong, You need a connection to retrive a logo", color: "#DC2626"})
        }
    }

    function setPriceHandler(text: string) {
        const invalidPattern = /[_,\-\/,]/; // any of these characters

        if (invalidPattern.test(text)) {
            return; // don't set the price
        }

        if (price.includes(".") && text === ".") {
            return
        }

        console.log(text);
        setPrice(text);
    }



    function ValidateNecessaryField() {

     
        // checks if the necessary field  has been filled out
        const validation = !!price && !!selectedCategory && !!validDate.current && !!serviceName 

       
        if (!validation) {
            return false
        }
        setContinueStyle(
            {
                backgroundColor: 'blue',
                color: 'white'

            }
        )
        return true
    }


    useEffect(() => {

        const interval = setTimeout(() => {

            ValidateNecessaryField()
        }, 100)


        return () => clearTimeout(interval)
    }, [price, selectedCategory, validDate.current, serviceName, logoImage])

    const addsubParams = {
        platformname: serviceName,
        price: price,
        firstpayment: dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        ,
        iconurl: logoImage ? logoImage.logo : null,
        note: note,
        paymentmethod: paymentMethod,
        description: description,
        category: !editing.current ? selectedCategory?.labelkey : selectedCategory,
        symbol: symbol 

    }


    useEffect(() => {
        const EditValue = async () => {
            console.log("Did editing work")
            if (!id) return;
            console.log("Yes")
            try {
                const sub: any = await db.getFirstAsync(`SELECT * FROM userSubscriptions WHERE id = ?`, [id]);
                console.log("sub: ", sub.category)
                if (sub) {
                    dateSelected.current = true
                    validDate.current = true
                    setLogoHandler({
                        logo: sub.iconurl,
                        name: sub.platformname
                    })
                    editing.current = true
                    setPrice(sub.price)
                    setServiceName(sub.platformname)
                    setSymbol(sub.symbol)
                    setDate(dayjs(sub.firstpayment).toDate())
                    setSelectedCategory(sub.category)
                    setNote(sub.note)
                    setPaymentMethod(sub.paymentmethod)
                    setDescription(sub.description)
                    editing.current = true
                }
            } catch (error) {
                console.log(error)
            }
        }
        EditValue()

    }, [id])



    useEffect(() => {
        const getSymbol = async () => {
            try {
                const defaultCurrency = await SecureStore.getItemAsync('defaultCurrency')
                if (defaultCurrency) {
                    setSymbol(JSON.parse(defaultCurrency).symbol)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getSymbol()
    }, [])

   console.log("LOGO IMagE:: : : ", logoImage.logo)


//    let logoImage 

//    if (log)

    return (
        <ScrollView>


            <KeyboardAvoidingView >


                <View>
                    <View style={styles.centeralize}>
                        <View>
                            <View style={{justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: theme.primaryText, fontWeight: 'bold' }}>{t("addsub.subquestion.icon")}</Text>
                                <Text style={{ color: theme.primaryText, fontWeight: 'bold', fontSize: 6 }}>{t("addsub.info")}</Text>
                            </View>
                            

                        </View>
                        {logoImage ? <Image source={{ uri: logoImage.logo}}  style={[styles.image, { width: 60, height: 60 ,}]} /> : 
                            <View
                                style={{ width: 50, height: 50, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginVertical: 10 }}
                            >
                                <Text style={{ color: theme.primaryText, fontWeight: 'bold' }}>{serviceName.slice(0, 1)}</Text>
                            </View>
                        }

                    </View>


                    <View>


                        <View>
                            <InputText inputTitle={t("addsub.subquestion.name.text")} inputTitleColor={theme.primaryText} placeholder={t("addsub.subquestion.name.placeholder")} placeholderTextColor={theme.placeholdertext} extraInputStyle={[styles.generalinput, { color: theme.primaryText, backgroundColor: theme.secondaryColor }]} value={serviceName} onChangeText={serviceNameHandler} onSubmitEditing={findLogoHandler} onBlur={findLogoHandler} />
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={{ flex: 0.3 }}>
                                <InputText inputTitle={t("addsub.subquestion.price.text")} maxLength={5} inputTitleColor={theme.primaryText} placeholder={`${symbol}${t("addsub.subquestion.price.placeholder")}`} placeholderTextColor={theme.placeholdertext} extraInputStyle={[styles.generalinput, { color: theme.primaryText, backgroundColor: theme.secondaryColor }]} value={price} onChangeText={setPriceHandler} keyboardType='numeric' />
                            </View>
                            <View style={{ flex: 0.6 }}>
                                <Text style={[styles.title, { color: theme.primaryText, marginBottom: 4, marginTop: 10 }]}>{activate ? t("addsub.subquestion.dateofActivation.text") : t("addsub.subquestion.firstpayment.text")}</Text>
                                <DatePicker theme={theme} date={date} setDate={setDate} validDate={validDate} label={dayjs(date).locale(i18n.language).format('MMMM D, YYYY')} dateSelected={dateSelected} />
                            </View>
                        </View>

                        <View>
                            <Text style={[styles.title, { color: theme.primaryText, marginBottom: 4 }]}>{t("addsub.subquestion.category.text")}</Text>
                            <View>
                                <CategoryDropdown theme={theme} selected={selectedCategory} setSelected={setSelectedCategory} editing={editing} />
                            </View>
                        </View>


                        <View>
                            <InputText inputTitle={t("addsub.subquestion.paymentmethod.text")} inputTitleColor={theme.primaryText} optional={true} optionalTextColor={theme.primaryText} placeholder={t("addsub.subquestion.paymentmethod.placeholder")} placeholderTextColor={theme.placeholdertext} extraInputStyle={[styles.generalinput, { color: theme.primaryText, backgroundColor: theme.secondaryColor }]} value={paymentMethod} onChangeText={setPaymentMethod} />
                        </View>

                        <View>
                            <InputText inputTitle={t("addsub.subquestion.description.text")} inputTitleColor={theme.primaryText} optional={true} optionalTextColor={theme.primaryText} placeholder={t("addsub.subquestion.description.placeholder")} placeholderTextColor={theme.placeholdertext} extraInputStyle={[styles.generalinput, { color: theme.primaryText, backgroundColor: theme.secondaryColor }]} value={description} onChangeText={setDescription} />
                        </View>

                        <View>
                            <InputText inputTitle={t("addsub.subquestion.note.text")} optional={true} inputTitleColor={theme.primaryText} multiline={true} optionalTextColor={theme.primaryText} placeholder={t("addsub.subquestion.note.placeholder")} placeholderTextColor={theme.placeholdertext} extraInputStyle={[styles.noteInput, { color: theme.primaryText, backgroundColor: theme.secondaryColor }]} value={note} onChangeText={setNote} />
                        </View>



                    </View>

                    <View >
                        <CustomButton title={t("addsub.continue")} onPress={ContinueStyle.backgroundColor === 'blue' 
                            ? () => {console.log(addsubParams); return router.push({ pathname: '/NotificationScreen', params: { ...addsubParams, id: id, activate: activate} })}
                            : () => {

                                if (ValidateNecessaryField() === false) {
                                    setSnackBarVisible(true);
                                    setSnackBarMessage({message: "Cannot add subscription fill in the necessary spaces", color: "#DC2626"});
                                    return

                                }
                                if (!logoImage) {
                                    setSnackBarVisible(true);
                                    setSnackBarMessage({message: "subscription name does not exist", color: "#DC2626"});
                                } else {
                                    Alert.alert(t("addsub.error"));
                                }
                            }} style={ContinueStyle} textColor={ContinueStyle.color} />
                    </View>



                </View>
                <SnackBarBottom visible={snackBarVisible} setVisible={setSnackBarVisible} message={snackbarMessage.message} color={snackbarMessage.color}/>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeralize: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowContainer: {

        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    generalinput: {
        height: 50,
        width: '100%',
        borderWidth: 0.1,
        textAlignVertical: 'center'

    },
    noteInput: {
        height: 60,
        width: '100%',
        borderWidth: 0.1,
        textAlignVertical: 'top'
    },
    image: {
        width: 50,
        height: 50
    },
    customButtonContainer: {
        flex: 1,                      // Take full screen space
        justifyContent: 'center',    // Center vertically
        alignItems: 'center',
        marginTop: '2%'


    }, title: {
        fontSize: 16,
        fontWeight: 'bold'
    }

})




export default SubQuestion
