import { Color3Array, ITagBaseDocsInfo, ITagBaseNameableEntry, ITagColorField, ITagGroupEntry, ITagLabelEntry, ITagTokenEntry } from "./types/TagInfo";


/**
 * This is what the output is.
 */
export interface ITagDataRoot_JSON {
    TagTokens: Record<string, ITagTokenEntry> //ITagTokenEntry[]
    TagGroups: Record<string, ITagGroupEntry>
    TagLabelDefs: Record<string, ITagLabelEntry>

    //[key: string]: TagBaseEntryHolderType;
}


export type TagBaseEntryHolderType = Record<string, ITagBaseNameableEntry>


/**
 * String Map stuff, used for switch, case and other stuff
 * It's a reflection of the JSON stuff
 */
export const TagRootEntryKeyStrMap = {
    TagTokens: "TagTokens",
    TagGroups: "TagGroups",
    TagLabelDefs: "TagLabelDefs"
}


export interface ITagDataRoot_Classes {
    TagTokens: Record<string, TagTokenEntry>,
    TagGroups: Record<string, TagGroupEntry>,
    TagLabelDefs: Record<string, TagLabel>,
}


/**
 * The root of the Tag Data.
 * This here is mainly the thing the TagDataBuilder holds.
 * 
 * Data only in here.
 */
export class TagDataRoot {
    /**
     * The object that holds the data
     */
    public RootData: ITagDataRoot_Classes = {
        /**
         * Entries about the "tokens" or "scopes"
         * e.g. "heartbeatInternal"
         */
        TagTokens: {} as Record<string, TagTokenEntry>,
        //TagTokens: [] as TagTokenEntry[],

        /**
         * e.g. LuaBridge
         */
        TagGroups: {} as Record<string, TagGroupEntry>,

        
        /**
         * Let's define labels somewhere so we can re-use them
         * This is in case the same label is present on another tag. 
         */
        TagLabelDefs: {} as Record<string, TagLabel>,
    }
}




export class BaseDocsEntry<T extends ITagBaseDocsInfo> {
    public Data: T

    constructor(data: T) {
        // Allow direct construction of interface.
        this.Data = data
    }

    /**
     * Alternative function
     */
    public static fromJSON<TInterface extends ITagBaseDocsInfo>(
        this: any, //new (...args: any[]) => T,
        data: TInterface // Partial<T>
    ) {
        let newClass = new this(data)
        /*let newClass = Object.create(this.prototype)
        newClass.Data = {}
        Object.assign(newClass.Data, data)*/

        return newClass;
    }

    //static readonly _typeSymbol?: symbol

    
    private getDocsInfo() {
        // Create if it doesn't already exist
        if (this.Data.DocsInfo === undefined)
            this.Data.DocsInfo = {}
            //this.Data.DocsInfo ??= {}

        return this.Data.DocsInfo
    }


    /**
     * Sets the description.
     * Can be Raw HTML as well
     */
    public SetDescription(str: string) {
        this.getDocsInfo().Description = str
        return this;
    }

    /**
     * Assigns a search tag
     */
    public InsertSearchTags(input: string[]) {
        this.Data.Tags ??= [];
        this.Data.Tags = this.Data.Tags.concat(input)
        return this;
    }


    public toJSON(key: any) {
        // If we are nested then return the "Data" directly.
        // Don't stringify again, because JSON.parse is going to parse it as a string otherwise.
        if (key !== undefined)
            return this.Data

        return JSON.stringify(this.Data)
    }

    /**
     * 
     * @deprecated
     */
    /*public InsertTo(builder: TagDataBuilder) {
        let table = builder.GetGenericTableForTag(this)
        if (table)
            table.push(this as any)
        
        return this;
    }*/
}


export class BaseTagNameableEntry<T extends ITagBaseNameableEntry & ITagColorField>
extends BaseDocsEntry<T>
{
    /**
     * Constructor
     * @param input Takes in a name as string or direct data.
     */
    constructor(input: string | T) {
        if (typeof(input) === "string") {
            super({
                NameUID: input,
            } as T); // as T is a workaround, hides some errors
        } else {
            // Construct with direct data.
            super(input);
        }
    }
    /*constructor(input: string | T, callbackFunc: ((input: string) => T) | undefined) {
        if (typeof(input) === "string") {
            // A default fallback
            if (callbackFunc === undefined) {
                callbackFunc = function(strInput) {
                    return {NameUID: strInput} as T
                }
            }

            super(callbackFunc(input));
        }
    */

    
    /**
     * Avoid calling this, as it doesn't change the "key" of the holder
     */
    /*public SetNameUID(name: string) {
        this.Data.NameUID = name;
        return this;
    }*/

    /**
     * Set the color.
     */
    public WithColor(colorArr: Color3Array) { this.Data.Color = colorArr; return this; }

    /**
     * Set DisplayName
     */
    public WithDisplayName(str: string) { this.Data.DisplayNameRaw = str; return this; }

    /**
     * To inherit descriptions from
     */
    public AsAliasOf(str: string) {this.Data.AliasOfNameUID = str; return this; }
}



export class TagTokenEntry extends BaseTagNameableEntry<ITagTokenEntry> {
    private __brand!: "token" // These are here, to help with nominal typing
    //public static readonly _typeSymbol = Symbol("TagTokenEntry")

    /*constructor(input: string | ITagTokenEntry) {
        super(input, strInput => ({
            NameUID: strInput
        }))
    }*/

    /**
     * Assigns the token a "group category"
     * @param groupInput GroupUID or TagGroupEntry
     */
    public WithGroup(groupInput: string | TagGroupEntry) {
        if (typeof(groupInput) == "string") {
            this.Data.GroupUID = groupInput
        }
        else if (groupInput instanceof TagGroupEntry) {
            this.Data.GroupUID = groupInput.Data.NameUID
        }

        return this;
    }


    private getLabels() {
        return this.Data.LabelUIDs ??= []
    }

    /**
     * This adds a label into the Tag Token.
     * It's order-sensitive.
     */
    public AddLabel(labelUID: string) {
        this.getLabels().push(labelUID)
        return this;
    }
}

export class TagGroupEntry extends BaseTagNameableEntry<ITagGroupEntry> {
    private __brand!: "group"
    //public static readonly _typeSymbol = Symbol("TagGroupEntry")
}

export class TagLabel extends BaseTagNameableEntry<ITagLabelEntry> {
    private __brand!: "label"
    //public static readonly _typeSymbol = Symbol("TagLabel")
}



/**
 * Helper
 */
export class TagDataClassesHelper {
    // The overloads allow the type autocomplete to function
    // Probably because the other one is too dynamic to predict.
    public static GetGenericSymbol(input: TagTokenEntry): "TagTokenEntry"
    public static GetGenericSymbol(input: TagGroupEntry): "TagGroupEntry"
    public static GetGenericSymbol(input: TagLabel): "TagLabel"
    public static GetGenericSymbol<T>(input: T) {
        if (input instanceof TagTokenEntry)
            return "TagTokenEntry"
        else if (input instanceof TagGroupEntry)
            return "TagGroupEntry"
        else if (input instanceof TagLabel)
            return "TagLabel"
        else
            throw new Error("Not valid.")
    }
}