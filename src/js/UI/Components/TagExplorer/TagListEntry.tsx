import { ITagDataRoot_JSON } from "../../../modules/TagInfoData/TagDataClasses"
import { GetDisplayNameFromTagEntry } from "../../../modules/TagInfoData/TagDataUtils"
import { ITagBaseNameableEntry } from "../../../modules/TagInfoData/types/TagInfo"
import { ITagSelectionRequestData } from "../../Contexts/TagExplorerContext"

type Props = {
    /**
     * Reference to the TagData for this entry.
     */
    tagDataRef: ITagBaseNameableEntry

    /**
     * Whether it is "TagTokens" or something else.
     * We wouldn't maybe need this if there were Contexts
     */
    entryType?: string

    /**
     * Whether this entry is currently selected.
     */
    isActive?: boolean


    /**
     * When the button is clicked.
     */
    onClick_forward?: (data: ITagSelectionRequestData) => void
}


export type TagEntrySelectionData = {
    entryType?: keyof ITagDataRoot_JSON | string;
    tagDataRef?: ITagBaseNameableEntry;
}


/**
 * This here is a button that you can click
 * for the Tag Listings
 * Meant to show up in the Tag Listings
 */
export const TagListEntry = function(props: Props) {

    // Literally
    //let tagName = props.tagDataRef.NameUID
    let nameToDisplay = GetDisplayNameFromTagEntry(props.tagDataRef)

    return <button
        className={[
            "tagListEntryBtn",
            props.isActive && "active"
        ]
            .filter(Boolean)
            .join(" ")}

        // We need to forward some data
        onClick={() => props.onClick_forward?.({
            entryType: props.entryType as keyof ITagDataRoot_JSON,
            tagDataRef: props.tagDataRef,
        })}

        // Apply style overrides here!
        style={{
            ...(props.tagDataRef.Color != null && {
                ["--tagEntry-input-color" as any]: `rgb(${props.tagDataRef.Color})`
            })
        }}
    >
        <span>{nameToDisplay}</span>
    </button>
}