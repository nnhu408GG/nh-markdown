import MainPanel from "."
import _processInline from "../mdast/processInline"
import { generatorPhrasingContentVnode, render } from "../render"
import { ComponentBlock } from "../types/mainPanel"
import { complierInline } from "./compiler"

/** 冒泡寻找指定特征的父级 */
export function getParentAttribute(state: MainPanel, node: Node, targetAttribute: string): HTMLElement | undefined {
    if (node instanceof HTMLElement) {

        /* 寻找 INLINE_ATTRIBUTE 若遇到 INLINE_SUPPORT 则结束匹配 */
        if (targetAttribute === MainPanel.INLINE_ATTRIBUTE && node.hasAttribute(MainPanel.INLINE_SUPPORT)) {
            return undefined
        }

        if (node === state.bindElement) {
            return undefined
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

/** 移除全部聚焦的 inline 元素 */
export function removeAllFocusInline(state: MainPanel) {
    if (state.focusInline.length === 0) return
    state.focusInline.forEach(item => item.classList.remove(MainPanel.INLINE_FOCUS))
    state.focusInline.length = 0
}

/** 直接设置 focusInline */
export function setFocusInline(state: MainPanel, ...els: HTMLElement[]) {
    state.focusInline.forEach(dom => {
        if (!els.includes(dom)) {
            dom.classList.remove(MainPanel.INLINE_FOCUS)
        }
    })

    let list = []
    /** 增加els剩余的元素 */
    els.forEach(dom => {
        if (!state.focusInline.includes(dom)) {
            dom.classList.add(MainPanel.INLINE_FOCUS)
        }
        list.push(dom)
    })
    state.focusInline = list
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
        let _fragment = range.extractContents()
        if (_fragment.textContent) {
            let ast = complierInline(_fragment)
            return render({ children: generatorPhrasingContentVnode(ast) }) as DocumentFragment
        }
    }
    return undefined
}

/** 清空dom的所有子元素，返回裁剪的 fragment */
export function extractChildNode(el: HTMLElement): DocumentFragment {
    if (el.childNodes.length !== 0) {
        let range = new Range()
        range.setStartBefore(el.firstChild)
        range.setEndAfter(el.lastChild)
        let fragment = range.extractContents()
        if (fragment.textContent.length !== 0) {
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





/** 自动设置 inlineFocus
 * 无选区时：识别 anchorNode
 * 存在选区：识别 anchorNode 和 fousNode
 */
export function autoSetInlineFocus(state: MainPanel) {
    let sel = document.getSelection()
    if (!sel.anchorNode) return

    let list = []

    let anchorBlock = getParentAttribute(state, sel.anchorNode, MainPanel.INLINE_ATTRIBUTE)
    if (anchorBlock) {
        list.push(anchorBlock)

        /** 是否第一次进入，且选择了末尾 */
        let isNeedSetCursorPositionToEnd = !state.focusInline.includes(anchorBlock) && sel.anchorOffset === anchorBlock.innerText.length
        if (isNeedSetCursorPositionToEnd) {
            setFocusInline(state, anchorBlock)
            setInlineCursorPosition(state, anchorBlock, -1)
        }

        /** 是否是在inline的末尾，且nextSibling也是inline */
        let isNeedAddNextSiblingFocus =
            sel.anchorNode.parentElement === anchorBlock.lastElementChild
            && sel.anchorOffset === anchorBlock.lastElementChild.textContent.length
            && anchorBlock.nextSibling instanceof HTMLElement
            && anchorBlock.nextSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE);

        if (isNeedAddNextSiblingFocus) {
            list.push(anchorBlock.nextSibling)
        }

    } else {
        /** 是否是在Text的末尾，且nextSibling也是inline */
        let isNeedAddNextSiblingFocus =
            sel.anchorOffset === sel.anchorNode.textContent.length
            && sel.anchorNode.nextSibling instanceof HTMLElement
            && sel.anchorNode.nextSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE);

        if (isNeedAddNextSiblingFocus) {
            list.push(sel.anchorNode.nextSibling)
        }
    }

    /* 存在选区情况 */
    if (!sel.isCollapsed) {
        let focusBlock = getParentAttribute(state, sel.focusNode, MainPanel.INLINE_ATTRIBUTE)
        if (focusBlock) {
            list.push(focusBlock)

            /** 是否第一次进入，且选择了末尾 */
            let isNeedSetCursorPositionToEnd =
                !state.focusInline.includes(focusBlock)
                && sel.focusOffset === focusBlock.innerText.length

            if (isNeedSetCursorPositionToEnd) {
                setFocusBlock(state, focusBlock)
                sel.setBaseAndExtent(sel.anchorNode, sel.anchorOffset, focusBlock.lastChild.firstChild, focusBlock.lastChild.firstChild.textContent.length)
            }

            /** 是否第一次进入，且选择了开头 */
            let isNeedSetCursorPositionToStart =
                !state.focusInline.includes(focusBlock)
                && sel.focusOffset === 0

            if (isNeedSetCursorPositionToStart) {
                sel.setBaseAndExtent(sel.anchorNode, sel.anchorOffset, focusBlock.firstChild.firstChild, 0)
            }



            /** 是否是在inline的末尾，且nextSibling也是inline */
            let isNeedAddNextSiblingFocus =
                sel.focusNode.parentElement === focusBlock.lastChild
                && sel.focusOffset === focusBlock.lastChild.textContent.length
                && focusBlock.nextSibling instanceof HTMLElement
                && focusBlock.nextSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE);

            if (isNeedAddNextSiblingFocus) {
                list.push(focusBlock.nextSibling)
            }

            /** 是否是在inline的开头，且PreviousSibling也是inline */
            let isNeedAddPreviousSiblingFocus =
                sel.focusNode.parentElement === focusBlock.firstChild
                && sel.focusOffset === 0
                && focusBlock.previousSibling instanceof HTMLElement
                && focusBlock.previousSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE)

            if (isNeedAddPreviousSiblingFocus) {
                list.push(focusBlock.previousSibling)
            }
        }

        else {
            /** 是否是在Text的末尾，且nextSibling也是inline */
            let isNeedAddNextSiblingFocus =
                sel.focusOffset === sel.focusNode.textContent.length
                && sel.focusNode.nextSibling instanceof HTMLElement
                && sel.focusNode.nextSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE);

            if (isNeedAddNextSiblingFocus) {
                list.push(sel.focusNode.nextSibling)
            }

            /** 是否是在Text的开头，且PreviousSibling也是inline */
            let isNeedAddPreviousSiblingFocus =
                sel.focusOffset === 0
                && sel.focusNode.previousSibling instanceof HTMLElement
                && sel.focusNode.previousSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE)

            if (isNeedAddPreviousSiblingFocus) {
                list.push(sel.focusNode.previousSibling)
            }
        }
    }

    setFocusInline(state, ...list)
}

/** 重新设置 inline 的光标的位置 */
export function setInlineCursorPosition(state: MainPanel, el: HTMLElement, position: number) {
    let sel = document.getSelection()
    let _separatedSource = getCursorSeparatedSource(state, el)
    let allLength = _separatedSource.before.length + _separatedSource.after.length

    let range = sel.getRangeAt(0)

    /* 末尾，或者是position溢出 */
    if (position === -1 || position >= allLength) {
        let lastChild = el.lastChild
        if (lastChild instanceof Text) {
            range.setStartAfter(lastChild);
        } else if (lastChild instanceof HTMLBRElement) {
            range.setStartAfter(lastChild)
        } else if (lastChild instanceof HTMLElement) {
            range.setStart(lastChild.lastChild, lastChild.lastChild.textContent.length)
        }
    } else {
        let indexCount = 0
        for (let i = 0; i < el.childNodes.length; i++) {
            let dom = el.childNodes[i]
            let aboutLength = 0
            if (dom instanceof HTMLBRElement) {
                aboutLength = 1
                if (aboutLength + indexCount === position) {
                    range.setStartAfter(dom)
                    break
                }
            } else if (dom instanceof HTMLElement) {
                aboutLength = dom.textContent.length
                if (aboutLength + indexCount >= position) {
                    setInlineCursorPosition(state, dom, position - indexCount)
                    return
                }
            } else if (dom instanceof Text) {
                aboutLength = dom.textContent.length
                if (aboutLength + indexCount >= position) {
                    range.setStart(dom, position - indexCount)
                    let inline = getParentAttribute(state, dom, MainPanel.INLINE_ATTRIBUTE);
                    if (inline) setFocusInline(state, inline);
                    break;
                }
            }
            indexCount += aboutLength
        }
    }
}

/** 重置 inline 的结构，使 ast 更合理化，并调整位置 */
export function resetInline(state: MainPanel, el: HTMLElement) {
    let _separatedSource = getCursorSeparatedSource(state)
    let position = _separatedSource.before.length
    let ast = _processInline(_separatedSource.before + _separatedSource.after)
    let fragment = render({ children: generatorPhrasingContentVnode(ast) })
    el.replaceChildren(fragment)
    setInlineCursorPosition(state, el, position)
}


/** 光标分割的源文本 */
export function getCursorSeparatedSource(state: MainPanel, dom?: Node): { before: string, after: string } {
    let sel = document.getSelection();
    if (!dom) dom = getParentAttribute(state, sel.anchorNode, MainPanel.INLINE_SUPPORT);
    let res = { before: "", after: "" };
    if (dom.childNodes.length === 0) { return res };
    let range = new Range();
    range.setStartBefore(dom.firstChild);
    range.setEnd(sel.anchorNode, sel.anchorOffset);
    let _before = range.cloneContents();
    _before.querySelectorAll("br").forEach(item => item.replaceWith("\n"));
    res.before = _before.textContent;
    range.setStart(sel.anchorNode, sel.anchorOffset);
    range.setEndAfter(dom.lastChild);
    let _after = range.cloneContents();
    _after.querySelectorAll("br").forEach(item => item.replaceWith("\n"));
    res.after = _after.textContent;
    return res;
}

