import axios from 'axios'
import { useState } from 'react';

interface Response {
  logo: string;
  name: string;

}

const cleanInput = (text: string) => text.trim().toLowerCase();


const useServiceHook = () => {
  const [logoImage, setLogoImage] = useState<any|Response>(null)


  function setLogoHandler(logodetails: any) {

    setLogoImage(logodetails)
  }
  


  async function FindLogo(serviceName: any) {
      const cleanedInput = cleanInput(serviceName)
    
        try {
          const response = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest`, {
            params: { query: cleanedInput }
          })

          const data = response.data;
          if (data.length > 0) {
            setLogoImage({
              logo: data[0].logo,
              name: data[0].name
            })
      
          }
          console.log("null found")
          return null;
        } catch (err: any) {
           console.log("error: : ", err)
            throw err
        
        }

  }

  return { logoImage, FindLogo, setLogoHandler}
  };



export default useServiceHook

  