import type { Module } from "../types"
import * as global from "../global"
import paragraph from "./paragraph"

interface Plugin {
    createBasics(heads: string[]): HTMLElement
    enterEventAtLastParagraph(el: HTMLElement, event: KeyboardEvent): boolean
}

export default <Module & Plugin>{
    mdtype: "table",

    createBasics(heads) {
        let figure = document.createElement("figure")
        figure.setAttribute(global.SIGN.MODULE_ATTRIBUTE, this.mdtype)

        figure.contentEditable = "false"

        let tableTool = document.createElement("div")
        tableTool.classList.add("toolContainer")
        figure.append(tableTool)

        let toolSpanA = document.createElement("span")
        let toolSpanB = document.createElement("span")
        let toolSpanC = document.createElement("span")
        tableTool.append(toolSpanA)
        tableTool.append(toolSpanB)
        tableTool.append(toolSpanC)
        let toolButton1 = document.createElement("button")
        let toolButton2 = document.createElement("button")
        let toolButton3 = document.createElement("button")
        let toolButton4 = document.createElement("button")
        let toolButton5 = document.createElement("button")
        toolSpanA.append(toolButton1)
        toolSpanB.append(toolButton2)
        toolSpanB.append(toolButton3)
        toolSpanB.append(toolButton4)
        toolSpanC.append(toolButton5)
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

        let TRhead = document.createElement("tr")
        let TRbody = document.createElement("tr")
        thead.append(TRhead)
        tbody.append(TRbody)

        for (let i = 0; i < heads.length; i++) {
            let th_head = document.createElement("th")
            let th_body = document.createElement("th")
            th_head.setAttribute(global.SIGN.INLINECONTAINER_ATTRIBUTE, "")
            th_body.setAttribute(global.SIGN.INLINECONTAINER_ATTRIBUTE, "")
            TRhead.append(th_head)
            TRbody.append(th_body)
            th_head.innerText = heads[i].trim()
        }

        return figure
    },

    // todo paragraph 末尾回车才触发
    // todo 图片的嵌入
    // changeFocusAtParagraph(el) {
    enterEventAtLastParagraph(el, event) {
        let data = el.firstChild?.textContent
        if (!data) return
        let mat = /^(?:(\|(?:(?!\|).)+))+?\|$/g.test(data)
        if (mat) {
            event.preventDefault()
            let datalist = data.split("|")
            datalist.shift()
            datalist.pop()

            let figure = this.createBasics(datalist)

            el.replaceWith(figure)
            global.classNameAddFocus(figure)
            let positionTH = figure.lastElementChild?.lastElementChild?.firstElementChild?.firstElementChild!
            global.setCursorPosition(positionTH)
            return true
        }
        return false
    },

    keydownEventUnlimited(el, event) {
        let table = el.lastElementChild!
        let thead = table.firstElementChild!
        let tbody = table.lastElementChild!
        let col = thead.firstElementChild?.childElementCount!
        let focusElement = global.getChildNodeMatchCursor(table)!

        /* command + Enter 新增行 */
        if (event.code === "Enter") {
            if (global.state.ACTIVE_META) {
                let tr = document.createElement("tr")
                for (let i = 0; i < col; i++) {
                    let th = document.createElement("th")
                    th.setAttribute(global.SIGN.INLINECONTAINER_ATTRIBUTE, "")
                    tr.append(th)
                }
                if (focusElement === table.firstElementChild) {
                    global.insertBefore(tbody.firstElementChild!, tr)
                } else if (focusElement === table.lastElementChild) {
                    let focusElement_tbody_row = global.getChildNodeMatchCursor(tbody)!
                    global.insertAfter(focusElement_tbody_row, tr)
                }
                global.setCursorPosition(tr.firstElementChild!)
            } else {
                event.preventDefault()
                // todo 光标移位
                if (el.nextElementSibling) {
                    global.setCursorPosition(el.nextElementSibling)
                } else {
                    let p = paragraph.createBasics()
                    global.insertAfter(el, p)
                    global.setCursorPosition(p)
                }
            }
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

    getSource(el) {
        let table = el.lastElementChild!
        let thead = table.firstElementChild!
        let tbody = table.lastElementChild!

        let length = thead.firstElementChild!.children.length

        let sourceTheadList = <string[]>[]
        for (let i = 0; i < length; i++) {
            sourceTheadList.push(thead.firstElementChild!.children[i].textContent || "")
        }

        let sourceTbodyList = <string[][]>[]
        for (let i = 0; i < tbody.children.length; i++) {
            let subSource = <string[]>[]
            let itemTR = tbody.children[i]
            for (let j = 0; j < length; j++) {
                subSource.push(itemTR.children[j].textContent || "")
            }
            sourceTbodyList.push(subSource)
        }

        let tempMergeList = [sourceTheadList, ...sourceTbodyList]

        let mapMaxColLeng = new Array(length).fill(0).reduce((res, _, index) => {
            res[index] = 0
            return res
        }, {})

        tempMergeList.forEach(itemTR => {
            itemTR.forEach((itemTH, index) => {
                let lenTH = itemTH.length
                if (lenTH > mapMaxColLeng[index]) {
                    mapMaxColLeng[index] = lenTH
                }
            })
        })

        // console.log("mapMaxColLeng:", mapMaxColLeng);



        for (let i = 0; i < length; i++) {
            let item = sourceTheadList[i]
            let supplement = (mapMaxColLeng[i] - item.length)
            let beforeSpan = Math.floor(supplement / 2)
            let afterSpan = supplement - beforeSpan
            sourceTheadList[i] = ` ${" ".repeat(beforeSpan)}${item}${" ".repeat(afterSpan)} `
        }

        let formatline = <string[]>[]
        for (let i = 0; i < length; i++) {
            formatline.push(` ${"-".repeat(mapMaxColLeng[i])} `)
        }



        for (let i = 0; i < sourceTbodyList.length; i++) {
            for (let j = 0; j < length; j++) {
                // let item = sourceTbodyList[i][j]
                // let supplement = (mapMaxColLeng[j] - item.length)
                // let beforeSpan = Math.floor(supplement / 2)
                // let afterSpan = supplement - beforeSpan
                // sourceTbodyList[i][j] = " ".repeat(beforeSpan) + item + " ".repeat(afterSpan)
                let item = sourceTbodyList[i][j]
                sourceTbodyList[i][j] = ` ${item}${" ".repeat(mapMaxColLeng[j] - item.length)} `
            }
        }


        let source = [sourceTheadList, formatline, ...sourceTbodyList].reduce((res, row) => {
            let str = row.join("|")
            // console.log("STR:", str);
            res.push(`|${str}|`)
            return res
        }, [])

        return source.join("\n")
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