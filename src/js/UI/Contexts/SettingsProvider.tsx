import React, { useState } from "react";
import SiteConfig from "../../modules/SiteConfig";
import SettingsContext, { ISiteSettings } from "./SettingsContext";

/*
 * SettingsContext already triggers createContext
 * This file here just makes the template provider.
 */

export function SettingsProvider({children}: {children: React.ReactNode}) {
    const [siteSettings, setSiteSettings] = useState<ISiteSettings>(function() {
        // Get values from localStorage, otherwise empty table.
        let settings = localStorage.getItem(SiteConfig.LocalStorage_Settings_Key)
        
        if (settings)
            settings = JSON.parse(settings)

        return settings ?? {}
    });

    // TODO: stuff

    return <SettingsContext.Provider 
        value={{
            siteSettings, setSiteSettings
        }}
    >
        {children}
    </SettingsContext.Provider>
}


export default SettingsProvider