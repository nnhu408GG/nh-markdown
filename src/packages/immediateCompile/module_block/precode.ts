import type { Module } from "../types"
import * as global from "../global"
export default <Module>{
    mdtype: "precode",

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
        // if(event.code === "")
    },

    // deleteEvent_Begin(el, event) {
    //     let codeContainer = global.getChildNodeMatchCursor(el)
    //     let codeline = global.getChildNodeMatchCursor(codeContainer)
    //     if (codeline === codeContainer.firstElementChild) {
    //         event.preventDefault()
    //         if (codeContainer.children.length === 1) {
    //             el.replaceWith(codeline)
    //             return
    //         }
    //     }
    // },

    // arrowEvent_Up(el) {
    //     let codeContainer = global.getChildNodeMatchCursor(el)
    //     let codeline = global.getChildNodeMatchCursor(codeContainer)
    //     if (codeline === codeContainer.firstElementChild) {
    //         if (!el.previousElementSibling
    //             || el.previousElementSibling.tagName === "PRE") {
    //             let p = document.createElement("p")
    //             global.insertBefore(el, p)
    //             global.setCursorPosition(p)
    //         }
    //     }
    // },
    // arrowEvent_Down(el) {
    //     let language = global.getChildNodeMatchCursor(el)
    //     if (language === el.lastElementChild) {
    //         if (!el.nextElementSibling
    //             || el.nextElementSibling.tagName === "PRE") {
    //             let p = document.createElement("p")
    //             global.insertAfter(el, p)
    //             global.setCursorPosition(p)
    //         } else if (el.nextElementSibling.className === "image") {
    //             // el.nextElementSibling.firstElementChild
    //         }
    //     }
    // },

}