import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(): HTMLDivElement
}

export default <Module & Plugin>{
    mdtype: "hr",

    createBasics() {
        let dom = document.createElement("div")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        let hr = document.createElement("hr")
        dom.append(hr)
        return dom
    },

    changeFocusAtParagraph(el) {
        if (el.childNodes.length === 1 && el.firstChild?.textContent === "---") {
            let dom = this.createBasics()
            el.replaceWith(dom)
            return true
        }
        return false
    },

    keydownEventUnlimited(el, event) {
        if (event.code === "ArrowUp") {
            if (global.createTempParagraph(el, "ArrowUp")) event.preventDefault()
        }
        else if (event.code === "ArrowDown") {
            if (global.createTempParagraph(el, "ArrowDown")) event.preventDefault()
        }
        else if (event.code === "ArrowLeft") {
            let range = new Range()
            range.setStart(el, 0)
            document.getSelection()?.removeAllRanges()
            document.getSelection()?.addRange(range)
            if (global.createTempParagraph(el, "ArrowUp")) event.preventDefault()
        }
        else if (event.code === "ArrowRight") {
            let range = new Range()
            range.setStart(el, 1)
            document.getSelection()?.removeAllRanges()
            document.getSelection()?.addRange(range)
            if (global.createTempParagraph(el, "ArrowDown")) event.preventDefault()
        }
        else if (event.code === "Backspace" || event.code === "Enter") {
            event.preventDefault()
            let p = paragraph.createBasics()
            el.replaceWith(p)
            global.setCursorPosition(p)
        } else {
            event.preventDefault()
        }
    },

    getSource(el) {
        return "---"
    },
}
