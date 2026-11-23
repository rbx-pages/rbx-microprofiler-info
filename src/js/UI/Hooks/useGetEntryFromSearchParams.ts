import { useSearchParams } from "react-router-dom";
import { GetEntryFromTagDataRoot_Lookup } from "../Helpers/SiteHelper";
import { ITagDataRoot_JSON } from "../../modules/TagInfoData/TagDataClasses";
import { TagEntrySelectionData } from "../Components/TagExplorer/TagListEntry";

// unused?

function useGetEntryFromSearchParams(): TagEntrySelectionData | undefined {
    const [searchParams, setSearchParams] = useSearchParams();

    const uri_nameUID = searchParams.get("NameUID")
    const uri_entryType = searchParams.get("entryType")

    if (uri_nameUID == null || uri_entryType == null)
        return undefined

    let startingTagDataRef = GetEntryFromTagDataRoot_Lookup(
        uri_entryType as keyof ITagDataRoot_JSON,
        uri_nameUID ?? "",
    )

    return {
        entryType: uri_entryType ?? "",
        tagDataRef: startingTagDataRef,
    }
}

export default useGetEntryFromSearchParams;