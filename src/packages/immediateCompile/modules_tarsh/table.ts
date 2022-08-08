/** todo:
 * 重新支持语法：
 * ^\s*|.+|.*|.*|...|\s*$
 * 
 * 追加工具栏：
 * - 行列选择（默认提供10x6）
 * - 行列数值添加
 * - 调整时候适当的保留原来的数据，做适当的数据丢失
 * - 置左
 * - 居中
 * - 置右
 * - 删除表格
 * 
 * 其他调整：
 * - 移除回车换行的行添加
 * - 回车事件改为全选对应下方的格子内容
 * - 末行回车事件为光标移置开头，若非p标签，则新增pbr
 * - 方向键的连续移动过程中生成的pbr要自动移除
 * - 追加tab键的光标右移，与回车类似全选格子内全部内容
 */


import type { Module } from "../types"
import * as global from "../global"

export default <Module>{
    // matchSource(data) { },
    // inputEvent_Paragraph(this) {
    //     let mat = matchText(this.cursorInfo.moduleELement.innerText)
    //     if (mat) {
    //         console.log("mat:", mat);
    //     }
    // },
    
    enterEvent_Begin(this) {
        if (this.cursorInfo.firstElementTagName === "TABLE") {
            this.abort()
            let moduleELement = this.cursorInfo.moduleELement
            let pos = getSubInfo(moduleELement)
            if (pos.type === "tbody" && pos.isLastCol) {
                this.event.preventDefault()
                let TR = document.createElement("tr")
                let len = pos.rowElement.children.length
                for (let i = 0; i < len; i++) {
                    let TD = global.createElementBR("td")
                    TR.append(TD)
                }
                global.insertAfter(TR, pos.rowElement)
                global.setCursorPosition(TR.firstChild as HTMLElement)
            }
        }
    },
    enterEvent_Unlimited(this) {
        let moduleELement = this.cursorInfo.moduleELement
        let matchTextLen = matchText(moduleELement.innerText)
        if (matchTextLen) {
            let firstElementPrevious = moduleELement.previousElementSibling as HTMLElement | null
            if (firstElementPrevious) {
                let content = firstElementPrevious.innerText
                content = content.replaceAll(" ", "")
                content = content.replace(/^\|?|\|?$/g, "")
                let HeaderList = content.split("|")
                if (HeaderList.length === matchTextLen) {
                    this.event.preventDefault()
                    this.abort()
                    let tableContainer = document.createElement("table")

                    let thead = document.createElement("thead")
                    let tbody = document.createElement("tbody")
                    tableContainer.append(thead)
                    tableContainer.append(tbody)

                    let thead_TR = document.createElement("tr")
                    let tableRow = document.createElement("tr")
                    thead.append(thead_TR)
                    tbody.append(tableRow)

                    for (let i = 0; i < HeaderList.length; i++) {
                        let thead_TH = document.createElement("th")
                        thead_TH.innerText = HeaderList[i]
                        thead_TR.append(thead_TH)
                        let subRow = global.createElementBR("td")
                        tableRow.append(subRow)
                    }
                    global.insertAfter(tableContainer, moduleELement)
                    moduleELement.remove()
                    firstElementPrevious.remove()
                }
            }
        }

        // TODO 将此添加至Meta&Enter
        if (this.cursorInfo.firstElementTagName === "TABLE") {
            this.abort()
            let moduleELement = this.cursorInfo.moduleELement
            let pos = getSubInfo(moduleELement)
            if (pos.type === "tbody" && pos.isLastCol) {
                this.event.preventDefault()
                let TR = document.createElement("tr")
                let len = pos.rowElement.children.length
                for (let i = 0; i < len; i++) {
                    let TD = global.createElementBR("td")
                    TR.append(TD)
                }
                global.insertAfter(TR, pos.rowElement)
                global.setCursorPosition(TR.firstChild as HTMLElement)
            }
        }
    },
    arrowEvent_Up(this) {
        if (this.cursorInfo.firstElementTagName === "TABLE") {
            this.event.preventDefault()
            this.abort()

            let moduleELement = this.cursorInfo.moduleELement
            let pos = getSubInfo(moduleELement)
            console.log(pos);


            let event = this.event as KeyboardEvent
            if (event.key === "ArrowUp") {
                if (pos.type === "thead") {
                    // 前面加空行
                    if (!moduleELement.previousElementSibling || moduleELement.previousElementSibling.tagName !== "P") {
                        let pbr = global.createElementBR()
                        global.insertBefore(pbr, moduleELement)
                        global.setCursorPosition(pbr)
                    } else {
                        global.setCursorPosition(moduleELement.previousElementSibling)
                    }
                } else {
                    // 光标移动
                    if (pos.row === 0) {
                        setSubPosition(moduleELement, {
                            type: "thead",
                            row: 0,
                            col: pos.col
                        })
                    } else {
                        setSubPosition(moduleELement, {
                            type: "tbody",
                            row: pos.row - 1,
                            col: pos.col
                        })
                    }
                }
            }

            else if (event.key === "ArrowDown") {
                if (pos.type === "thead") {
                    setSubPosition(moduleELement, {
                        type: "tbody",
                        row: 0,
                        col: pos.col
                    })
                } else {
                    // 判断是否为最后的一行
                    if (pos.isLastRow) {
                        if (!moduleELement.nextElementSibling || moduleELement.nextElementSibling.tagName !== "P") {
                            let pbr = global.createElementBR()
                            global.insertAfter(pbr, moduleELement)
                            global.setCursorPosition(pbr)
                        } else {
                            global.setCursorPosition(moduleELement.nextElementSibling)
                        }
                    } else {
                        setSubPosition(moduleELement, {
                            type: "tbody",
                            row: pos.row + 1,
                            col: pos.col,
                        })
                    }
                }
            }
        }
    },
}

function matchText(data: string) {
    let res = data.replaceAll(" ", "")
    res = res.replace(/^\|?|\|?$/g, "")
    let mat = /^(-\|)+-$/.test(res)
    if (mat) {
        console.log(mat);

        let list = res.split("|")
        return list.length
    }
    return false
}

interface SubPosition {
    type: "thead" | "tbody"
    row: number
    col: number
}
interface SubDetail {
    rowElement: HTMLElement
    colElement: HTMLElement
    isLastRow: boolean
    isLastCol: boolean
}

function getSubInfo(moduleELement: HTMLElement): SubPosition & SubDetail {
    let secondELement = global.getChildNodeMatchCursor(moduleELement)
    let type = secondELement.tagName.toLocaleLowerCase() as "thead" | "tbody"
    let rowElement = global.getChildNodeMatchCursor(secondELement)
    let row = global.indexFromParent(secondELement)
    let colElement = global.getChildNodeMatchCursor(rowElement)
    let col = global.indexFromParent(rowElement)
    let isLastRow = secondELement.lastChild === rowElement
    let isLastCol = rowElement.lastChild === colElement
    return { type, row, col, isLastRow, isLastCol, rowElement, colElement }
}

function setSubPosition(firstELement: HTMLElement, pos: SubPosition) {
    let secondELement
    if (pos.type === "thead") {
        secondELement = firstELement.firstChild! as HTMLElement
    } else {
        secondELement = firstELement.lastChild! as HTMLElement
    }
    let rowElement = secondELement.children[pos.row]
    let colElement = rowElement.children[pos.col]
    global.setCursorPosition(colElement, -1)
}
