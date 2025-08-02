import {changeLanguage} from "../src/locales/index"
import { useAppTranslation } from "./useAppTranslator"



const useSettingHook = () => {

    const { t} = useAppTranslation()
    
    const LanguageList = [
    {code: "en", name: t('setting.language.english'), onPress: async () => { await changeLanguage({languageCode: "en"} ); return t('setting.language.english')}}, 
    {code: "fr", name: t('setting.language.french'), onPress: async () => { await changeLanguage({languageCode: "fr"}); return t('setting.language.french')}},
    {code: "es", name: t('setting.language.spanish'), onPress: async () => { await changeLanguage({languageCode: "es"}); return t('setting.language.spanish')}},
    {code: "it", name: t('setting.language.italian'), onPress: async () => { await changeLanguage({languageCode: "it"}); return t('setting.language.italian')}},
    {code: "tr", name: t('setting.language.turkish'), onPress: async () => { await changeLanguage({languageCode: "tr"}); return t('setting.language.turkish')}}
   ]
   
   const SystemList = [
     {code: "dark", name: t('setting.systemmode.dark'), onPress: () => {return t('setting.systemmode.dark')}},
     {code: "light", name: t('setting.systemmode.light'), onPress: () => {return t('setting.systemmode.light')}}
   ]

    return  { LanguageList, SystemList}
    
}


export default useSettingHook