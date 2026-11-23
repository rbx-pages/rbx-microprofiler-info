import { useContext } from "react"
import SettingsContext from "../Contexts/SettingsContext"

/**
 * Get SettingsContext but through a standardized function
 */
export default function useSiteSettingsContext() {
    return useContext(SettingsContext)
}