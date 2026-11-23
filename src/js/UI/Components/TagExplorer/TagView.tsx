/**
 * This here displays tag stuff
 * 
 * TagView is one view, that displays one tag.
 */


import { useCallback, useContext, useMemo } from "react"
import Loader_TagData from "../../../modules/Storage_TagData"
import {GetColorForTagEntry, GetDisplayNameFromTagEntry, GetEntryFromTagDataRoot_JSON, TagDataUtils} from "../../../modules/TagInfoData/TagDataUtils"
import { ITagDataRoot_JSON, TagRootEntryKeyStrMap } from "../../../modules/TagInfoData/TagDataClasses"
import { ITagBaseNameableEntry, ITagGroupEntry, ITagLabelEntry, ITagTokenEntry } from "../../../modules/TagInfoData/types/TagInfo"
import { makeCSS_WidthHeight } from "../../../modules/Utils/Utilities"
import SVG_AssetUriMap from "../Other/SVG_AssetUriMap"
import SVG_Circle from "../Other/SVG_Circle"
import SVG_Inline from "../Utils/SVG_Inline"
import { TagExplorerContext } from "../../Contexts/TagExplorerContext"
import { MakeLinkURLToTagEntry } from "../../Helpers/SiteHelper"
import TagLinkNoStyleButton from "./TagLinkNoStyleButton"

type Props_TagView = {
    entryType?: keyof ITagDataRoot_JSON | string

    tagDataRef?: ITagBaseNameableEntry
}



/**
 * Table key to display string conversion
 */
function EntryType_ToDisplay(
    entryType?: keyof ITagDataRoot_JSON | string
) {
    switch (entryType) {
        case TagRootEntryKeyStrMap.TagTokens:
            return "Token"
        case TagRootEntryKeyStrMap.TagGroups:
            return "Group"
        case TagRootEntryKeyStrMap.TagLabelDefs:
            return "Label"

        default:
            return "Unknown";
    }
}



type Props_CircleButton = React.HTMLAttributes<HTMLElement> & {
    
}

function CircleButton(props: Props_CircleButton) {
    return <button
        {...props}

        title={props.title}
        className={
            ["btn btnCircle", props.className]
            .filter(Boolean)
            .join(" ")
        }
    >
        {props.children}
    </button>
}

type Props_LabelSectionComponent = {
    labelUIDs?: string[]

    /**
     * When clicking on a label entry
     */
    onClick_label?: (labelUID: string) => void
}

/**
 * Section to display Labels
 */
function LabelSectionComponent(props: Props_LabelSectionComponent) {
    if (props.labelUIDs == undefined)
        return null;

    let nodes = useMemo(function() {
        let data = Loader_TagData.data
        let output_nodes: React.ReactNode[] = []

        if (props.labelUIDs == null)
            return null

        for (let labelUID of props.labelUIDs) {
            let labelEntry = data?.TagLabelDefs[labelUID]
            
            if (labelEntry == undefined)
                continue; // Skip

            let node = <tr key={labelUID}>
                <td>
                    <button className="noStyleBtn"
                        title={labelEntry.NameUID} // always show this
                        onClick={() => props.onClick_label?.(labelUID)}
                    >
                        {TagDataUtils.GetDisplayNameFromTagEntry(labelEntry)}
                    </button>
                </td>

                {/* Set the description */}
                <td dangerouslySetInnerHTML={{
                    __html: labelEntry.DocsInfo?.Description ?? ""
                }}>
                </td>
            </tr>
            
            output_nodes.push(node)
        }

        return output_nodes
    }, [props.labelUIDs])

    return <div>
        <table>
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {nodes}
            </tbody>
        </table>
    </div>
}


type Props_LabelReferencesComponent = {
    curLabelUID: string | undefined;
}
function LabelReferencesComponent(props: Props_LabelReferencesComponent) {
    if (props.curLabelUID == undefined)
        return null;

    const labelRefs = Loader_TagData.metadataHolder.Metadata.LabelReferences

    let entries = undefined
    if (Object.hasOwn(labelRefs, props.curLabelUID))
        entries = labelRefs[props.curLabelUID]
    if (entries == undefined || entries.length <= 0)
        return null;


    const nodes = entries.map(function(v_tokenNameUID) {
        return <li
            key={v_tokenNameUID}
        >
            {/* Make a link */}
            <TagLinkNoStyleButton
                entryType="TagTokens"
                nameUID={v_tokenNameUID}
            >{v_tokenNameUID}</TagLinkNoStyleButton>
        </li>
    })

    return <section className="wrapper">
        <h2>Referenced by</h2>
        <div>
            <ul>{nodes}</ul>
        </div>
    </section>
}




/**
 * Selection Tutorial
 */
function PlaceholderComponent() {
    return <div className="tagView">
        <div className="placeholder-container dim-text">
            Select an entry to view info.
        </div>
    </div>
}


export function TagView(props: Props_TagView) {

    // Maybe some hooks need to be before early return?

    if (props.tagDataRef === undefined)
        return PlaceholderComponent();

    
    // Should be a reference to loaded Tag Data
    let tagDataRef = props.tagDataRef

    let selectedNameUID = tagDataRef.NameUID
    let partOf_groupUID = "Unknown"
    let bCapabilities_hasGroup = false
    let bCapabilities_hasTags = false

    let titleDisplayText = "<Entry Name>"
    let b_hasLabels = false

    // Get name to display as title.
    titleDisplayText = GetDisplayNameFromTagEntry(tagDataRef)
    let entryColor = GetColorForTagEntry(tagDataRef,props.entryType as keyof ITagDataRoot_JSON, Loader_TagData.data!)

    // NOW, load the alias if there is one
    // The order is important
    if (tagDataRef.AliasOfNameUID !== undefined) {
        // re-overwrite
        tagDataRef = GetEntryFromTagDataRoot_JSON(
            Loader_TagData.data!,
            (props.entryType as keyof ITagDataRoot_JSON),
            tagDataRef.AliasOfNameUID
        )!
        if (tagDataRef === undefined)
            throw new Error("Probably an error with the JSON.")
    }

    // Get the color, if available


    // Extra processing by specific entry types
    switch (props.entryType) {
        case TagRootEntryKeyStrMap.TagTokens: {
            let tagToken = tagDataRef as ITagTokenEntry
            bCapabilities_hasGroup = true

            partOf_groupUID = tagToken.GroupUID ?? partOf_groupUID

            if (tagToken.LabelUIDs != undefined
                && tagToken.LabelUIDs.length > 0
            )
                b_hasLabels = true

            break;
        }


        default: {}
    }

    if (tagDataRef.Tags && tagDataRef.Tags.length > 0)
        bCapabilities_hasTags = true


    let groupColor = [255, 255, 255] as any
    if (bCapabilities_hasGroup && Loader_TagData.data?.TagGroups[partOf_groupUID]) {
        groupColor = Loader_TagData.data.TagGroups[partOf_groupUID].Color
    }

    
    const b_hasDescription = tagDataRef.DocsInfo?.Description ? true : false
    /*const tagToken = props.tagDataRef as ITagTokenEntry
    const tagGroup = props.tagDataRef as ITagGroupEntry
    const tagLabel = props.tagDataRef as ITagLabelEntry*/


    function func_copyName() {
        if (tagDataRef.NameUID == undefined)
            return;

        navigator.clipboard.writeText(
            tagDataRef.NameUID ?? ""
        )
        window.alert("Copied!")
    }
    let func_copyLink = useCallback(function() {
        let link = MakeLinkURLToTagEntry(
            props.entryType ?? "",
            tagDataRef.NameUID
        )

        navigator.clipboard.writeText(link.toString())
        window.alert("Copied!")
    }, [props.entryType, tagDataRef.NameUID])


    function MainContentNode() {
        return <>
        
        </>
    }

    let {onListEntrySelected} = useContext(TagExplorerContext)

    let groupLabelSelected = useCallback(function() {
        //console.log("Click!")

        onListEntrySelected({
            entryType: "TagGroups",
            nameUID: partOf_groupUID,
        })
    }, [partOf_groupUID])

    
    return <>
    <div className="tagView">
        <section className="introSection"
            style={{
                marginBottom: "20px",
            }}
        >
            <div className="titleContainer flex-row items-center"
                style={{justifyContent:"space-between"}}
            >
                {/* Title */}
                <div className="flex-column">
                    <div className="flex-row items-center">
                        <span className="title">
                            {titleDisplayText}
                        </span>
                        {/*<SVG_Circle
                            {...makeCSS_WidthHeight("24px")}
                            color={`rgb(${tagDataRef.Color})`}
                        />*/}
                    </div>
                </div>

                {/* Container with buttons */}
                <div
                    className="flex-row items-center"
                    style={{gap:"4px"}}
                >
                    <CircleButton
                        title="Copy Name"
                        className="square-32"
                        onClick={func_copyName}
                    >
                        <span className="icon"
                        >
                            <SVG_Inline
                                src={SVG_AssetUriMap.clone}
                                {...makeCSS_WidthHeight("12px")}
                            />
                        </span>
                    </CircleButton>
                    <CircleButton
                        title="Share"
                        className="square-32"
                        onClick={func_copyLink}
                    >
                        <span className="icon"
                        >
                            <SVG_Inline
                                src={SVG_AssetUriMap["hyperlink-solid"]}
                                {...makeCSS_WidthHeight("12px")}
                            />
                        </span>
                    </CircleButton>
                </div>
            </div>

            {/* Sub display */}
            <div className="subIntroInfo-container flex-row font-d-small">
                <div className="subEntry flex-row items-center">
                    <span><b>Type:</b></span>
                    <span className="">{EntryType_ToDisplay(props.entryType)}</span>
                </div>

                {
                    (bCapabilities_hasGroup) &&
                    <div className="vertDivLine"/>
                }

                <div
                    className="subEntry flex-row items-center"
                    style={{
                        display: (!bCapabilities_hasGroup ? "none" : undefined),
                    }}
                >
                    <span><b>Group:</b></span>
                    <button className="noStyleBtn roundedTag-box"
                        style={{fontFamily:"monospace", fontWeight:"bold"}}
                        onClick={groupLabelSelected}
                    >
                        <span>{partOf_groupUID}</span>
                        <SVG_Circle
                            {...makeCSS_WidthHeight("6px")}
                            color={`rgb(${groupColor})`}
                        />
                        {/*<span className="circleDot" style={{marginLeft:"4px"}}></span>*/}
                    </button>
                </div>

                {
                    tagDataRef.DisplayNameRaw && 
                    <>
                        <div className="vertDivLine"/>
                        <code title="Actual NameUID">
                            {selectedNameUID}
                        </code>
                    </>
                }
            </div>

            {/* Search Tags */}
            {
                bCapabilities_hasTags &&
                <div className="subIntroInfo-container flex-row"
                    style={{
                        justifySelf: "flex-end"
                    }}
                >
                    <div
                        className="subEntry flex-row items-center"
                        style={{
                            display: (!bCapabilities_hasTags ? "none" : undefined),
                        }}
                    >
                        {tagDataRef.Tags?.map(function(str) {
                            return <div key={str} className="noStyleBtn roundedTag-box">
                                {str}
                            </div>
                        })}
                    </div>
                    <span>Tags</span>
                </div>
            }
        </section>

        <section className="wrapper"
            style={{marginBottom: "20px"}}
        >
            {/* Description */}
            <h2>Description</h2>
            <div className="desc">

                {
                    (!b_hasDescription) &&
                    <span className="dim-text">
                        No description.
                    </span>
                }

                <span
                    dangerouslySetInnerHTML={{
                        __html: tagDataRef.DocsInfo?.Description ?? ""
                    }}
                >
                </span>
            </div>
        </section>


        {/* Another section for if there's references for labels */ }
        {
            (props.entryType == "TagLabelDefs") &&
            <LabelReferencesComponent
                curLabelUID={props.tagDataRef.NameUID}
            />
        }


        {/* Labels */}
        {
        b_hasLabels &&
        <section className="wrapper">
            <h2>Labels</h2>
            
            <LabelSectionComponent
                labelUIDs={(tagDataRef as ITagTokenEntry).LabelUIDs}
                onClick_label={(labelUID) => {
                    onListEntrySelected({
                        entryType: "TagLabelDefs",
                        nameUID: labelUID
                    })
                }}
            />
        </section>
        }
    </div>
    </>
}
