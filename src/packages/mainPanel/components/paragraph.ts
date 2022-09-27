import MainPanel from "..";
import _processInline from "../../mdast/processInline";
import { ComponentBlock } from "../../types/mainPanel";
import { Paragraph } from "../../types/mdast";
import { complierInline } from "../compiler";

import * as global from "../global"
import * as generator from "../generator";
import heading from "./heading";
import { generatorPhrasingContentVnode, render } from "../../render";

export default <ComponentBlock>{
    type: "paragraph",
    generator(ast: Paragraph) {
        return {
            type: "p",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.BLOCK_ATTRIBUTE]: "",
                [MainPanel.INLINE_SUPPORT]: "",
            },
            children: ast.children ? generatorPhrasingContentVnode(ast.children) : undefined
        }
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

        if (el.childNodes.length === 0) {
            console.log("empty");
            return
        }

        let _separatedSourceA = global.getCursorSeparatedSource(state)
        let cursorPosition = _separatedSourceA.before.length
        if (cursorPosition === 0) {
            global.extractChildNode(el)
            setTimeout(() => {
                let support = global.getParentAttribute(state, sel.anchorNode, MainPanel.INLINE_SUPPORT)
                let _separatedSourceB = global.getCursorSeparatedSource(state)
                let cursorPosition = _separatedSourceB.before.length
                if (global.getComponent(support).type === heading.type) {
                    let listBR = _separatedSourceA.after.split("\n")
                    let afterHeadingSource = listBR.shift()
                    let astHeading = _processInline(_separatedSourceB.before + afterHeadingSource)
                    global.extractChildNode(support)
                    support.replaceChildren(render({ children: generatorPhrasingContentVnode(astHeading) }))
                    if (listBR.length !== 0) {
                        let paragraphSource = listBR.join("\n")
                        let astParagraph = _processInline(paragraphSource)
                        let p = this.generator(<Paragraph>{ type: this.type, children: astParagraph }) as HTMLElement
                        global.insertAfter(support, p)
                    }
                } else {
                    let ast = _processInline(_separatedSourceB.before + _separatedSourceA.after)
                    global.extractChildNode(support)
                    support.replaceChildren(render({ children: generatorPhrasingContentVnode(ast) }))
                }
                global.setInlineCursorPosition(state, support, cursorPosition)
                support.normalize()
            }, 0);
        } else {
            event.preventDefault()
            console.log(_separatedSourceA.before.slice(0, -1), cursorPosition - 1);
            let ast = _processInline(_separatedSourceA.before.slice(0, -1) + _separatedSourceA.after)
            global.extractChildNode(el)
            el.replaceChildren(render({ children: generatorPhrasingContentVnode(ast) }))
            global.setInlineCursorPosition(state, el, cursorPosition - 1)
            el.normalize()
        }
    },

    // todo 有序/无序列表的回车
    enter(state, event, el) {
        event.preventDefault()
        let sel = document.getSelection()
        if (!sel || !sel.anchorNode) return

        // Shift + Enter
        let _separatedSource = global.getCursorSeparatedSource(state)
        if (state.activeShift) {
            let position = _separatedSource.before.length
            let ast = _processInline(_separatedSource.before + "\n" + _separatedSource.after)
            global.extractChildNode(el)
            el.replaceChildren(render({ children: generatorPhrasingContentVnode(ast) }))
            global.setInlineCursorPosition(state, el, position + 1)
            el.normalize()
            return
        }

        // todo 还需要判断是否为空行
        let range = new Range()
        range.setStartBefore(el.firstChild)
        range.setEnd(sel.anchorNode, sel.anchorOffset)
        let position = range.cloneContents().textContent.length

        if (position === 0) {
            let dom = this.generator({ type: this.type })
            global.insertBefore(el, dom)
        }
        // else {
        //     // offset === 0
        //     // 
        //     let dom = this.generator({ type: this.type })
        //     let fragment = global.getFragementRangeToEnd(el)
        //     if (fragment) {
        //         dom.append(fragment)
        //     }

        //     // 是否在inline中分割
        //     let inline = global.getParentAttribute(state, sel.anchorNode, MainPanel.INLINE_ATTRIBUTE)
        //     if (inline) {
        //         // 重置ast结构
        //         let range = new Range()
        //         range.setStartBefore(el.firstChild)
        //         range.setEndAfter(el.lastChild)
        //         let ast = complierInline(range.extractContents())
        //         generator.generatorPhrasingContent(el, ast)
        //     }


        //     global.insertAfter(el, dom)
        //     global.setFocusBlock(state, dom)
        //     global.setInlineCursorPosition(state, dom, 0)
        // }
    },
}