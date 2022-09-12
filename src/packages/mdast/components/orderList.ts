import type { OrderList, ModuleBlock, FlowContent } from "../types"
import paragraph from "./paragraph"
export default <ModuleBlock>{
    type: "orderList",
    regexp: /^((\d+)\.\s+)(.*)/,
    build(state): OrderList {
        let index = state.index
        let list = state.list

        let matSpan = state.mat[1].length
        let tempChildren = <string[][]>[]
        while (index < list.length) {
            if (list[index] === "") break
            let { type, mat } = state.parser.getModuleType(list[index])
            if (type === this.type) {
                matSpan = mat[1].length
                tempChildren.push([mat[3]])
            } else if (type === paragraph.type && list[index].startsWith(" ".repeat(matSpan))) {
                tempChildren[tempChildren.length - 1].push(list[index].slice(matSpan))
            } else {
                break
            }
            index++
        }

        state.index = index - 1

        let children = tempChildren.reduce((res, item) => {
            res.push(state.parser.process(item))
            return res
        }, <FlowContent[][]>[])


        return {
            type: this.type,
            start: parseInt(state.mat[2]),
            children
        }
    },
}