import  { View, Text, Image, useWindowDimensions, StyleSheet, Pressable  } from 'react-native';
import { router } from 'expo-router'
import { useAppTranslation } from '@/hooks/useAppTranslator';




const CarouselItem = ({data}: {data: any}) => {
    const {width: screenWidth, height} = useWindowDimensions();
    const {t} = useAppTranslation()
    return (
        <View style={[styles.container, {width: screenWidth}]}>
           
                <Image source={data.image} style={{width: screenWidth, height: height/2, resizeMode: 'contain'}}/>
                <View style={styles.skipContainer}>
                    <Pressable style={({pressed}) => pressed && {opacity: 0.6}} onPress={() => router.replace("/(stack)/CurrencyPicker")}>
                        <Text style={styles.subTitle}>{t("skip")}</Text>
                    </Pressable>
                </View>
          
            <View style={styles.info}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.description}>{data.description}</Text>

            </View>

        </View>
    );
};     



const styles = StyleSheet.create({
   container: {
    flex: 1,

  
   },
 
    info: {
        marginTop: '10%',
        paddingHorizontal: 50,
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10, 
    },
    description: {
        fontSize: 10,
        fontWeight: 'light', 
        textAlign: 'center'
    }, 
    subTitle: {
        fontSize: 15,
        color: 'rgba(220, 22, 22, 0.55)'
    },
    skipContainer: {
        position: 'absolute',
        top: 10,
        right: 20
    }
 
    
})  
export default CarouselItem;
