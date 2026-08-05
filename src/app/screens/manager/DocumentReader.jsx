import { openDocumentTree } from "react-native-saf-x";

export async function PickExistingDocumentFolder () {
    try {

         const docTree = await openDocumentTree()
         console.log(docTree)
         

    }catch(e) { 
        console.log(`Error : ${e}`)
    }
}