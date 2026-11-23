import { createContext } from "react";


type ModalEntry = {
    content: React.ReactNode;
}


const ModalsContext = createContext({
    modals: [] as ModalEntry[],
})


export default ModalsContext;