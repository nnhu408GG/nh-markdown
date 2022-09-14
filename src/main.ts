import './style.less'
// import "./agate.css"
import "./xcode.css"

// import nhMrk from './packages'
import md from "./assets/test.md?raw" // vite 引入纯文本的方式
// import md from "../开发需求.md?raw" // vite 引入纯文本的方式
// import md from "../mdast.md?raw" // vite 引入纯文本的方式
import Mdast from './packages/mdast';
import MainPanel from './packages/mainPanel';

const app = document.querySelector<HTMLDivElement>('#app')!;

const dom = document.createElement("div")
app.append(dom)



// let wys = new nhMrk.wys(dom)



// console.time()
let ast = Mdast.Parser(md)
// console.timeEnd()
// ast.forEach(item => console.log(item))
// console.log("");


let panel = new MainPanel(dom)
panel.generator(ast)
// let ast2 = panel.compiler()
// ast2.forEach(item => console.log(item))

// console.log(JSON.stringify(ast) === JSON.stringify(ast2));


// let data = `嗯~~\`嗯~~**嗯嗯\n嗯嗯****\`**`
// let data = "EEE\n~~AAAEE"
// parser.processInline(data)



// let Text = document.createTextNode(data)
// setTimeout(() => {
//     //     dom.firstElementChild.append(Text)
//     dom.firstElementChild.innerHTML = data
// }, 1000);


// let list = ["SS1", "SS2", "SS3", "FF", "EE", "ZZ", "WW1", "WW2"]
// let index = 3
// let _index = 6
// let addCount = 3
// list.splice(index, _index - index)
// for (let i = 0; i < addCount; i++) {
//     list.splice(index + i, 0, "HH")
// }
// console.log(list);

// console.log(list.slice(index, _index));


// let data = [{ l: 2 }, { f: "z" }, 1, "erwer"]
// console.log(Array.isArray(data));


// wys.source = md

// setTimeout(() => {
//     console.log(wys.source);
// }, 1000);

// const btn = document.createElement("button")
// btn.setAttribute("tempbtn", "")
// btn.innerText = "getSource"
// app.append(btn)
// btn.onclick = () => {
//     console.log(wys.source);
//     // wys.initSourceData = "fxxxxx"
//     // wys.setViewMode = "Preview"
// }
