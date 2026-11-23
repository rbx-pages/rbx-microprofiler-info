/**
 * Purpose:
 * Utilities to search through Tag Data.
 * 
 * Search filtering order preferrably should be sub-class before base class.
 */

import { ITagDataRoot_JSON, TagBaseEntryHolderType, TagRootEntryKeyStrMap } from "./TagInfoData/TagDataClasses";
import { ITagBaseNameableEntry, ITagTokenEntry } from "./TagInfoData/types/TagInfo";
import { KeysOfObject } from "./Utils/TypeUtils";


export interface ITagSearchFilters {
    /**
     * Main Search Query
     */
    query?: string,

    /**
     * Whether to search through descriptions or not.
     */
    b_searchDesc?: boolean,

    //b_caseSens?: boolean

    /**
     * Whether to search for content that only has Labels.
     */
    b_onlyWithLabels: boolean,

    /**
     * Whether to use the Tag Group filter
     */
    b_useTagGroupFilter?: boolean

    /**
     * Only results from these TagGroups, using their NameUID.
     * Unless it is empty, then it doesn't care, for now.
     */
    arr_onlyTagGroups?: [string?]

    /**
     * Search Tags
     */
    arr_onlySearchTags?: [string?]
}


// namespace
//namespace TagSearching {


/**
 * Create empty Tag Data in JSON format.
 */
export function MakeEmptyTagDataJSON() {
    let newTagData: ITagDataRoot_JSON = {
        TagTokens: {},
        TagGroups: {},
        TagLabelDefs: {},
    }

    return newTagData
}


type TEntry = ITagBaseNameableEntry
type TPredicate = ([key, entry]: [string, TEntry]) => boolean

function BuildFilterPredicateBaseEntry(
    starterPredicatesArr: TPredicate[] = [],
    filters: ITagSearchFilters,
) {
    const predicates: TPredicate[] = starterPredicatesArr

    let searchQuery = filters.query ?? ""
    searchQuery = searchQuery.toLowerCase()

    // TODO: Support Group::token_name search?

    predicates.push(function([k, v]) {
        // NameUID
        let nameUID_cond = v.NameUID.toLowerCase().includes(searchQuery)

        // Support Display Names
        let displayName_cond = false
        if (v.DisplayNameRaw) {
            displayName_cond = v.DisplayNameRaw.toLowerCase().includes(searchQuery)
        }

        // Description
        let description_cond = filters.b_searchDesc &&
            v.DocsInfo?.Description?.toLowerCase().includes(searchQuery)

        
        let finalConditions = nameUID_cond
            || (displayName_cond ?? false)
            || (description_cond ?? false)

        return finalConditions
    })

    // Search Tags
    // Loop through current search tags and match with an entry's search tags
    if (filters.arr_onlySearchTags && filters.arr_onlySearchTags.length > 0) {
        predicates.push(function([k,v]) {
            // Contains any of the tags?
            for (let item of filters.arr_onlySearchTags!) {
                if (!item)
                    continue;

                if (v.Tags?.includes(item)) {
                    return true;
                }
            }

            return false;
        })
    }

    return predicates
}

function BuildFilterPredicatesGenericIntake(
    starterPredicatesArr: TPredicate[] = [],
    filters: ITagSearchFilters,
    entryTypeIntake?: keyof ITagDataRoot_JSON,
) {
    let predicates: TPredicate[] = starterPredicatesArr

    // entryTypeIntake tells us what kind of "type" we are.
    // This allows us to do special searching for a specific type
    switch (entryTypeIntake) {
        case TagRootEntryKeyStrMap.TagTokens: {
            // Filter the groups

            // If it's [], then we allow all to be included
            if (filters.arr_onlyTagGroups && filters.arr_onlyTagGroups?.length > 0) {
                // Has group?
                predicates.push(function([key, _entry]) {
                    let entry = _entry as ITagTokenEntry
                    return filters.arr_onlyTagGroups!.includes(entry.GroupUID)
                })
            }

            // Only with labels?
            if (filters.b_onlyWithLabels) {
                predicates.push(function([_, _entry]) {
                    let entry = _entry as ITagTokenEntry
                    
                    if (entry.LabelUIDs && entry.LabelUIDs.length > 0)
                        return true;

                    return false;
                })
            }
        }
        case TagRootEntryKeyStrMap.TagGroups: {
            
        }
        case TagRootEntryKeyStrMap.TagLabelDefs: {
            
        }

        default: {}
    }


    // Go further
    predicates = BuildFilterPredicateBaseEntry(predicates, filters)

    return predicates
}

/**
 * Search with predicates (set of functions) that define rules
 * on what to filter
 */
function SearchWithFilterPredicates(
    tagDocsEntryObj: TagBaseEntryHolderType,
    predicates: TPredicate[]
) {
    let filteredResult = tagDocsEntryObj

    filteredResult = Object.fromEntries(
        Object.entries(filteredResult).filter(function([k,v]) {
            // Search with predicates
            return predicates.every(function(predicate) {
                return predicate([k, v])
            })
        })
    )

    return filteredResult
}


/**
 * Function that searches for the TagBaseDocs type
 * REMINDER: This is for the BaseDocs type, other type logic shouldn't be in here!
 */
function SearchWithinTagBaseEntry(
    tagDocsEntryObj: TagBaseEntryHolderType,
    filters: ITagSearchFilters
) {
    let filteredResult = tagDocsEntryObj

    /*let searchQuery = filters.query ?? ""
    searchQuery = searchQuery.toLowerCase()

    filteredResult = Object.fromEntries(
        Object.entries(tagDocsEntryObj).filter(function ([k, v]) {
            // NameUID
            let nameUID_cond = v.NameUID.toLowerCase().includes(searchQuery)

            // Description
            let description_cond = filters.b_searchDesc &&
                v.DocsInfo?.Description?.toLowerCase().includes(searchQuery)


            let finalConditions = nameUID_cond
                || description_cond

            return finalConditions
        })
    )*/

    const predicates = BuildFilterPredicateBaseEntry(undefined, filters)
    filteredResult = SearchWithFilterPredicates(filteredResult, predicates)

    return filteredResult
}



/**
 * Filters tags
 * @param tagDocsEntryObj
 * Current filtering entry. New object recommended for direct modification
 * for filtering
 * @param filters Search Filters
 * @param entryTypeIntake What section the entry is
 * @returns Filtered results
 */
function SearchTagsWithGenericIntake(
    tagDocsEntryObj: TagBaseEntryHolderType,
    filters: ITagSearchFilters,
    entryTypeIntake?: keyof ITagDataRoot_JSON
) {
    /**
     * So we say that this function accepts entries of all types.
     */

    // start off with this here
    let filteredResult = tagDocsEntryObj


    // entryTypeIntake tells us what kind of "type" we are.
    // This allows us to do special searching for a specific type
    switch (entryTypeIntake) {
        case TagRootEntryKeyStrMap.TagTokens: {
            // Filter the groups
            // This here is a problem now, because now it's multiple loops
            // Depends how many entries survived each iteritation

            /*if (filters.arr_onlyTagGroups && filters.arr_onlyTagGroups?.length > 0) {
                filteredResult = Object.fromEntries(
                    Object.entries(filteredResult).filter(function([k,_v]) {
                        let v = _v as ITagTokenEntry
                        // If GroupID is included then include entry
                        if (filters.arr_onlyTagGroups?.includes(v.GroupUID)) {
                            return true
                        }
                    })
                )
            }*/
        }
        case TagRootEntryKeyStrMap.TagGroups: {
            
        }
        case TagRootEntryKeyStrMap.TagLabelDefs: {
            
        }

        default: {}
    }    
    
    //filteredResult = SearchWithinTagBaseEntry(filteredResult, filters)

    const filterPredicates = BuildFilterPredicatesGenericIntake(undefined, filters, entryTypeIntake)
    filteredResult = SearchWithFilterPredicates(filteredResult, filterPredicates)

    return filteredResult
}



/**
 * Searching function that returns tags.
 * It searches through the Tag Root.
 */
export function SearchTagRoot(
    tagRootData: ITagDataRoot_JSON,
    filters: ITagSearchFilters
) {

    // Create an empty tag data, to not modify the original one.
    let newTagData = MakeEmptyTagDataJSON()

    // And then we just do this here...
    // "k_entryType" is the key of the entry indexer, e.g. TagLabelDefs or something
    //for (const k_entryType of Object.keys(newTagData)) {
    for (const k_entryType of Object.keys(newTagData) as KeysOfObject<typeof newTagData>) {
        // Root data should always have this Record format... so
        newTagData[k_entryType] = SearchTagsWithGenericIntake(
            tagRootData[k_entryType], filters, k_entryType
        )
    }
    

    return newTagData
}

//} // namespace end


//export default TagSearching;
export * as TagSearching from "./TagSearching";