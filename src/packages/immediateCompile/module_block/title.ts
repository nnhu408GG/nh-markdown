import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(rank: number, fragment?: DocumentFragment): HTMLHeadElement
}

export default <Module & Plugin>{
    mdtype: "head",

    createBasics(rank, fragment) {
        let dom = document.createElement(`h${rank}`) as HTMLHeadElement
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        dom.setAttribute(global.SIGN.INLINECONTAINER_ATTRIBUTE, "")
        fragment && dom.append(fragment)
        return dom
    },

    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^(#{1,6})\s(.*)/g.exec(data)
        if (mat) {
            let rank = mat[1].length

            let fragment = global.getFragementRangeToEnd(el)
            let h = this.createBasics(rank, fragment)
            el.replaceWith(h)
            global.setCursorPosition(h)
            return true
        }
        return false
    },

    enterEvent_Begin(el, event) {
        event.preventDefault()
        let p = paragraph.createBasics()
        global.insertBefore(el, p)
    },

    enterEvent_After(el, event) {
        event.preventDefault()
        let _el = el.cloneNode(true)

        let sel = document.getSelection()!
        let range = new Range()
        range.setStart(sel.anchorNode!, sel.anchorOffset)
        range.setEndAfter(el.lastChild!)
        let fragement = range.extractContents()

        let p = paragraph.createBasics()
        if (!el.isEqualNode(_el)) {
            p.append(fragement)
        }
        global.insertAfter(el, p)
        global.setCursorPosition(p)
    },

    deleteEvent_Begin(el, event) {
        event.preventDefault()
        console.log("title delete begin");

        let fragment = global.getFragementRangeToEnd(el)
        let p = paragraph.createBasics(fragment)
        el.replaceWith(p)
        global.setCursorPosition(p)
    },

    /* inline module support */
    // inputEvent_Unlimited(el, event) {
    //     strong.upgradeInKeyup()
    //     // if (global.state.ACTIVE_META
    //     //     && [""].includes(event.code)) {
    //     // }
    // },
}