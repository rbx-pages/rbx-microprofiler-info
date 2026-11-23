import { useEffect, useState } from "react";
import { ISiteSettings } from "../Contexts/SettingsContext";
import useSiteSettingsContext from "../Hooks/useSiteSettingsContext";
import ButtonStyled from "./ButtonStyled";
import { ResetSiteSettings, SaveSiteSettings } from "../Helpers/SettingsHelper";

type TSettingKey = keyof ISiteSettings
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



type Props = {
    onSaveButtonClicked?: () => void;
}

/**
 * A panel with the settings to configure.
 */
function SettingsPanel(props: Props) {
    // This here should use the context straight up
    let settingsContext = useSiteSettingsContext()

    let [draft, setDraft] = useState<ISiteSettings>(settingsContext.siteSettings)

    function updateDraft<K extends keyof ISiteSettings>(
        key: TSettingKey,
        value: ISiteSettings[K]
    ) {
        const updatedFilters = {
            ...draft,
            [key]: value,
        }
        setDraft(updatedFilters)
    }

    // Update settings in case of need
    useEffect(function() {
        setDraft(settingsContext.siteSettings)
    }, [settingsContext.siteSettings])

    
    function saveSiteSettings() {
        settingsContext.setSiteSettings(draft)
        SaveSiteSettings(draft)

        props.onSaveButtonClicked?.()
    }
    function resetSiteSettings() {
        settingsContext.setSiteSettings({})
        ResetSiteSettings()
    }

    return <div>
        <div>
            <CheckboxInternal
                settingsKey="b_preferDockFilters"
                checked={draft.b_preferDockFilters ?? false}
                onCheckboxChange={updateDraft}
            />
            <label>Dock Search Filter</label>
        </div>
        <div>
            <CheckboxInternal
                settingsKey="b_disableColorsOnTagList"
                checked={draft.b_disableColorsOnTagList ?? false}
                onCheckboxChange={updateDraft}
            />
            <label>Disable Colors on Tag List</label>
        </div>


        <br/>
        <div>
            <button
                className="btn modalBtn modalCloseWindowBtnStyle"
                onClick={resetSiteSettings}
            >
                Reset
            </button>
            <span style={{marginRight: "1em"}}></span>
            <ButtonStyled
                recolorAs="#3149ff"
                onClick={saveSiteSettings}
            >Save</ButtonStyled>
        </div>
    </div>;
}


export default SettingsPanel;