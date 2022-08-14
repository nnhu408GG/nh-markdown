import type { Module } from "../types"
import * as global from "../global"

export default <Module>{
    mdtype: "table",
    // todo 支持行内特征
    // todo 上下键的处理
    // todo 图片的嵌入
    changeFocus_AtParagraph(el) {
        let data = el.firstChild?.textContent
        if (!data) return
        let mat = /^(?:(\|(?:(?!\|).)+))+?\|$/g.test(data)
        if (mat) {
            let datalist = data.split("|")
            datalist.shift()
            datalist.pop()

            let figure = global.createElement("figure", this.mdtype)
            figure.contentEditable = "false"

            let tableTool = document.createElement("div")
            tableTool.classList.add("toolContainer")
            figure.append(tableTool)

            let toolSpan_A = document.createElement("span")
            let toolSpan_B = document.createElement("span")
            let toolSpan_C = document.createElement("span")
            tableTool.append(toolSpan_A)
            tableTool.append(toolSpan_B)
            tableTool.append(toolSpan_C)
            let toolButton1 = document.createElement("button")
            let toolButton2 = document.createElement("button")
            let toolButton3 = document.createElement("button")
            let toolButton4 = document.createElement("button")
            let toolButton5 = document.createElement("button")
            toolSpan_A.append(toolButton1)
            toolSpan_B.append(toolButton2)
            toolSpan_B.append(toolButton3)
            toolSpan_B.append(toolButton4)
            toolSpan_C.append(toolButton5)
            toolButton1.ariaLabel = "调整表格"
            toolButton2.ariaLabel = "左对齐"
            toolButton3.ariaLabel = "居中对齐"
            toolButton4.ariaLabel = "右对齐"
            toolButton5.ariaLabel = "删除表格"

            toolButton1.innerText = "调整表格"
            toolButton2.innerText = "左对齐"
            toolButton3.innerText = "居中对齐"
            toolButton4.innerText = "右对齐"
            toolButton5.innerText = "删除表格"

            let table = document.createElement("table")
            figure.append(table)
            let thead = document.createElement("thead")
            let tbody = document.createElement("tbody")
            thead.contentEditable = "true"
            tbody.contentEditable = "true"
            table.append(thead)
            table.append(tbody)

            let TR_head = document.createElement("tr")
            let TR_body = document.createElement("tr")
            thead.append(TR_head)
            tbody.append(TR_body)

            for (let i = 0; i < datalist.length; i++) {
                let th_head = document.createElement("th")
                let th_body = document.createElement("th")
                TR_head.append(th_head)
                TR_body.append(th_body)
                th_head.innerText = datalist[i].trim()
            }
            el.replaceWith(figure)
            global.classNameAddFocus(figure)
            global.setCursorPosition(TR_body.firstElementChild!)
            return true
        }
        return false
    },

    keydownEvent_Unlimited(el, event) {
        let table = el.lastElementChild!
        let thead = table.firstElementChild!
        let tbody = table.lastElementChild!
        let col = thead.firstElementChild?.childElementCount!
        let focusElement = global.getChildNodeMatchCursor(table)!

        /* command + Enter 新增行 */
        if (global.state.ACTIVE_META && event.code === "Enter") {
            let tr = document.createElement("tr")
            for (let i = 0; i < col; i++) {
                let th = document.createElement("th")
                tr.append(th)
            }
            if (focusElement === table.firstElementChild) {
                global.insertBefore(tbody.firstElementChild!, tr)
            } else if (focusElement === table.lastElementChild) {
                let focusElement_tbody_row = global.getChildNodeMatchCursor(tbody)!
                global.insertAfter(focusElement_tbody_row, tr)
            }
            global.setCursorPosition(tr.firstElementChild!)
        }

        else if (event.code === "ArrowUp") {
            if (focusElement === table.firstElementChild) {
                event.preventDefault()
                if (!global.createTempParagraph(el, "ArrowUp")) {
                    global.setCursorPosition(el.previousElementSibling!)
                }
            } else if (focusElement === table.lastElementChild) {
                event.preventDefault()
                let row_dom = global.getChildNodeMatchCursor(tbody) as HTMLElement
                let col_dom = global.getChildNodeMatchCursor(row_dom) as HTMLElement
                let row = indexOfELement(row_dom)
                let col = indexOfELement(col_dom)
                console.log("row:", row, "   col:", col);
                if (row === 0) {
                    global.setCursorPosition(thead.firstElementChild!.children[col])
                } else {
                    global.setCursorPosition(tbody.children[row - 1].children[col])
                }
            }
        }

        else if (event.code === "ArrowDown") {
            if (focusElement === table.firstElementChild) {
                event.preventDefault()
                let col_dom = global.getChildNodeMatchCursor(thead.firstElementChild!) as HTMLElement
                let col = indexOfELement(col_dom)
                global.setCursorPosition(tbody.firstElementChild!.children[col])
            } else if (focusElement === table.lastElementChild) {
                let row_dom = global.getChildNodeMatchCursor(tbody) as HTMLElement
                if (row_dom === tbody.lastElementChild) {
                    event.preventDefault()
                    if (!global.createTempParagraph(el, "ArrowDown")) {
                        global.setCursorPosition(el.nextElementSibling!)
                    }
                } else {
                    event.preventDefault()
                    let row = indexOfELement(row_dom)
                    let col_dom = global.getChildNodeMatchCursor(row_dom) as HTMLElement
                    let col = indexOfELement(col_dom)
                    global.setCursorPosition(tbody.children[row + 1].children[col])
                }
            }
        }
    },
}


function indexOfELement(el: HTMLElement): number {
    let parentElement = el.parentElement!
    for (let i = 0; i < parentElement.children.length; i++) {
        if (parentElement.children[i] === el) {
            return i
        }
    }
    return -1
}