import { Pressable, StyleSheet, Image, View } from "react-native";

interface Props {
    source: any;
    onPress: () => void;
}



const ImageButton = ({source, onPress}: Props) => {
    return (
        <Pressable onPress={onPress} style={({pressed}) => [ pressed && { opacity: 0.5 }]}>
            <View style={styles.container}>
            < Image source={source} style={styles.image}/>
            </View>
            
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
     
       borderColor: 'black',
       borderRadius: 10,
       borderWidth: 1, 
       padding: 5,
       alignItems: 'center',
       justifyContent: 'center'
        
    },
    image : {
        height: 35,
        width: 35,
        alignSelf: 'flex-start',
     
     
    }
})  

export default ImageButton