import { TagDataClasses } from "../../../js/modules/TagInfoData/exportStuff"
import { ITagBaseDocsInfo, ITagBaseNameableEntry, ITagDocsInfo } from "../../../js/modules/TagInfoData/types/TagInfo"


console.log(
    new TagDataClasses.TagTokenEntry("test")
        .SetDescription("test")
        .WithColor([255,0,0])
)


interface IFooGroup extends ITagBaseDocsInfo {
    Group?: string;
}

// class AlternativeDocsTest<T> implements ITagBaseDocInfo

class AlternativeDocsTest implements ITagBaseDocsInfo {
    public DocsInfo?: ITagDocsInfo
    public Tags?: string[]


    public static fromJSON<T, TClass>(
        classInput: new (...args: any[]) => TClass,
        data: T
    ): TClass {
        let newClass = Object.create(classInput.prototype)
        
        if (data) {
            (Object.keys(data) as Array<keyof T>).forEach(function(key) {
                console.log(key)
                newClass[key] = data[key];
            }, newClass)
        }

        return newClass;
    }

    public static fromJSON2<T>(
        this: new (...args: any[]) => T,
        data: Partial<T>
    ): T {
        let newClass = Object.create(this.prototype)
        
        if (data) {
            (Object.keys(data) as Array<keyof T>).forEach(function(key) {
                console.log(key)
                newClass[key] = data[key];
            }, newClass)
        }

        return newClass;
    }

    private getDocsInfo() {
        // Create if it doesn't already exist
        if (this.DocsInfo === undefined)
            this.DocsInfo = {}
            //this.DocsInfo ??= {}

        return this.DocsInfo
    }
    
    public SetDescription(str: string) {
        this.getDocsInfo().Description = str
        return this
    }
}


class AlternativeNameable extends AlternativeDocsTest implements ITagBaseNameableEntry  {
    public NameUID!: string

    constructor(nameUID: string | ITagBaseNameableEntry) {
        super();
        if (typeof(nameUID) == "string")
            this.NameUID = nameUID
        else {
            Object.assign(this, nameUID)
        }
    }
}

class AlternativeGroupEntry extends AlternativeNameable {}

console.log(
    new AlternativeDocsTest()
        .SetDescription("Hello")
)


let test = AlternativeGroupEntry.fromJSON2({
    NameUID: "test"
})

console.log(test)


let testObj = {
    toJSON: function(key?: number) {
        console.log(key)
        return {
            a: "A"
        }
    }
}

function mapToObj(map: Map<string, any>) {
    let obj: any = {}
    for (let [k,v] of map) {
        obj[k] = v
    }
    return obj
}

let mapTest = new Map<string, any>()
mapTest.set("test", testObj)
console.log(
    JSON.stringify(mapToObj(mapTest))
)


