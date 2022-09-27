import hl from "highlight.js"

import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import { Code } from "../../types/mdast";
import { VNode } from "../../types/render";

export default <ComponentBlock>{
    type: "code",
    generator(ast: Code) {

        const CODE = <VNode>{
            type: "code",
            innerHTML: hl.highlight(ast.value, { language: ast.lang }).value + "<br>"
        }

        const TEXTAREA = <VNode>{
            type: "textarea",
            prop: { spellcheck: false, value: ast.value },
            on: {
                oninput() {
                    CODE.dom.innerHTML = hl.highlight(
                        (TEXTAREA.dom as HTMLTextAreaElement).value,
                        { language: ast.lang }
                    ).value + "<br>"
                },
            },
        }

        const CONTAINER = <VNode>{
            type: "div",
            prop: { class: "prism-editor__container" },
            children: [CODE, TEXTAREA]
        }


        const LANGUAGE = <VNode>{
            type: "div",
            prop: { class: "language" },
            children: [
                { type: "span", prop: { contenteditable: true }, children: ast.lang }
            ]
        }

        return {
            type: "pre",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.BLOCK_ATTRIBUTE]: "",
                contenteditable: false
            },
            children: [CONTAINER, LANGUAGE]
        }
    },
    complier(el) {
        let lang = el.lastElementChild.textContent
        let value = el.firstElementChild.textContent
        return <Code>{ type: this.type, lang, value }
    },
    backspace(el) {

    },
    enter(state, event, el) {

    },
}