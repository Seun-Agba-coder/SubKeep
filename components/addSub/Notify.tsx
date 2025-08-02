import {View, Text, StyleSheet} from 'react-native'
import IconButton from '../ui/IconButton'


const Notify  = ({iconName, size, children, theme, freeTrial, isVisible, setIsVisible}: any) =>{
    return (
        <View style={styles.rowContainer}>
            <IconButton  name={iconName} size={size} color="green"/>
            <Text style={[styles.text, { color: theme.primaryText }]} >
                {children}
            </Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'rgba(207, 192, 192, 0.37)', 
        padding: 20, 
        gap: 10, 
        borderRadius: 10,
        marginVertical: 10, 

    }, 
    text: {
        textAlign:'left', 
        fontSize: 13,


    }
})



export default Notify