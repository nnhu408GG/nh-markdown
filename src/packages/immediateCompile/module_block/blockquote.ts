import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(fragment?: DocumentFragment | Node): HTMLQuoteElement
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
        let mat = /^>\s.*$/g.test(data)
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
    enterEvent_Begin(el, event) {
        console.log('success use this');
        // todo 需解决br生成
        if (el.childNodes.length === 0) {
            let p = paragraph.createBasics()
            let parentElement_blockquote = el.parentElement!
            if (parentElement_blockquote.children.length === 1) {
                global.insertBefore(parentElement_blockquote, p)
                parentElement_blockquote.remove()
                global.setCursorPosition(p)
            } else {
                if (el === parentElement_blockquote.firstElementChild) {
                    global.insertBefore(parentElement_blockquote, p)
                } else if (el === parentElement_blockquote.lastElementChild) {
                    global.insertAfter(parentElement_blockquote, p)
                } else {
                    let range = new Range()
                    range.setStartBefore(el.nextElementSibling!)
                    range.setEndAfter(parentElement_blockquote.lastElementChild!)
                    let fragement = range.extractContents()
                    let tempBlockquote = this.createBasics(fragement)
                    global.insertAfter(parentElement_blockquote, tempBlockquote)
                    global.insertAfter(parentElement_blockquote, p)
                }
                el.remove()
                global.setCursorPosition(p)
            }
            return true
        }
    },

    deleteEvent_Begin(el, event) {
        let parentElement_blockquote = el.parentElement!
        if (el === parentElement_blockquote.firstElementChild) {
            event.preventDefault()
            global.insertBefore(parentElement_blockquote, el)
            if (parentElement_blockquote.children.length === 0) {
                parentElement_blockquote.remove()
            }
            global.setCursorPosition(el)
            return true
        }
    },
}