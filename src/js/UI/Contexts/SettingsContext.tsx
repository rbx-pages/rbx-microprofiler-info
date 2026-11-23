import React from "react";


export interface ISiteSettings {
    /**
     * Whether to disable the colors on the TagListing
     */
    b_disableColorsOnTagList?: boolean


    /**
     * Whether we prefer to dock the filters or have a modal.
     */
    b_preferDockFilters?: boolean
}


export interface IContext_Settings {
    siteSettings: ISiteSettings,
    setSiteSettings: React.Dispatch<React.SetStateAction<ISiteSettings>>
}


const SettingsContext = React.createContext<IContext_Settings>({
    siteSettings: {},
    setSiteSettings: () => {},
})


export default SettingsContext