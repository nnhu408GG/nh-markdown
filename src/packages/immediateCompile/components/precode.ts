import type { Module } from "../types"
import * as global from "../global"

interface Plugin {
    createBasics(fragment: DocumentFragment, language: string): HTMLPreElement
}

export default <Module & Plugin>{
    mdtype: "precode",

    createBasics(fragment, language) {
        let pre = document.createElement("pre")
        pre.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        let code = document.createElement("code")
        pre.append(code)
        code.append(fragment)

        let lang = document.createElement("div")
        lang.contentEditable = "false"
        lang.className = "language"
        let input = document.createElement("span")
        input.contentEditable = "true"
        lang.append(input)
        input.innerText = language
        pre.append(lang)
        return pre
    },

    focusEvent(el) {
        global.classNameAddFocus(el)
        let language = el.lastElementChild!
        let language_node = language.firstElementChild?.firstChild
        let range = new Range()
        range.selectNode(language_node!)
        document.getSelection()?.removeAllRanges()
        document.getSelection()?.addRange(range)
    },

    changeAtParagraph(el) {
        let mat = /^```(.*)$/g.exec(el.firstChild?.textContent!)!
        if (mat && el.childNodes.length === 1) {
            let fragment = document.createDocumentFragment()
            let p = document.createElement("p")
            fragment.append(p)
            let language = mat[1].trim()

            let pre = this.createBasics(fragment, language)

            el.replaceWith(pre)
            global.setCursorPosition(p)
            global.classNameAddFocus(pre)
            return true
        }
        return false
    },

    keydownEventUnlimited(el, event) {
        let focusPreElement = global.getChildNodeMatchCursor(el) as HTMLElement
        if (event.code === "ArrowUp"
            && focusPreElement === el.firstElementChild
            && global.getChildNodeMatchCursor(focusPreElement) === focusPreElement.firstElementChild
        ) {
            console.log("precode.keydownEventUnlimited.ArrowUp");
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

    getSource(el) {
        let source = `\`\`\`${el.lastElementChild?.textContent}\n`

        let children = el.firstElementChild?.children!
        for (let i = 0; i < children.length; i++) {
            let item = children[i]
            source += `${item.textContent}\n`
        }

        source += "```"

        return source
    },
}