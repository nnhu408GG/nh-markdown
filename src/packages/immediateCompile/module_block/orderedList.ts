import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"
export default <Module>{
    mdtype: "ordered-list",

    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^(\d+)\.\s/g.exec(data)
        if (mat) {
            let ol = global.createElement("ol", this.mdtype) as HTMLOListElement
            ol.start = Number(mat[1])
            let li = document.createElement("li")
            ol.append(li)
            let p = global.createElement("p", paragraph.mdtype)
            li.append(p)
            let _e = el.cloneNode(true)
            console.log(_e, mat[1].length + 2);

            let range = new Range()
            range.setStart(el.firstChild!, mat[1].length + 2)
            range.setEndAfter(el.lastChild!)
            let fragment = range.extractContents()
            if (!el.isEqualNode(_e)) {
                p.append(fragment)
            }
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

                    let ol = global.createElement("ol", this.mdtype) as HTMLOListElement
                    ol.start = parentElement_ol.children.length + parentElement_ol.start
                    ol.append(fragement)
                    global.insertAfter(el, ol)
                    global.setCursorPosition(el)
                }
                return true
            }

            let li = document.createElement("li")
            let p = global.createElement("p", paragraph.mdtype)
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
            let p = global.createElement("p", paragraph.mdtype)
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