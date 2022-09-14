import hl from "highlight.js"

import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import { Code } from "../../types/mdast";

export default <Component>{
    type: "code",
    generator(ast: Code) {
        let dom = document.createElement("pre")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        dom.contentEditable = "false"

        let container = document.createElement("div")
        container.classList.add("prism-editor__container")
        dom.append(container)

        let code = document.createElement("code")
        container.append(code)
        code.innerHTML = hl.highlight(ast.value, { language: "js" }).value + "<br>"

        let textarea = document.createElement("textarea")
        textarea.spellcheck = false
        textarea.value = ast.value
        container.append(textarea)

        let lang = document.createElement("div")
        lang.className = "language"
        let input = document.createElement("span")
        input.contentEditable = "true"
        lang.append(input)
        input.innerText = ast.lang
        dom.append(lang)
        return dom
    },
    complier(el) {
        let lang = el.lastElementChild.textContent
        let value = el.firstElementChild.textContent
        return <Code>{ type: this.type, lang, value }
    },
}