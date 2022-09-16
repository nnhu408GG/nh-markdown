import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import { FlowContent, UnorderList } from "../../types/mdast";
import { complier } from "../compiler";
import { generatorFlowContent } from "../generator";

export default <ComponentBlock>{
    type: "unorderList",
    generator(ast: UnorderList) {
        let dom = document.createElement("ul")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.setAttribute(MainPanel.SIGN, ast.sign)
        ast.children.forEach(item => {
            let li = document.createElement("li")
            generatorFlowContent(li, item)
            dom.append(li)
        })
        return dom
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
    backspace(el) {
        
    },
}