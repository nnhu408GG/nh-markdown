import MainPanel from "..";
import thematicBreak from "../../mdast/components/thematicBreak";
import { ComponentBlock } from "../../types/mainPanel";
import { ThematicBreak } from "../../types/mdast";

export default <ComponentBlock>{
    type: thematicBreak.type,
    generator(ast: ThematicBreak) {
        return {
            type: "div",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.SIGN]: ast.sign,
                [MainPanel.BLOCK_ATTRIBUTE]: "",
                contenteditable: false,
            },
            children: [{ type: "hr" }]
        }
    },
    complier(el: HTMLHRElement) {
        let sign = el.getAttribute(MainPanel.SIGN)
        return <ThematicBreak>{ type: this.type, sign }
    },
    backspace(el) {

    },
    enter() { }
}

// generator(ast: ThematicBreak): HTMLHRElement {
// let dom = document.createElement("hr")
// dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
// dom.setAttribute(MainPanel.SIGN, ast.sign)
// dom.contentEditable = "false"