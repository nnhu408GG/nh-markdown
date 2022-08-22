import type { Module } from "../types"
import * as global from "../global"
import * as globalInline from "../module_inline"
import blockquote from "./blockquote"
import unorderedList from "./unorderedList"
import orderedList from "./orderedList"
import precode from "./precode"
import hr from "./hr"
import image from "./image"
import table from "./table"

// import module_PreCode from "./precode"
// import module_Image from "./image"

interface Plugin {
    createBasics(fragment?: DocumentFragment | Node | string): HTMLParagraphElement
    createByStruct(children: string): HTMLDivElement
}

export default <Module & Plugin>{
    mdtype: "paragraph",

    createBasics(fragment) {
        let dom = document.createElement("p")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        dom.setAttribute(global.SIGN.INLINECONTAINER_ATTRIBUTE, "")
        if (typeof fragment === "string") {
            fragment = fragment.replaceAll(/\s/g, "\u00A0")
        }
        fragment && dom.append(fragment)
        return dom
    },

    createByStruct(data) {
        let fragment = document.createTextNode(data)
        return this.createBasics(fragment)
    },

    enterEventBegin(el, event) {
        event.preventDefault()

        if (el.childNodes.length === 1 && el.firstElementChild?.tagName === "BR") {
            el.firstElementChild.remove()
        }

        /* 兼容blockquote的嵌套 */
        if (el.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === blockquote.mdtype
            && blockquote.enterEventBegin(el, event)
        ) return


        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype
            && unorderedList.enterEventBegin(el, event)
        ) return

        /* todo 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === orderedList.mdtype
            && orderedList.enterEventBegin(el, event)
        ) return

        let p = this.createBasics()
        global.insertBefore(el, p)
    },

    enterEventAfter(el, event) {
        event.preventDefault()

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype
            && unorderedList.enterEventAfter(el, event)
        ) return

        /* 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === orderedList.mdtype
            && orderedList.enterEventAfter(el, event)
        ) return

        let p = this.createBasics()
        let fragment = global.getFragementRangeToEnd(el)
        if (fragment) {
            p.append(fragment)
        } else {
            // 在末尾的回车处理
            if (table.enterEventAtLastParagraph(el, event)) return
        }
        global.insertAfter(el, p)
        global.setCursorPosition(p)
    },

    deleteEventBegin(el, event) {
        /* 兼容blockquote的嵌套 */
        if (el.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === blockquote.mdtype
            && blockquote.deleteEventBegin(el, event)
        ) return

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype
            && unorderedList.deleteEventBegin(el, event)
        ) return

        /* 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === orderedList.mdtype
            && orderedList.deleteEventBegin(el, event)
        ) return

        let previousElementSibling = el.previousElementSibling as HTMLEmbedElement
        if (previousElementSibling) {
            let mdtype = global.getAttribute(previousElementSibling)
            if (mdtype === hr.mdtype) {
                event.preventDefault()
                previousElementSibling.remove()
            }
            else if (mdtype === image.mdtype) {
                event.preventDefault()
                if (el.childNodes.length === 0) {
                    el.remove()
                    image.focusEvent(previousElementSibling)
                } else {
                    let range = new Range()
                    range.selectNode(previousElementSibling.firstElementChild?.firstChild!)
                    let fragment = range.extractContents()
                    if (fragment) {
                        global.insertBefore(el.firstChild!, fragment)
                    }
                    el.normalize()
                    previousElementSibling.remove()
                }
            }
            else if (mdtype === precode.mdtype) {
                event.preventDefault()
                if (el.childNodes.length === 0) {
                    el.remove()
                }
                precode.focusEvent(previousElementSibling)
            }
            else if (mdtype === table.mdtype) {
                event.preventDefault()
                let table = previousElementSibling.lastElementChild!
                let tbody = table.lastElementChild
                let lastTbody_TR = tbody?.lastElementChild
                let targetTH = lastTbody_TR?.lastElementChild!

                let range = new Range()
                if (targetTH.childNodes.length === 0) {
                    range.setStart(targetTH, 0)
                } else {
                    range.setStartAfter(targetTH.lastChild!)
                }

                if (el.childNodes.length !== 0) {
                    let fragment = global.getFragementRangeToEnd(el)!
                    range.insertNode(fragment)
                    range.collapse(true)
                }

                document.getSelection()?.removeAllRanges()
                document.getSelection()?.addRange(range)
                targetTH.normalize()
                el.remove()
            }
        }
    },

    // belong inputEvent
    upgradeInParagraph(el) {
        globalInline.handleInline(el)

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype) {
            unorderedList.inputEventUnlimited(el)
            // return true // 这里不要结束匹配!!!!
        }
        return false
    },

    getSource(el) {
        let source = el.textContent!
        return source
    }
}