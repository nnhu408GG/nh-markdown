import * as global from "./global"

type InlineOptionItem = {
    sign: string
    inlineType: string
    tagName: keyof HTMLElementTagNameMap
};

const inlineModuleOption: InlineOptionItem[] = [
    {
        sign: "\*\*",
        inlineType: "strong",
        tagName: "strong"
    },
    {
        sign: "__",
        inlineType: "strong",
        tagName: "strong"
    },
    {
        sign: "\*",
        inlineType: "em",
        tagName: "em"
    },
    {
        sign: "`",
        inlineType: "code",
        tagName: "code"
    }
];




/**
 * 1. 内部有多个匹配的
 * 2. 多个单类不同需要匹配的
 * 从左到右匹配
 */

/**
 *    `code`
 *    *em*
 *    **strong**
 *    __strong__
 */

/**
 * blockqute/orderedList/unorderedList -> paragraph
 * table
 * title
 */

/** 创建inline的模板 */
export function createInlineElement(opt: { tagName: keyof HTMLElementTagNameMap, sign: string, fragment: DocumentFragment | Node }) {
    let container = document.createElement("span")
    container.setAttribute(global.state.MODULE_ATTRIBUTE_SIGN, opt.tagName)
    container.setAttribute("inline", "")

    let pairBefore = document.createElement("span")
    pairBefore.classList.add("meta")
    pairBefore.innerText = opt.sign
    let pairAfter = pairBefore.cloneNode(true)
    let strong = document.createElement(opt.tagName)
    strong.append(opt.fragment)

    container.append(pairBefore)
    container.append(strong)
    container.append(pairAfter)
    return container
}


export function createLinkElement(url: string, labelFragment: DocumentFragment | Node) {
    let container = document.createElement("a")
    container.setAttribute(global.state.MODULE_ATTRIBUTE_SIGN, "link")
    container.setAttribute("inline", "")
    container.href = url

    let metaA = document.createElement("span")
    metaA.classList.add("meta")
    let metaB = metaA.cloneNode() as HTMLSpanElement
    let metaC = metaA.cloneNode() as HTMLSpanElement
    let link = metaA.cloneNode() as HTMLSpanElement
    link.classList.add("url")

    metaA.innerText = "["
    metaB.innerText = "]("
    metaC.innerText = ")"
    link.innerText = url


    let label = document.createElement("span")
    label.appendChild(labelFragment)



    container.append(metaA)
    container.append(label)
    container.append(metaB)
    container.append(link)
    container.append(metaC)

    return container
}


type InlineStructSub = {
    sign?: string
    length?: number
    children?: InlineStructSub[]
    content?: string
    url?: string
}


/** 获取父级元素 */
// todo 对 table 的 TH 父级元素的支持
function iterator_getModuleElement(el: HTMLElement): HTMLElement {
    if (el.hasAttribute(global.state.MODULE_ATTRIBUTE_SIGN) && !el.hasAttribute("inline")) {
        return el
    }
    return iterator_getModuleElement(el.parentElement!)
}


/** 重新设置 inline 的光标的位置 */
function setCursorPosition(el: HTMLElement, indexPosition: number) {
    let indexCount = 0
    for (let i = 0; i < el.childNodes.length; i++) {
        let item = el.childNodes[i]
        let tempLength = item.textContent?.length! + indexCount
        if (tempLength >= indexPosition) {
            if (item instanceof Text) {
                console.log("!TextNode:", item.parentElement);
                global.classNameAddFocus(el.parentElement!)
                let range = new Range()
                range.setStart(item, indexPosition - indexCount)
                document.getSelection()?.removeAllRanges()
                document.getSelection()?.addRange(range)
            } else {
                setCursorPosition(item as HTMLElement, indexPosition - indexCount)
            }
            return
        } else {
            indexCount = tempLength
        }
    }
}


export function arrowHorizontal(el: HTMLElement, arrow: "ArrowLeft" | "ArrowRight") {
    console.log("arrowHorizontal");

    let range = new Range()
    if (arrow === "ArrowLeft") {
        range.setStart(el.lastElementChild?.firstChild!, el.lastElementChild?.firstChild?.textContent?.length!)
    } else {
        range.setStart(el.firstElementChild?.firstChild!, 0)
    }
    document.getSelection()?.removeAllRanges()
    document.getSelection()?.addRange(range)
}

/** 执行函数的主入口 */
export function getInlineStruct_textContent(el: HTMLElement) {
    let baseElement = iterator_getModuleElement(el)
    // console.log("baseElement:", baseElement);

    // 记录 光标位置
    let sel = document.getSelection()!
    let range = new Range()
    range.setStart(baseElement, 0)
    range.setEnd(sel.anchorNode!, sel.anchorOffset!)
    let indexCursor = range.cloneContents().textContent?.length!
    // console.log("indexCursor:", indexCursor);


    let SIGNLIST = inlineModuleOption.reduce((res, obj) => {
        res.push(obj.sign.replaceAll("*", "\\*"))
        return res
    }, <string[]>[]).join("|")

    /* 
    (\*|\*\*|`|__)((?!\1).+?)\1
    \[((?!\[).+?)\]\(((?!\().+?)\)
    */

    // todo 放到初始化函数里执行
    let regexp = new RegExp(`((${SIGNLIST})((?!\\2).+?)\\2)|(\\[((?!\\[).+?)\\]\\(((?!\\().+?)\\))`, "g")
    // console.log(regexp);

    let data = baseElement.textContent!
    // console.log(data);

    // 获取到行内数据结构
    let structTextContent = iterator_regExp(regexp, data)
    let structChildren = getInlineStruct(baseElement)

    if (JSON.stringify(structTextContent) === JSON.stringify(structChildren)) {
        return
    }

    matchStructDiff(baseElement, { childNode: structChildren, textContent: structTextContent })

    let newStructChildren = getInlineStruct(baseElement)
    console.log("JSON.stringify(newStructChildren) === JSON.stringify(structTextContent):", JSON.stringify(newStructChildren) === JSON.stringify(structTextContent));

    // 重设光标位置
    // setTimeout(() => {
    setCursorPosition(baseElement, indexCursor)
    // }, 1000);
}

function matchStructDiff(el: HTMLElement, struct: { childNode: InlineStructSub[], textContent: InlineStructSub[] }) {
    console.log(struct);
    let indexStart = 0
    // start
    for (; ;) {
        let A = struct.childNode[indexStart]
        let B = struct.textContent[indexStart]
        if (A.sign !== B.sign
            || A.length !== B.length
            || (A.sign !== "TextNode" && JSON.stringify(A.children) !== JSON.stringify(B.children))) {
            break
        }
        indexStart++
    }

    let indexEnd = struct.childNode.length
    let indexEndTextContent = struct.textContent.length

    // end
    for (; ;) {
        let A = struct.childNode[indexEnd - 1]
        let B = struct.textContent[indexEndTextContent - 1]
        if (A.sign !== B.sign
            || A.length !== B.length
            || (A.sign !== "TextNode" && JSON.stringify(A.children) !== JSON.stringify(B.children))
        ) {
            break
        }
        indexEnd--
        indexEndTextContent--
    }
    console.log(indexStart, indexEnd);

    let range = new Range()
    range.setStart(el, indexStart)
    range.setEnd(el, indexEnd)
    // document.getSelection()?.removeAllRanges()
    // document.getSelection()?.addRange(range)
    let structRange = struct.textContent.slice(indexStart, indexEndTextContent)
    console.log("res.struct:", structRange);
    let fragment = iterator_createInlineElement(structRange)
    console.log("fragment:", fragment);
    range.deleteContents()
    range.insertNode(fragment)
    // console.log("res.textContent:", range.cloneContents().textContent);
}

function iterator_createInlineElement(struct: InlineStructSub[]) {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < struct.length; i++) {
        let item = struct[i]
        if (item.sign === "link") {
            let fragment_link = iterator_createInlineElement(item.children!)
            let link = createLinkElement(item.url!, fragment_link)
            fragment.append(link)
        } else if (item.sign === "TextNode") {
            let textNode = document.createTextNode(item.content!)
            fragment.append(textNode)
        } else {
            let tagName = inlineModuleOption.find(sub => sub.sign === item.sign)?.tagName!
            let fragment_dom = iterator_createInlineElement(item.children!)
            let dom = createInlineElement({ tagName, sign: item.sign!, fragment: fragment_dom })
            fragment.append(dom)
        }
    }
    return fragment
}


/** 将 textContent 转换成数据结构 */
function iterator_regExp(regexp: RegExp, data: string) {
    let dataIndex = 0
    let resSub: InlineStructSub[] = []
    let mat = data.matchAll(regexp)
    let next = mat.next()
    for (; ;) {
        let value = next.value
        // console.log(value);

        if (next.done) {
            let textNode = data.slice(dataIndex, data.length)
            textNode && resSub.push({
                length: textNode.length,
                sign: "TextNode",
                content: textNode
            })
            break
        }

        let textNode = data.slice(dataIndex, value.index)
        textNode && resSub.push({
            length: textNode.length,
            sign: "TextNode",
            content: textNode
        })
        dataIndex = value.index! + value[0].length

        let sub: InlineStructSub = {
            length: value[0].length
        }
        let childrenValue
        if (next.value[5]) {
            sub.sign = "link"
            sub.url = value[6]
            childrenValue = value[5]
        } else {
            sub.sign = value[2]
            childrenValue = value[3]
        }
        sub.children = iterator_regExp(regexp, childrenValue)
        resSub.push(sub)

        next = mat.next()
    }
    return resSub
}

/** 获取该元素的 children 数据结构 */
function getInlineStruct(el: HTMLElement) {
    let resSub: InlineStructSub[] = []

    for (let i = 0; i < el.childNodes.length; i++) {
        let item = el.childNodes[i]
        if (item instanceof Text) {
            resSub.push({
                length: item.textContent?.length,
                sign: "TextNode",
                content: item.textContent!
            })
        } else if (item instanceof HTMLElement) {
            let sub: InlineStructSub = { length: item.textContent?.length }
            let mdtype = item.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN)!

            if (mdtype === "link") {
                sub.sign = "link"
                sub.url = item.childNodes[3].textContent!
            } else {
                sub.sign = item.children[0].textContent!
            }

            // sub.children[1] // 设计上都是第二个元素包含下一级
            let children = getInlineStruct(item.children[1] as HTMLElement)
            if (children.length !== 0) {
                sub.children = children
            }
            resSub.push(sub)
        }
    }
    return resSub
}


