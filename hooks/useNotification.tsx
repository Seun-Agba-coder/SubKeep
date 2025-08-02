import * as Notifications from 'expo-notifications'
import {Alert} from 'react-native'






const useNotificationHook = () => {

    // Request notification permissions
    const requestNotificationPermission = async () => {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
        
          
          let finalStatus = existingStatus;
          
          // If permission not already granted, ask for it
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          
          if (finalStatus !== 'granted') {
            Alert.alert("You can not be allowed acces to this feature")
            return false;
          }
          
          
          return true;
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          return false;
        }
      };
   

      return { requestNotificationPermission}


}


export default useNotificationHook