import { useRef, useState } from "react"
import { ITagSearchFilters } from "../../../modules/TagSearching"
import ModalLocalOpen from "../Base/Modals/ModalLocalOpen"
import ButtonStyled from "../ButtonStyled"
import TagFilterDialog, { TagFilterDialogHandle } from "./TagFilterDialog"

type Props = {
    searchFilters: ITagSearchFilters,

    /**
     * What to do with the filters
     */
    funcTransmitFilters: (draftFilters: ITagSearchFilters) => void,
    closeFilterModal: () => void;

    onClearBtnClicked?: () => void;

    b_SubmitBtn: boolean;
}

export default function TagFilterDialog_Modal(props: Props) {
    let filterHandle = useRef<TagFilterDialogHandle>(null)

    // These are needed if the Submit Button would be present
    let [_toSubmitFilter, _setToSubmitFilter] = useState<ITagSearchFilters>(props.searchFilters)
    
    let b_useSubmitConfirmer = props.b_SubmitBtn

    const btnSubmit = <ButtonStyled
        key="btnSubmit"
        onClick={() => {
            props.funcTransmitFilters(_toSubmitFilter)
        }}
        >Submit</ButtonStyled>

    const btnFilterClear = <ButtonStyled
        key="btnClear" // key is needed due to array
        onClick={() => {
            if (filterHandle.current?.triggerClearFunc) {
                filterHandle.current?.triggerClearFunc?.()
            }
        }}
    >
        Clear
    </ButtonStyled>

    return <ModalLocalOpen
        onModalClose={props.closeFilterModal}

        extraProps={{
            title: "Search Filters",
            extraButtonsArr: [btnFilterClear, b_useSubmitConfirmer ? btnSubmit : undefined]
        }}
    >
        <TagFilterDialog
            handleRef={filterHandle}
            filterSettings={props.searchFilters}
            onChange={b_useSubmitConfirmer ? _setToSubmitFilter : props.funcTransmitFilters}

            onClearBtnClicked={props.onClearBtnClicked}
        />
    </ModalLocalOpen>
  }
