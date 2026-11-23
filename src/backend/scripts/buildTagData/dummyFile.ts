import builderHelper from "./utils/builderHelper"
const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder


let builder = builderHelper.currentBuilder

builder.AddTagToken(
    new TagDataClasses.TagTokenEntry("test")
        .SetDescription("test")
        .WithColor([255,0,0])
)

console.log(
    builder.GetGenericTableForTag(
        new TagDataClasses.TagTokenEntry("test")
            .SetDescription("test")
            .WithColor([255,0,0])
    )
)

console.log(
    builder.AddGenericTagEntries(
        [
            new TagDataClasses.TagTokenEntry("test2")
                .SetDescription("test")
                .WithColor([255,0,0])
        ]
    )
)


console.log("JSON Output String:")

builder.Finalize()
console.log(
    builder.toJSON(),
)

console.log("JSON Output:")
console.log(
    JSON.parse(builder.toJSON())
)


console.log("OK")




class A {
	declare ["constructor"]: typeof A;

    public static readonly _typeSymbol = Symbol("A")
    public readonly TypeSymbol = A._typeSymbol
}
class B {
    public static readonly _typeSymbol = Symbol("B")
    public readonly TypeSymbol = B._typeSymbol
}
class C {
        public static readonly _typeSymbol = Symbol("C")
    public readonly TypeSymbol = C._typeSymbol
}


function ReturnHappiness(entry: A): typeof A._typeSymbol
function ReturnHappiness(entry: B): "B"
function ReturnHappiness(entry: C): "C"
function ReturnHappiness<T>(entry: T) {
    if (entry instanceof A)
        return A._typeSymbol
    else if (entry instanceof B)
        return "B"
    else if (entry instanceof C)
        return "C"
    else
        throw new Error("no")
}

let test = {
    [A._typeSymbol]: {
        A: "test"
    },
    ["B"]: {
        B: "test"
    },
    ["C"]: {
        C: "test"
    }
}


let newClassA = new A()
let classObjTest = newClassA.constructor


let result = test[ReturnHappiness(new A())]
console.log(result)