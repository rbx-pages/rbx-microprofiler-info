import { BaseTagNameableEntry, ITagDataRoot_Classes, ITagDataRoot_JSON, TagDataRoot } from "./TagDataClasses.ts"
import { Color3Array, ITagBaseNameableEntry, ITagTokenEntry } from "./types/TagInfo"


/**
 * Retrieve tag data from NameUID
 * Though you need an entryType
 */
export function GetEntryFromTagDataRoot_JSON(
    data: ITagDataRoot_JSON,
    rootKeyIndexer: keyof ITagDataRoot_JSON,
    nameUID: string
): ITagBaseNameableEntry | undefined {
    if (data[rootKeyIndexer]) {
        return data[rootKeyIndexer][nameUID]
    }

    return undefined
}


/**
 * Get whatever will count as "DisplayName" for the given entry.
 * If an entry has a DisplayName retrieve it.
 * Else just get NameUID
 */
export function GetDisplayNameFromTagEntry(entryData: ITagBaseNameableEntry) {
    if (entryData.DisplayNameRaw)
        return entryData.DisplayNameRaw
    else
        return entryData.NameUID
}


/**
 * Returns the color for the tag entry
 * Gets it in this order
 * - Original Data
 * - Alias entry
 * - Group Data
 */
export function GetColorForTagEntry(
    entryData: ITagBaseNameableEntry,
    entryType?: keyof ITagDataRoot_JSON,
    rootData?: ITagDataRoot_JSON
): (Color3Array | undefined)
{
    let colorToReturn = undefined

    if (entryData.Color)
        colorToReturn = entryData.Color

    if (entryType != undefined && colorToReturn == undefined) {
        switch(entryType) {
            case "TagTokens": {
                let tagToken = entryData as ITagTokenEntry

                if (colorToReturn == undefined) {
                    if (tagToken.AliasOfNameUID) {
                        let aliasEntry = GetEntryFromTagDataRoot_JSON(
                            rootData!, "TagTokens", tagToken.AliasOfNameUID
                        )
                        if (aliasEntry)
                            colorToReturn = GetColorForTagEntry(aliasEntry, "TagTokens", rootData)
                    }

                    if (tagToken.GroupUID) {
                        let groupEntry = GetEntryFromTagDataRoot_JSON(
                            rootData!,
                            "TagGroups",
                            tagToken.GroupUID
                        )

                        if (groupEntry)
                            colorToReturn = GetColorForTagEntry(groupEntry, "TagGroups", rootData)
                    }
                }

                break;
            }
            default:
                break;
        }
    }

    return colorToReturn
}



type T_forEachNameableEntryCb<T_tagEntryKind> = (
    /**
     * What kind are we looping through?
     */
    entryType: string,
    tagEntry: T_tagEntryKind
) => void

export function ForEach_TagNameableEntryInRoot_JSON(
    jsonRootData: ITagDataRoot_JSON,
    forEachCb: T_forEachNameableEntryCb<ITagBaseNameableEntry>
) {
    for (let entryType of Object.keys(jsonRootData)) {
        for (let [key, _tagEntry] of Object.entries(jsonRootData[entryType as keyof typeof jsonRootData])) {
            let tagEntry = _tagEntry as ITagBaseNameableEntry
            
            forEachCb(entryType, tagEntry)
        }
    }
}

export function ForEach_TagNameableEntryInRoot(
    tagRootDataHolder: ITagDataRoot_Classes,
    forEachCb: T_forEachNameableEntryCb<BaseTagNameableEntry<ITagBaseNameableEntry>>
) {
    let rootData = tagRootDataHolder
    for (let entryType of Object.keys(rootData)) {
        for (let [key, _tagEntry] of Object.entries(rootData[entryType as keyof typeof rootData])) {
            let tagEntry = _tagEntry as BaseTagNameableEntry<ITagBaseNameableEntry>
            
            forEachCb(entryType, tagEntry)
        }
    }
}



export * as TagDataUtils from "./TagDataUtils.ts"