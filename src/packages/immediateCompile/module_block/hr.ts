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
        // console.log(event.code);
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
            if (event.code === "ArrowLeft") {
                let range = new Range()
                range.setStart(el, 0)
                document.getSelection()?.removeAllRanges()
                document.getSelection()?.addRange(range)
            } else if (event.code === "ArrowRight") {
                let range = new Range()
                range.setStart(el, 1)
                document.getSelection()?.removeAllRanges()
                document.getSelection()?.addRange(range)
            }
        } else if (["Backspace", "Enter"].includes(event.code)) {
            event.preventDefault()
            let p = global.createElement("p", paragraph.mdtype)
            el.replaceWith(p)
            global.setCursorPosition(p)
        } else {
            event.preventDefault()
        }
    },
}
