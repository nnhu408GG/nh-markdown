import type { Module } from "../types"
import * as global from "../global"
export default <Module>{
    enterEvent_Unlimited(this) {
        let mat = matchHTMLElement(this.cursorInfo.moduleELement)
        if (mat) {
            this.event.preventDefault()
            this.abort()

            let p = document.createElement("p")

            let range = new Range()
            range.setStart(this.cursorInfo.sel.anchorNode!, this.cursorInfo.sel.anchorOffset)
            range.setEnd(this.cursorInfo.moduleELement.lastChild!, this.cursorInfo.moduleELement.lastChild!.textContent!.length)

            if (range.collapsed) {
                let br = document.createElement("br")
                p.append(br)
            } else {
                let fragment = range.extractContents()
                p.append(fragment)
            }
            global.insertAfter(p, this.cursorInfo.moduleELement)
            global.setCursorPosition(p)
        }
    },
    enterEvent_Begin(this) {
        let mat = matchHTMLElement(this.cursorInfo.moduleELement)
        if (mat) {
            this.event.preventDefault()
            this.abort()
            let pbr = global.createElementBR()
            global.insertBefore(pbr, this.cursorInfo.moduleELement)
        }
    },
    // delEvent_Begin(this) {
    //     let mat = matchHTMLElement(this.cursorInfo.moduleELement)
    //     if (mat) {
    //         this.event.preventDefault()
    //         this.abort()
    //         if (this.cursorInfo.previousElement) {
    //             let isEmpty = global.isEmptyElementWithBR(this.cursorInfo.previousElement)
    //             if (isEmpty) {
    //                 this.cursorInfo.previousElement.remove()
    //             }
    //         }
    //     }
    // },
    inputEvent_Paragraph(this) {
        let mat = matchText(this.cursorInfo.firstChildContent)
        if (mat) {
            let dom = document.createElement("a")
            dom.className = "url"
            dom.innerText = this.cursorInfo.firstChildContent
            dom.href = this.cursorInfo.firstChildContent
            dom.target = "_blank"
            this.cursorInfo.moduleELement.replaceWith(dom)
            global.setCursorPosition(dom, -1)
            this.abort()
        }
    },
}

function matchText(data: string) {
    return /^(http|https):\/\/\S+$/g.test(data)
}
function matchHTMLElement(el: HTMLElement) {
    return el.tagName === "A" && el.className === "url"
}