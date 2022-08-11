import * as global from "./global"

type inlineOptionSub = {
    sign: string
    inlineType: string
    tagName: keyof HTMLElementTagNameMap
};

const inlineModuleOption: inlineOptionSub[] = [
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


type InlineStructSub = {
    sign?: string
    children?: InlineStructSub[]
}


/** 获取该元素的 children 数据结构 */
export function getInlineStruct(el: HTMLElement) {
    let resSub: InlineStructSub[] = []

    for (let i = 0; i < el.children.length; i++) {
        let sub: InlineStructSub = {}
        let item = el.children[i]
        let mdtype = item.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN)!

        if (mdtype === "link") {
            sub.sign = "link"
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
    return resSub
}

/** 获取该元素的 textContent 数据结构 */
export function getInlineStruct_textContent(el: HTMLElement) {
    let data = el.textContent!
    console.log(data);

    let SIGNLIST = inlineModuleOption.reduce((res, obj) => {
        res.push(obj.sign.replaceAll("*", "\\*"))
        return res
    }, <string[]>[]).join("|")

    /* 
    (\*|\*\*|`|__)((?!\1).+?)\1
    \[((?!\[).+?)\]\(((?!\().+?)\)
    */

    let regexp = new RegExp(`((${SIGNLIST})((?!\\2).+?)\\2)|(\\[((?!\\[).+?)\\]\\(((?!\\().+?)\\))`, "g")
    console.log(regexp);

    // 获取到行内数据结构
    // todo 保存比对
    let structTextContent = iterator_regExp(regexp, data)
    let structChildren = getInlineStruct(el)

    console.log("children:", structChildren);
    console.log("textContent:", structTextContent);

    // todo 获取光标原来的位置

    // todo 框选需要更新的区域

    let range = new Range()
    range.setStart(el, 0)
    range.setEnd(el, 2)

    // todo 将需要更新的区域进行替换处理
    range.deleteContents()
    let updateNode = document.createTextNode("UpdataNode")
    range.insertNode(updateNode)

    // document.getSelection()?.removeAllRanges()
    // document.getSelection()?.addRange(range)

    // todo 还原光标原来的位置

}

/** 将 textContent 转换成数据结构 */
function iterator_regExp(regexp: RegExp, data: string) {
    let resSub: InlineStructSub[] = []
    let mat = data.matchAll(regexp)
    let next = mat.next()
    while (!next.done) {
        // console.log(next.value);
        let value = next.value

        let sub: InlineStructSub = {}
        let childrenValue

        if (next.value[5]) {
            sub.sign = "link"
            childrenValue = value[5]
        } else {
            sub.sign = value[2]
            childrenValue = value[3]
        }

        // console.log(`${next.value[1]}\t${next.value[2]}`);

        let children = iterator_regExp(regexp, childrenValue)
        if (children.length !== 0) {
            sub.children = children
        }
        resSub.push(sub)
        next = mat.next()
    }
    return resSub
}

