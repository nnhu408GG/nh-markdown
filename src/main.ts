import './style.less'
import nhMrk from './packages'
import paragraph from './packages/immediateCompile/module_block/paragraph';


/* ============= template ============= */
const app = document.querySelector<HTMLDivElement>('#app')!;
const btn = document.createElement("button")
btn.innerText = "getSource"
app.append(btn)
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

let temp = document.createElement("p")
temp.setAttribute("mdtype", "paragraph")
temp.innerText = "h3lo2_z!"
// let nomalspan = document.createElement("span")
// nomalspan.innerText = "nomalspan"
// temp.append(nomalspan)
dom.append(temp)



let tempStrong = document.createElement("span")
tempStrong.setAttribute("mdtype", "strong")
let meta1 = document.createElement("span")
meta1.classList.add("meta")
meta1.innerText = "**"
let meta2 = meta1.cloneNode(true)
let _strong = document.createElement("strong")
_strong.innerText = "strongDemo"
tempStrong.append(meta1)
tempStrong.append(_strong)
tempStrong.append(meta2)
temp.append(tempStrong)

// paragraph.enterEvent_After(dom, null)


let tempSpan1 = document.createElement("em")
tempSpan1.innerText = "tempSpan1"
temp.append(tempSpan1)


// console.log(temp.compareDocumentPosition(tempSpan1));
// console.log(tempSpan1.compareDocumentPosition(temp));


// let tempnode = document.createTextNode("ffsdf")
// console.log(tempnode instanceof HTMLElement);
// let tempel = document.createElement("span")
// console.log(tempel instanceof HTMLElement);


// let data = "+ jkj"
// let mat = /^(-|\*|\+|\d+\.)\s.*$/g.exec(data)
// console.log(mat);

// let str = "12345."
// console.log(parseInt(str.slice(0, -1)));

// import lessStatus from "./className.module.less"
// console.log(lessStatus.res);
// console.log(lessStatus);



// function FontMetrics(family: string, size: number | string) {
//     this._family = family || (family = "Monaco, 'Courier New', Courier, monospace");
//     this._size = parseInt(size) || (size = 12);

//     // Preparing container
//     var line = document.createElement('div'),
//         body = document.body;
//     line.style.position = 'absolute';
//     line.style.whiteSpace = 'nowrap';
//     line.style.font = size + 'px ' + family;
//     body.appendChild(line);

//     // Now we can measure width and height of the letter
//     line.innerHTML = 'm'; // It doesn't matter what text goes here
//     this._width = line.offsetWidth;
//     this._height = line.offsetHeight;

//     // Now creating 1px sized item that will be aligned to baseline
//     // to calculate baseline shift
//     var span = document.createElement('span');
//     span.style.display = 'inline-block';
//     span.style.overflow = 'hidden';
//     span.style.width = '1px';
//     span.style.height = '1px';
//     line.appendChild(span);

//     // Baseline is important for positioning text on canvas
//     this._baseline = span.offsetTop + span.offsetHeight;

//     document.body.removeChild(line);
// };

// FontMetrics.prototype.getSize = function () {
//     return this._size;
// };


