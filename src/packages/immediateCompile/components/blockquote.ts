import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(fragment?: DocumentFragment | Node): HTMLQuoteElement
    // createByStruct(children:)
}

export default <Module & Plugin>{
    mdtype: "blockquote",

    createBasics(fragment) {
        let dom = document.createElement("blockquote")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        fragment && dom.append(fragment)
        return dom
    },

    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^>.*$/g.test(data)
        if (mat) {
            let _e = el.cloneNode(true)

            let sel = document.getSelection()!

            let range = new Range()
            range.setStart(sel.anchorNode!, sel.anchorOffset!)
            range.setEndAfter(el.lastChild!)
            let fragement = range.extractContents()

            let p = paragraph.createBasics()
            let blockquote = this.createBasics(p)

            if (!el.isEqualNode(_e)) {
                p.append(fragement)
            }

            blockquote.append(p)
            el.replaceWith(blockquote)
            global.setCursorPosition(p)
        }
        return false
    },
    /** 因无法直接触发，需要从外部引用 */
    enterEventBegin(el, event) {
        console.log('success use this');
        // todo 需解决br生成
        if (el.childNodes.length === 0) {
            let p = paragraph.createBasics()
            let parentElementBlockquote = el.parentElement!
            if (parentElementBlockquote.children.length === 1) {
                global.insertBefore(parentElementBlockquote, p)
                parentElementBlockquote.remove()
                global.setCursorPosition(p)
            } else {
                if (el === parentElementBlockquote.firstElementChild) {
                    global.insertBefore(parentElementBlockquote, p)
                } else if (el === parentElementBlockquote.lastElementChild) {
                    global.insertAfter(parentElementBlockquote, p)
                } else {
                    let range = new Range()
                    range.setStartBefore(el.nextElementSibling!)
                    range.setEndAfter(parentElementBlockquote.lastElementChild!)
                    let fragement = range.extractContents()
                    let tempBlockquote = this.createBasics(fragement)
                    global.insertAfter(parentElementBlockquote, tempBlockquote)
                    global.insertAfter(parentElementBlockquote, p)
                }
                el.remove()
                global.setCursorPosition(p)
            }
            return true
        }
    },

    deleteEventBegin(el, event) {
        let parentElementBlockquote = el.parentElement!
        if (el === parentElementBlockquote.firstElementChild) {
            event.preventDefault()
            global.insertBefore(parentElementBlockquote, el)
            if (parentElementBlockquote.children.length === 0) {
                parentElementBlockquote.remove()
            }
            global.setCursorPosition(el)
            return true
        }
    },

    getSource(el) {
        return global.prefixGetSource({
            fragment: el.children,
            blankLine: true,
            prefix: "> "
        })
    },
}