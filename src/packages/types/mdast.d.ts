export interface ParserInterface {
    public block: ModuleBlock[]
    // public inline: ModuleInline[]
    /** 计算该行类型 */
    public getModuleType(data: string): { type: string, mat: RegExpExecArray }
    /** 多行处理 */
    public process(list: string[]): FlowContent[]
}

export interface ParserState {
    list: string[]
    index: number
    mat: RegExpExecArray
    parser: ParserInterface
    type: string
}

export type Module = {
    type: string
    build(opt?: any): PhrasingContent
}

export interface ModuleBlock extends Module {
    regexp: RegExp
    build(state: ParserState): FlowContent
}


export type MaybeSign = {
    sign: string,
    len: number,
}


/* ====================================================================== */

/** 块级元素 block */
export type FlowContent = Heading | ThematicBreak | Image | Paragraph | Blockquote | Code | OrderList | UnorderList | Checkbox | Table

/** 行内元素 inline-block */
export type PhrasingContent = Link | Emphasis | InlineCode | Strong | Text | Delete | Break


/** 文本段落 */
export interface Paragraph {
    type: string
    children?: PhrasingContent[]
}

// export interface Break {
//     type: string
// }

/** 标题 */
export interface Heading {
    type: string
    depth: number,
    children: PhrasingContent[]
}

/** 分割行 */
export interface ThematicBreak {
    type: string
    sign: string // 区分：--- ***
}

/** 块引用 */
export interface Blockquote {
    type: string
    children: FlowContent[]
}

/** 有序列表 */
export interface OrderList {
    type: string
    start: number
    children: FlowContent[][]
}

/** 无序列表 */
export interface UnorderList {
    type: string
    sign: string // 区分：+ *
    children: FlowContent[][]
}

/** 任务勾选 */
export interface Checkbox {
    type: string
    checkout: boolean
}

/** 代码块 */
export interface Code {
    type: string
    lang: string
    value: string
    // meta: 'highlight-line="2"',
}

/** 图片 */
// ![alpha](https://example.com/favicon.ico "bravo")
export interface Image {
    type: string
    label: string
    url: string
}

/** 表格 */
export interface Table {
    type: string
    align?: alignType[] // 表格对齐方式：["left","center","right"]
    children: PhrasingContent[][][] // 表格内容
}

type alignType = "left" | "right" | "center" | null

/* =========================================================================== */

/** 反斜杠标注不转换 */
export interface NotProcess {
    type: string
    value: string
}

export interface Break {
    type: string
}

/** 纯文本 */
export interface Text {
    type: string
    value: string
}



/** 斜体 */
export interface Emphasis {
    type: string
    sign: string // 区分：* _
    value: PhrasingContent[]
}

/** 加粗 */
export interface Strong {
    type: string
    sign: string // 区分：** __
    value: PhrasingContent[]
}

/** 删除 */
export interface Delete {
    type: string
    value: PhrasingContent[]
}


/** 行内代码 */
export interface InlineCode {
    type: string
    value: PhrasingContent[]
}

/** 超链接 */
export interface Link {
    type: string
    label: string
    url: string
}

