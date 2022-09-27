import type { SymmetricInline, VNode } from "./types/render"
import type { PhrasingContent, Text, InlineCode, Delete, Strong, Emphasis, Link } from "./types/mdast"
import text from "./mdast/components/text"
import inlineCode from "./mdast/components/inlineCode"
import _break from "./mdast/components/break"
import MainPanel from "./mainPanel"
import _delete from "./mdast/components/delete"
import strong from "./mdast/components/strong"
import emphasis from "./mdast/components/emphasis"
import link from "./mdast/components/link"


/** 传入 VNode结构树 来生成dom */
export function render(vnode: VNode) {
    let dom: HTMLElement | DocumentFragment
    if (vnode.type) {
        dom = document.createElement(vnode.type)
    } else {
        dom = document.createDocumentFragment()
    }



    /* children */
    if (vnode.children) {
        if (typeof vnode.children === "string") {
            dom.append(vnode.children)
        } else {
            vnode.children.forEach(itemVNode => {
                if (typeof itemVNode === "string") {
                    dom.append(itemVNode)
                } else {
                    dom.append(render(itemVNode))
                }
            })
        }
    }


    if (vnode.type) {
        dom = dom as HTMLElement
        /* prop */
        vnode?.prop && Object.keys(vnode.prop).forEach(key => {
            if (dom instanceof HTMLTextAreaElement && key === "value") {
                dom.value = vnode.prop[key]
            }
            else if (dom instanceof HTMLInputElement && key === "checked") {
                dom.checked = vnode.prop[key]
            }
            else if (dom instanceof HTMLElement) {
                dom.setAttribute(key, vnode.prop[key])
            }
        })

        /* innerHTML */
        if (vnode.innerHTML) {
            dom.innerHTML = vnode.innerHTML
        }


        /* on */
        vnode?.on && Object.keys(vnode.on).forEach(key => {
            if (dom instanceof HTMLElement) {
                dom.oninput = vnode.on[key].bind(vnode)
            }
        })
    }



    vnode.dom = dom

    return dom
}






/** 传入 PhrasingContent[] AST 来生成 Vnode结构树 */
export function generatorPhrasingContentVnode(ast: PhrasingContent[]) {
    let vnode: (VNode | string)[] = []
    ast.forEach(item => {
        let node: VNode | string
        if (item.type === text.type) {
            let _item = item as Text
            node = _item.value
        } else if (item.type === _break.type) {
            node = <VNode>{ type: "br" }
        } else if (item.type === inlineCode.type) {
            let _item = item as InlineCode
            node = generatorSymmetricInlineVNode("`", _item.value)
        } else if (item.type === _delete.type) {
            let _item = item as Delete
            node = generatorSymmetricInlineVNode("~~", _item.value)
        } else if (item.type === strong.type) {
            let _item = item as Strong
            node = generatorSymmetricInlineVNode(_item.sign, _item.value)
        } else if (item.type === emphasis.type) {
            let _item = item as Emphasis
            node = generatorSymmetricInlineVNode(_item.sign, _item.value)
        } else if (item.type === link.type) {
            let _item = item as Link
            node = generatorInlineLinkVNode(_item)
        }

        vnode.push(node)
    })

    return vnode
}






/** 对称结构的Inline */
const SYMMETRIC_INLINE_MAP = <SymmetricInline[]>[
    { sign: "*", mdtype: "emphasis", type: "em" },
    { sign: "_", mdtype: "emphasis", type: "em" },
    { sign: "**", mdtype: "strong", type: "strong" },
    { sign: "__", mdtype: "strong", type: "strong" },
    { sign: "`", mdtype: "inlineCode", type: "code" },
    { sign: "~~", mdtype: "delete", type: "del" },
]

/** 解析 对称结构的Inline AST 生成VNode  */
function generatorSymmetricInlineVNode(sign: string, value: PhrasingContent[]) {
    let mod = SYMMETRIC_INLINE_MAP.find(item => item.sign === sign);

    return <VNode>{
        type: "span",
        prop: {
            [MainPanel.COMPONENT_TYPE]: mod.mdtype,
            [MainPanel.INLINE_ATTRIBUTE]: "",
        },
        children: [
            { type: "span", prop: { class: "meta" }, children: sign },
            { type: mod.type, children: generatorPhrasingContentVnode(value) },
            { type: "span", prop: { class: "meta" }, children: sign },
        ]
    }
}

/** 解析 Link AST 生成VNode  */
function generatorInlineLinkVNode(ast: Link): VNode {
    return {
        type: "span",
        prop: {
            [MainPanel.COMPONENT_TYPE]: ast.type,
            [MainPanel.INLINE_ATTRIBUTE]: ""
        },
        children: [
            { type: "span", prop: { class: "meta" }, children: "[" },
            { type: "a", prop: { href: ast.url }, children: ast.label },
            { type: "span", prop: { class: "meta" }, children: "](" },
            { type: "span", prop: { class: "meta" }, children: ast.url },
            { type: "span", prop: { class: "meta" }, children: ")" },
        ],
    }
}