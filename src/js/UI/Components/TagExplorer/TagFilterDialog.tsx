/**
 * Filtering logic should be found inside of "TagSearching.ts"
 */

import { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { ITagSearchFilters } from "../../../modules/TagSearching"
import Loader_TagData from "../../../modules/Storage_TagData";

type Props = {
    
    /**
     * Pre-set filter settings
     */
    filterSettings: ITagSearchFilters

    /**
     * When something was changed in the filters.
     */
    onChange?: (draftFilters: ITagSearchFilters) => void;


    /**
     * When clear is requested.
     */
    onClearBtnClicked?: () => void;

    
    handleRef?: React.Ref<TagFilterDialogHandle>;
}


type TSettingKey = keyof ITagSearchFilters


type Props_Checkbox = {
    id?: string

    checked: boolean

    settingsKey: TSettingKey,

    onCheckboxChange: (settingsKey: TSettingKey, checked: boolean) => void
}
function CheckboxInternal(props: Props_Checkbox) {
    return <input 
        id={props.id}
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onCheckboxChange?.(props.settingsKey, e.target.checked)}
    />
}


type Props_Filter_CheckboxList = {
    itemsToList: {
        key: string,
        entryUID: string,
    }[];

    existingItems?: [string?];

    settingsKey: TSettingKey;

    onChange: (
        settingsKey: TSettingKey,
        value: ITagSearchFilters["arr_onlyTagGroups"]
    ) => void,
}
function Filter_CheckboxList(props: Props_Filter_CheckboxList) {
    let checkedItems = props.existingItems

    function updateSingle(strEntry: string, checked: boolean) {
        if (checkedItems == undefined)
            checkedItems = []

        // Should this even stay an array?

        if (checked) {
            // If not already inside
            if (!checkedItems.includes(strEntry)) {
                checkedItems.push(strEntry)
            }
        } else {
            if (checkedItems.includes(strEntry)) {
                let foundIndex = checkedItems.findIndex(function(indexToMatch) {
                    return indexToMatch === strEntry
                })
                checkedItems.splice(foundIndex, 1)
            }
        }

        // e.g. props.onChange("arr_onlyTagGroups", arr_onlyTagGroups)
        props.onChange(props.settingsKey, checkedItems)
    }

    let output: React.ReactNode[] = [];
    
    Object.entries(props.itemsToList).map(function([_, item]) {
        let k = item.key

        output.push(
            <span key={k}>
                <input 
                    type="checkbox"
                    id={k}
                    // Make checked if key is in array
                    checked={checkedItems?.includes(k)}
                    onChange={(e) => updateSingle(k, e.target.checked)}
                />
                <label key={k} htmlFor={k}>{item.entryUID}</label>
            </span>
        )
    })

    return <div>
        {output}
    </div>
}


type Props_Filter_TagGroups = {
    arr_onlyTagGroups?: ITagSearchFilters["arr_onlyTagGroups"]

    onChange: (
        settingsKey: TSettingKey,
        value: ITagSearchFilters["arr_onlyTagGroups"]
    ) => void,
}

/**
 * This here uses NameUID as keys!
 */
function Filter_TagGroups(props: Props_Filter_TagGroups) {
    if (Loader_TagData.data == undefined)
        return null;

    /*let arr_onlyTagGroups = props.arr_onlyTagGroups

    function updateSingle(groupUID: string, checked: boolean) {
        if (arr_onlyTagGroups == undefined)
            arr_onlyTagGroups = []

        // Should this even stay an array?

        if (checked) {
            // If not already inside
            if (!arr_onlyTagGroups.includes(groupUID)) {
                arr_onlyTagGroups.push(groupUID)
            }
        } else {
            if (arr_onlyTagGroups.includes(groupUID)) {
                let foundIndex = arr_onlyTagGroups.findIndex(function(indexToMatch) {
                    return indexToMatch === groupUID
                })
                arr_onlyTagGroups.splice(foundIndex, 1)
            }
        }

        props.onChange("arr_onlyTagGroups", arr_onlyTagGroups)
    }*/

    const items = Object.entries(Loader_TagData.data.TagGroups).map(([k, v]) => ({
        key: k,
        entryUID: v.NameUID
    }));

    return <Filter_CheckboxList
        itemsToList={items}
        settingsKey="arr_onlyTagGroups"
        existingItems={props.arr_onlyTagGroups}
        onChange={props.onChange}
    />
}

type Props_Filter_SearchTags = {
    arr_onlySearchTags?: ITagSearchFilters["arr_onlySearchTags"]

    onChange: (
        settingsKey: TSettingKey,
        value: ITagSearchFilters["arr_onlySearchTags"]
    ) => void,
}
function Filter_SearchTags(props: Props_Filter_SearchTags) {
    if (Loader_TagData.data == undefined)
        return null;

    const items = Object.entries(Loader_TagData.metadataHolder.Metadata.SearchTagRefs).map(([k, _]) => ({
        key: k,
        entryUID: k
    }));

    return <Filter_CheckboxList
        itemsToList={items}
        settingsKey="arr_onlySearchTags"
        existingItems={props.arr_onlySearchTags}
        onChange={props.onChange}
    />
}


export interface TagFilterDialogHandle {
    triggerClearFunc?: () => void;
}


/**
 * 
 */
export default function TagFilterDialog(props: Props) {
    // should one use useReducer?

    // this here is the initial state so it's not gonna update unless the element is new
    let [draftFilters, setDraftFilters] = useState<ITagSearchFilters>(props.filterSettings)

    // Updates filters
    function updateFilters<K extends keyof ITagSearchFilters>(
        key: keyof ITagSearchFilters,
        value: ITagSearchFilters[K]
    ) {
        const updatedFilters = {
            ...draftFilters,
            [key]: value,
        }
        setDraftFilters(updatedFilters)

        props.onChange?.(updatedFilters)
    }

    useImperativeHandle(props.handleRef, function() {
        return {
            triggerClearFunc: props.onClearBtnClicked
        }
    }, [props.onClearBtnClicked])


    // Update settings in need
    useEffect(function() {
        setDraftFilters(props.filterSettings)
    }, [props.filterSettings])


    // useMemo, display Tag Group filters
    let tagGroupNodes = useMemo(function() {
        return <Filter_TagGroups
            arr_onlyTagGroups={draftFilters.arr_onlyTagGroups}
            onChange={updateFilters}
        />
    }, [Loader_TagData.data, draftFilters])
    let searchTagNodes = useMemo(function() {
        return <Filter_SearchTags
            arr_onlySearchTags={draftFilters.arr_onlySearchTags}
            onChange={updateFilters}
        />
    }, [Loader_TagData.data, draftFilters])


    return <>
    <div
        style={{
            minWidth: "20vw",
        }}
    >
        <form>
            <div>
                <h3>General</h3>
                <div>
                    <CheckboxInternal
                        checked={draftFilters.b_searchDesc ?? false}
                        settingsKey="b_searchDesc"
                        onCheckboxChange={updateFilters}
                    />
                    <label>Search Descriptions</label>
                </div>
                <div>
                    <CheckboxInternal
                        checked={draftFilters.b_onlyWithLabels ?? false}
                        settingsKey="b_onlyWithLabels"
                        onCheckboxChange={updateFilters}
                    />
                    <label>Has Labels</label>
                </div>


            </div>
            <br/>
            <div>
                <h3>Groups Filter</h3>
                {tagGroupNodes}
            </div>
            <br/>
            <div>
                <h3>Search Tags</h3>
                {searchTagNodes}
            </div>
        </form>
    </div>
    </>
    
}