import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"
import { FlowContent, ThematicBreak } from "../../types/mdast"

interface Plugin {
    createBasics(): HTMLHRElement
    /** 根据 AST 结构生成 dom 节点 */
    createByAST(ast: ThematicBreak): HTMLHRElement
}

export default <Module & Plugin>{
    mdtype: "thematicBreak",

    createBasics(sign: string) {
        let dom = document.createElement("hr")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        dom.setAttribute("sign", sign)
        dom.contentEditable = "false"
        return dom
    },

    createByAST(ast) {
        // ast.sign
        let dom = document.createElement("hr")
        dom.setAttribute("sign", "")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        return dom
    },

    changeAtParagraph(el) {
        if (el.childNodes.length === 1 && el.firstChild?.textContent === "---") {
            let dom = this.createBasics(el.firstChild.textContent)
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
