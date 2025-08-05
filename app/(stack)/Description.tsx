import IconButton from '@/components/ui/IconButton'
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle'
import { useAppSelector } from '@/redux/hooks'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect} from 'react'
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { FAB, Icon, Portal } from 'react-native-paper'
import { deleteSubscription, setInactive } from '@/utils/Crud'
import { useSQLiteContext } from 'expo-sqlite'
import { calculateNextBilling } from '@/utils/Billiigfunctions'
import ModalContainer from '@/components/ui/ModalContainer'
import { useAppTranslation } from '@/hooks/useAppTranslator'
import i18n from '../../src/locales/index'
import dayjs from 'dayjs'
import 'dayjs/locale/es'; 
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import 'dayjs/locale/it';




const ActionButton = ({ theme, data, width, height, deleteHandler, makeInactive   }: { theme: any, data: any, width: number, height: number, deleteHandler: () => void, makeInactive: () => void }) => {
    const [open, setOpen] = useState(false);
    const {t } = useAppTranslation()

    return (
     
            <FAB.Group
                open={open}
                visible={true}
                icon={open ? 'close' : 'dots-vertical'}
                fabStyle={{ backgroundColor: theme.accentColor, position: 'absolute', bottom: height - (height/6), right: width/300 }}
                actions={[
                    {
                        icon: 'pencil',
                        label: t('Description.actionbutton.edit'),
                        onPress: () => router.push(
                            {
                                pathname: '../AddSub',
                                params: { id: data.id, to: 'update' }
                            }
                        )
                    },
                    {
                        icon: 'pause',
                        label: t('Description.actionbutton.deactivate'),
                        onPress: () => {
                            setOpen(false)
                            makeInactive()},
                    },
                    {
                        icon: 'delete',
                        label: t('Description.actionbutton.delete'),
                        onPress: () => {
                            setOpen(false)
                            deleteHandler()},
                    },
                ]}
                onStateChange={({ open }) => setOpen(open)}
            />
   
    );
};

function Data({ title, data }: { title: string, data: string }) {

    const { t} = useAppTranslation()
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const theme = mode === 'light' ? LightTheme : DarkTheme
    return (
        <>
            {
                data ?
                    <View style={[styles.dataContianer, { borderBottomColor: theme.accentColor }]}>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: theme.tetiaryText }}>
                            {title}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
                            { title !== t('description.data.note') ?
                            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primaryText }}>
                                {data}
                            </Text>
                            :
                            <Text style={{ fontSize: data === 'No Note' ? 15: 10, fontWeight: '600', color: theme.primaryText, width: 300, textAlign: 'right', paddingRight: 10,  }}>
                                {data}
                            </Text>
                            }
                            {
                                title === t('description.data.firstpayment') || title === t('description.data.nextpayment') && <IconButton name="calendar" size={20} color={theme.primaryText} />
                            }
                        </View>
                    </View> :
                    <></>
            }
        </>
    )
}

/**
 * A header component for the description screen.
 * It consists of a back button and an action dropdown.
 * @param {{ color: string, theme: any, item: any }} props
 * @returns {JSX.Element}
 */
function DescriptionHeader({ color, theme, item, width }: { color: string, theme: any, item: any, width: number }) {
    const {t } = useAppTranslation()
    return (
        <View style={[styles.rowContainer, { gap: width/3.3 }]}>
            <IconButton name="arrow-back" size={30} color={color} onPress={() => router.back()} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: color }}>{t('description.header.text')}</Text>
        </View>
    )
}

const Description = () => {
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const db = useSQLiteContext()
    const theme = mode === 'light' ? LightTheme : DarkTheme
    const { item }: any = useLocalSearchParams()
    const data = JSON.parse(item)
    const [visibleDelete, setVisibleDelete] = useState(false)
    const [visibleInactivate, setVisibleInactivate] = useState(false)
    const {width, height} = useWindowDimensions()

    const {t} = useAppTranslation()
  

   function DeleteModal () {
    setVisibleDelete(true)
    
   }
   function InactiveModal () {
    setVisibleInactivate(true)
   }


    async function DeleteSubcriptionHandler() {
       
        await deleteSubscription(db, data.id, data)
        router.replace({pathname: "/(tab)/Index", params : {refresh: new Date().toString()}})
    }

    async function SetSubscriptionInactive() {
        await setInactive(db, data.id, data)
        router.replace({pathname: "/(tab)/Index", params: {refresh : new Date().toString()}})
    }


     console.log("Category: ", data.category)


    return (
        <>

            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <DescriptionHeader color={theme.primaryText} theme={theme} item={data} width={width}/>

                <View style={{ paddingBottom: 100 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: data.iconurl || '' }} style={styles.image} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.primaryText }}>{data.platformname || 'No Name'}</Text>
                    </View>

                    <View style={[styles.mainContainer, { backgroundColor: theme.secondaryColor }]}>
                        <Data title={t('description.data.name')} data={data.platformname} />
                        <Data title={t('description.data.price')} data={data.symbol + data.price } />
                        <Data title={t('description.data.occurence')} data={data.billingperiodtime || 'N/A'} />
                        <Data title={t('description.data.firstpayment')} data={data.firstpayment && dayjs(data.firstpayment).locale(i18n.language).format('MMM D, YYYY')} />
                        <Data title={t('description.data.nextpayment')} data={dayjs(data.billingrecurringtime ? data.billingrecurringtime : calculateNextBilling(data.firstpayment, data.billingperiodnumber, data.billingperiodtime)).locale(i18n.language).format('MMM D, YYYY')} />

                    </View> 

                    <View style={[styles.mainContainer, { backgroundColor: theme.secondaryColor }]} >
                        <Data title={t('description.data.category')} data={data.category && t('addsub.category.' + data.category)} />
                        <Data title={t('description.data.freetrial')} data={data.freetrial ? t('description.datadefault.freetrialtrue') : t('description.datadefault.freetrialfalse')} />
                        <Data title={t('description.data.remindme')} data={data.reminderenabled ? t('description.datadefault.remindme') : 'N/A'} />
                        <Data title={t('description.data.paymentmethod')} data={data.paymentmethod } />
                        <Data title={t('description.data.description')} data={data.description } />
                        <Data title={t('description.data.note')} data={data.note } />
                    </View>
                </View>

                {/* ActionButton is now in the header, will float in bottom-right */}
                <ActionButton theme={theme} data={data} width={width} height={height} deleteHandler={DeleteModal} makeInactive={InactiveModal}/>
            </View>

            {visibleDelete && <ModalContainer
                theme={theme}
                title={t('description.modal.delete.title')}
                body={t('description.modal.delete.body')}
                actionHandler={DeleteSubcriptionHandler} actionText={t('description.modal.delete.actionText')} visible={visibleDelete} setVisible={setVisibleDelete} />}
            {visibleInactivate && <ModalContainer
                theme={theme}
                title={t('description.modal.inactive.title')}
                body={t('description.modal.inactive.body')}
                actionHandler={SetSubscriptionInactive} actionText={t('description.modal.inactive.actionText')} visible={visibleInactivate} setVisible={setVisibleInactivate} />}

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    dataContianer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1
    },
    mainContainer: {
        padding: 10,
        marginVertical: "5%",
        borderRadius: 30
    },
    rowContainer: {
        flexDirection: 'row',
       
        alignItems: 'center',
        marginBottom: 20,
    }
})

export default Description