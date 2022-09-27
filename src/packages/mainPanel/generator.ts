import MainPanel from "."
import _break from "../mdast/components/break"
import _delete from "../mdast/components/delete"
import { FlowContent } from "../types/mdast"

/** 将 FlowContent 类型的 ast 生成 dom，并嵌入到指定的 dom 中 */
export function generatorFlowContent(ast: FlowContent[]) {
    return ast.map(item => MainPanel.COMPONENTS_FLOWCONTENT.find(mod => mod.type === item.type)?.generator(item))
}


