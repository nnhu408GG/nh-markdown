import MainPanel from "../mainPanel";
import { FlowContent } from "./mdast";
import { VNode } from "./render";

export interface Component {
    type: string
    /** 是否支持 INLINE_SUPPORT */
    isInlineSupport?: boolean
    /** 根据ast生成dom文档树 */
    generator(ast: FlowContent): VNode
    /** 将dom文档树编译成ast */
    complier?(el: Element): FlowContent
}

export interface ComponentBlock extends Component {
    backspace(state: MainPanel, event: KeyboardEvent, el: HTMLElement): void
    enter(state: MainPanel, event: KeyboardEvent, el: HTMLElement): void
}