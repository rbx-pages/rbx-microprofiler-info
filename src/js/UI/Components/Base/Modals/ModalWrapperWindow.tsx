import { useCallback, useRef } from "react"
import ButtonComponent from "../ButtonComponent"
import SVG_Inline from "../../Utils/SVG_Inline"
import ButtonStyled from "../../ButtonStyled"
import ModalPresetWindow, { Props_ModalPresetWindow as Props_ModalPresetWindow } from "./ModalPresetWindow"


export type Props_ModalWrapperWindowPublic = {
    children?: React.ReactNode

    /**
     * For dialog "open" property
     */
    dialogOpen?: boolean

    zIndex?: number

    bCloseFromUnfocus?: boolean
}


// Internal props, basically, not exposed to ModalWrapper's own props
// to prevent confusion
export type Props_ModalWrapperWindowDirect = Props_ModalWrapperWindowPublic & {
    extraProps?: Props_ModalPresetWindow

    /**
     * What should happen when one of this internal's provided close button is pressed
     */
    onModalClose?: () => void
}


// TODO: You can select modals behind other modals with the SHIFT button...


/**
 * The HTML for the actual Modal Wrapper pop-up window with the backdrop and stuff.
 * This here can be used by ModalWrapper or anything else for visual.
 * Hence why the Props are set up like that.
 */
function ModalWrapperWindow(props: Props_ModalWrapperWindowDirect) {
    // useRefs need to be before any return, I think
    let modalBackdropRef = useRef(null)

    let dialogOpen = props.dialogOpen ?? true

    let extraProps = props.extraProps
    let bCloseFromUnfocus = props?.bCloseFromUnfocus ?? false 


    // Clicking the backdrop should act as a alternative close
    // There's also an option to toggle it on/off
    let focusOutTriggerFunc = useCallback(function(e: React.MouseEvent) {
        let targetElem = e.target

        // Needs to be Left Mouse button
        if (!(e.button === 0))
            return;

        // Starting mouse down needs origin from element we started to click on.
        if (targetElem == modalBackdropRef.current) {
            //console.log("Passed!")
            props.onModalClose?.()
        }
    }, [])


    let closeButtonTriggered = useCallback(function() {
        props.onModalClose?.()
    }, [])


    return <div
        className="modalBackdrop"
        ref={modalBackdropRef}
        style={{zIndex: props.zIndex}}

        // Tap through mobile scroll shouldn't be triggered by this
        onMouseDown={bCloseFromUnfocus ? focusOutTriggerFunc : function(){}}
    >
        <dialog open={dialogOpen} className="noBg-dialog">
            <ModalPresetWindow
                {...props.extraProps}
                funcInnerCloseBtnTrigger={closeButtonTriggered}
            >
                {props.children}
            </ModalPresetWindow>
        </dialog>
    </div>
}


export default ModalWrapperWindow;