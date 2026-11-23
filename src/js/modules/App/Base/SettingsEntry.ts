export class SettingsEntry {
    /**
     * Indexer into the settings.
     */
    public SettingsKey: string

    public ValueType: "string" | "number" | string
    
    public Description?: string

    /**
     * Constructor
     * Needs a settingsKey
     */
    constructor(
        settingsKey: string,
        valueType: string
    ) {
        this.SettingsKey = settingsKey
        this.ValueType = valueType
    }

    /**
     * Set a Description.
     */
    public SetDescription(str: string) {
        this.Description = str
    }
}