import type { ThematicBreak, ModuleBlock } from "../../types/mdast"
export default <ModuleBlock>{
    type: "thematicBreak",
    regexp: /^-{3,}$|^\*{3,}$/,
    build(state): ThematicBreak {
        return {
            type: this.type,
            sign: state.list[state.index],
        }
    }
}