import { Module } from "./types";
import type { BeforeMatch, AfterHandle } from "./types"
import * as globalInline from "./module_inline"
import paragraph from "./components/paragraph";
import hr from "./components/thematicBreak";
import precode from "./components/precode";
import image from "./components/image";
import table from "./components/table";
import blockquote from "./components/blockquote";
import title from "./components/title";
import unorderedList from "./components/unorderedList";
import orderedList from "./components/orderedList";

/* =============== 全局参数 ========================================================================= */

/** 聚焦元素的 className */

/** 元素标志名称 */
export const SIGN = {
    /** 聚焦的元素记号 */
    MODULE_FOCUS: "focus",
    /** 识别为module的标志 */
    MODULE_ATTRIBUTE: "mdtype",
    /** 能支持inline的元素标志 */
    INLINECONTAINER_ATTRIBUTE: "inline-container",
}


// 向内部函数暴露一些重要的参数
export const state =
    <{
        /** 基于该dom来创建markdown的编辑功能 */
        BIND_ELEMENT: HTMLElement
        /** 初始化参数 */
        MODULE: Module[]

        /** command键的触发     
         * todo 加入ctrl键的兼容 */
        ACTIVE_META: boolean
        /** 最近一次记录的firstElement */
        latelyFirstELement?: HTMLElement

        /** 特殊 moduleBlock 生成的临时空行 */
        tempParagraph?: HTMLElement

        /** inline的数据结构对象 */
        inlineStruct: []

    }>{
        MODULE: [] as Module[],
        ACTIVE_META: false,
        latelyFirstELement: undefined,
        tempParagraph: undefined,
        inlineStruct: []
    };

/* =============== 通用操作 ======================================================================== */
export function iteratorModule(basics: { moduleELement: HTMLElement, e?: any }, afterFunc?: keyof AfterHandle) {
    let mdtype = basics.moduleELement.getAttribute(SIGN.MODULE_ATTRIBUTE)
    if (mdtype) {
        for (let mod of state.MODULE) {
            if (mdtype === mod.mdtype) {
                mod[afterFunc!]?.(basics.moduleELement, basics.e)
                break
            }
        }
    }
}

function getModuleELementIterator(el: Node): HTMLElement {
    if (el instanceof HTMLElement && el.hasAttribute("mdtype")) {
        return el
    }
    return getModuleELementIterator(el.parentElement!)
}

/** 获取最近含有mdtype属性的元素 */
export function getModuleELement(el?: Node) {
    if (el && el !== state.BIND_ELEMENT) {
        return getModuleELementIterator(el)
    } else {
        let sel = document.getSelection()
        if (sel?.anchorNode // 存在光标，且有对应的元素
            && sel.isCollapsed // 只支持非光标选区
            && sel.anchorNode !== state.BIND_ELEMENT) {
            return getModuleELementIterator(sel.anchorNode)
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

/** @desc 转移聚焦的元素，设置class标志
 * @param el 操作的dom对象
 * @param opt inline的操作参数
 */
export function classNameAddFocus(el: HTMLElement, opt?: string) {
    if (el && el !== state.latelyFirstELement) {
        console.log("changeNameAddFoucs");

        // todo inline 的左右函数执行条件

        // todo focus 切换执行
        el.classList.add(SIGN.MODULE_FOCUS)
        state.latelyFirstELement?.classList.remove(SIGN.MODULE_FOCUS)

        let tempLatelyFirstElement = state.latelyFirstELement
        state.latelyFirstELement = el

        if (el.getAttribute(SIGN.MODULE_ATTRIBUTE) === image.mdtype) {
            image.focusEvent(el)
        }

        if (state.latelyFirstELement.hasAttribute("inline")) {
            if (opt === "ArrowLeft" || opt === "ArrowRight") {
                // todo 光标的移动还是有问题，内部光标移到外部发生错误跳转，需添加内部到外部的移动条件
                if (tempLatelyFirstElement && tempLatelyFirstElement.compareDocumentPosition(state.latelyFirstELement) !== 10) {
                    globalInline.arrowHorizontal(state.latelyFirstELement, opt)
                    return
                } else {
                    console.log("compareDocumentPosition === 10!!!");

                }
            }
        }


        if (tempLatelyFirstElement?.getAttribute(SIGN.MODULE_ATTRIBUTE) === paragraph.mdtype) {
            /**
             * precode
             * image
             * hr
             * table
             * url
             */

            if (hr.changeAtParagraph(tempLatelyFirstElement)
                || precode.changeAtParagraph(tempLatelyFirstElement)
                || image.changeAtParagraph(tempLatelyFirstElement)
            ) {
                return
            }
        }
    }
}

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
        if (el.childNodes.length !== 0) {
            let _e = el.cloneNode(true)
            let range = new Range()
            range.setStart(sel.anchorNode!, sel.anchorOffset!)
            range.setEndAfter(el.lastChild!)
            let fragement = range.extractContents()
            if (!el.isEqualNode(_e)) {
                return fragement
            }
        }
    }
    return
}

export function getAttribute(el: HTMLElement) {
    if (el instanceof HTMLElement && el.hasAttribute(SIGN.MODULE_ATTRIBUTE)) {
        return el.getAttribute(SIGN.MODULE_ATTRIBUTE)!
    }
    return ""
}

export function createTempParagraph(el: HTMLElement, from: "ArrowUp" | "ArrowDown"): boolean {
    let nextElement = (from === "ArrowUp" ? el.previousElementSibling : el.nextElementSibling) as HTMLElement
    if (!nextElement
        || (nextElement
            && [
                hr.mdtype,
                table.mdtype,
                image.mdtype,
                precode.mdtype
            ].includes(getAttribute(nextElement)))
    ) {
        let tempParagraph = paragraph.createBasics()
        state.tempParagraph = tempParagraph
        if (from === "ArrowUp") {
            insertBefore(el, tempParagraph)
        } else {
            insertAfter(el, tempParagraph)
        }
        setCursorPosition(tempParagraph)
        return true
    }
    return false
}


export function prefixGetSource(param: {
    fragment: HTMLCollection,
    prefix?: string,
    /* 开启空行 */
    blankLine: boolean,
}) {

    let source = <string[]>[]

    if (param.prefix === undefined) {
        param.prefix = ""
    }

    for (let i = 0; i < param.fragment.length; i++) {
        let itemEL = param.fragment[i] as HTMLElement
        for (let modIndex = 0; modIndex < state.MODULE.length; modIndex++) {
            let mod = state.MODULE[modIndex]
            if (getAttribute(itemEL) === mod.mdtype && mod.getSource) {
                let modSourceList = <string[]>[]
                mod.getSource(itemEL).split("\n").forEach(res => modSourceList.push(`${param.prefix}${res}`))
                source.push(modSourceList.join("\n"))
                break
            }
        }
    }

    if (param.blankLine) {
        return source.join(`\n${param.prefix}\n`)
    } else {
        return source.join(`\n`)
    }
}

interface ItemStruct {
    type?: string
    children?: unknown
    opt?: unknown
}

export function createByStruct(datalist: ItemStruct[]) {
    let fragment = document.createDocumentFragment()

    for (let i = 0; i < datalist.length; i++) {
        let item = datalist[i]

        // thematicBreak
        if (item.type === "thematicBreak") {
            let dom = hr.createBasics()
            fragment.append(dom)
        }

        // image
        else if (item.type === "image") {
            let opt = item.opt as { label: string, url: string }
            let dom = image.createBasics(opt.label, opt.url)
            fragment.append(dom)
        }

        // header
        else if (item.type === "header") {
            let opt = item.opt as { rank: number }
            let dom = title.createBasics(opt.rank, item.children as string)
            fragment.append(dom)
        }

        // paragraph
        else if (item.type === "paragraph") {
            let dom = paragraph.createBasics(item.children as string)
            fragment.append(dom)
        }

        // unorderedList1
        // unorderedList2
        else if (item.type === "unorderedList1" || item.type === "unorderedList2") {
            let LiFragment = document.createDocumentFragment()


            let children = item.children as ItemStruct[][]
            for (let i = 0; i < children.length; i++) {
                let item = children[i]
                let li = document.createElement("li")

                // todo 需要优化这坨东西
                if (item[0].type === "paragraph") {
                    if ((item[0].children as string).startsWith("[x] ")) {
                        item[0].children = (item[0].children as string).slice(4)
                        li.classList.add("task")

                        let checkboxContainer = document.createElement("div")
                        checkboxContainer.classList.add("checkbox")
                        checkboxContainer.contentEditable = "false"
                        let taskCheck = document.createElement("input")
                        taskCheck.type = "checkbox"
                        checkboxContainer.append(taskCheck)
                        taskCheck.checked = true

                        li.insertAdjacentElement("afterbegin", checkboxContainer)

                    } else if ((item[0].children as string).startsWith("[ ] ")) {
                        item[0].children = (item[0].children as string).slice(4)
                        li.classList.add("task")

                        let checkboxContainer = document.createElement("div")
                        checkboxContainer.classList.add("checkbox")
                        checkboxContainer.contentEditable = "false"
                        let taskCheck = document.createElement("input")
                        taskCheck.type = "checkbox"
                        checkboxContainer.append(taskCheck)

                        li.insertAdjacentElement("afterbegin", checkboxContainer)
                    }
                }

                let _fragment = createByStruct(item)
                li.append(_fragment)
                LiFragment.append(li)
            }

            let dom = unorderedList.createBasics(LiFragment)
            fragment.append(dom)
        }

        // orderedList
        else if (item.type === "orderedList") {
            let opt = item.opt as { start: number }
            let LiFragment = document.createDocumentFragment()

            let children = item.children as ItemStruct[][]
            for (let i = 0; i < children.length; i++) {
                let item = children[i]
                let li = document.createElement("li")

                let _fragment = createByStruct(item)
                li.append(_fragment)
                LiFragment.append(li)
            }

            let dom = document.createElement("ol")
            dom.setAttribute(SIGN.MODULE_ATTRIBUTE, orderedList.mdtype)
            dom.start = opt.start
            dom.append(LiFragment)

            fragment.append(dom)
        }

        // quote
        else if (item.type === "quote") {
            let children = item.children as ItemStruct[]
            let quotefragment = createByStruct(children)
            let dom = blockquote.createBasics(quotefragment)
            fragment.append(dom)
        }

        // table
        else if (item.type === "table") {
            let children = item.children as string[][]

            let headerList = children[0]
            let dom = table.createBasics(headerList)

            let tbody = dom.lastElementChild?.lastElementChild!

            let _trFragment = document.createDocumentFragment()

            for (let i = 2; i < children.length; i++) {
                let tr = tbody.firstElementChild!.cloneNode(true) as HTMLTableRowElement
                for (let j = 0; j < children[i].length; j++) {
                    tr.children[j].append(children[i][j])
                }
                _trFragment.append(tr)
            }

            let range = new Range()
            range.selectNodeContents(tbody)
            range.deleteContents()

            tbody.append(_trFragment)

            fragment.append(dom)
        }

        // precode
        else if (item.type === "precode") {
            let children = item.children as string[]
            let opt = item.opt as { language: string }
            let codeFragment = document.createDocumentFragment()
            for (let i = 0; i < children.length; i++) {
                let p = document.createElement("p")
                if (children[i] === "") {
                    let br = document.createElement("br")
                    p.append(br)
                } else {
                    p.append(children[i])
                }
                codeFragment.append(p)
            }

            let dom = precode.createBasics(codeFragment, opt.language)
            fragment.append(dom)
        }
    }

    return fragment
}