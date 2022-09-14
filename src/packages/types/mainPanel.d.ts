import { FlowContent } from "./mdast";

export interface Component {
    type: string
    /** 根据ast生成dom文档树 */
    generator(ast: FlowContent): HTMLElement
    /** 将dom文档树编译成ast */
    complier?(el: Element): FlowContent
}