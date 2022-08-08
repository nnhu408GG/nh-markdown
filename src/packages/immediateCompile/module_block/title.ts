import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"
// import strong from "../module_inline/strong"
export default <Module>{
    mdtype: "head",
    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^(#{1,6})\s(.*)/g.exec(data)
        if (mat) {
            let tagNameRank = mat[1].length
            let h = global.createElement(`h${tagNameRank}` as keyof HTMLElementTagNameMap, this.mdtype)
            if (el.childNodes.length !== 1 || mat[2] !== "") {
                let range = new Range()
                range.setStart(el.firstChild!, tagNameRank + 1)
                range.setEndAfter(el.lastChild!)
                let fragement = range.extractContents()
                h.append(fragement)
            }
            el.replaceWith(h)
            global.setCursorPosition(h)
            return true
        }
        return false
    },

    enterEvent_Begin(el, event) {
        event.preventDefault()
        let p = global.createElement("p", paragraph.mdtype)
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

        let p = global.createElement("p", paragraph.mdtype)
        if (!el.isEqualNode(_el)) {
            p.append(fragement)
        }
        global.insertAfter(el, p)
        global.setCursorPosition(p)
    },

    deleteEvent_Begin(el, event) {
        event.preventDefault()
        let range = new Range()
        range.setStartBefore(el.firstChild!)
        range.setEndAfter(el.lastChild!)
        let fragement = range.cloneContents()
        let p = global.createElement("p", paragraph.mdtype)
        p.append(fragement)
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