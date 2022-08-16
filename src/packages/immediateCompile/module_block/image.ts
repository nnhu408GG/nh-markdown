import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

// todo 支持图片的嵌入
// todo 支持行内特征
export default <Module>{
    mdtype: "image",
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

    changeFocus_AtParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^!\[(.*)\]\((.+)\)$/g.exec(data)
        console.log("mat:", mat);

        if (mat && el.childNodes.length === 1) {
            let labelName = mat[1]
            let url = mat[2]

            // <div class="image">
            let imgContainer = document.createElement("div")
            imgContainer.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
            imgContainer.classList.add("image")

            // <p class="label">
            let label = document.createElement("p")
            label.innerText = data
            label.className = "label"
            imgContainer.append(label)

            // <div class="container"><img src=""></div>
            let container = document.createElement("div")
            container.classList.add("container")
            container.contentEditable = "false"

            let img = document.createElement("img")
            img.src = url
            // img.src = "./src/assets/4d15253eaad892bbb9dd5e13779ad271d97fc786.jpg"
            // img.src = "./src/assets/99267638_p0.png"

            img.alt = labelName
            img.title = labelName
            container.append(img)
            imgContainer.append(container)
            el.replaceWith(imgContainer)
            return true
        }
        return false
    },

    enterEvent_Begin(el, event) {
        event.preventDefault()
        let p = global.createElement("p", paragraph.mdtype)
        global.insertBefore(el, p)
        global.setCursorPosition(p)
    },

    enterEvent_After(el, event) {
        event.preventDefault()
        let label = el.firstElementChild as HTMLElement
        let fragment = global.getFragementRangeToEnd(label)
        if (fragment) {
            let beforeParagraph = global.createElement("p", paragraph.mdtype)
            beforeParagraph.append(label.firstChild!)
            let afterParagraph = global.createElement("p", paragraph.mdtype)
            afterParagraph.append(fragment)
            global.insertBefore(el, beforeParagraph)
            global.insertAfter(el, afterParagraph)
            el.remove()
            global.setCursorPosition(afterParagraph)
        } else {
            let p = global.createElement("p", paragraph.mdtype)
            global.insertAfter(el, p)
            global.setCursorPosition(p)
        }
    },

    inputEvent_Unlimited(el) {
        let label = el.firstElementChild
        let data = el.firstChild?.textContent!
        let mat = /^!\[(.*)\]\((.+)\)$/g.test(data)
        if (!(mat && label?.childNodes.length !== 1 && el.children.length === 2 && label?.childNodes.length === 1)) {
            let sel = document.getSelection()!
            let anchorOffset = sel.anchorOffset

            let p = global.createElement("p", paragraph.mdtype)
            p.append(label?.firstChild!)
            el.replaceWith(p)

            let range = new Range()
            range.setStart(p.firstChild!, anchorOffset)
            document.getSelection()?.removeAllRanges()
            document.getSelection()?.addRange(range)
        }
    },

    keydownEvent_Unlimited(el, event) {
        if (event.code === "ArrowUp") {
            if (global.createTempParagraph(el, "ArrowUp")) event.preventDefault()
        }
        else if (event.code === "ArrowDown") {
            if (global.createTempParagraph(el, "ArrowDown")) event.preventDefault()
        }
    },
}