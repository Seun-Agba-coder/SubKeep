import {View, Text, StyleSheet } from 'react-native'
import { LightTheme, DarkTheme } from '@/constants/Styles/AppStyle'
import AnalyticLayout from '@/components/analytics/AnalyticLayout'
import { useAppSelector } from '@/redux/hooks'
import { useAppTranslation } from '@/hooks/useAppTranslator'



const Analytics = () => {

    const mode = useAppSelector((state) => state.appmode.mode)
    const theme = mode === "light" ? LightTheme: DarkTheme
    const {t } = useAppTranslation()
    return (
        <View style={[ styles.container, {backgroundColor: theme.background} ]}>
            <Text style={[styles.title, {color: theme.primaryText}]}>{t('analytics.title    ')}</Text>
            <AnalyticLayout theme={theme} mode={mode} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 50, 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})

export default Analytics    