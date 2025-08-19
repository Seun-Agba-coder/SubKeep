import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { useAppTranslation } from '@/hooks/useAppTranslator';

interface Response {
  logo: string;
  name: string;

}

const cleanInput = (text: string) => text.trim().toLowerCase();


const useServiceHook = () => {
  const [logoImage, setLogoImage] = useState<any | Response>('')
  const {t } = useAppTranslation()

  function setLogoHandler(logodetails: any) {

    setLogoImage(logodetails)
  }



  async function FindLogo(serviceName: any) {

    if (!serviceName) {
      setLogoImage({
        logo: "",
        name: ""
      })
      return;
    }
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
      console.log("Cleaned Input: ", cleanedInput)
      
      const response = await fetch(`https://api.logo.dev/search?q=${cleanedInput}`, {
        headers: {
          "Authorization": `Bearer: sk_bltQKE7jRRmceBdaP3cirA`
        },

      })
      console.log(response)
      const data = await response.json()
      console.log("data: ", data)

      if (data.length === 0) {
        showMessage({
          message: `${t("logo.error1")}${serviceName}, ${t("logo.errorpart1")}. `,
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
        message: `${t("logo.error1")}${serviceName}, ${t("logo.errorpart2")}.`,
        type: "danger",
        duration: 5000,
        style: { bottom: 60 }
      })
      throw err

    }

  }

  return { logoImage, FindLogo, setLogoHandler }
};



export default useServiceHook

