import { FlatList, Text,View, StyleSheet } from "react-native";
import SubscriptionHeader from "./SubscriptionHeader";
import SubscriptionItem from "./SubscriptionItem";
import { useAppTranslation } from "@/hooks/useAppTranslator";


interface Props {
    data: any[];
    theme: any;
    active: boolean;
 
}

const EmptyContainer = ({theme, active  }: any) => {
    const {t} = useAppTranslation()
    return (
        <View style={styles.container}>
               <Text style={[styles.title, {color: theme.primaryText}]}> {active === true ? t("AllSubscription.active") : t("AllSubscription.inactive")}</Text>
        </View> 
    )
}

const SubscriptionList = ({data, theme, active}: Props) => {
    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <SubscriptionItem data={item} theme={theme} active={active}/>}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}    
            ListEmptyComponent={() => <EmptyContainer theme={theme} active={active}/>}

        />
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    title  : {
        fontWeight: '900',
        fontSize: 18,
        color: 'gray'
    }
})

export default SubscriptionList