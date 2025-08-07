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
            {num ? (
                <View>
                    <Text style={{color: textColor}}>{num}</Text>
                </View>
            ) : null}
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        width: '90%',
        height: 60, 
        marginVertical: 10,
        marginHorizontal: 10,
    }, 
    rowContainer: {
        flexDirection: 'row', 
        gap: 5,
        marginHorizontal: 2, 
        paddingRight: 1, 
        alignItems: 'center',
        
    }

})








export default Card  