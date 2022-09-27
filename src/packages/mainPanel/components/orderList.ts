import MainPanel from "..";
import { generatorPhrasingContentVnode, render } from "../../render";
import { ComponentBlock } from "../../types/mainPanel";
import { FlowContent, OrderList } from "../../types/mdast";
import { VNode } from "../../types/render";
import { complier } from "../compiler";
import { generatorFlowContent } from "../generator";

export default <ComponentBlock>{
    type: "orderList",
    generator(ast: OrderList) {
        return {
            type: "ol",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                start: ast.start
            },
            children: ast.children.map(item => <VNode>{ type: "li", children: generatorFlowContent(item) })
        }
    },
    complier(el: HTMLOListElement) {
        let start = el.start
        let children = <FlowContent[][]>[]
        for (let i = 0; i < el.children.length; i++) {
            let li = el.children[i]
            children.push(complier(li))
        }
        return <OrderList>{ type: this.type, start, children }
    },
    backspace(el) {

    },
    enter(state, event, el) {

    },
}