import MainPanel from "."
import _break from "../mdast/components/break"
import _delete from "../mdast/components/delete"
import emphasis from "../mdast/components/emphasis"
import inlineCode from "../mdast/components/inlineCode"
import link from "../mdast/components/link"
import strong from "../mdast/components/strong"
import text from "../mdast/components/text"
import { Delete, Emphasis, FlowContent, InlineCode, Link, PhrasingContent, Strong, Text } from "../types/mdast"

/** 将 FlowContent 类型的 ast 生成 dom，并嵌入到指定的 dom 中 */
export function generatorFlowContent(el: HTMLElement, ast: FlowContent[]) {
    ast.forEach(item => {
        let dom = MainPanel.COMPONENTS_FLOWCONTENT.find(comp => comp.type === item.type)?.generator(item)
        if (dom) {
            el.append(dom)
        }
    })
}

/** 将 PhrasingContent 类型的 ast 生成 dom，并嵌入到指定的 dom 中 */
export function generatorPhrasingContent(el: HTMLElement | DocumentFragment, ast: PhrasingContent[]) {
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
                dom = createInlineElement("`", (item as InlineCode).value)
                break;
            case _delete.type:
                dom = createInlineElement("~~", (item as Delete).value)
                break;
            case strong.type:
                dom = createInlineElement((item as Strong).sign, (item as Strong).value)
                break;
            case emphasis.type:
                dom = createInlineElement((item as Emphasis).sign, (item as Emphasis).value)
                break;
            case link.type:
                dom = createInlineELementLink((item as Link))
                break;
            default:
                break;
        }

        dom && el.append(dom)
    })
}

const MapPairInline = [
    { sign: "*", type: "emphasis", tagName: "em" },
    { sign: "_", type: "emphasis", tagName: "em" },
    { sign: "**", type: "strong", tagName: "strong" },
    { sign: "__", type: "strong", tagName: "strong" },
    { sign: "`", type: "inlineCode", tagName: "code" },
    { sign: "~~", type: "delete", tagName: "del" },
]

function createInlineElement(sign: string, value: PhrasingContent[]) {
    let target = MapPairInline.find(item => item.sign === sign)

    let dom = document.createElement("span")
    dom.setAttribute(MainPanel.COMPONENT_TYPE, target.type)
    dom.setAttribute(MainPanel.INLINE_ATTRIBUTE, "")

    let pairBefore = document.createElement("span")
    pairBefore.classList.add("meta")
    pairBefore.append(sign)

    let main = document.createElement(target.tagName)
    generatorPhrasingContent(main, value)

    dom.append(pairBefore)
    dom.append(main)

    let pairAfter = pairBefore.cloneNode(true)
    dom.append(pairAfter)

    return dom
}

function createInlineELementLink(ast: Link) {
    let dom = document.createElement("span")
    dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
    dom.setAttribute(MainPanel.INLINE_ATTRIBUTE, "")

    let pairA = document.createElement("span")
    pairA.classList.add("meta")
    pairA.append("[")
    dom.append(pairA)

    let main = document.createElement("a")
    main.href = ast.url
    main.append(ast.label)
    dom.append(main)

    let pairB = document.createElement("span")
    pairB.classList.add("meta")
    pairB.append("](")
    dom.append(pairB)

    let url = document.createElement("span")
    url.classList.add("meta")
    url.append(ast.url)
    dom.append(url)

    let pairC = document.createElement("span")
    pairC.classList.add("meta")
    pairC.append(")")
    dom.append(pairC)

    return dom
}