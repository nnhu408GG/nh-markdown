import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import { FlowContent, UnorderList } from "../../types/mdast";
import { VNode } from "../../types/render";
import { complier } from "../compiler";
import { generatorFlowContent } from "../generator";

export default <ComponentBlock>{
    type: "unorderList",
    generator(ast: UnorderList) {
        return {
            type: "ul",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.SIGN]: ast.sign
            },
            children: ast.children.map(item => <VNode>{ type: "li", children: generatorFlowContent(item) })
        }
    },

    complier(el: HTMLUListElement) {
        let sign = el.getAttribute(MainPanel.SIGN)
        let children = <FlowContent[][]>[]
        for (let i = 0; i < el.children.length; i++) {
            let li = el.children[i]
            children.push(complier(li))
        }
        return <UnorderList>{ type: this.type, sign, children }
    },

    backspace(el) { },

    enter() { }
}