import React from "react";
import { TagEntrySelectionData } from "../Components/TagExplorer/TagListEntry";
import { ITagDataRoot_JSON } from "../../modules/TagInfoData/TagDataClasses";
import { ITagBaseNameableEntry } from "../../modules/TagInfoData/types/TagInfo";


export interface ITagSelectionRequestData {
    entryType?: keyof ITagDataRoot_JSON;
    nameUID?: string;
    tagDataRef?: ITagBaseNameableEntry
}

export interface IContext_TagExplorer {
    /**
     * This here is basically used to switch the selectionData entry.
     */
    onListEntrySelected: (selectionData: ITagSelectionRequestData) => void;
}

export const TagExplorerContext = React.createContext<IContext_TagExplorer>({
    onListEntrySelected: () => {}
})


type Props = {
    children: React.ReactNode

    onListEntrySelected?: (selectionData: ITagSelectionRequestData) => void;
}

export function TagExplorerContextProvider(props: Props) {

    return <TagExplorerContext.Provider value={{
        onListEntrySelected: props.onListEntrySelected ?? (() => {})
    }}>
        {props.children}
    </TagExplorerContext.Provider>;
}