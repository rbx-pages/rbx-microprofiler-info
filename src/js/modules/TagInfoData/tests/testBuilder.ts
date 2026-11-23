import Utilities from "../../Utils/Utilities"
import { TagDataBuilder, TagDataClasses, TagDataProcessing } from "../exportStuff"

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel



const TEST_STRING = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy \
eirmod tempor invidunt ut labore et dolore magna aliquyam erat, \
sed diam voluptua. At vero eos et accusam et justo duo dolores et ea \
rebum. Stet clita kasd gubergren, no sea takimata sanctus \
est Lorem ipsum dolor sit amet.`



let GroupStrings = {
    LuaBridge: "LuaBridge",
    Systems: "Systems",
}


function build() {
    let builder = new TagDataBuilder()

    builder.AddTagGroup(
        new TagGroupEntry(GroupStrings.LuaBridge)
            .SetDescription([
                "This is LuaBridge!<br>",
                "Very cool!",
            ].join(""))
            .WithColor([182,105,0])
    )
    builder.AddTagGroup(
        new TagGroupEntry(GroupStrings.Systems)
            .SetDescription([
                "This is Systems<br>",
                "Hello!",
            ].join(""))
    )



    // Make random Tokens
    for (let i=1; i<=300; i++) {
        builder.AddTagToken(
            new TagTokenEntry(`test_${i}`)
                .SetDescription(TEST_STRING)
                .WithColor([
                    Utilities.randomIntFromInterval(0,130),
                    Utilities.randomIntFromInterval(0,130),
                    Utilities.randomIntFromInterval(0,130)
                ])
                .WithGroup([
                    "Systems", "LuaBridge"
                ][Utilities.randomIntFromInterval(0,1)])
        )
    }

    builder.AddTagToken(
        new TagTokenEntry(`specialToken`)
.SetDescription(`
Hello World!
Example description.

### Advice
Example text.

### Other advice
More example text.
`)
            .WithColor([
                Utilities.randomIntFromInterval(0,130),
                Utilities.randomIntFromInterval(0,130),
                Utilities.randomIntFromInterval(0,130)
            ])
            .WithGroup("Systems")
            .AddLabel("label_Test1")
            .AddLabel("label_Test2")
            .AddLabel("label_Test3")
            .InsertSearchTags(["TestTag", "TestTag2"])
    )
    builder.AddTagToken(
        new TagTokenEntry(`specialToken_Parallel`)
            .WithDisplayName(`Special Token`)
            .AsAliasOf("specialToken")
    )

    /*builder.AddGenericTagEntries(
        [
            new TagTokenEntry("test")
                .SetDescription("This is test")
                .WithColor([255,0,0]),
            new TagTokenEntry("test2")
                .SetDescription("This is test2")
                .WithColor([0,255,0]), 
            new TagTokenEntry("test3")
                .SetDescription("This is test3")
                .WithColor([0,0,255]), 
        ]
    )*/


    // Make random Labels
    for (let i=1; i<=15; i++) {
        builder.AddTagLabel(
            new TagLabel(`label_Test${i}`)
                .SetDescription(TEST_STRING)
                .WithColor([
                    Utilities.randomIntFromInterval(0,130),
                    Utilities.randomIntFromInterval(0,130),
                    Utilities.randomIntFromInterval(0,130)
                ])
        )
    }

    builder.Finalize()
    let test_dataJsonStr = builder.toJSON()

    return test_dataJsonStr
}

export default {
    build: build
}


