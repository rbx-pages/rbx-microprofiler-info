import React, { useContext } from "react"
import { TagExplorerContext } from "../../Contexts/TagExplorerContext";
import { ITagDataRoot_JSON } from "../../../modules/TagInfoData/TagDataClasses";

type Props = {
    children: React.ReactNode;
    title?: string;

    nameUID: string,
    entryType: keyof ITagDataRoot_JSON
}

function TagLinkNoStyleButton(props: Props) {
    let {onListEntrySelected} = useContext(TagExplorerContext)

    return <button
        className="noStyleBtn"
        title={props.title}

        onClick={() => {
            onListEntrySelected({
                entryType: props.entryType,
                nameUID: props.nameUID,
            })
        }}
    >
        {props.children}
    </button>
}



export default TagLinkNoStyleButton