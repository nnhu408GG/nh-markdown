import { Module } from "./types";
import type { BeforeMatch, AfterHandle } from "./types"
import paragraph from "./module_block/paragraph";
import hr from "./module_block/hr";
import precode from "./module_block/precode";
import image from "./module_block/image";
import table from "./module_block/table";

/* =============== 全局参数 ========================================================================= */

/** 聚焦元素的 className */
const FIRSTELEMENT_FOCUSSIGN = "focus";
/** 行内特殊元素的 className */
const INLINESIGN = "md-pair-s"

// 向内部函数暴露一些重要的参数
export const state =
    <{
        /** 识别该module是inline元素的标志，用以显示/隐藏特殊文本记号 */
        MODULE_INLINE_SIGN: string
        /** 识别为module的标志 */
        MODULE_ATTRIBUTE_SIGN: string,
        /** 基于该dom来创建markdown的编辑功能 */
        BIND_ELEMENT: HTMLElement
        /** 初始化参数 */
        MODULE: Module[]

        /** command键的触发     
         * todo 加入ctrl键的兼容 */
        ACTIVE_META: boolean
        /** 最近一次记录的firstElement */
        latelyFirstELement?: HTMLElement
        /** 记录selection的变化 */
        latelySelection: {
            anchorNode?: Node
            anchorOffset?: number
        }
    }>{
        MODULE_INLINE_SIGN: "md-pair-s",
        MODULE_ATTRIBUTE_SIGN: "mdtype",
        MODULE: [] as Module[],
        ACTIVE_META: false,
        latelyFirstELement: undefined,
        latelySelection: {
            anchorNode: undefined,
            anchorOffset: undefined,
        }
    };

/* =============== 通用操作 ======================================================================== */
export function iteratorModule(basics: { moduleELement: HTMLElement, e?: any }, afterFunc?: keyof AfterHandle) {
    for (let mod of state.MODULE) {
        if (basics.moduleELement.getAttribute(state.MODULE_ATTRIBUTE_SIGN) === mod.mdtype) {
            mod[afterFunc!]?.(basics.moduleELement, basics.e)
            break
        }
    }
}

function _iterator(el: Node): HTMLElement {
    if (el instanceof HTMLElement && el.hasAttribute("mdtype")) {
        return el
    }
    return _iterator(el.parentElement!)
}

/** 获取最近含有mdtype属性的元素 */
export function getModuleELement(el?: Node) {
    if (el && el !== state.BIND_ELEMENT) {
        return _iterator(el)
    } else {
        let sel = document.getSelection()
        if (sel?.anchorNode // 存在光标，且有对应的元素
            && sel.isCollapsed // 只支持非光标选区
            && sel.anchorNode !== state.BIND_ELEMENT) {
            return _iterator(sel.anchorNode)
        }
    }
    return
}



/** 获取包含光标的子元素 getChildNodeMatchCursor */
export function getChildNodeMatchCursor(el: Node) {
    let sel = document.getSelection()
    if (sel?.anchorNode) {
        let _comparedocpos = el.compareDocumentPosition(sel.anchorNode)
        if (_comparedocpos === 20) {
            let res: Node
            function iterator(node: Node): Node {
                let parent = node.parentElement!
                if (parent === el) {
                    return node
                } else {
                    return iterator(parent)
                }
            }
            res = iterator(sel.anchorNode)
            return res
        }
    }
    return
}


/** 判断传入元素是否为inline，以便识别行内元素 */
export function isInlineBlock(el: HTMLElement) {
    let res = window.getComputedStyle(el).display
    // console.log(res);
    return res === "inline"
}

export function createElement(tagName: keyof HTMLElementTagNameMap, mdtype: string) {
    let dom = document.createElement(tagName)
    dom.setAttribute(state.MODULE_ATTRIBUTE_SIGN, mdtype)
    return dom
}

/** 创建inline的模板 */
export function createInlineElement(opt: { tagName: keyof HTMLElementTagNameMap, mdtype: string, sign: string, fragment: DocumentFragment }) {
    let container = document.createElement("span")
    container.setAttribute(state.MODULE_ATTRIBUTE_SIGN, opt.mdtype)
    container.classList.add(state.MODULE_INLINE_SIGN)

    let pairBefore = document.createElement("span")
    pairBefore.classList.add("meta")
    pairBefore.innerText = opt.sign
    let pairAfter = pairBefore.cloneNode()
    let strong = document.createElement(opt.tagName)
    strong.append(opt.fragment)

    container.append(pairBefore)
    container.append(strong)
    container.append(pairAfter)
    return container
}


/** 转移聚焦的元素，设置class标志 */
export function classNameAddFocus(el?: HTMLElement): boolean {
    if (el && el !== state.latelyFirstELement) {
        // todo focus 切换执行
        el.classList.add(FIRSTELEMENT_FOCUSSIGN)
        state.latelyFirstELement?.classList.remove(FIRSTELEMENT_FOCUSSIGN)

        let tempLatelyFirstElement = state.latelyFirstELement
        state.latelyFirstELement = el

        if (tempLatelyFirstElement?.getAttribute(state.MODULE_ATTRIBUTE_SIGN) === paragraph.mdtype) {
            /**
             * precode
             * image
             * hr
             * table
             * url
             */

            // if (hr.changeFocus_AtParagraph(tempLatelyFirstElement)) {
            //     return true
            // }
            // else if (precode.changeFocus_AtParagraph(tempLatelyFirstElement)) {
            //     return true
            // }
            // else if (image.changeFocus_AtParagraph(tempLatelyFirstElement)) {
            //     return true
            // }
            // else if (table.changeFocus_AtParagraph(tempLatelyFirstElement)) {
            //     return true
            // }

            if (hr.changeFocus_AtParagraph(tempLatelyFirstElement)
                || precode.changeFocus_AtParagraph(tempLatelyFirstElement)
                || image.changeFocus_AtParagraph(tempLatelyFirstElement)
                || table.changeFocus_AtParagraph(tempLatelyFirstElement)
            ) {
                return true
            }
        }
    }
    return false
}



/** className:mdfocus 移除 */
// export function classNameRemoveFocus() {
//     state.latelyFirstELement && state.latelyFirstELement.classList.remove(FIRSTELEMENT_FOCUSSIGN)
// }

/** 处理完毕后的光标位置
 * @param anchorOffset "0"为默认值
 * @param anchorOffset "-1"为表示最后
 */
export function setCursorPosition(el: HTMLElement | Element, anchorOffset: 0 | -1 = 0) {
    let range = new Range()
    // if (el.childNodes.length === 0) {
    //     range.setStart(el.firstChild)
    // } else 

    if (anchorOffset === 0 || el.childNodes.length === 0) {
        range.setStart(el.firstChild || el, 0)
    } else if (anchorOffset === -1) {
        range.setStart(el.lastChild!, el.lastChild!.textContent!.length)
    }
    document.getSelection()!.removeAllRanges();
    document.getSelection()!.addRange(range)
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

/** 截取该元素从光标开始直到最后的内容 */
export function getFragementRangeToEnd(el: HTMLElement): DocumentFragment | undefined {
    let sel = document.getSelection()
    if (sel) {
        let _e = el.cloneNode(true)
        let range = new Range()
        range.setStart(sel.anchorNode!, sel.anchorOffset!)
        range.setEndAfter(el.lastChild!)
        let fragement = range.extractContents()
        if (!el.isEqualNode(_e)) {
            return fragement
        }
    }
    return
}


// /** 元素位于第几个
//  * @return "-1"表示错误
//  */
// export function indexOfELement(el: HTMLElement): number {
//     let parentElement = el.parentElement!
//     for (let i = 0; i < parentElement.children.length; i++) {
//         if (parentElement.children[i] === el) {
//             return i
//         }
//     }
//     return -1
// }

// /** 输入父级元素
//  * 输出secondElement位于第几元素 */
// export function indexFromParent(parentELement: HTMLElement): number {
//     let secondELement = getChildNodeMatchCursor(parentELement)
//     for (let i = 0; i < parentELement.childNodes.length; i++) {
//         if (parentELement.childNodes[i] === secondELement) {
//             return i
//         }
//     }
//     return -1
// }