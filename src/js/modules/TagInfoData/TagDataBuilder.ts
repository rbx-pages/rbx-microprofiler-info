import { marked } from "marked";
import { TagDataClasses } from "./exportStuff";
import { BaseDocsEntry, BaseTagNameableEntry, ITagDataRoot_JSON, TagDataClassesHelper, TagDataRoot, TagGroupEntry, TagLabel, TagTokenEntry } from "./TagDataClasses"
import { TagDataUtils } from "./TagDataUtils";
import { ITagBaseDocsInfo, ITagBaseNameableEntry } from "./types/TagInfo";


/**
 * It would be possible to create a function that passes in the "this", with callback processor.
 */
/*
function ForReturnThis<T>(obj_this: T) {
    return function <Args extends any[]>(
        callbackFunc: (obj_this: T, ...args: Args) => void
    ) {
        return function (...args: Args) {
            callbackFunc(obj_this, ...args)
            return obj_this
        }
    }
}
*/

/*
class TestClass {
  public TestProp1 = "Value1"
  public TestProp2: string | undefined;
  
  constructor(data?: Partial<TestClass>) {
    let this_obj = this as Record<string, unknown>

    // Not sure if it should be done like this
    // It could mess with casting by removing fields
    if (data) {
      (Object.keys(this_obj) as Array<keyof TestClass>).forEach(function(key) {
        console.log(key)
        this_obj[key] = data[key];
      }, this_obj)
    }
  }
  
  public HelloFunc() {
    return "Hello"
  }
}

let newClass = new TestClass({
  TestProp1: "Override1",
  TestProp2: "Override2",
  notValidProp: "test"
})

console.log(newClass)
*/




/**
 * This is used to build the Tag Data
 */
export class TagDataBuilder {
    /**
     * Use static fromJSON to create from JSON.
     */
    constructor() {

    }

    /**
     * @param data Can take existing data as well.
     */
    /*constructor(data?: TagDataRoot) {
        if (data) {
            this.rootData = data;
        }
    }*/

    /**
     * Construct from JSON
     * @param input The JSON input
     */
    public static fromJSON(input: ITagDataRoot_JSON) {
        let newBuilder = new TagDataBuilder()
        
        // I could put it through a generic handler here?

        for (let tagData of Object.values(input.TagTokens)) {
            newBuilder.AddTagToken(new TagTokenEntry(tagData))
        }
        for (let tagData of Object.values(input.TagGroups)) {
            newBuilder.AddTagGroup(new TagGroupEntry(tagData))
        }
        for (let tagData of Object.values(input.TagLabelDefs)) {
            newBuilder.AddTagLabel(new TagLabel(tagData))
        }

        return newBuilder
    }


    /** Root of the data */
    public _rootHolder = new TagDataRoot();
    public rootData = this._rootHolder.RootData;


    private _EntryMapping = {
        /*[TagTokenEntry._typeSymbol]: this.rootData.TagTokens,
        [TagGroupEntry._typeSymbol]: this.rootData.TagGroups,
        [TagLabel._typeSymbol]: this.rootData.TagLabelDefs,*/
        ["TagTokenEntry"]: this.rootData.TagTokens,
        ["TagGroupEntry"]: this.rootData.TagGroups,
        ["TagLabel"]: this.rootData.TagLabelDefs,
    }

    static _labelPrefix = "label_"

    static makeLabelName(name: string) {
        return this._labelPrefix + name
    }


    public AddTagToken(tagToken: TagTokenEntry) {
        this._EntryMapping["TagTokenEntry"][tagToken.Data.NameUID] = tagToken
        //this._EntryMapping["TagTokenEntry"].push(tagToken)
        return this;
    }

    /**
     * Adds a Tag Group. The name you provide in the TagGroupEntry is the ID
     * that can be used to assign Tag Tokens to a group.
     * @returns Builder
     */
    public AddTagGroup(tagGroup: TagGroupEntry) {
        this._EntryMapping["TagGroupEntry"][tagGroup.Data.NameUID] = tagGroup
        return this;
    }

    public AddTagLabel(tagLabel: TagLabel) {
        this._EntryMapping["TagLabel"][tagLabel.Data.NameUID] = tagLabel
        return this;
    }

    public AddTagEntryGeneric<T extends BaseTagNameableEntry<ITagBaseNameableEntry>>(entry: T) {
        let table = this.GetGenericTableForTag(entry)
        if (table) {
            let indexer = entry.Data.NameUID
            if (table[indexer] !== undefined)
                throw new Error(`"${indexer}" is already in the entry for "${typeof entry}"`)

            table[indexer] = (entry as any)
            //table.push(entry as any)
        }
        else
            throw new Error("Invalid entry.")
        
        return this;
    }


    /**
     * To help with Generic stuff, return the table from the _EntryMapping.
     */
    public GetGenericTableForTag(entry: TagDataClasses.BaseDocsEntry<ITagBaseDocsInfo>) {
        //let result = this._EntryMapping[(entry.constructor as any)._typeSymbol! as keyof typeof this._EntryMapping]
        let result = this._EntryMapping[TagDataClassesHelper.GetGenericSymbol(entry as any) as keyof typeof this._EntryMapping]

        if (result === undefined)
             throw new Error("This type does not have a data storage.")

        return result;

        /*if (entry instanceof TagTokenEntry)
            return this.RootData.TagTokens;
        else if (entry instanceof TagGroupEntry)
            return this.RootData.TagGroups;
        else if (entry instanceof TagLabel)
            return this.RootData.TagLabelDefs;
        else
            throw new Error("This type does not have a data storage.")*/
    }

    /**
     * Generic adding
     * @param entries 
     */
    public AddGenericTagEntries(entries: BaseTagNameableEntry<ITagBaseNameableEntry>[]) {
        for (let entry of entries) {

            this.AddTagEntryGeneric(entry)
            /*if (entry instanceof TagTokenEntry)
                this.AddTagToken(entry)
            else if (entry instanceof TagGroupEntry)
                this.AddTagGroup(entry)
            else if (entry instanceof TagLabel)
                this.AddTagLabel(entry)*/
        }

        return this;
    }

    /*public AddTagTokens = this.AddGenericTagEntries
    public AddTagGroups = this.AddGenericTagEntries
    public AddTagLabels = this.AddGenericTagEntries*/


    /**
     * After the entire data is setup
     * this here could process data and expand data.
     * Post-processing
     */
    public Finalize() {
        // Make labels start with "label_"
        // We enforce this here and not before. Could change it though.
        for (let [key, tagLabel] of Object.entries(this.rootData.TagLabelDefs)) {
            if (!tagLabel.Data.NameUID.startsWith(TagDataBuilder._labelPrefix)) {
                throw new Error(`Labels need to start with ${TagDataBuilder._labelPrefix}`)
            }  
        }
        

        // Assign search tags where applicable?
        // like "has labels"

        
        // Format Descriptions
        TagDataUtils.ForEach_TagNameableEntryInRoot(this.rootData, function(entryType, tagEntry) {
            let docsInfo = tagEntry.Data.DocsInfo ?? undefined
            if (docsInfo !== undefined && docsInfo.Description != undefined) {
                let newDescription = docsInfo.Description.trim()
                newDescription = marked.parse(newDescription, {breaks: true, async: false})

                tagEntry.SetDescription(newDescription)
            }
        })

        return this;
    }

    /**
     * Convert our builder stored data into JSON
     * Don't forget to run Finalize before exporting
     * This needs to conform to ITagDataRoot_JSON
     */
    public toJSON() {
        /*let mirrorObj: any = {}
        
        for (let _k of Object.keys(this.rootData)) {
            let k = _k as keyof typeof this.rootData
            mirrorObj[k] = Object.values(this.rootData[k])
        }

        return JSON.stringify(mirrorObj)*/

        // JSON.stringify will look for "toJSON" under objects
        // It also passes something into "toJSON"
        return JSON.stringify(this.rootData)
    }
}