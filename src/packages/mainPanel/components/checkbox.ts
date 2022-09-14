import { Component } from "../../types/mainPanel";
import { Checkbox } from "../../types/mdast";

export default <Component>{
    type: "checkbox",
    generator(ast: Checkbox) {
        let dom = document.createElement("input")
        dom.contentEditable = "false"
        dom.classList.add("checkbox")
        dom.type = "checkbox"
        dom.checked = ast.checkout
        return dom
    },
}