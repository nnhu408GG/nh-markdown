import _processInline from "../processInline"
import type { Heading, ModuleBlock } from "../types"
export default <ModuleBlock>{
    type: "heading",
    regexp: /^(#{1,6})\s+(.*)/,
    build(state): Heading {
        return {
            type: this.type,
            depth: state.mat[1].length,
            children: _processInline(state.mat[2])
        }
    }
}