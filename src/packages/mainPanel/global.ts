import MainPanel from "."
import _processInline from "../mdast/processInline"
import { ComponentBlock } from "../types/mainPanel"
import { complierInline } from "./compiler"
import { generatorPhrasingContent } from "./generator"

/** 冒泡寻找指定特征的父级 */
export function getParentAttribute(state: MainPanel, node: Node, targetAttribute: string): HTMLElement | void {
    if (node instanceof HTMLElement) {
        if (targetAttribute === MainPanel.INLINE_ATTRIBUTE && node.hasAttribute(MainPanel.INLINE_SUPPORT)) {
            return
        }

        if (node === state.bindElement) {
            return
        }

        if (node.hasAttribute(targetAttribute)) {
            return node
        }
    }
    return getParentAttribute(state, node.parentElement, targetAttribute)
}

/** 设置聚焦的 block 元素 */
export function setFocusBlock(state: MainPanel, el: HTMLElement) {
    if (state.focusBlock === el) return

    if (state.focusBlock) {
        state.focusBlock.classList.remove(MainPanel.BLOCK_FOCUS)
    }

    state.focusBlock = el
    state.focusBlock.classList.add(MainPanel.BLOCK_FOCUS)
}

/** 移除聚焦的 block 元素 */
export function removeFocusBlock(state: MainPanel) {
    if (!state.focusBlock) return
    state.focusBlock.classList.remove(MainPanel.BLOCK_FOCUS)
    state.focusBlock = undefined
}

/** 设置聚焦的 inline 元素 */
export function setFocusInline(state: MainPanel, el: HTMLElement) {
    if (state.focusInline === el) return

    if (state.focusInline) {
        state.focusInline.classList.remove(MainPanel.INLINE_FOCUS)
    }

    state.focusInline = el
    state.focusInline.classList.add(MainPanel.INLINE_FOCUS)
}

/** 移除聚焦的 inline 元素 */
export function removeFocusInline(state: MainPanel) {
    if (!state.focusInline) return
    state.focusInline.classList.remove(MainPanel.INLINE_FOCUS)
    state.focusInline = undefined
}

/** 获取该 block 对应的 component */
export function getComponent(el: HTMLElement): ComponentBlock {
    let type = el.getAttribute(MainPanel.COMPONENT_TYPE)
    return MainPanel.COMPONENTS_FLOWCONTENT.find(item => item.type === type)
}


/** 截取该元素从光标开始直到最后的内容，截取到的内容会做ast重置转换 */
export function getFragementRangeToEnd(el: HTMLElement): DocumentFragment | undefined {
    let sel = document.getSelection()
    if (sel && el.childNodes.length !== 0) {
        let range = new Range()
        range.setStart(sel.anchorNode!, sel.anchorOffset!)
        range.setEndAfter(el.lastChild!)
        console.log(range.cloneContents().childNodes);
        let _fragment = range.extractContents()

        if (_fragment.textContent) {
            let fragment = document.createDocumentFragment()
            let ast = complierInline(_fragment)
            console.log(ast);

            generatorPhrasingContent(fragment, ast)
            return fragment
        }
    }
    return undefined
}

export function insertBefore(el: Node, add: Node) {
    let range = new Range()
    range.setStartBefore(el)
    range.insertNode(add)
}

export function insertAfter(el: Node, add: Node) {
    let range = new Range()
    range.setStartAfter(el)
    range.insertNode(add)
}

/** 重新设置 inline 的光标的位置 */
export function setInlineCursorPosition(state: MainPanel, el: HTMLElement, indexPosition: number) {
    let indexCount = 0
    for (let i = 0; i < el.childNodes.length; i++) {
        let subitem = el.childNodes[i]
        let aboutLen = subitem.textContent?.length! + indexCount
        if (aboutLen >= indexPosition) {
            if (subitem instanceof Text) {
                let inline = getParentAttribute(state, subitem, MainPanel.INLINE_ATTRIBUTE)
                if (inline) {
                    setFocusInline(state, inline)
                }
                let range = new Range()
                range.setStart(subitem, indexPosition - indexCount)
                document.getSelection()?.removeAllRanges()
                document.getSelection()?.addRange(range)
            } else {
                setInlineCursorPosition(state, subitem as HTMLElement, indexPosition - indexCount)
            }
            return
        } else {
            indexCount = aboutLen
        }
    }
}

/** 清空dom的所有子元素，返回裁剪的 fragment */
export function extractChildNode(el: HTMLElement): DocumentFragment | void {
    if (el.childNodes.length !== 0) {
        let range = new Range()
        range.setStartBefore(el.firstChild)
        range.setEndAfter(el.lastChild)
        let fragment = range.extractContents()
        if (fragment.textContent.length !== 0) {
            return fragment
        }
    }
}

/** 重置 inline 的结构，ast合理化，并调整位置 */
export function resetInline(state: MainPanel, el: HTMLElement) {
    el.querySelectorAll("br").forEach(item => item.replaceWith("\n"))
    let ast = _processInline(el.textContent)

    let sel = document.getSelection()
    let range = new Range()
    range.setStartBefore(el.firstChild)
    range.setEnd(sel.anchorNode, sel.anchorOffset)
    let position = range.cloneContents().textContent.replaceAll("\n", "").length;
    extractChildNode(el)
    generatorPhrasingContent(el, ast)
    setInlineCursorPosition(state, el, position)
}





