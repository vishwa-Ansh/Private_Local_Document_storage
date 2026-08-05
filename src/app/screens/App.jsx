import { useState } from "react";
import ChooseSetupScreen from "./ChooseSetUpScreen";
import FolderPickerScreen from "./FolderPickerScreen";

export default function App(){
    const [chooseMethod , setChooseMethod] = useState(null);

    const handleChooseSystem = (mode) =>{
        setChooseMethod(mode)
    }
    console.log(chooseMethod)
    
    if(!chooseMethod) return <ChooseSetupScreen handleChooseSystem={handleChooseSystem}/>
    if(chooseMethod ==='own'){
        return <FolderPickerScreen/>

        
    }
}