import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, useWindowDimensions, Text, Platform } from 'react-native';
import CarouselItem from './CarouselItem';
import Paginator from './Paginator';
import ImageButton from '../ui/ImageButton';
import signInWithGoogleAndFirebase from '../SignIn/GoogleSignInButton'
import AppleSignIn   from '../SignIn/AppleSignInButton';
import { router } from 'expo-router';
import { useAppTranslation } from '@/hooks/useAppTranslator';

import SnackBarBottom from '../ui/SnackBar';

interface CarouselItem {
    image: any;
    title: string;
    description: string;
}

interface CarouselProps {
    data: CarouselItem[];
    goToAccessScreen: () => void; 
}
const Carousel = ({data, goToAccessScreen}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // these two use states are for  sncakbar Bottom
  const [visible, setVisible] = useState(false)
  const [snackbarMessage, setSnackBarMessage] = useState({
    message: "", 
    color: ""
  })
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const { width , height} = useWindowDimensions();
  const {t} = useAppTranslation()
  return (
    <>
    <View style={styles.container} >
      <FlatList
        data={data}
        renderItem={({item, index}) => (
           <CarouselItem data={item} />
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={16}
        ref={slideRef}
      />
      <View>
        <View style={{position: 'absolute', bottom: height/4.6, left: width/2-30}}>
          <Paginator data={data} scrollX={scrollX} /> 
        </View>
        {
        currentIndex === data.length - 1 && (
          <View style={{position: 'absolute', bottom: height/9, left: width/2-90, width: 200}}>
        

               <View>   
               
                <Text style={[styles.text, {marginTop: 10}]}>{Platform.OS === 'android'? t("signin.androidSignin") : t("signin.iosSignin")}</Text>
               
               <View style={{flexDirection: 'row', gap: 10, justifyContent: 'center'}}>
                {
                  Platform.OS === "ios" ? 
                  <AppleSignIn/>: 
                  <ImageButton source={require("../../assets/AppImages/googlelogo.webp")} onPress={async () => {
                    try {
                      await signInWithGoogleAndFirebase()
                      setVisible(true)
                      setSnackBarMessage({message: "Successully signup", color: "#16A34A"})
                      router.replace("/(stack)/CurrencyPicker")
                    
                    } catch (error) {
                      console.log(error)
                      setVisible(true)
                      setSnackBarMessage({message: "Something went wrong, check your connnection", color: "#DC2626"})
                    }
                  }} />
                }

                 
              
               </View>
               <Text style={[styles.text, {marginTop: 10}]}>{t("terms.description")} <Text style={{color: '#66A1F0'}}>{t("terms.policy")}</Text></Text>
             </View>

          </View>
        )}
      </View>

    </View>

       <SnackBarBottom visible={visible} setVisible={setVisible} message={snackbarMessage.message} color={snackbarMessage.color}/> 

   

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: 'light',
    textAlign: 'center',
    marginBottom: 10,
     

}
});

export default Carousel;