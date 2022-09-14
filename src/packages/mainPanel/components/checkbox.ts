import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import { Checkbox } from "../../types/mdast";

export default <Component>{
    type: "checkbox",
    generator(ast: Checkbox) {
        let dom = document.createElement("input")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
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
}