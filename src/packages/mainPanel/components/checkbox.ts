import MainPanel from "..";
import { Component, ComponentBlock } from "../../types/mainPanel";
import { Checkbox } from "../../types/mdast";

export default <ComponentBlock>{
    type: "checkbox",
    generator(ast: Checkbox) {
        let dom = document.createElement("input")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.contentEditable = "false"
        dom.classList.add("checkbox")
        dom.type = "checkbox"
        dom.checked = ast.checkout
        return dom
    },
    complier(el: HTMLInputElement) {
        let checkout = el.checked
        return <Checkbox>{ type: this.type, checkout }
    },
    backspace() { },
}