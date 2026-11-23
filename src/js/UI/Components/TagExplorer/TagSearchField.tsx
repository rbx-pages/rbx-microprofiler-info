import { Ref, useCallback, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react";
import ButtonComponent from "../Base/ButtonComponent";
import SVG_Inline from "../Utils/SVG_Inline";


type Props = {
    searchRef?: Ref<SearchRef>;

    query?: string;

    id: string;
    //className?: string

    //onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onQueryChange?: (query: string) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void
    //onFilterClick?: () => void
}

export interface SearchRef {
  eraseSearch: () => void;
}


function TagSearchField(props: Props) {
    /*
        Since this Component is only going to appear once.
        It's fine.
        
        However, in React's nature these inner functions below are technically new ones
        for each Component, unless there's optimization.

        This means that if there's ever a high-frequency appearing Component
        It would be better to have a higher level, define a function.

        propsRef can be used to create functions.

        Otherwise as an alternative, there's HTML custom elements.
    */




    // I didn't want to use "useState"
    /**
     * function that checks whether to show the erase button
     * near the search field
     */
    let func_eraseButtonCheck = useCallback(function() {
        if (ref_searchEraseButton.current && ref_inputField.current) {
            if (ref_inputField.current.value.length > 0)
                ref_searchEraseButton.current.style.display = "block"
            else
                ref_searchEraseButton.current.style.display = "none"
        }
    }, [])


    // Input change
    let event_onChange = function(event: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = event.target.value
        //console.log(inputValue)

        //props?.onChange?.(event)
        props?.onQueryChange?.(inputValue)

        func_eraseButtonCheck()
    }

    // useCallback apparently caches this function.
    let event_onKeyDown = useCallback(function(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key == "Enter") {
            //console.log("Enter was pressed")
            // Unfocus
            ref_inputField.current?.blur()
        }
    }, [])

    const event_buttonEraseClick = function() {
        props?.onQueryChange?.("")
    }


    let ref_inputField = useRef<HTMLInputElement>(null)
    let ref_searchEraseButton = useRef<HTMLButtonElement>(null)

    // ref functions
    useImperativeHandle(props.searchRef, function() {
        return {
            eraseSearch: event_buttonEraseClick
        }
    })
    
    useEffect(function() {
        func_eraseButtonCheck()
    }, [props.query])



    return <>
        <div className="searchField inputWrapper flex-grow-1">
            <label
                className="material-symbols-outlined square-24 mat-icon-fill"
                htmlFor={props.id}
                title="Search"
            >search</label>
            <input
                id={props.id}
                ref={ref_inputField}
                type="text"
                /*
                    "query" has to be here I guess
                    So that it is "React controlled", there isn't really
                    A way out of this without React breaking
                */
                value={props.query}
                onChange={event_onChange}
                onKeyDown={event_onKeyDown}
                onBlur={props.onBlur}
                placeholder={"Search..."}
                autoComplete="off"
            />

            {/* Cancel Search Button */}
            <button
                className="no-style-button"
                ref={ref_searchEraseButton}
                style={{zIndex:1}}
                title="Clear"
                onClick={event_buttonEraseClick}
            >
                <span className="icon">
                    <SVG_Inline
                        src="./assets/icons/cancel.svg"
                        width="18px"
                        height="18px"
                    />
                </span>
            </button>
        </div>
    </>
}


export default TagSearchField