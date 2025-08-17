import Notify from '@/components/addSub/Notify';
import CustomButton from '@/components/ui/CustomButton';
import DropDownMenu from '@/components/ui/DropDownPicker';
import IconButton from '@/components/ui/IconButton';
import InputText from '@/components/ui/InputText';
import ToogleButton from '@/components/ui/Toggle';
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle';
import { useAppSelector } from '@/redux/hooks';
import { saveSubcriptionLocally, updateUserSubscription } from '@/utils/Crud';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslator';
import useNotificationHook from '@/hooks/useNotification';
import * as Notifications from 'expo-notifications'
import { setActive } from '@/utils/Crud';
import { showMessage } from 'react-native-flash-message';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import 'dayjs/locale/it';

function getOrdinalSuperscript(n: number) {
  const suffix = (() => {
    if (n % 100 >= 11 && n % 100 <= 13) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  })();

  const superscriptMap: any = {
    's': 'ˢ',
    't': 'ᵗ',
    'n': 'ⁿ',
    'd': 'ᵈ',
    'h': 'ʰ',
    'r': 'ʳ',
  };

  const superscriptSuffix = suffix
    .split('')
    .map(letter => superscriptMap[letter] || letter)
    .join('');

  return `${n}${superscriptSuffix}`;
}

// Converts string to boolean
function toBoolean(str: string | null | undefined): boolean {
  return str?.toLowerCase() === 'true';
}

interface NotificationHeaderProps {
  theme: any;
}

const NotificationHeader = ({ theme, }: NotificationHeaderProps) => {
  const { t } = useAppTranslation()

  return (
    <View style={styles.headerContianer}>
      <View>
        <Text style={{ color: theme.primaryText, fontSize: 18, fontWeight: 'bold' }}>{t('addsub.notificationscreen.header.title')}</Text>
      </View>

      <View>
        <IconButton name="close-sharp" color={theme.primaryText} size={30} onPress={() => router.push('/Index')} />
      </View>
    </View>
  )
}

const NotificationScreen = () => {
  const db = useSQLiteContext()
  const requestNotificationPermission = useNotificationHook()

  const { t, i18n } = useAppTranslation()

  const { id,activate, ...params }: any = useLocalSearchParams()

  const [period, setPeriod] = useState<string>('1')
  const [freeTrial, setFreeTrial] = useState<boolean>(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
  const [selectedPeriod, setSelectedPeriod] = useState<{ value: string, label: string }>({ value: 'Month', label: 'Month' })
  const [trialDuration, setTrialDuration] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [billingList,  setBillingList] = useState<any>('')




  async function setNotificationEnabledHandler(value: boolean) {
    const permission = await requestNotificationPermission.requestNotificationPermission()
    
    if (permission) {
      setNotificationsEnabled(value)
      return;
    } 
    setNotificationsEnabled(false)
  }


  async function setFreetrialHandler(value: boolean) {
    const permission = await requestNotificationPermission.requestNotificationPermission()
    // if (permission) {

    //   // Now notifications will work AND use the handler from App.js
    //   await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: "Welcome!",
    //       body: "Notifications are now enabled",
    //     },
    //     trigger: { type: 'timeInterval', seconds: 1 } as Notifications.NotificationTriggerInput,
    //   });


    if (permission) {
      setModalVisible(value)
      setFreeTrial(value)
      return;
    }  
    setModalVisible(false)
    setFreeTrial(false)
 
}



function selectedPeriodHanlder({ value, label }: any) {
  // this funciton checks if the selected period was a oneTime subscription and if so set the period  to null

  if (value === t('addsub.notificationscreen.dropdown.onetime')) {
    setPeriod("")
  }
  setSelectedPeriod({ value: value, label: label })
}

// using this instead of useState to show the free trial shit.
const [showTrialMessage, setShowTrialMessage] = useState<boolean>(false)

const convertDate = dayjs(params.firstpayment)

console.log('convertData: ', convertDate.format())

const day = convertDate.date();
const daySuperScript = getOrdinalSuperscript(Number(day))

// Set dayjs locale to match i18n language
dayjs.locale(i18n.language);

const month = convertDate.toDate().toLocaleString(i18n.language, { month: 'long' }); // 'June'
const formattedDate = `${month} ${daySuperScript} `;
const year = convertDate.year().toString()

const mode = useAppSelector((selector) => selector.appmode.mode)
const theme = mode === 'light' ? LightTheme : DarkTheme

const dateOptions: any = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

// free trial ends
const trialEndDate = convertDate.add(Number(trialDuration), 'day');
console.log("Trial end Data: ", convertDate.toDate())
const trialEndFormatted = trialEndDate.toDate().toLocaleDateString(i18n.language, dateOptions);

// a day before free trial ends 
const adaybeforeEndTrial = trialEndDate.subtract(1, 'day');
const adaybeforeEndTrialFormatted = adaybeforeEndTrial.toDate().toLocaleDateString(i18n.language, dateOptions);

function setDurationHandler(text: string) {
  const invalidPattern = /[_,\-\.\/,]/; // any of these characters

  if (invalidPattern.test(text)) {
    return;
  }

  const num = parseInt(text);

  setTrialDuration(text);
}

console.log("Free Trial: ", freeTrial)
console.log("Free Trial Start day: ", params.firstpayment)

const notifScreenParams = {
  freetrial: freeTrial,
  reminderenabled: notificationsEnabled,
  freetrialduration: trialDuration,
  freetrialendday: freeTrial ? dayjs(trialEndDate).format('YYYY-MM-DD HH:mm:ss') : null,
  billingperiodnumber: period,
  billingperiodtime: selectedPeriod.value,
  billingtype: selectedPeriod.label === t('addsub.notificationscreen.dropdown.onetime') ? "One Time" : "Recurring",
}

console.log("notifScreenParams: ", notifScreenParams)

async function saveSubcription () {


  try {
    
  if (id && activate) {
    console.log( "restart subscription; ")
    console.log({ ...notifScreenParams, ...params})
   await setActive(db, id, { ...notifScreenParams, ...params}, activate)
    router.replace({pathname: "/(tab)/Index", params: {refresh: Date.now().toString()}})
    return ;
 }

  if (id) {
  console.log("Update subscriptions: update sub")
  console.log({ ...notifScreenParams, ...params, freetrial: String(freeTrial),reminderenabled: String(notificationsEnabled) })
 

  //  await updateUserSubscription(db, id, { ...notifScreenParams, ...params, freetrial: String(freeTrial),reminderenabled: String(notificationsEnabled) }, billingList)
   router.replace({pathname: "/(tab)/Index", params: {refresh: Date.now().toString()}})
   return ;
  }
        console.log("going to the  save subscription in device")
        console.log({ ...notifScreenParams, ...params })
        
    await saveSubcriptionLocally(db, { ...notifScreenParams, ...params }, trialEndFormatted)
    router.replace({pathname: "/(tab)/Index", params: {refresh: Date.now().toString()}})
  } catch (error) {
      showMessage({
                message: `${error}`,
                type: "danger",
                duration: 5000, 
                style: { bottom: 60 } 
              })
   
  }
}

useEffect(() => {
  const EditValue = async () => {
    if (!id) return;
    try {
      const sub: any = await db.getFirstAsync(`SELECT * FROM userSubscriptions WHERE id = ?`, [id]);
      console.log("Billing Period Time: ", sub)

      console.log('freetrail: ', sub.freetrial)
      console.log('reminderenabled: ', sub.reminderenabled)
      /// convert them into their boolean form
      const bolfreetrial: boolean = toBoolean(sub.freetrial)
      
      const bolnotenabled: boolean = toBoolean(sub.reminderenabled)
    

      if (sub) {        
        setPeriod(sub.billingperiodnumber)
        setSelectedPeriod({ value: sub.billingperiodtime, label: sub.billingperiodtime })
        setTrialDuration(sub.freetrialduration)
        setFreeTrial(bolfreetrial)
        setShowTrialMessage(bolfreetrial && true)
        setNotificationsEnabled(bolnotenabled)
        setBillingList(JSON.parse(sub.billingrecurringlist))
        
      }
    } catch (error) {
      console.log(error)
    }
  }
  EditValue()
}, [id])

let customButtonText 
if (!id)  {
  customButtonText = t('addsub.notificationscreen.addsubscription')
} else {
  if (activate) {
    customButtonText= "Activate"
  } else {
    customButtonText = t('addsub.notificationscreen.updatesubscription')
  }
}

return (
  <View style={[styles.container, { backgroundColor: theme.background }]}>
    <NotificationHeader theme={theme} />

    <View style={[styles.editConatainer, { backgroundColor: theme.secondaryColor }]}>
      <View style={{ flex: 0.6 }}>
        <Text style={[styles.text, { color: theme.primaryText }]}>{t('addsub.notificationscreen.edittext.subscriptionfor')} {params.platformname.toUpperCase()}, {t('addsub.notificationscreen.edittext.ofprice')}  {params.symbol}{params.price} {t('addsub.notificationscreen.edittext.startingon')}{formattedDate} {t('addsub.notificationscreen.edittext.intheyear')}{year} </Text>
      </View>
      <View style={{ flex: 0.4 }}>
        <CustomButton title="Edit" onPress={() => router.back()} style={{ backgroundColor: theme.primaryText, borderRadius: 10, }} textColor={theme.secondaryText} />
      </View>
    </View>

    <View style={styles.rowContainer}>
      {selectedPeriod.label !== t('addsub.notificationscreen.dropdown.onetime') ?
        <><View style={{ flex: 0.4, flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 0.3 }}>
            <Text style={{ color: theme.primaryText }}>{t('addsub.notificationscreen.every')}</Text>
          </View>
          <View style={{ flex: 0.6 }}>
            <InputText maxLength={1} inputTitleColor={theme.primaryText} placeholderTextColor={theme.placeholdertext} extraInputStyle={[styles.generalinput, { color: theme.primaryText, backgroundColor: theme.secondaryColor }]} value={period} onChangeText={setPeriod} keyboardType='numeric' />
          </View>

        </View><View style={{ flex: 0.6 }}>
            <DropDownMenu theme={theme} selectedPeriod={selectedPeriod} setSelectedPeriod={selectedPeriodHanlder} />

          </View></> :
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <DropDownMenu theme={theme} selectedPeriod={selectedPeriod} setSelectedPeriod={selectedPeriodHanlder} />
        </View>
      }
    </View>

    <View>
      <ToogleButton label={t('addsub.notificationscreen.freetrial.label')} isSet={freeTrial} setIsSet={setFreetrialHandler} theme={theme} fttoogle={true} setModalVisible={setModalVisible} modalVisible={modalVisible} />
      {showTrialMessage && <Notify theme={theme} size={20} iconName="notifications-sharp"> {t('addsub.notificationscreen.freetrial.notify1')} {adaybeforeEndTrialFormatted}, {t('addsub.notificationscreen.freetrial.notify2')} {trialEndFormatted}</Notify>}
    </View>

    <View>
      <ToogleButton label={t('addsub.notificationscreen.enablenotification.label')} isSet={notificationsEnabled} setIsSet={setNotificationEnabledHandler} theme={theme} />
      {notificationsEnabled && <Notify theme={theme} size={30} iconName="notifications-sharp"> {t('addsub.notificationscreen.enablenotification.notify1')} {t('addsub.notificationscreen.enablenotification.notify2')} {period} {t(`addsub.notificationscreen.dropdown.${selectedPeriod.value?.toLowerCase()}`)}</Notify>}

    </View>

    <View style={{ marginTop: 20 }}>
      <CustomButton title={customButtonText} onPress={() => (saveSubcription())} style={{ backgroundColor: theme.primaryText }} textColor={theme.secondaryText} />
    </View>
    {/* MODAL */}

    {freeTrial && <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.backdrop}>
        <View style={[styles.modal, { backgroundColor: theme.secondaryColor }]}>
          <Text style={{ color: theme.primaryText, fontSize: 15, fontWeight: '900', textAlign: 'center' }}>{t('addsub.notificationscreen.modal.freetrialsetup')}</Text>

          <Text style={[styles.subTitle, { color: theme.primaryText }]}>{t('addsub.notificationscreen.modal.startdate')}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 13 }}>
            {convertDate.toDate().toLocaleDateString(i18n.language, dateOptions)}
          </Text>

          <Text style={[styles.subTitle, { color: theme.primaryText }]}>{t('addsub.notificationscreen.modal.trialduration')}</Text>
          <InputText
            extraInputStyle={[styles.input, { backgroundColor: theme.background,color: theme.primaryText}]}
            keyboardType="numeric"
            maxLength={2}
            value={trialDuration}
            onChangeText={setDurationHandler}
          />

          <Text style={[styles.subTitle, { color: theme.primaryText }]}>{t("addsub.notificationscreen.modal.trialending")}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 13 }}>
            {trialEndFormatted}
          </Text>

          <View style={styles.buttonRow}>
            <CustomButton
              title={t('addsub.notificationscreen.cancel')}
              onPress={() => {
                setModalVisible(false);
                setShowTrialMessage(false);
                setFreeTrial(false)
              }}
              style={{ backgroundColor: theme.secondaryText }}
            />
            <CustomButton
              title={t('addsub.notificationscreen.save')}
              onPress={() => {

                if (!trialDuration) {
                  setModalVisible(false);
                  setShowTrialMessage(false);
                  setFreeTrial(false)
                  return
                  
                }
                setShowTrialMessage(true);
                setModalVisible(false);
                setFreeTrial(true);
              }}
              style={{ backgroundColor: "#228B22", borderRadius: 20 }}
              textColor={"black"}
            />
          </View>
        </View>
      </View>
    </Modal>}
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContianer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editConatainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  generalinput: {
    height: 50,
    width: '100%',
    borderWidth: 0.1,
    fontSize: 17,
    textAlignVertical: 'center'
  },
  text: {
    fontSize: 12,
    fontWeight: '600'
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    height: 300,
    width: '85%',
    elevation: 10,
  },
  input: {
    height: 30,
    borderRadius: 10,
    borderWidth: 0.1
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 17,
    marginVertical: 5,
  }
})

export default NotificationScreen