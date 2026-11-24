import { useEffect, useMemo, useState } from "react"
import { ITagDataRoot_JSON } from "../../../modules/TagInfoData/TagDataClasses"
import ExpandCollapsable from "../Base/ExpandCollapsable/ExpandCollapsable"
import { TagEntrySelectionData, TagListEntry } from "./TagListEntry"
import { ITagSelectionRequestData } from "../../Contexts/TagExplorerContext"
import ButtonStyled from "../ButtonStyled"

type TagListProps = React.HTMLAttributes<HTMLElement> & {
    query?: string

    /**
     * What data to display.
     */
    resultsTagData?: ITagDataRoot_JSON


    /**
     * What happens when an entry is selected.
     */
    onListEntrySelected?: (data: ITagSelectionRequestData) => void

    
    selectedEntryRef?: TagEntrySelectionData
}


type TagListSectionEntriesProps = {
    items: React.ReactNode[]

    /**
     * How many results to display at once.
     * If not provided it will show all.
     */
    pageSize?: number
}

/**
 * Entries as section, within for either Tokens, Groups or Labels
 * 
 * Should display also its own message if no results were found?
 */
const TagListSectionEntries = function(props: TagListSectionEntriesProps) {
    let totalItems = props.items.length
    
    // If no pageSize then we aim to show all.
    const [bShowAll, setShowAll] = useState(!props.pageSize)

    // How many items should be made visible
    const [visibleCount, setVisibleCount] = useState(props.pageSize ?? totalItems)

    useEffect(() => {
        if (bShowAll) {
            setVisibleCount(totalItems)
        }
    }, [bShowAll]) // this technically makes one extra re-render
    useEffect(() => {
        setShowAll(!props.pageSize)
        if (props.pageSize)
            setVisibleCount(props.pageSize)    
    }, [props.items, props.pageSize])

    // Cut away from what to show
    let visibleItems = bShowAll ? props.items : props.items.slice(0, visibleCount)

    // If visibleCount is less than the total
    //const b_hasMoreItems = visibleCount < totalItems

    let remainingCount = totalItems - visibleCount
    //console.log(remainingCount, visibleItems.length)

    return (
        <div className="flex-column">
            {visibleItems}

            {
                // If there are more items display two buttons
                // Show More and Show All
                (remainingCount > 0) &&
                <div>
                    <ButtonStyled
                        onClick={function() {
                          setVisibleCount(current => current + (props.pageSize ?? 50))  
                        }}
                    >
                        <span>Show More</span>
                    </ButtonStyled>
                    <ButtonStyled
                        onClick={function() {
                            setShowAll(true)
                        }}
                    >
                        <span>Show All</span>
                    </ButtonStyled>
                </div>
            }
        </div>
    )
}


/**
 * To display a list of tags.
 * 
 * The sub-component has simple virtualization
 * with "Show More" and "Show All" buttons.
 */
function TagList(props: TagListProps) {
    let isSearching = false
    let bNoResults = false

    // Are we searching?
    if (props.query)
        isSearching = props.query.length > 0

    // Do we have results?
    if (
        (props.resultsTagData == undefined) 
            || (Object.keys(props.resultsTagData.TagTokens).length == 0)
            && (Object.keys(props.resultsTagData.TagGroups).length == 0)
            && (Object.keys(props.resultsTagData.TagLabelDefs).length == 0)
    ) {
        bNoResults = true
    }


    // Get the nodes ready for the results
    // Make the HTML out of it
    let tagResults = useMemo(() => {
        let results: {
            [key in keyof ITagDataRoot_JSON]: React.ReactNode[]
        } = {
            TagTokens: [],
            TagGroups: [],
            TagLabelDefs: []
        }

        let resultTagData = props?.resultsTagData
        if (resultTagData === undefined)
            return results

        for (const k_entryType of Object.keys(resultTagData)) {
            //console.log(k_entryType)

            let output: React.ReactNode[] = []

            for (const [k,v] of Object.entries(resultTagData[k_entryType as keyof ITagDataRoot_JSON])) {
                /*let b_IsActive = undefined
                if (v == props.selectedEntryRef?.tagDataRef) {
                    b_IsActive = true
                }*/

                output.push(
                    <TagListEntry
                        key={k}
                        tagDataRef={v}
                        entryType={k_entryType}
                        //isActive={b_IsActive}
                        onClick_forward={props.onListEntrySelected}
                    />
                )
            }

            // Store nodes
            results[k_entryType as keyof typeof results] = output;
        }

        return results
    }, [props.resultsTagData, props.onListEntrySelected])
    // Is this good?


    // Put results in like this, so we can loop create the elements to list them
    // without repeating same code
    const listResults = useMemo(() => {
        return [
            { type: "Tokens", items: tagResults.TagTokens, startExpanded: true },
            { type: "Groups", items: tagResults.TagGroups },
            { type: "Labels", items: tagResults.TagLabelDefs },
        ]
    }, [props.resultsTagData])


    return <>
    <div className="tagListContainer">
        {/* When searching */}
        {(isSearching && bNoResults) &&
            <div className="innerTextContainer dim-text">
                <i>{`No search results found for: "${props?.query}"`}</i>
            </div>
        }

        {/* The List */ }
        {/* Put the list itself in its own container, due to CSS */}
        <div className="display-contents">
            {listResults.map(listResult => {
                return <ExpandCollapsable 
                    key={listResult.type} // key
                    startExpanded={listResult.startExpanded}
                    //extraClassName="flex-pre-scroll-container"
                >
                    <ExpandCollapsable.Header>
                        {listResult.type} - ({listResult.items.length})
                    </ExpandCollapsable.Header>
                    <ExpandCollapsable.Content>
                        {/* Scrollable Flex */}
                        <div className="scrollable-Y flex-scroll">
                            <TagListSectionEntries
                                items={listResult.items}
                                pageSize={350}
                            />
                        </div>
                    </ExpandCollapsable.Content>
                </ExpandCollapsable>
            })}
        </div>

        
    </div>
    </>
}



export {
    TagList
}