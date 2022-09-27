import MainPanel from "..";
import blockquote from "../../mdast/components/blockquote";
import { ComponentBlock } from "../../types/mainPanel";
import { Blockquote } from "../../types/mdast";
import { complier } from "../compiler";
import { generatorFlowContent } from "../generator";

export default <ComponentBlock>{
    type: blockquote.type,
    generator(ast: Blockquote) {
        return {
            type: "blockquote",
            prop: { [MainPanel.COMPONENT_TYPE]: ast.type },
            children: generatorFlowContent(ast.children)
        }
    },
    complier(el) {
        let children = complier(el)
        return <Blockquote>{ type: this.type, children }
    },
    backspace(el) { },
    enter(state, event, el) {

    },
}