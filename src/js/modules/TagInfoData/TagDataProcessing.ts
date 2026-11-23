import { ITagDataRoot_JSON } from "./TagDataClasses";
import { ForEach_TagNameableEntryInRoot_JSON } from "./TagDataUtils";

export type T_TagEntryLinkFormat = {
    nameUID: string,
    entryType: keyof ITagDataRoot_JSON
}

type NameUID = string


/**
 * This says something similar like the Root Holder
 * {TagTokens: T, etc..}
 */
export type T_TagSubsectionForEntries<T> = {
    [entryType in keyof ITagDataRoot_JSON]?: T
}


export interface IMetadata_TagDataRoot {
    /**
     * Where certain labels appear.
     * What tags reference what.
     */
    LabelReferences: {
        /**
         * Would contain an array of NameUID
         */
        [labelUID: string]: [string] | undefined
    }

    /**
     * Search Tags and where they point to.
     * Holds a dimensional table with NameUIDs
     */
    SearchTagRefs: {
        [searchTagKey: string]: T_TagSubsectionForEntries<[NameUID?]>
    }
}

/**
 * Metadata for a Tag Root
 */
export class TagDataRootMeta {
    /**
     * Metadata
     */
    public Metadata: IMetadata_TagDataRoot


    /**
     * 
     */
    constructor(tagRootData_JSON?: ITagDataRoot_JSON) {
        if (tagRootData_JSON)
            this.Metadata = this.ConstructMetadata(tagRootData_JSON)
        else {
            this.Metadata = {
                LabelReferences: {},
                SearchTagRefs: {}
            }
        }
    }

    /**
     * For loading pre-builts.
     */
    fromJSON(jsonInput: IMetadata_TagDataRoot) {
        this.Metadata = jsonInput
    }


    private _PhaseLabelRefs(tagRootData_JSON: ITagDataRoot_JSON) {
        let _this = this
    }

    /**
     * Constructs Metadata from a given root.
     */
    ConstructMetadata(tagRootData_JSON: ITagDataRoot_JSON): IMetadata_TagDataRoot {
        let _this = this
        //let constructedMetadata = {}
        
        let labelRefs: IMetadata_TagDataRoot["LabelReferences"] = {}

        // Fill in label references
        // We loop through TagTokens, as these can reference labels
        Object.entries(tagRootData_JSON.TagTokens).forEach(function([k_tagToken, v]) {

            // Check if a token has labels
            if (v.LabelUIDs == undefined)
                return;

            v.LabelUIDs.forEach(function(k_label) {
                // If label has a reference already
                let keyExists = Object.hasOwn(labelRefs, k_label)
                if (keyExists) {
                    labelRefs[k_label]?.push(v.NameUID)
                } else {
                    // Otherwise if we're new, make a new array
                    labelRefs[k_label] = [v.NameUID]
                }
            })
        })

        
        // Search Tags
        let searchTagRefs: IMetadata_TagDataRoot["SearchTagRefs"] = {}
        ForEach_TagNameableEntryInRoot_JSON(tagRootData_JSON, function(_entryType, tagEntry) {
            if (!tagEntry.Tags)
                return

            let entryType = _entryType as keyof ITagDataRoot_JSON

            // Go through an Entry's Search Tags to do filling
            tagEntry.Tags.forEach(function(str_searchTag) {
                // If we already exist or not, else create
                if (!Object.hasOwn(searchTagRefs, str_searchTag))
                    searchTagRefs[str_searchTag] = {}

                // Same goes for the inner part
                if (!Object.hasOwn(searchTagRefs[str_searchTag], _entryType))
                    searchTagRefs[str_searchTag][entryType] = []

                // Then insert the entry NameUID itself into the search tag reference
                // based on entryType
                searchTagRefs[str_searchTag][entryType]?.push(tagEntry.NameUID)
            })
        })
        
        
        return {
            LabelReferences: labelRefs,
            SearchTagRefs: searchTagRefs,
        }
    }


    toJSON() {
        return JSON.stringify(this.Metadata)
    }
}