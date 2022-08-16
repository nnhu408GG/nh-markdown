import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(start: number, fragment: HTMLParagraphElement[]): HTMLOListElement
}

export default <Module & Plugin>{
    mdtype: "ordered-list",

    createBasics(start, fragment) {
        let ol = document.createElement("ol")
        ol.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        ol.start = start
        for (let i = 0; i < fragment!.length; i++) {
            let li = document.createElement("li")
            ol.append(li)
            li.append(fragment[i])
        }
        return ol
    },

    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^(\d+)\.\s/g.exec(data)
        if (mat) {
            let start = parseInt(mat[1])
            let fragment = global.getFragementRangeToEnd(el)
            let p = paragraph.createBasics(fragment)
            let ol = this.createBasics(start, [p])
            el.replaceWith(ol)
            global.setCursorPosition(p)
            return true
        }
        return false
    },

    enterEventBegin(el, event) {
        let parentElementLI = el.parentElement!
        if (el === parentElementLI.firstElementChild) {
            // 三类分割
            if (el.childNodes.length === 0
                && parentElementLI.children.length === 1
            ) {
                let parentElementOL = parentElementLI.parentElement! as HTMLOListElement
                if (parentElementLI === parentElementOL.firstElementChild) {
                    global.insertBefore(parentElementOL, el);
                    if (parentElementOL.children.length === 1) {
                        parentElementOL.remove()
                    } else {
                        parentElementLI.remove()
                    }
                    global.setCursorPosition(el)
                } else if (parentElementLI === parentElementOL.lastElementChild) {
                    global.insertAfter(parentElementOL, el)
                    if (parentElementOL.children.length === 1) {
                        parentElementOL.remove()
                    } else {
                        parentElementLI.remove()
                    }
                    global.setCursorPosition(el)
                } else {
                    let range = new Range()
                    range.setStartBefore(parentElementLI.nextElementSibling!)
                    range.setEndAfter(parentElementOL.lastElementChild!)
                    let fragement = range.extractContents()
                    global.insertAfter(parentElementOL, el)
                    parentElementLI.remove()


                    let ol = document.createElement("ol")
                    ol.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
                    ol.start = parentElementOL.children.length + parentElementOL.start
                    ol.append(fragement)
                    global.insertAfter(el, ol)
                    global.setCursorPosition(el)
                }
                return true
            }

            let li = document.createElement("li")
            let p = paragraph.createBasics()
            li.append(p)
            global.insertBefore(parentElementLI, li)
            return true
        }
        return false
    },

    enterEventAfter(el, event) {
        let parentElementLI = el.parentElement!
        if (parentElementLI.children.length === 1) {
            event.preventDefault()
            let li = document.createElement("li")
            let p = paragraph.createBasics()
            li.append(p)
            let fragment = global.getFragementRangeToEnd(el)
            if (fragment) {
                p.append(fragment)
            }
            global.insertAfter(el.parentElement!, li)
            global.setCursorPosition(p)
            return true
        }
        return false
    },

    deleteEventBegin(el, event) {
        let parentElementLI = el.parentElement!
        let parentElementOL = parentElementLI.parentElement!
        if (el === parentElementLI.firstElementChild) {
            event.preventDefault()
            let posElement = parentElementLI.firstElementChild!
            let range = new Range()
            range.setStartBefore(parentElementLI.firstElementChild!)
            range.setEndAfter(parentElementLI.lastElementChild!)
            let fragement = range.extractContents()
            if (parentElementLI === parentElementOL.firstElementChild) {
                global.insertBefore(parentElementOL, fragement)
                if (parentElementOL.children.length === 1) {
                    parentElementOL.remove()
                } else {
                    parentElementLI.remove()
                }
            } else {
                parentElementLI.previousElementSibling!.append(fragement)
                parentElementLI.remove()
            }
            global.setCursorPosition(posElement)
            return true
        }
        return false
    },
}