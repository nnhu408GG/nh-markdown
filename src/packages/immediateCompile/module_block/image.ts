import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"


interface Plugin {
    createBasics(label: string, url: string): HTMLDivElement
}

export default <Module & Plugin>{
    mdtype: "image",

    createBasics(label, url) {
        // <div mdtype="image">
        let dom = document.createElement("div")
        dom.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        dom.classList.add("image")

        // <p class="label">
        let labeldom = document.createElement("p")
        labeldom.innerText = `![${label}](${url})`
        labeldom.className = "label"
        dom.append(labeldom)

        // <div class="container"><img src=""></div>
        let container = document.createElement("div")
        container.classList.add("container")
        container.contentEditable = "false"

        let img = document.createElement("img")
        // img.src = url
        // img.src = "./src/assets/4d15253eaad892bbb9dd5e13779ad271d97fc786.jpg"
        img.src = "./src/assets/99267638_p0.png"
        img.alt = label
        img.title = label
        container.append(img)

        dom.append(container)
        return dom
    },

    focusEvent(el, from) {
        global.classNameAddFocus(el)
        let label = el.firstElementChild!
        let data = label.firstChild?.textContent!
        let mat = /^!\[(.*)\]\((.+)\)$/g.exec(data)!

        let range = new Range()
        range.setStart(label.firstChild!, 2)
        range.setEnd(label.firstChild!, mat[1].length + 2)
        document.getSelection()?.removeAllRanges()
        document.getSelection()?.addRange(range)
    },

    changeFocusAtParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^!\[(.*)\]\((.+)\)$/g.exec(data)
        if (mat && el.childNodes.length === 1) {
            let imgContainer = this.createBasics(mat[1], mat[2])
            el.replaceWith(imgContainer)
            return true
        }
        return false
    },

    enterEventBegin(el, event) {
        event.preventDefault()
        let p = paragraph.createBasics()
        global.insertBefore(el, p)
        global.setCursorPosition(p)
    },

    enterEventAfter(el, event) {
        event.preventDefault()
        let label = el.firstElementChild as HTMLElement
        let fragment = global.getFragementRangeToEnd(label)
        if (fragment) {
            let beforeParagraph = paragraph.createBasics(label.firstChild!)
            let afterParagraph = paragraph.createBasics(fragment)
            global.insertBefore(el, beforeParagraph)
            global.insertAfter(el, afterParagraph)
            el.remove()
            global.setCursorPosition(afterParagraph)
        } else {
            let p = paragraph.createBasics()
            global.insertAfter(el, p)
            global.setCursorPosition(p)
        }
    },

    inputEventUnlimited(el) {
        let label = el.firstElementChild
        let data = el.firstChild?.textContent!
        let mat = /^!\[(.*)\]\((.+)\)$/g.test(data)
        if (!(mat && label?.childNodes.length !== 1 && el.children.length === 2 && label?.childNodes.length === 1)) {
            let sel = document.getSelection()!
            let anchorOffset = sel.anchorOffset

            let p = paragraph.createBasics(label?.firstChild!)
            el.replaceWith(p)

            let range = new Range()
            range.setStart(p.firstChild!, anchorOffset)
            document.getSelection()?.removeAllRanges()
            document.getSelection()?.addRange(range)
        }
    },

    keydownEventUnlimited(el, event) {
        if (event.code === "ArrowUp") {
            if (global.createTempParagraph(el, "ArrowUp")) event.preventDefault()
        }
        else if (event.code === "ArrowDown") {
            if (global.createTempParagraph(el, "ArrowDown")) event.preventDefault()
        }
    },

    getSource(el) {
        let source = el.firstElementChild?.textContent!
        return source
    },
}