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

    enterEvent_Begin(el, event) {
        let parentElement_li = el.parentElement!
        if (el === parentElement_li.firstElementChild) {
            // 三类分割
            if (el.childNodes.length === 0
                && parentElement_li.children.length === 1
            ) {
                let parentElement_ol = parentElement_li.parentElement! as HTMLOListElement
                if (parentElement_li === parentElement_ol.firstElementChild) {
                    global.insertBefore(parentElement_ol, el);
                    if (parentElement_ol.children.length === 1) {
                        parentElement_ol.remove()
                    } else {
                        parentElement_li.remove()
                    }
                    global.setCursorPosition(el)
                } else if (parentElement_li === parentElement_ol.lastElementChild) {
                    global.insertAfter(parentElement_ol, el)
                    if (parentElement_ol.children.length === 1) {
                        parentElement_ol.remove()
                    } else {
                        parentElement_li.remove()
                    }
                    global.setCursorPosition(el)
                } else {
                    let range = new Range()
                    range.setStartBefore(parentElement_li.nextElementSibling!)
                    range.setEndAfter(parentElement_ol.lastElementChild!)
                    let fragement = range.extractContents()
                    global.insertAfter(parentElement_ol, el)
                    parentElement_li.remove()


                    let ol = document.createElement("ol")
                    ol.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
                    ol.start = parentElement_ol.children.length + parentElement_ol.start
                    ol.append(fragement)
                    global.insertAfter(el, ol)
                    global.setCursorPosition(el)
                }
                return true
            }

            let li = document.createElement("li")
            let p = paragraph.createBasics()
            li.append(p)
            global.insertBefore(parentElement_li, li)
            return true
        }
        return false
    },

    enterEvent_After(el, event) {
        let parentElement_li = el.parentElement!
        if (parentElement_li.children.length === 1) {
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

    deleteEvent_Begin(el, event) {
        let parentElement_li = el.parentElement!
        let parentElement_ol = parentElement_li.parentElement!
        if (el === parentElement_li.firstElementChild) {
            event.preventDefault()
            let posElement = parentElement_li.firstElementChild!
            let range = new Range()
            range.setStartBefore(parentElement_li.firstElementChild!)
            range.setEndAfter(parentElement_li.lastElementChild!)
            let fragement = range.extractContents()
            if (parentElement_li === parentElement_ol.firstElementChild) {
                global.insertBefore(parentElement_ol, fragement)
                if (parentElement_ol.children.length === 1) {
                    parentElement_ol.remove()
                } else {
                    parentElement_li.remove()
                }
            } else {
                parentElement_li.previousElementSibling!.append(fragement)
                parentElement_li.remove()
            }
            global.setCursorPosition(posElement)
            return true
        }
        return false
    },
}