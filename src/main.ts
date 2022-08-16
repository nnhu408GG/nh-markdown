import './style.less'
import nhMrk from './packages'
import paragraph from './packages/immediateCompile/module_block/paragraph';
import * as global from './packages/immediateCompile/global';
import * as globalInline from './packages/immediateCompile/module_inline'

/* ============= template ============= */
const app = document.querySelector<HTMLDivElement>('#app')!;
const btn = document.createElement("button")
btn.innerText = "getSource"
// app.append(btn)
const dom = document.createElement("div")
app.append(dom)
/* ==================================== */

// let temp_p1 = document.createElement("li")
// let node1 = document.createTextNode("pppnode")
// let span1 = document.createElement("span")
// span1.innerText = "isSpan!!"
// temp_p1.append(node1)
// temp_p1.append(span1)
// setTimeout(() => {
//     let temp_ul = document.createElement("ul")
//     let temp_li = document.createElement("li")
//     temp_ul.append(temp_li)
//     dom.append(temp_ul)
//     console.log(temp_li.firstChild);
//     console.log(!temp_li.firstChild);
//     let range = new Range()
//     // range.setStart(temp_ul.firstChild!, 0)
//     range.setStart(temp_li, 0)
//     let sel = document.getSelection()
//     sel?.removeAllRanges()
//     sel?.addRange(range)
// }, 500);

/* 
element.compareDocumentPosition(otherElement)

1: 两个元素不再同一个文档内
2: otherElement 在 element 之前
4: otherElement 在 element 之后
8: otherElement 包含 element
16: otherElement 被 element 所包含

那么问题来了，为什么上面例子中第一行的结果是20、第二行的结果是10呢？
因为 h1 同时满足“被 container 所包含(16)” 和 “在 container 之后”，所以语句的执行结果是 16+4=20，同理可推出第二条语句的结果是 8+2=10。

*/

// let msg = temp_p1.compareDocumentPosition(span1)
// console.log(msg);

/* ==================================== */


let wys = new nhMrk.wys().bind(dom)

btn.onclick = () => {
    console.log(wys.getSource());
    // wys.initSourceData = "fxxxxx"
    // wys.setViewMode = "Preview"
    // let source = wys.getSource()
}

let testElement = document.createElement("p")
testElement.setAttribute("mdtype", "paragraph")
// dom.append(testElement)

// let textA = document.createTextNode("TEXTA***TE`XTA**TE`XT`A")
let textA = document.createTextNode("T**E[xx`x`x[xx`x`xxx](T)xx](T)ATEXTATEXTA有啥问题")
testElement.append(textA)

let linkA_label = document.createTextNode("点击此处")
let linkA = globalInline.createLinkElement("https://www.baidu.com", linkA_label)
testElement.append(linkA)


let tempStrongA_TextNode = document.createTextNode("STRONGA")
let tempStrongA = globalInline.createInlineElement({
    tagName: "strong",
    sign: "**",
    fragment: tempStrongA_TextNode
})
testElement.append(tempStrongA)

let tempStrongB_TextNode = document.createTextNode("STRONGB")
let tempStrongB = globalInline.createInlineElement({
    tagName: "strong",
    sign: "**",
    fragment: tempStrongB_TextNode
})
testElement.append(tempStrongB)



let textB = document.createTextNode("TEXTB")
testElement.append(textB)

let containerA_fragment = document.createDocumentFragment()
testElement.append(containerA_fragment)
let containerA_textA = document.createTextNode("containerA_textA")
containerA_fragment.append(containerA_textA)
let containerA_emA_textNode = document.createTextNode("containerA_emA")
let containerA_emA = globalInline.createInlineElement({
    tagName: "em",
    sign: "*",
    fragment: containerA_emA_textNode
})
containerA_fragment.append(containerA_emA)
let containerA_textB = document.createTextNode("containerA_textB")
containerA_fragment.append(containerA_textB)
let containerA_codeA_textNode = document.createTextNode("containerA_codeA")
let containerA_codeA = globalInline.createInlineElement({
    tagName: "code",
    sign: "`",
    fragment: containerA_codeA_textNode
})
containerA_fragment.append(containerA_codeA)
let containerA_textC = document.createTextNode("containerA_textC")
containerA_fragment.append(containerA_textC)

let containerA = globalInline.createInlineElement({
    tagName: "strong",
    sign: "**",
    fragment: containerA_fragment
})
testElement.append(containerA)

console.log("compareDocumentPosition:", containerA.compareDocumentPosition(testElement));
