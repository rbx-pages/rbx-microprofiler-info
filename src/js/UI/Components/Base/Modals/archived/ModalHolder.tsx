import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import modalStore, { _MODAL_GLOBAL_HOLDER_ID } from "./modalStore";
import ModalWrapper from "./ModalWrapper";

/**
 * This could theoretically update with ModalHolder having ID, so you could
 * specify where Modals could show.
 * 
 * And here we could also create another element
 * that provides a z-index boost so we can stack dialogs, eventually.
 */

type Props = {
    children?: React.ReactNode

    portalTo?: HTMLElement,

    /**
     * If none, it will be just global.
     */
    holderId?: string;

    /**
     * For dialog "open" property
     */
    dialogOpen?: boolean;
}

export default function ModalHolder(props: Props) {
    // useRefs need to be before any return, I think
    let modalHolderRef = useRef(null)

    /*useEffect(() => {
        let holderId = props.holderId

        if (holderId=== undefined)
            holderId = props.holderId ?? _MODAL_GLOBAL_HOLDER_ID
            

        // Could do registering here.

        // And return an unregister function here
    }, [props.holderId])*/


    // Get SyncStore data
    const modalStoreData = modalStore.useHookSyncStore();

    // Orders of the modals will depend on array order
    // display first as first, and stack the rest.

    let holderModals = modalStoreData.modalsRecord[props.holderId ?? _MODAL_GLOBAL_HOLDER_ID]
    // No modals, no rendering
    if (holderModals.length == 0)
        return null;


    
    let dialogOpen = props.dialogOpen ?? true;


    // Function to mount stuff anywhere
    return createPortal(
        // This "div" here centers all the modals
        <div 
            className="modalHolder"
            ref={modalHolderRef}
            //onMouseDown={(e) => console.log(e.target == modalHolderRef.current)}
        >
            {
                holderModals.map((modal, index) => {
                    return <ModalWrapper
                        key={index}
                        zIndex={index}
                        
                        modalEntryRef={modal}
                        dialogOpen={dialogOpen}
                    >
                        {modal.content}
                    </ModalWrapper>
                })
            }
        </div>,

        // To where it portals to.
        props.portalTo ?? document.body
    )
}