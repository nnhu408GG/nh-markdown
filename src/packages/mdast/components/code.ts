import type { Code, ModuleBlock } from "../../types/mdast"
export default <ModuleBlock>{
    type: "code",
    regexp: /^```(.*)/,
    build(state): Code {
        let index = state.index
        let list = state.list

        let tempCodeList = <string[]>[]
        while (index < list.length) {
            index++
            let { type } = state.parser.getModuleType(list[index])
            if (type === this.type) break
            tempCodeList.push(list[index])
        }
        state.index = index
        return {
            type: this.type,
            lang: state.mat[1],
            value: tempCodeList.join("\n")
        }
    },
}