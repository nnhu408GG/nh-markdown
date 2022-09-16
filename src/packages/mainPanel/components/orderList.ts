import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import { FlowContent, OrderList } from "../../types/mdast";
import { complier } from "../compiler";
import { generatorFlowContent } from "../generator";

export default <ComponentBlock>{
    type: "orderList",
    generator(ast: OrderList) {
        let dom = document.createElement("ol")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.start = ast.start
        ast.children.forEach(item => {
            let li = document.createElement("li")
            generatorFlowContent(li, item)
            dom.append(li)
        })
        return dom
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
}