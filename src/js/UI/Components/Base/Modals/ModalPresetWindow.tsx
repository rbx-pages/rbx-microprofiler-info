import ButtonStyled from "../../ButtonStyled"
import SVG_Inline from "../../Utils/SVG_Inline"
import ButtonComponent from "../ButtonComponent"

export type Props_ModalPresetWindow = {
    funcInnerCloseBtnTrigger?: () => void

    /**
     * Modal Title
     */
    title?: string

    enableTopArea?: boolean
    enableBottomArea?: boolean
    extraButtonsArr?: React.ReactNode[]
}

type Props = Props_ModalPresetWindow & {
    children?: React.ReactNode
}


export default function ModalPresetWindow(props: Props) {
    
    // useMemo somewhere?
    
    let enableTopBarArea = props.enableTopArea ?? true
    let enableBottomArea = props.enableBottomArea ?? true


    return <div className="modalPreContainer">
        <div className="modalContainer">
            {/* Inner Top Container */}
            {
            enableTopBarArea && <>
            <div className="modalBodyInner">
                <div className="modalTopBtnContainer">
                    {/* Optional Title */}
                    <div>
                        <span>{props?.title}</span>
                    </div>

                    {/* Upper close button. */}
                    <div>
                        <ButtonComponent
                            className="btn modalCloseWindowBtn modalCloseWindowBtnStyle"
                            onClick={props.funcInnerCloseBtnTrigger}
                        >
                            <span className="icon">
                                <SVG_Inline 
                                    src="./assets/icons/cancel.svg"
                                    style={{height:"18px"}}
                                />
                            </span>
                        </ButtonComponent>
                    </div>

                </div>
            </div>
            <hr></hr>
            </>
            }


            {/* Main showing content */}
            <div className="modalBodyInner">
                {props.children}
            </div>


            {
            enableBottomArea && <>
            <hr></hr>
            <div className="modalBodyInner">
                <div className="modalButtonRow">
                    <ButtonStyled
                        className="modalCloseWindowBtnStyle"
                        onClick={props.funcInnerCloseBtnTrigger}
                    >
                        Close
                    </ButtonStyled>

                    <div style={{marginLeft:"auto"}}>
                        {props?.extraButtonsArr}
                    </div>
                </div>
            </div>
            </>
            }
        </div>

    </div>
}