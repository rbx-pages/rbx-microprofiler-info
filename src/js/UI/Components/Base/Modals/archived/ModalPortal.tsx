import React, { useEffect, useRef } from "react";
import modalStore, { ModalStoreEntry_InputProps } from "./modalStore"

type Props = Omit<ModalStoreEntry_InputProps, "content"> & {
    children?: React.ReactNode,
}


function areMaybeSameContent(
    a: React.ReactNode,
    b: React.ReactNode
): boolean {
    if (a === b) return true;

    if (
        React.isValidElement(a) &&
        React.isValidElement(b)
    ) {
        return (
            a.type === b.type &&
            a.key === b.key &&
            JSON.stringify(a.props) === JSON.stringify(b.props)
        );
    }

    return false;
}


/**
 * A portal to the ModalHolder.
 * Doesn't render any element directly, it's just for nicer JSX usage.
 * 
 * The modalStore does the re-rendering.
 */
export default function ModalPortalOpen(props: Props) {
    // Since we subtract "content" from the input, we set it here
    let openProps: ModalStoreEntry_InputProps = {
        content: props.children,
        ...props
    }

    /**
     * Hold a reference to the modalId we opened up.
     */
    const modalIdRef = useRef<string | null>(null)


    // Note: There might be a problem where you can't rename Modal Title or something
    // maybe


    useEffect(() => {
        let modalId = modalStore.openModal(openProps);

        // If the Portal opened a Modal, then we should remember our current modal.
        modalIdRef.current = modalId

        // Here we could return a function for custom cleanup, apparently.
        // e.g. to close the modal, to remove from the store, if the portal disappears
        
        return function() {
            //console.warn(`useEffect closed a portal with id: ${modalId}`)

            // important
            modalStore.closeModalById(modalId)
            modalIdRef.current = null
        }
    }, []);


    // If we're already opened, update the children.
    // also should update title and etc.
    useEffect(() => {
        if (modalIdRef.current === null)
            return;

        //console.warn(`${modalIdRef.current} is updating through ModalPortalOpen`)

        /*let targetModal = modalStore.storeData.modalsRecord["_global"][modalIdRef.current as any]
        

        // This is a problem, but it prevents strange loop updates
        // This is a failure, since the React.Node references are griefed in some way...
        let resultTest = areMaybeSameContent(targetModal.content, props.children)

        //console.log(resultTest)
        if (resultTest) {
            //console.log("Skip update")
            return;
        }*/

        modalStore.updateModalById(modalIdRef.current, openProps)
    }, [props.children])

    
    // WARNING: If a re-render happens within a state above ModalPortal and etc.
    // It will do an infinite loop, one reason is props.children always changes

    return null;
}