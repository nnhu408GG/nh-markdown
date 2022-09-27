import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import { Checkbox } from "../../types/mdast";

export default <ComponentBlock>{
    type: "checkbox",
    generator(ast: Checkbox) {
        return {
            type: "input",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                contenteditable: false,
                class: "checkbox",
                type: "checkbox",
                checked: ast.checkout,
            },
        }
    },
    complier(el: HTMLInputElement) {
        let checkout = el.checked
        return <Checkbox>{ type: this.type, checkout }
    },
    backspace() { },
    enter() { },
}