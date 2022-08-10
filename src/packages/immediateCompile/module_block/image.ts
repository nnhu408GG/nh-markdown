import type { Module } from "../types"
import * as global from "../global"

// todo 支持图片的嵌入
// todo 支持行内特征
export default <Module>{
    mdtype: "image",
    focusEvent(el, from) {
        global.classNameAddFocus(el)
        let label = el.firstElementChild!
        let data = label.firstChild?.textContent!
        let mat = /^!\[(.+)\]\((.+)\)$/g.exec(data)!
        let range = new Range()
        range.setStart(label.firstChild!, 2)
        range.setEnd(label.firstChild!, mat[1].length + 2)
        document.getSelection()?.removeAllRanges()
        document.getSelection()?.addRange(range)
    },

    changeFocus_AtParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^!\[(.+)\]\((.+)\)$/g.exec(data)
        if (mat && el.childNodes.length === 1) {
            let labelName = mat[1]
            let url = mat[2]

            // <div class="image">
            let imgContainer = document.createElement("div")
            imgContainer.setAttribute(global.state.MODULE_ATTRIBUTE_SIGN, this.mdtype)
            imgContainer.classList.add("image")
            imgContainer.classList.add("focus")

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
            // img.src = url
            // img.src = "./src/assets/4d15253eaad892bbb9dd5e13779ad271d97fc786.jpg"
            img.src = "./src/assets/WechatIMG3181.jpeg"

            img.alt = labelName
            img.title = labelName
            container.append(img)
            imgContainer.append(container)
            el.replaceWith(imgContainer)
            global.classNameAddFocus(imgContainer)
            this.focusEvent(imgContainer)
            return true
        }
        return false
    },

    // inputEvent_Unlimited(el) {
    //     let p = global.getChildNodeMatchCursor(el)!
    //     let data = el.firstChild?.textContent!
    //     let mat = /^!\[(.+)\]\((.+)\)$/g.test(data)
    //     if (!mat) {
    //         let sel = document.getSelection()!
    //         let anchorOffset = sel.anchorOffset
    //         el.replaceWith(p)
    //         let range = new Range()
    //         range.setStart(p.firstChild!, anchorOffset)
    //         sel.removeAllRanges()
    //         sel.addRange(range)
    //     }
    // },

    // enterEvent_Begin(el, event) {
    //     event.preventDefault()
    //     let p = document.createElement("p")
    //     global.insertBefore(el, p)
    // },
    // enterEvent_After(el, event) {
    //     event.preventDefault()
    //     let sel = document.getSelection()!
    //     let range = new Range()
    //     range.setStart(sel.anchorNode!, sel.anchorOffset)
    //     let lastChild = sel.focusNode!.parentElement!.lastChild!
    //     range.setEnd(lastChild, lastChild.textContent!.length!)
    //     if (range.collapsed) {
    //         let p = document.createElement("p")
    //         global.insertAfter(el, p)
    //         global.setCursorPosition(p)
    //     } else {
    //         let fragment = range.extractContents()
    //         let _after = document.createElement("p")
    //         _after.append(fragment)

    //         global.insertAfter(el, _after)

    //         let _before = document.createElement("p")
    //         _before.append(el.firstElementChild?.firstChild!)
    //         el.replaceWith(_before)
    //         global.setCursorPosition(_after)
    //     }
    // },
}