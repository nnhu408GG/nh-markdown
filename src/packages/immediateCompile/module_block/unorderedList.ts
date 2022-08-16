import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(fragment: HTMLParagraphElement[] | DocumentFragment): HTMLOListElement
}

export default <Module & Plugin>{
    mdtype: "unordered-list",

    createBasics(fragment) {
        let ul = document.createElement("ul")
        ul.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)
        if (fragment instanceof DocumentFragment) {
            ul.append(fragment)
        } else {
            for (let i = 0; i < fragment!.length; i++) {
                let li = document.createElement("li")
                ul.append(li)
                li.append(fragment[i])
            }
        }
        return ul
    },

    upgradeInParagraph(el) {
        let data = el.firstChild?.textContent!
        let mat = /^(-|\*|\+|\d+\.)\s/g.exec(data)
        if (mat) {
            let fragment = global.getFragementRangeToEnd(el)
            let p = paragraph.createBasics(fragment)
            let ul = this.createBasics([p])
            el.replaceWith(ul)
            global.setCursorPosition(p)
            return true
        }
        return false
    },

    enterEventBegin(el, event) {
        let parentElementLI = el.parentElement!
        if (el === parentElementLI.firstElementChild || el.previousElementSibling?.classList.contains("checkbox")) {
            // 三类分割
            if (el.childNodes.length === 0
                && (parentElementLI.children.length === 1 || (el.previousElementSibling?.classList.contains("checkbox") && parentElementLI.children.length === 2))
            ) {
                let parentElementUL = parentElementLI.parentElement!
                if (parentElementLI === parentElementUL.firstElementChild) {
                    global.insertBefore(parentElementUL, el);
                    if (parentElementUL.children.length === 1) {
                        parentElementUL.remove()
                    } else {
                        parentElementLI.remove()
                    }
                    global.setCursorPosition(el)
                } else if (parentElementLI === parentElementUL.lastElementChild) {
                    global.insertAfter(parentElementUL, el)
                    if (parentElementUL.children.length === 1) {
                        parentElementUL.remove()
                    } else {
                        parentElementLI.remove()
                    }
                    global.setCursorPosition(el)
                } else {
                    let range = new Range()
                    range.setStartBefore(parentElementLI.nextElementSibling!)
                    range.setEndAfter(parentElementUL.lastElementChild!)
                    let fragement = range.extractContents()
                    let ul = this.createBasics(fragement)
                    global.insertAfter(parentElementUL, ul)
                    global.insertAfter(parentElementUL, el)
                    parentElementLI.remove()
                    global.setCursorPosition(el)
                }
                return true
            }

            let li = document.createElement("li")
            if (parentElementLI.classList.contains("task")) {
                li.classList.add("task")
                let checkboxContainer = document.createElement("div")
                checkboxContainer.classList.add("checkbox")
                checkboxContainer.contentEditable = "false"
                li.append(checkboxContainer)
                let checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkboxContainer.append(checkbox)
            }
            let p = paragraph.createBasics()
            li.append(p)
            global.insertBefore(parentElementLI, li)
            return true
        }
        return false
    },

    enterEventAfter(el, event) {
        let parentElementLI = el.parentElement!
        /* 兼容task */
        if (parentElementLI.classList.contains("task")
            && parentElementLI.children.length === 2
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

            let p = paragraph.createBasics()
            li.append(p)

            global.insertAfter(parentElementLI, li)

            let fragement = global.getFragementRangeToEnd(el)
            if (fragement) {
                p.append(fragement)
            }
            global.setCursorPosition(p)
            return true
        }

        else if (parentElementLI.children.length === 1) {
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
        let parentElementUL = parentElementLI.parentElement!

        /* task 降级处理 */
        if (el.previousElementSibling?.classList.contains("checkbox")) {
            event.preventDefault()
            parentElementLI.classList.remove("task")
            parentElementLI.firstElementChild?.remove()
            return true
        }

        else if (el === parentElementLI.firstElementChild) {
            event.preventDefault()
            let posElement = parentElementLI.firstElementChild!
            let range = new Range()
            range.setStartBefore(parentElementLI.firstElementChild!)
            range.setEndAfter(parentElementLI.lastElementChild!)
            let fragement = range.extractContents()
            if (parentElementLI === parentElementUL.firstElementChild) {
                global.insertBefore(parentElementUL, fragement)
                if (parentElementUL.children.length === 1) {
                    parentElementUL.remove()
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

    inputEventUnlimited(el) {
        // console.log("inputEventUnlimited");
        let parentElementLI = el.parentElement!
        if (!parentElementLI.classList.contains("task")) {
            let data = el.firstChild?.textContent!
            let mat = /^\[([x|\s])\]\s.*$/.exec(data)
            if (mat) {
                parentElementLI.classList.add("task")
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
