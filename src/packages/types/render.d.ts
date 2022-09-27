export type VnodeChildren = (string | VNode)[] | string

export interface VNode {
    type?: keyof HTMLElementTagNameMap
    prop?: {
        [key: string]: any
        class?: string
        contenteditable?: boolean
        spellcheck?: boolean
        style?: string
    }
    children?: VnodeChildren

    on?: {
        [key: string]: (this: VNode, event: Event) => void
        oninput: (this: VNode, event: InputEvent) => void
    }

    innerHTML?: string

    /** 不要手动绑定！这是 render 执行生成的 dom 之后自动绑定的*/
    dom?: HTMLElement | DocumentFragment
}

// document.createElement().sty

export interface SymmetricInline {
    sign: string
    mdtype: string
    type: keyof HTMLElementTagNameMap
}