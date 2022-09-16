import MainPanel from "..";
import thematicBreak from "../../mdast/components/thematicBreak";
import { ComponentBlock } from "../../types/mainPanel";
import { ThematicBreak } from "../../types/mdast";

export default <ComponentBlock>{
    type: thematicBreak.type,
    generator(ast: ThematicBreak): HTMLElement {
        let dom = document.createElement("div")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.setAttribute(MainPanel.SIGN, ast.sign)
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, "")
        dom.contentEditable = "false"
        let hr = document.createElement("hr")
        dom.append(hr)
        return dom
    },
    complier(el: HTMLHRElement) {
        let sign = el.getAttribute(MainPanel.SIGN)
        return <ThematicBreak>{ type: this.type, sign }
    },
    backspace(el) {
        
    },
}

// generator(ast: ThematicBreak): HTMLHRElement {
// let dom = document.createElement("hr")
// dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
// dom.setAttribute(MainPanel.SIGN, ast.sign)
// dom.contentEditable = "false"