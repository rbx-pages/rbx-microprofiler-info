import SiteConfig from "../../modules/SiteConfig";
import Loader_TagData from "../../modules/Storage_TagData";
import { ITagDataRoot_JSON } from "../../modules/TagInfoData/TagDataClasses";
import { GetEntryFromTagDataRoot_JSON } from "../../modules/TagInfoData/TagDataUtils";



export function GetEntryFromTagDataRoot_Lookup(
    entryType?: keyof ITagDataRoot_JSON,
    nameUID?: string
) {
    if (Loader_TagData.data == undefined)
        return undefined;

    return GetEntryFromTagDataRoot_JSON(
        Loader_TagData.data,
        entryType as keyof ITagDataRoot_JSON,
        nameUID ?? ""
    )
}



export function MakeLinkURLToTagEntry(entryType: string, nameUID: string) {
    let origin = window.location.origin
    
    let newUrl = new URL(origin)

    // Uh... cheat
    if (origin.match("rbx-pages.github.io")) {
        newUrl = new URL(SiteConfig.GitHub_Pages_URL)
    }

    newUrl.searchParams.set("NameUID", nameUID)
    newUrl.searchParams.set("entryType", entryType)

    return newUrl
}