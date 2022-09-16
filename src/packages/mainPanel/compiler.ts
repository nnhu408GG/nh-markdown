import MainPanel from "."
import _processInline from "../mdast/processInline"
import { FlowContent, PhrasingContent } from "../types/mdast"


/** 将block文档树编译成生成ast */
export function complier(el: HTMLElement | Element) {
    let res = <FlowContent[]>[]
    for (let i = 0; i < el.children.length; i++) {
        let dom = el.children[i]
        let mdtype = dom.getAttribute(MainPanel.COMPONENT_TYPE)
        let mod = MainPanel.COMPONENTS_FLOWCONTENT.find(item => item.type === mdtype)
        mod?.complier && res.push(mod.complier(dom))
    }
    return res
}

/** 将inline文档树编译成生成ast */
export function complierInline(el: Element | DocumentFragment): PhrasingContent[] {
    el.querySelectorAll("br").forEach(br => br.replaceWith("\n"))
    return _processInline(el.textContent)
}