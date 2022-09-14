import MainPanel from "."
import _processInline from "../mdast/processInline"
import { FlowContent, PhrasingContent } from "../types/mdast"

export function complier(el: HTMLElement | Element) {
    let res = <FlowContent[]>[]
    for (let i = 0; i < el.children.length; i++) {
        let dom = el.children[i]
        let mdtype = dom.getAttribute(MainPanel.BLOCK_ATTRIBUTE)
        let mod = MainPanel.COMPONENTS_FLOWCONTENT.find(item => item.type === mdtype)
        mod?.complier && res.push(mod.complier(dom))
    }
    return res
}

export function complierInline(el: Element): PhrasingContent[] {
    let str = ""
    el.childNodes.forEach(item => {
        if (item instanceof HTMLElement && item.tagName === "BR") {
            str += "\n"
        } else {
            str += item.textContent
        }
    })

    return _processInline(str)
}