import MainPanel from "."
import _break from "../mdast/components/break"
import _delete from "../mdast/components/delete"
import emphasis from "../mdast/components/emphasis"
import inlineCode from "../mdast/components/inlineCode"
import link from "../mdast/components/link"
import strong from "../mdast/components/strong"
import text from "../mdast/components/text"
import { Delete, Emphasis, FlowContent, InlineCode, Link, PhrasingContent, Strong, Text } from "../types/mdast"

export function generatorFlowContent(el: HTMLElement, ast: FlowContent[]) {
    ast.forEach(item => {
        let dom = MainPanel.COMPONENTS_FLOWCONTENT.find(comp => comp.type === item.type)?.generator(item)
        if (dom) {
            el.append(dom)
        }
    })
}

export function generatorPhrasingContent(el: HTMLElement, ast: PhrasingContent[]) {
    ast.forEach(item => {
        let dom
        switch (item.type) {
            case text.type:
                dom = document.createTextNode((item as Text).value)
                break;
            case _break.type:
                dom = document.createElement("br")
                break;
            case inlineCode.type:
                dom = document.createElement("code")
                generatorPhrasingContent(dom, (item as InlineCode).value)
                break;
            // case _delete.type:
            //     dom = document.createElement("del")
            //     generatorPhrasingContent(dom, (item as Delete).value)
            //     break;
            // case strong.type:
            //     dom = document.createElement("strong")
            //     dom.setAttribute(MainPanel.INLINE_FOCUS, (item as Strong).sign)
            //     generatorPhrasingContent(dom, (item as Strong).value)
            //     break;
            // case emphasis.type:
            //     dom = document.createElement("em")
            //     dom.setAttribute(MainPanel.INLINE_FOCUS, (item as Emphasis).sign)
            //     generatorPhrasingContent(dom, (item as Emphasis).value)
            //     break;
            // case link.type:
            //     dom = document.createElement("a");
            //     dom.innerText = (item as Link).label;
            //     (dom as HTMLLinkElement).href = (item as Link).url;
            //     (dom as HTMLLinkElement)
            default:
                break;
        }

        dom && el.append(dom)
    })
}