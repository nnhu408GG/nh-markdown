import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"
export default <Module>{
    mdtype: "hr",

    changeFocus_AtParagraph(el) {
        if (el.childNodes.length === 1 && el.firstChild?.textContent === "---") {
            let container = document.createElement("div")
            container.setAttribute(global.state.MODULE_ATTRIBUTE_SIGN, this.mdtype)
            container.classList.add("hr")
            // container.contentEditable = "false"
            let hr = document.createElement("hr")
            container.append(hr)
            el.replaceWith(container)
            return true
        }
        return false
    },

    keydownEvent_Unlimited(el, event) {
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
            let p = global.createElement("p", paragraph.mdtype)
            el.replaceWith(p)
            global.setCursorPosition(p)
        } else {
            event.preventDefault()
        }
    },
}
