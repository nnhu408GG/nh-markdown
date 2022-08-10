import type { Module } from "../types"
import * as global from "../global"
export default <Module>{
    mdtype: "precode",

    focusEvent(el) {
        global.classNameAddFocus(el)
        let language = el.lastElementChild!
        let language_node = language.firstElementChild?.firstChild
        let range = new Range()
        range.selectNode(language_node!)
        document.getSelection()?.removeAllRanges()
        document.getSelection()?.addRange(range)
    },

    changeFocus_AtParagraph(el) {
        let mat = /^```(.*)$/g.exec(el.firstChild?.textContent!)!
        if (mat && el.childNodes.length === 1) {
            let pre = document.createElement("pre")
            pre.setAttribute(global.state.MODULE_ATTRIBUTE_SIGN, this.mdtype)
            let code = document.createElement("code")
            pre.append(code)
            let p = document.createElement("p")
            code.append(p)

            let lang = document.createElement("div")
            lang.contentEditable = "false"
            lang.className = "language"
            let input = document.createElement("span")
            input.contentEditable = "true"
            lang.append(input)
            input.innerText = mat[1].trim()
            pre.append(lang)

            el.replaceWith(pre)
            global.setCursorPosition(p)
            global.classNameAddFocus(pre)
            return true
        }
        return false
    },

    keydownEvent_Unlimited(el, event) {
        let focusPreElement = global.getChildNodeMatchCursor(el) as HTMLElement

        if (event.code === "ArrowUp"
            && focusPreElement === el.firstElementChild
            && global.getChildNodeMatchCursor(focusPreElement) === focusPreElement.firstElementChild
        ) {
            if (global.createTempParagraph(el, "ArrowUp")) event.preventDefault()
        }

        else if (event.code === "ArrowDown") {
            if (focusPreElement === el.firstElementChild
                && global.getChildNodeMatchCursor(focusPreElement) === focusPreElement.lastElementChild
            ) {
                event.preventDefault()
                this.focusEvent(el)
            }
            else if (focusPreElement === el.lastElementChild) {
                if (global.createTempParagraph(el, "ArrowDown")) event.preventDefault()
            }
        }
    },
}