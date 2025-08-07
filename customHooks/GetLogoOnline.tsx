import axios from 'axios'
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

interface Response {
  logo: string;
  name: string;

}

const cleanInput = (text: string) => text.trim().toLowerCase();


const useServiceHook = () => {
  const [logoImage, setLogoImage] = useState<any|Response>('')


  function setLogoHandler(logodetails: any) {

    setLogoImage(logodetails)
  }
  


  async function FindLogo(serviceName: any) {
      const cleanedInput = cleanInput(serviceName)
      console.log('Cleaned Input: : ', cleanedInput)
    
        try {
          // const response = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest`, {
          //   params: { query: cleanedInput }
          // })
          const response = await axios.get(`https://api.brandfetch.io/v2/search/${cleanedInput}?c=1idRAnosyXJQQvodyHO`)
  
          const data = response.data;
          console.log("data: ", data)

          if (data.length === 0 ) {
            showMessage({
              message: `We could not Find the logo image of the service: ${serviceName}, a default image will be used. `,
              type: "danger",
              duration: 5000, 
              style: { bottom: 60 } 
            })
            setLogoImage({
              logo: "",
              name: ""
            })
            return null;
          }

          if (data.length > 0) {
            setLogoImage({
              logo: data[0].icon,
              name: data[0].name
            })
      
          }
          console.log("null found")
          return null;
        } catch (err: any) {
           console.log("error: : ", err)
           showMessage({
            message: `We could not Find the logo image of the service: ${serviceName}, check internet connection.`,
            type: "danger",
            duration: 5000, 
            style: { bottom: 60 } 
          })
            throw err
        
        }

  }

  return { logoImage, FindLogo, setLogoHandler}
  };



export default useServiceHook

  