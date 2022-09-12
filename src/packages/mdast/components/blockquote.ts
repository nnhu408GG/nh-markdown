import type { Blockquote, ModuleBlock, ParserState } from "../types"
import paragraph from "./paragraph"
export default <ModuleBlock>{
    type: "blockquote",
    regexp: /^(>\s?)(.*)/,
    build(state: ParserState): Blockquote {
        let index = state.index
        let list = state.list

        let tempBlockquoteList = <string[]>[]

        while (index < list.length) {
            if (list[index] == "") break
            let { type, mat } = state.parser.getModuleType(list[index])
            if (type === this.type) {
                tempBlockquoteList.push(mat[2])
            } else if (type === paragraph.type) {
                tempBlockquoteList.push(list[index])
            }
            index++
        }
        state.index = index - 1
        let children = state.parser.process(tempBlockquoteList)
        return { type: this.type, children }
    },
}