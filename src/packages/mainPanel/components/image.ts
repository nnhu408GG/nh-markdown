import MainPanel from "..";
import { render } from "../../render";
import { ComponentBlock } from "../../types/mainPanel";
import { Image } from "../../types/mdast";
import { VNode } from "../../types/render";

export default <ComponentBlock>{
    type: "image",
    generator(ast: Image) {
        const params = <VNode>{
            type: "div",
            prop: {
                class: "params"
            },
            children: [
                {
                    type: "div",
                    prop: { class: "container" },
                    children: [
                        { type: "div", prop: { class: "label" }, children: "label" },
                        { type: "div", prop: { class: "value", contenteditable: true, spellcheck: false }, children: ast.label },
                        { type: "div", prop: { class: "label" }, children: "url" },
                        { type: "div", prop: { class: "value", contenteditable: true, spellcheck: false }, children: ast.url },
                    ]
                }
            ]
        }

        return {
            type: "div",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.BLOCK_ATTRIBUTE]: "",
                contenteditable: false
            },
            children: [
                {
                    type: "img",
                    prop: {
                        src: ast.url,
                        alt: ast.label,
                        title: ast.label,
                    }
                },
                params
            ]
        }
    },
    complier(el) {
        let img = el.firstElementChild as HTMLImageElement
        let label = img.alt
        let url = img.src
        return <Image>{ type: this.type, label, url }
    },
    backspace(el) {

    },
    enter(state, event, el) {

    },
}