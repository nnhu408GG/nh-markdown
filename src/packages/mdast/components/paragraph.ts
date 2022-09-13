import _processInline from "../processInline"
import type { Paragraph, FlowContent } from "../../types/mdast"
// import _break from "./break"
export default {
    type: "paragraph",
    build(list: (FlowContent | string)[]) {
        let index = 0
        while (index < list.length) {

            if (list[index] === "") {

                let _index = index + 1
                let emptyParagraphCount = 1
                while (list[_index] === "") {
                    emptyParagraphCount++
                    _index++
                }

                let addCount = 0
                if (index === 0 && list.length === 1) {
                    addCount = 1
                } else if (index === 0 || _index === list.length) {
                    addCount = Math.floor(emptyParagraphCount / 2)
                } else {
                    addCount = Math.floor((emptyParagraphCount - 1) / 2)
                }

                list.splice(index, _index - index)

                for (let i = 0; i < addCount; i++) {
                    list.splice(index, 0, { type: this.type })
                }

                index += addCount
                continue
            }

            else if (typeof list[index] === "string") {
                let _index = index
                let tempStr = <string[]>[]
                while (typeof list[_index] === "string" && list[_index] !== "") {
                    tempStr.push(list[_index] as string)
                    _index++
                }
                let children = _processInline(tempStr.join("\n"))
                list.splice(index, _index - index, <Paragraph>{ type: this.type, children })
            }

            index++
        }
    },
}