import { useEffect, useMemo } from "react"
import { ITagDataRoot_JSON } from "../../../modules/TagInfoData/TagDataClasses"
import ExpandCollapsable from "../Base/ExpandCollapsable/ExpandCollapsable"
import { TagEntrySelectionData, TagListEntry } from "./TagListEntry"
import { ITagSelectionRequestData } from "../../Contexts/TagExplorerContext"

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
    items: []

    /**
     * How many results to display at once.
     */
    pageSize?: number
}


/**
 * Entries as section, within for either Tokens, Groups or Labels
 * Should display also its own message if no results were found?
 */
function TagListSectionEntries(props: TagListSectionEntriesProps) {


    return null
}


/**
 * To display a list of tags.
 * 
 * TODO: Virtualization or some kind of Show All or More button.
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
    }, [props.resultsTagData])
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
                    key={listResult.type}
                    startExpanded={listResult.startExpanded}
                    //extraClassName="flex-pre-scroll-container"
                >
                    <ExpandCollapsable.Header>
                        {listResult.type} - ({listResult.items.length})
                    </ExpandCollapsable.Header>
                    <ExpandCollapsable.Content>
                        {/* Scrollable Flex */}
                        <div className="scrollable-Y flex-scroll">
                            {listResult.items}
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