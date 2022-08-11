import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"
export default <Module>{
    mdtype: "unordered-list",
    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^(-|\*|\+|\d+\.)\s/g.exec(data)
        if (mat) {
            let ul = global.createElement("ul", this.mdtype)
            let li = document.createElement("li")
            ul.append(li)
            let p = global.createElement("p", paragraph.mdtype)
            li.append(p)
            let fragment = global.getFragementRangeToEnd(el)
            if (fragment) {
                p.append(fragment)
            }
            el.replaceWith(ul)
            global.setCursorPosition(p)
            return true
        }
        return false
    },

    enterEvent_Begin(el, event) {
        let parentElement_li = el.parentElement!
        if (el === parentElement_li.firstElementChild || el.previousElementSibling?.classList.contains("checkbox")) {
            // 三类分割
            if (el.childNodes.length === 0
                && (parentElement_li.children.length === 1 || (el.previousElementSibling?.classList.contains("checkbox") && parentElement_li.children.length === 2))
            ) {
                let parentElement_ul = parentElement_li.parentElement!
                if (parentElement_li === parentElement_ul.firstElementChild) {
                    global.insertBefore(parentElement_ul, el);
                    if (parentElement_ul.children.length === 1) {
                        parentElement_ul.remove()
                    } else {
                        parentElement_li.remove()
                    }
                    global.setCursorPosition(el)
                } else if (parentElement_li === parentElement_ul.lastElementChild) {
                    global.insertAfter(parentElement_ul, el)
                    if (parentElement_ul.children.length === 1) {
                        parentElement_ul.remove()
                    } else {
                        parentElement_li.remove()
                    }
                    global.setCursorPosition(el)
                } else {
                    let range = new Range()
                    range.setStartBefore(parentElement_li.nextElementSibling!)
                    range.setEndAfter(parentElement_ul.lastElementChild!)
                    let fragement = range.extractContents()
                    let ul = global.createElement("ul", this.mdtype)
                    ul.append(fragement)
                    global.insertAfter(parentElement_ul, ul)
                    global.insertAfter(parentElement_ul, el)
                    parentElement_li.remove()
                    global.setCursorPosition(el)
                }
                return true
            }

            let li = document.createElement("li")
            if (parentElement_li.classList.contains("task")) {
                li.classList.add("task")
                let checkboxContainer = document.createElement("div")
                checkboxContainer.classList.add("checkbox")
                checkboxContainer.contentEditable = "false"
                li.append(checkboxContainer)
                let checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkboxContainer.append(checkbox)
            }
            let p = global.createElement("p", paragraph.mdtype)
            li.append(p)
            global.insertBefore(parentElement_li, li)
            return true
        }
        return false
    },

    enterEvent_After(el, event) {
        let parentElement_li = el.parentElement!
        /* 兼容task */
        if (parentElement_li.classList.contains("task")
            && parentElement_li.children.length === 2
        ) {
            event.preventDefault()

            let li = document.createElement("li")
            li.classList.add("task")

            let checkboxContainer = document.createElement("div")
            checkboxContainer.classList.add("checkbox")
            checkboxContainer.contentEditable = "false"
            li.append(checkboxContainer)

            let checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkboxContainer.append(checkbox)

            let p = global.createElement("p", paragraph.mdtype)
            li.append(p)

            global.insertAfter(parentElement_li, li)

            let fragement = global.getFragementRangeToEnd(el)
            if (fragement) {
                p.append(fragement)
            }
            global.setCursorPosition(p)
            return true
        }

        else if (parentElement_li.children.length === 1) {
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
        let parentElement_ul = parentElement_li.parentElement!

        /* task 降级处理 */
        if (el.previousElementSibling?.classList.contains("checkbox")) {
            event.preventDefault()
            parentElement_li.classList.remove("task")
            parentElement_li.firstElementChild?.remove()
            return true
        }

        else if (el === parentElement_li.firstElementChild) {
            event.preventDefault()
            let posElement = parentElement_li.firstElementChild!
            let range = new Range()
            range.setStartBefore(parentElement_li.firstElementChild!)
            range.setEndAfter(parentElement_li.lastElementChild!)
            let fragement = range.extractContents()
            if (parentElement_li === parentElement_ul.firstElementChild) {
                global.insertBefore(parentElement_ul, fragement)
                if (parentElement_ul.children.length === 1) {
                    parentElement_ul.remove()
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

    inputEvent_Unlimited(el) {
        // console.log("inputEvent_Unlimited");
        let parentElement_li = el.parentElement!
        if (!parentElement_li.classList.contains("task")) {
            let data = el.firstChild?.textContent!
            let mat = /^\[([x|\s])\]\s.*$/.exec(data)
            if (mat) {
                parentElement_li.classList.add("task")
                let checkboxContainer = document.createElement("div")
                checkboxContainer.classList.add("checkbox")
                checkboxContainer.contentEditable = "false"
                let taskCheck = document.createElement("input")
                taskCheck.type = "checkbox"
                checkboxContainer.append(taskCheck)
                if (mat[1] === "x") {
                    taskCheck.checked = true
                }
                global.insertBefore(el, checkboxContainer)
                let range = new Range()
                range.setStartBefore(el.firstChild!)
                range.setEnd(el.firstChild!, 4)
                range.deleteContents()
                global.setCursorPosition(el)
                return
            }
        }
    },
}
