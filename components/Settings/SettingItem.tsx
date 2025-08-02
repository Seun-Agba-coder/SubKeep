import {View, Text, StyleSheet } from 'react-native';
import IconButton from '../ui/IconButton';
import MinimalDropdown from '../ui/MinimalDropdowm';



interface SettingItemProp {
    icon: any;
    label: string;
    list?: any;
    theme: any;
    selected?: any;
    visible?: boolean;
    setVisible?: (value: boolean) => void;
    setSelected?: (value: any) => void;
    dropdown?: boolean;
    currency?: string;
    onPress?: () => void;
    systemChange?: boolean
    border?: boolean
}



const SettingItem = ({icon, label, list, theme, selected, setSelected, visible, setVisible, dropdown =true, currency, onPress, systemChange=false, border=true}: SettingItemProp) => {
    
    return (
        <View style={[styles.rowContainer, border && styles.borderBottom,  {justifyContent: 'space-between', padding: 10 }]}>
            <View style={styles.rowContainer}>
                <IconButton name={icon} size={20}/>
                <Text>{label}</Text>
            </View>
             {
                dropdown ?
                <MinimalDropdown list={list} label="language"theme={theme} selected={selected} setSelected={setSelected} visible={visible} setVisible={setVisible} systemChange={systemChange}/>
                :
                <View style={styles.rowContainer}>
                    <Text>{currency}</Text>
                    <IconButton name="chevron-forward-outline" size={20} color={theme.primaryColor} onPress={onPress}/>
                </View>
             }
           
        </View>
    )
}




const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        gap: 10, 
        alignItems: 'center'
    },
    borderBottom : {
        borderBottomWidth: 1,
        borderColor: 'white',
        paddingBottom: 8,
        
    }
})


export default SettingItem



