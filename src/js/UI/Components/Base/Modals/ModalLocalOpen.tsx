import { createPortal } from "react-dom";
import ModalWrapperWindow, { Props_ModalWrapperWindowDirect } from "./ModalWrapperWindow";


/**
 * Unlike modalStore, this one here is not centralized.
 * But supports more React Node features and refreshing?
 * 
 * It really depends on what one wants to do, honestly.
 */
function ModalLocalOpen(props: Props_ModalWrapperWindowDirect) {
    
    // We need to make our own "modalHolder" in here.
    return createPortal(
        <div className="modalHolder">
            <ModalWrapperWindow
                {...props}
            >
                {props.children}
            </ModalWrapperWindow>
        </div>

    , document.body)
}




export default ModalLocalOpen;