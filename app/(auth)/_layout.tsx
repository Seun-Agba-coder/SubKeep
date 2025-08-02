import { Stack } from "expo-router";


const AuthLayout = () => {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="OnBoarding" />
         
        </Stack>
    )
}

export default AuthLayout
