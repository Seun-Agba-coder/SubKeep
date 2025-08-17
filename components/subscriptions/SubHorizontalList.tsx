import { FlatList, Text, View, StyleSheet } from "react-native";
import SubHorizontalItem from "./SubHorizontalItem";
import CustomButton from "../ui/CustomButton";
import { router } from "expo-router";
import { useAppTranslation } from "@/hooks/useAppTranslator";

interface Props {
    data: any[];
    theme: any;
}



const SubHorizontalList = ({data, theme}: Props) => {
    const { t} = useAppTranslation()
  

    return (
        <FlatList
         data={data}
         horizontal 
         keyExtractor={(item) => item.id} 
         showsHorizontalScrollIndicator={false}

         ListEmptyComponent={() => 
            data !== null ? ( // Only render after data is loaded
                <View>
                  <Text style={[styles.subTitle, { color: theme.primaryText, marginVertical: 4 }]}>
                    {t("index.emptyTitle")}
                  </Text>
                  <CustomButton 
                    title={t("index.buttonText")} 
                    onPress={() => router.push('/(stack)/AddSub')} 
                    style={styles.buttonStyle} 
                  />
                </View>
              ) : null
            }
         renderItem={({item}) => {
         return <SubHorizontalItem theme={theme} item={item}/>
         
        }} />
    )
} 



const styles = StyleSheet.create({
    subTitle: {
        fontWeight: '300',
        fontSize: 12, 
        textAlign: 'center'
    },
    buttonStyle: {
        backgroundColor: '#2f80ed',
        borderRadius: 30,
    }

})

export default SubHorizontalList