import {View, Text, StyleSheet} from 'react-native'
import IconButton from '../ui/IconButton';


interface Prop {
    icon?: any;
    title: string;
    num?: string;
    background: string;
    textColor: string;
}


const Card = ({icon, title, num, background, textColor}: Prop) => {
    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <View style={styles.rowContainer}>
                {icon && <IconButton name={icon} size={24} color={textColor} />}
            <Text style={{color: textColor}}>{title}</Text>

            </View>
            <View>
                <Text style={{color: textColor}}>{num}</Text>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
    
        marginVertical: 10,
        marginHorizontal: 10,
    }, 
    rowContainer: {
        flexDirection: 'row', 
        gap: 5,
        alignItems: 'center',
        
    }

})








export default Card  