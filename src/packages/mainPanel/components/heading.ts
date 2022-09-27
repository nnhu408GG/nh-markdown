import MainPanel from "..";
import heading from "../../mdast/components/heading";
import _processInline from "../../mdast/processInline";
import { generatorPhrasingContentVnode, render } from "../../render";
import { ComponentBlock } from "../../types/mainPanel";
import { Heading } from "../../types/mdast";
import { complierInline } from "../compiler";

import * as generator from "../generator";
import * as global from "../global"

import paragraph from "./paragraph";

export default <ComponentBlock>{
    type: heading.type,
    generator(ast: Heading) {
        return {
            type: `h${ast.depth}` as "h1",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.BLOCK_ATTRIBUTE]: "",
                [MainPanel.INLINE_SUPPORT]: ""
            },
            children: ast.children ? generatorPhrasingContentVnode(ast.children) : undefined
        }
    },

    complier(el) {
        let depth = parseInt(el.tagName.slice(1))
        let children = complierInline(el)
        return <Heading>{ type: this.type, depth, children }
    },

    backspace(state, event, el) {
        let sel = document.getSelection()
        if (!sel || !sel.anchorNode) return
        /* 开头 */
        if (sel.anchorOffset === 0) {
            event.preventDefault()
            let fragment = global.getFragementRangeToEnd(el)
            let dom = render(paragraph.generator({ type: paragraph.type })) as HTMLElement
            if (fragment) {
                dom.append(fragment)
            }
            el.replaceWith(dom)
            global.setFocusBlock(state, dom)
        }
    },

    enter(state, event, el) {
        let sel = document.getSelection()
        if (!sel || !sel.anchorNode) return
        if (sel.anchorOffset === 0) {
            event.preventDefault()
            let dom = render(paragraph.generator({ type: paragraph.type }))
            global.insertBefore(el, dom)
        } else {
            event.preventDefault()

            let dom = render(paragraph.generator({ type: paragraph.type })) as HTMLElement
            let fragment = global.getFragementRangeToEnd(el)
            // 是否在中间
            if (fragment) {
                dom.append(fragment)
            }

            // 是否在inline中分割
            let inline = global.getParentAttribute(state, sel.anchorNode, MainPanel.INLINE_ATTRIBUTE)
            if (inline) {
                // 重置ast结构
                let range = new Range()
                range.setStartBefore(el.firstChild)
                range.setEndAfter(el.lastChild)
                let textContent = range.extractContents().textContent
                let ast = _processInline(textContent)
                let elChildren = render({ children: generatorPhrasingContentVnode(ast) })
                el.replaceChildren(elChildren)
            }


            global.insertAfter(el, dom)
            global.setFocusBlock(state, dom)
            global.setInlineCursorPosition(state, dom, 0)
        }
    },
}