import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Carousel from '@/components/OnBoarding.tsx/Carousel';
import { router } from 'expo-router';
import { useAppTranslation } from '@/hooks/useAppTranslator';


const OnBoarding = () => {
  const {t} = useAppTranslation()



  const Data = [{
    image: require("../../assets/AppImages/OnBoarding1.png"),
    title: t("onboarding.title1"),
    description: t("onboarding.description1")
  }, {
    image: require("../../assets/AppImages/OnBoarding2.png"),
    title: t("onboarding.title2"),
    description: t("onboarding.description2")
  }, {
    image: require("../../assets/AppImages/OnBoarding3.png"),
    title: t("onboarding.title3"),
    description: t("onboarding.description3")
  }]

  function goToAccessScreen() {
    router.replace("/AccessScreen")
  }

  return (
    <View style={styles.container}>
          <Carousel data={Data} goToAccessScreen={goToAccessScreen}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnBoarding;