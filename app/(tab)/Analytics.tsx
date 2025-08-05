import {View, Text, StyleSheet } from 'react-native'
import { useAppSelector } from '@/redux/hooks'
import { LightTheme, DarkTheme } from '@/constants/Styles/AppStyle'
import AnalyticLayout from '@/components/analytics/AnalyticLayout'



const Analytics = () => {
    const mode = useAppSelector((state) => state.appmode.mode)
    const theme = mode === "light" ? LightTheme: DarkTheme
    return (
        <View style={[ styles.container, {backgroundColor: theme.background} ]}>
            <Text style={[styles.title, {color: theme.primaryText}]}>Analytics</Text>
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