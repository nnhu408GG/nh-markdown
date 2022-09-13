import type { Table, ModuleBlock, PhrasingContent } from "../../types/mdast"
import _processInline from "../processInline"
import paragraph from "./paragraph"
export default <ModuleBlock>{
    type: "table",
    regexp: /^\|.*\|$/,
    build(state): Table | void {
        let index = state.index
        let list = state.list
        let tempChildren = <PhrasingContent[][][]>[]

        let header = list[index].slice(1, -1).split("|").map(item => item.trim())
        let isTabel = false
        let align = []
        if (list[index + 1]) {
            let { type } = state.parser.getModuleType(list[index + 1])
            if (type === this.type) {
                let splitLine = list[index + 1].slice(1, -1).split("|").map(item => item.trim())
                if (splitLine.length === header.length) {
                    let isSplitLine = true
                    for (let i = 0; i < splitLine.length; i++) {
                        let item = splitLine[i]
                        if (/^-+$/.test(item) || /^:-+$/.test(item)) {
                            align.push("left")
                        } else if (/^:-+:$/.test(item)) {
                            align.push("center")
                        } else if (/^-+:$/.test(item)) {
                            align.push("right")
                        } else {
                            isSplitLine = false
                        }
                    }
                    if (isSplitLine) {
                        isTabel = true
                    }
                }
            }
        }

        if (!isTabel) {
            state.type = paragraph.type
            return
        }

        while (index < list.length) {
            if (list[index] === "") break
            let { type } = state.parser.getModuleType(list[index])
            if (type !== this.type) break
            let l = list[index].slice(1, -1).split("|").map(item => _processInline(item.trim()))
            tempChildren.push(l)
            index++
        }

        state.index = index - 1

        tempChildren.splice(1, 1) // 去除分割行

        return {
            type: this.type,
            align,
            children: tempChildren
        }
    },
}