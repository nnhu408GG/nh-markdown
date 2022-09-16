import MainPanel from "..";
import table from "../../mdast/components/table";
import { ComponentBlock } from "../../types/mainPanel";
import { PhrasingContent, Table } from "../../types/mdast";
import { complierInline } from "../compiler";
import { generatorPhrasingContent } from "../generator";

// todo center left right 的初始化调整
// todo inline support的标记

export default <ComponentBlock>{
    type: table.type,
    generator(ast: Table) {
        let dom = document.createElement("figure")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, "")
        dom.contentEditable = "false"

        let tableTool = document.createElement("div")
        tableTool.classList.add("toolContainer")
        dom.append(tableTool)

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
        dom.append(table)
        let thead = document.createElement("thead")
        let tbody = document.createElement("tbody")
        thead.contentEditable = "true"
        tbody.contentEditable = "true"
        table.append(thead)
        table.append(tbody)

        let TRhead = document.createElement("tr")
        thead.append(TRhead)

        // let header = ast.children.shift()
        let header = ast.children[0]
        for (let i = 0; i < ast.align.length; i++) {
            let item = header[i]
            let th = document.createElement('th')
            th.setAttribute(MainPanel.INLINE_SUPPORT, "")
            th.style.textAlign = ast.align[i]
            generatorPhrasingContent(th, item)
            TRhead.append(th)
        }

        ast.children.slice(1).forEach(item => {
            let tr = document.createElement("tr")
            for (let i = 0; i < ast.align.length; i++) {
                let sub = item[i]
                let th = document.createElement('th')
                th.setAttribute(MainPanel.INLINE_SUPPORT, "")
                th.style.textAlign = ast.align[i]
                if (sub) {
                    generatorPhrasingContent(th, sub)
                }
                tr.append(th)
            }
            tbody.append(tr)
        })

        return dom
    },
    complier(el) {
        let children = <PhrasingContent[][][]>[]

        let theadTr = el.lastElementChild.firstElementChild.firstElementChild!
        let align = []
        let theadAst = <PhrasingContent[][]>[]
        for (let i = 0; i < theadTr.children.length; i++) {
            let th = theadTr.children[i] as HTMLTableCellElement
            align.push(th.style.textAlign);
            theadAst.push(complierInline(th))
        }
        children.push(theadAst)

        let tbody = el.lastElementChild.lastElementChild as HTMLTableSectionElement
        for (let i = 0; i < tbody.children.length; i++) {
            let tr = tbody.children.item(i)
            let tbodyAst = <PhrasingContent[][]>[]
            for (let j = 0; j < tr.children.length; j++) {
                let th = tr.children.item(j)
                tbodyAst.push(complierInline(th))
            }
            children.push(tbodyAst)
        }


        return <Table>{ type: this.type, align, children }
    },
    backspace(el) {
        
    },
}