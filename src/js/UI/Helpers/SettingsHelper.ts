import SiteConfig from "../../modules/SiteConfig";
import { ISiteSettings } from "../Contexts/SettingsContext";

export function SaveSiteSettings(settings: ISiteSettings) {
    localStorage.setItem(
        SiteConfig.LocalStorage_Settings_Key,
        JSON.stringify(settings)
    )
}

export function ResetSiteSettings() {
    localStorage.removeItem(SiteConfig.LocalStorage_Settings_Key)
}