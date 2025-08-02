import { auth } from "@/firebaseConfig.js";
import { signOut } from "firebase/auth";


const logOut = async () => {
  
    try {
        await signOut(auth);
        console.log("User logged out successfully");
      } catch (error) {
        throw error
      };
}




export {logOut}