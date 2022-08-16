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
    createBasics(): HTMLParagraphElement
}

export default <Module & Plugin>{
    mdtype: "paragraph",
    createBasics(fragment?: DocumentFragment | Node): HTMLParagraphElement {
        let dom = document.createElement("p")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        dom.setAttribute(global.SIGN.INLINECONTAINER_ATTRIBUTE, "")
        fragment && dom.append(fragment)
        return dom
    },

    enterEvent_Begin(el, event) {
        event.preventDefault()

        if (el.childNodes.length === 1 && el.firstElementChild?.tagName === "BR") {
            el.firstElementChild.remove()
        }

        /* 兼容blockquote的嵌套 */
        if (el.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === blockquote.mdtype
            && blockquote.enterEvent_Begin(el, event)
        ) return


        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype
            && unorderedList.enterEvent_Begin(el, event)
        ) return

        /* todo 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === orderedList.mdtype
            && orderedList.enterEvent_Begin(el, event)
        ) return

        let p = global.createElement("p", this.mdtype)
        global.insertBefore(el, p)
    },

    enterEvent_After(el, event) {
        event.preventDefault()

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype
            && unorderedList.enterEvent_After(el, event)
        ) return

        /* 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === orderedList.mdtype
            && orderedList.enterEvent_After(el, event)
        ) return

        let p = global.createElement("p", this.mdtype)
        let fragment = global.getFragementRangeToEnd(el)
        if (fragment) {
            p.append(fragment)
        } else {
            // todo 在末尾的回车处理
            // todo 转移到focus切换时候触发！
            // if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === precode.mdtype) {
            //     precode.changeFocus_AtParagraph(el, event)
            //     return
            // }
        }
        global.insertAfter(el, p)
        global.setCursorPosition(p)
    },

    deleteEvent_Begin(el, event) {
        /* 兼容blockquote的嵌套 */
        if (el.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === blockquote.mdtype
            && blockquote.deleteEvent_Begin(el, event)
        ) return

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === unorderedList.mdtype
            && unorderedList.deleteEvent_Begin(el, event)
        ) return

        /* 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE) === orderedList.mdtype
            && orderedList.deleteEvent_Begin(el, event)
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
            unorderedList.inputEvent_Unlimited(el)
            // return true // 这里不要结束匹配!!!!
        }
        return false
    },
}