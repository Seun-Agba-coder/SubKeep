import { Stack } from "expo-router";


const SubLayout =  () => {
   
    return (
       

    <Stack screenOptions={{headerShown: false}}> 
        <Stack.Screen name="AddSub" /> 
        <Stack.Screen name="AccessScreen" />
        <Stack.Screen name="Description" />
        <Stack.Screen name="NotificationScreen"/>
        <Stack.Screen name="CurrencyPicker"/>
    </Stack>

      
       
    )
}

export default SubLayout