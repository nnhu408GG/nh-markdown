import type { Module } from "../types"
import * as global from "../global"
import precode from "./precode"
import paragraph from "./paragraph"
export default <Module>{
    mdtype: "hr",
    // upgradeInParagraph(el) {

    focusEvent(el) {
        let sel = document.getSelection()!
        sel.removeAllRanges()
        el.focus()
        // global.classNameAddFocus(el)
    },

    changeFocus_AtParagraph(el) {
        if (el.childNodes.length === 1 && el.firstChild?.textContent === "---") {
            let container = document.createElement("div")
            container.setAttribute(global.state.MODULE_ATTRIBUTE_SIGN, this.mdtype)
            container.classList.add("hr")
            container.contentEditable = "false"
            let hr = document.createElement("hr")
            container.append(hr)
            el.replaceWith(container)
            return true
        }
        return false
    },

    arrowEvent_Up(el) { },

    arrowEvent_Down(el) {
        if (el.nextElementSibling?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === precode.mdtype) {
            console.log(111);
            ; (el.nextElementSibling as HTMLElement).focus()
        }
    },

    keydownEvent_Unlimited(el, event) {
        // console.log(event.code);
        if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
            event.preventDefault()
            let nextElement = el.previousElementSibling!
            if (nextElement) {
                global.setCursorPosition(nextElement)
            } else {
                let p = global.createElement("p", paragraph.mdtype)
                global.insertBefore(el, p)
                global.setCursorPosition(p)
            }
        } else if (event.code === "ArrowDown" || event.code === "ArrowRight") {
            event.preventDefault()
            let nextElement = el.nextElementSibling!
            if (nextElement) {
                global.setCursorPosition(nextElement)
            } else {
                let p = global.createElement("p", paragraph.mdtype)
                global.insertAfter(el, p)
                global.setCursorPosition(p)
            }
        } else if (event.code === "Backspace" || event.code === "Enter") {
            event.preventDefault()
            let p = global.createElement("p", paragraph.mdtype)
            el.replaceWith(p)
            global.setCursorPosition(p)
        }
    },
}
