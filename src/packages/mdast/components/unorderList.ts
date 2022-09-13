import type { UnorderList, ModuleBlock, FlowContent, Checkbox } from "../../types/mdast"
import paragraph from "./paragraph"
export default <ModuleBlock>{
    type: "unorderList",
    regexp: /^(\+|-)\s(.*)$/,
    build(state): UnorderList {
        let index = state.index
        let list = state.list
        let sign = state.mat[1]

        let tempChildren = <string[][]>[]
        while (index < list.length) {
            if (list[index] === "") break
            let { type, mat } = state.parser.getModuleType(list[index])
            if (type === this.type && mat[1] === sign) {
                tempChildren.push([mat[2]])
            } else if (type === paragraph.type && list[index].startsWith("  ")) {
                tempChildren[tempChildren.length - 1].push(list[index].slice(2))
            } else {
                break
            }
            index++
        }

        let children = tempChildren.reduce((res, item) => {
            // todo判断checkbox
            let sub = <FlowContent[]>[]
            if (item[0].startsWith("[x] ")) {
                item[0] = item[0].slice(4)
                sub.push(<Checkbox>{ type: "checkbox", checkout: true })
            }

            else if (item[0].startsWith("[ ] ")) {
                item[0] = item[0].slice(4)
                sub.push(<Checkbox>{ type: "checkbox", checkout: false })
            }

            sub.push(...state.parser.process(item))
            res.push(sub)
            return res
        }, <FlowContent[][]>[])

        state.index = index - 1
        return {
            type: this.type,
            sign,
            children
        }
    },
}
