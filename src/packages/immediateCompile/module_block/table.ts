import type { Module } from "../types"
import * as global from "../global"
export default <Module>{
    mdtype: "table",
    // todo 支持行内特征
    // todo 上下键的处理
    // todo 图片的嵌入
    changeFocus_AtParagraph(el) {
        let textContent = el.firstChild?.textContent || ""
        let datalist = textContent.split("|")
        if (datalist.length >= 4
            && datalist.shift() === ""
            && datalist.pop() === ""
            && datalist.every(item => item !== "")
        ) {
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


}