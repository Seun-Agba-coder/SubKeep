import { View, Text, StyleSheet} from "react-native";


interface Props {
    montlyIncome: number;
}

const SubscriptionHeader = ({montlyIncome}: Props) => {
    return (
        <View style={styles.monthly}>
               <Text> Average Monthly Expense</Text>

                <Text>{montlyIncome}</Text>   
            
        </View>
    )
}



const styles = StyleSheet.create({
    monthly: {
        backgroundColor: 'blue',
    }

})


export default SubscriptionHeader