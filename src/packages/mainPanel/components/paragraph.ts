import MainPanel from "..";
import _processInline from "../../mdast/processInline";
import { ComponentBlock } from "../../types/mainPanel";
import { Paragraph } from "../../types/mdast";
import { complierInline } from "../compiler";
import { generatorPhrasingContent } from "../generator";

import * as global from "../global"
import * as generator from "../generator";

export default <ComponentBlock>{
    type: "paragraph",
    generator(ast: Paragraph) {
        let dom = document.createElement("p")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, "")
        dom.setAttribute(MainPanel.INLINE_SUPPORT, "")
        ast.children && generatorPhrasingContent(dom, ast.children)
        return dom
    },
    complier(el) {
        if (el.childNodes.length) {
            let children = complierInline(el)
            return <Paragraph>{ type: this.type, children }
        } else {
            return <Paragraph>{ type: this.type }
        }
    },
    backspace(state, event, el) {
        let sel = document.getSelection()
        if (!sel || !sel.anchorNode) return

        let range = new Range()
        range.setStartBefore(el.firstChild)
        range.setEnd(sel.anchorNode, sel.anchorOffset)
        let position = range.cloneContents().textContent.length

        if (position === 0) {
            let strAfter = ""
            el.querySelectorAll("br").forEach(br => br.replaceWith("\n"))
            el.childNodes.forEach(item => strAfter += item.textContent)
            el.innerText = ""

            setTimeout(() => {
                let range = new Range()
                let support = global.getParentAttribute(this, sel.anchorNode, MainPanel.INLINE_SUPPORT) as HTMLElement;

                let cursorPosition = 0
                range.setStartBefore(support.firstChild)
                range.setEnd(sel.anchorNode, sel.anchorOffset)
                cursorPosition = range.cloneContents().textContent.length; // 记录光标位置总距离

                support.querySelectorAll("br").forEach(br => br.replaceWith("\n"))
                let strBefore = support.textContent
                support.innerText = ""

                let ast = _processInline(strBefore + strAfter)
                generator.generatorPhrasingContent(support, ast)

                global.setInlineCursorPosition(state, support, cursorPosition)
                el.normalize()
            }, 0);
        }
    },

    enter(state, event, el) {
        event.preventDefault()
        let sel = document.getSelection()
        if (!sel || !sel.anchorNode) return

        let range = new Range()
        range.setStartBefore(el.firstChild)
        range.setEnd(sel.anchorNode, sel.anchorOffset)
        let position = range.cloneContents().textContent.length

        if (position === 0) {
            let dom = this.generator({ type: this.type })
            global.insertBefore(el, dom)
        } else {
            let dom = this.generator({ type: this.type })
            let fragment = global.getFragementRangeToEnd(el)
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
                let ast = complierInline(range.extractContents())
                generator.generatorPhrasingContent(el, ast)
            }


            global.insertAfter(el, dom)
            global.setFocusBlock(state, dom)
            global.setInlineCursorPosition(state, dom, 0)
        }
    },
}