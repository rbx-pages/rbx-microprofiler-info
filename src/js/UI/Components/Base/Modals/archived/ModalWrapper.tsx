import React, { useCallback, useRef } from "react"
import modalStore, { ModalStoreEntry } from "./modalStore"
import ButtonComponent from "../../ButtonComponent"
import ButtonStyled from "../../../ButtonStyled"
import SVG_Inline from "../../../Utils/SVG_Inline"
import ModalWrapperWindow, { Props_ModalWrapperWindowPublic } from "../ModalWrapperWindow"

/**
 * This is used by ModalHolder
 */


//type Props = React.HTMLAttributes<HTMLElement> & {
type Props = Props_ModalWrapperWindowPublic & {
    /**
     * A reference to the ModalStoreEntry
     */
    modalEntryRef: ModalStoreEntry
}


function closeModalById(modalId: string) {
    modalStore.closeModalById(modalId)
}



/**
 * Used with ModalPortal and ModalHolder
 */
export default function ModalWrapper(props: Props) {
    // Define callback function, when close button inside of the other component is pressed
    let wrapperCloseBtnFunc = useCallback(function() {
        closeModalById(props.modalEntryRef.id)
    }, [])

    // Send our stuff to the actual Component for the window
    return <ModalWrapperWindow
        {...props}

        extraProps={props.modalEntryRef.extraProps}
        onModalClose={wrapperCloseBtnFunc}
    >
        {props.children}
    </ModalWrapperWindow>
}