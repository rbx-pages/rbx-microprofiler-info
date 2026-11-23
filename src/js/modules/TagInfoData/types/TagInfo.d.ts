/**
 * Some terminology can be found here:
 * https://github.com/Roblox/libmp/blob/main/docs/api-reference.md
 */

/**
 * Tag Groups eventually don't have colors but idk
 */



/**
 * Color in 3-entry array RGB.
 */
export type Color3Array = [number, number, number];



/**
 * This is the base, and should be put on anything that will contain documentation info.
 */
export interface ITagBaseDocsInfo {
    DocsInfo?: ITagDocsInfo;

    /**
     * Search Tags that lets strings in, that can be additionally used for filtering.
     * Tags could have their own description, but maybe separate.
     */
    Tags?: string[];
}

export interface ITagDocsInfo {
    /**
     * Raw text, meaning HTML is allowed as well.
     */
    Description?: string;

    /**
     * Performance Advice
     * Also raw HTML.
     */
    //DescAdvice?: string
    //ExtraDescs: ["kind", {}]
}


export interface ITagColorField {
    /**
     * Color if known.
     */
    Color?: Color3Array;
}



/// ====================================================


export interface ITagBaseNameableEntry extends ITagBaseDocsInfo, ITagColorField {
    /**
     * Unique ID
     */
    NameUID: string;


    /**
     * Optional, the way it should display
     * Can also be raw HTML, e.g. italic or similar
     */
    DisplayNameRaw?: string;

    /**
     * Whether it's an alias
     * Alias, would mean to re-use docs stuff
     * such as description
     */
    AliasOfNameUID?: string;
}


/**
 * For the Tokens, used for these "Tags"
 */
export interface ITagTokenEntry extends ITagBaseNameableEntry {
    /**
     * Name of the tag, that will also be the UID
     * The NameUID, e.g. "something::test"
     */
    NameUID: string;


    /**
     * If known, the Group this tag is part of.
     * e.g. LuaBridge for Script_
     */
    GroupUID?: string;


    /**
     * Label references that this Token may contain.
     * Order-sensitive
     */
    LabelUIDs?: string[];
}


/**
 * For Groups
 */
export interface ITagGroupEntry extends ITagBaseNameableEntry {
    /**
     * Name of the group, e.g. "LuaBridge"
     */
    NameUID: string;
}


/**
 * For Labels
 */
export interface ITagLabelEntry extends ITagBaseNameableEntry {
    /**
     * The Value Type the Label references
     */
    ValueType?: string
}