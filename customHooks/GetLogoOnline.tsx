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
       if (cleanedInput.toLowerCase() === "subkeep") {
        console.log("Yes")
        setLogoImage({
          logo: "../../assets/AppImages/subkeep.png",
          name: "subkeep"
        })
        return;
       }

    
        try {
          // const response = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest`, {
          //   params: { query: cleanedInput }
          // })
          console.log("Cleaned Input: ", cleanedInput)
          const response = await fetch(`https://api.logo.dev/search?q=${cleanedInput}`, {
            headers: {
              "Authorization": `Bearer: sk_bltQKE7jRRmceBdaP3cirA`
            }, 
           
          })
          console.log(response)
          const data = await response.json()
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
              logo: data[0].logo_url,
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

  